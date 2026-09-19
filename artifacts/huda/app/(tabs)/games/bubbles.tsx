import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  AppState,
  AppStateStatus,
  Animated,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@/components/IoniconsSVG';
import * as Haptics from 'expo-haptics';
import { useGameSound } from '@/hooks/useGameSound';
import { GameErrorBoundary } from '@/components/GameErrorBoundary';
import { useApp } from '@/context/AppContext';
import { translateLabel } from '@/data/translations';

const COLORS = [
  '#2A9D8F', '#2B78BE', '#7C4DBC', '#D0457E',
  '#C98A1A', '#2D9A57', '#E07B39', '#5599BB',
];

const DEFAULT_STREAK_WINDOW_MS = 1500;
const MILESTONES = [10, 25, 50, 100, 200, 500, 1000];

interface Bubble {
  id: string;
  x: number;
  size: number;
  color: string;
  yAnim: Animated.Value;
  opacity: Animated.Value;
  scale: Animated.Value;
  done: boolean;
}

interface StreakLabel {
  id: string;
  text: string;
  x: number;
  y: number;
  translateY: Animated.Value;
  opacity: Animated.Value;
}

interface MilestoneParticle {
  translateX: Animated.Value;
  translateY: Animated.Value;
  opacity: Animated.Value;
  scale: Animated.Value;
  color: string;
  size: number;
  // Baked-in target offsets from burst centre (for reference, actual motion
  // is driven by the Animated.Values above).
  targetX: number;
  targetY: number;
}

interface MilestoneBurst {
  id: string;
  count: number;
  flashOpacity: Animated.Value;
  flashColor: string;
  labelOpacity: Animated.Value;
  labelScale: Animated.Value;
  particles: MilestoneParticle[];
}

let _bubbleId = 0;
let _streakLabelId = 0;
// Module-level session counter — survives component remounts and background/foreground cycles.
let _sessionPops = 0;
let _sessionBest = 0;
let _sessionBestStreak = 0;

const PARTICLE_COUNT = 14;

function BubblesGameInner() {
  const { width, height } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const topPad = Platform.OS === 'web' ? Math.max(insets.top, 67) : insets.top;
  const { soundOn, toggleSound, playSound } = useGameSound('bubbles');
  const { childGameSettings, appLanguage } = useApp();
  const t = (key: string) => translateLabel(key, appLanguage);
  const streakWindowMs = childGameSettings.streakWindowMs ?? DEFAULT_STREAK_WINDOW_MS;
  const [bubbles, setBubbles] = useState<Bubble[]>([]);
  // Initialise from the persisted session count so remounts don't reset it.
  const [popped, setPopped] = useState(_sessionPops);
  const [sessionBest, setSessionBest] = useState(_sessionBest);
  const [bestStreak, setBestStreak] = useState(_sessionBestStreak);
  const [streakLabels, setStreakLabels] = useState<StreakLabel[]>([]);
  const [milestoneBursts, setMilestoneBursts] = useState<MilestoneBurst[]>([]);

  const bubblesRef = useRef<Bubble[]>([]);
  const timerRef = useRef<ReturnType<typeof setInterval>>();

  // Streak tracking refs — synchronous access inside pop()
  const lastPopTimeRef = useRef<number>(0);
  const streakCountRef = useRef<number>(0);
  const streakResetRef = useRef<ReturnType<typeof setTimeout>>();

  const spawn = useCallback(() => {
    const size = 46 + Math.random() * 60;
    const safeLeft = insets.left + 12;
    const safeRight = insets.right + 12;
    const b: Bubble = {
      id: String(_bubbleId++),
      x: safeLeft + Math.random() * (width - safeLeft - safeRight - size),
      size,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      yAnim: new Animated.Value(height),
      opacity: new Animated.Value(1),
      scale: new Animated.Value(1),
      done: false,
    };
    bubblesRef.current = [...bubblesRef.current.slice(-20), b];
    setBubbles([...bubblesRef.current]);

    Animated.timing(b.yAnim, {
      toValue: -(size + 80),
      duration: 5500 + Math.random() * 5000,
      useNativeDriver: true,
    }).start(({ finished }) => {
      if (finished && !b.done) {
        bubblesRef.current = bubblesRef.current.filter(x => x.id !== b.id);
        setBubbles([...bubblesRef.current]);
      }
    });
  }, [width, height, insets.left, insets.right]);

  // When dimensions change, immediately clear all in-flight bubbles so none
  // appear outside the new canvas bounds.
  useEffect(() => {
    bubblesRef.current.forEach(b => {
      b.yAnim.stopAnimation();
      b.opacity.stopAnimation();
      b.scale.stopAnimation();
    });
    bubblesRef.current = [];
    setBubbles([]);
  }, [width, height]);

  const startLoop = useCallback(() => {
    for (let i = 0; i < 5; i++) setTimeout(spawn, i * 340);
    timerRef.current = setInterval(spawn, 1100);
  }, [spawn]);

  const stopLoop = useCallback(() => {
    clearInterval(timerRef.current);
    bubblesRef.current.forEach(b => {
      b.yAnim.stopAnimation();
      b.opacity.stopAnimation();
      b.scale.stopAnimation();
    });
    bubblesRef.current = [];
    setBubbles([]);
  }, []);

  useEffect(() => {
    startLoop();
    return () => {
      clearInterval(timerRef.current);
      bubblesRef.current.forEach(b => b.yAnim.stopAnimation());
    };
  }, [startLoop]);

  useEffect(() => {
    const handleAppState = (nextState: AppStateStatus) => {
      if (nextState === 'active') {
        startLoop();
      } else {
        stopLoop();
      }
    };
    const sub = AppState.addEventListener('change', handleAppState);
    return () => sub.remove();
  }, [startLoop, stopLoop]);

  const spawnStreakLabel = useCallback((streakCount: number, bubbleX: number, bubbleY: number) => {
    const text = streakCount >= 10
      ? `${streakCount}x 🔥🔥🔥`
      : streakCount >= 5
        ? `${streakCount}x 🔥🔥`
        : `${streakCount}x 🔥`;

    const translateY = new Animated.Value(0);
    const opacity = new Animated.Value(0);
    const label: StreakLabel = {
      id: String(_streakLabelId++),
      text,
      x: bubbleX,
      y: bubbleY,
      translateY,
      opacity,
    };

    setStreakLabels(prev => [...prev.slice(-5), label]);

    Animated.parallel([
      Animated.sequence([
        Animated.timing(opacity, { toValue: 1, duration: 120, useNativeDriver: true }),
        Animated.delay(350),
        Animated.timing(opacity, { toValue: 0, duration: 350, useNativeDriver: true }),
      ]),
      Animated.timing(translateY, { toValue: -90, duration: 820, useNativeDriver: true }),
    ]).start(() => {
      setStreakLabels(prev => prev.filter(l => l.id !== label.id));
    });
  }, []);

  // ---------------------------------------------------------------------------
  // Milestone celebration
  // ---------------------------------------------------------------------------
  const triggerMilestone = useCallback((count: number) => {
    // Stronger haptic for milestone moments
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});

    const flashColor = COLORS[Math.floor(Math.random() * COLORS.length)];
    const flashOpacity = new Animated.Value(0);
    const labelOpacity = new Animated.Value(0);
    const labelScale = new Animated.Value(0.4);

    // Build particles radiating from screen centre
    const cx = width / 2;
    const cy = height / 2;
    const particles: MilestoneParticle[] = Array.from({ length: PARTICLE_COUNT }, (_, i) => {
      const angle = (i / PARTICLE_COUNT) * Math.PI * 2;
      const distance = 70 + Math.random() * 90;
      return {
        translateX: new Animated.Value(0),
        translateY: new Animated.Value(0),
        opacity: new Animated.Value(1),
        scale: new Animated.Value(0.2),
        color: COLORS[i % COLORS.length],
        size: 14 + Math.random() * 14,
        targetX: Math.cos(angle) * distance,
        targetY: Math.sin(angle) * distance,
      };
    });

    const burst: MilestoneBurst = {
      id: String(Date.now()) + count,
      count,
      flashOpacity,
      flashColor,
      labelOpacity,
      labelScale,
      particles,
    };

    setMilestoneBursts(prev => [...prev, burst]);

    // Flash: quick in, slow out
    Animated.sequence([
      Animated.timing(flashOpacity, { toValue: 0.35, duration: 80, useNativeDriver: true }),
      Animated.timing(flashOpacity, { toValue: 0, duration: 600, useNativeDriver: true }),
    ]).start();

    // Milestone label: spring in, pause, fade out
    Animated.parallel([
      Animated.spring(labelScale, { toValue: 1, friction: 5, tension: 90, useNativeDriver: true }),
      Animated.sequence([
        Animated.timing(labelOpacity, { toValue: 1, duration: 120, useNativeDriver: true }),
        Animated.delay(700),
        Animated.timing(labelOpacity, { toValue: 0, duration: 400, useNativeDriver: true }),
      ]),
    ]).start();

    // Particles: spring outward, then fade
    const particleAnims = particles.map(p =>
      Animated.parallel([
        Animated.spring(p.translateX, { toValue: p.targetX, friction: 4, tension: 60, useNativeDriver: true }),
        Animated.spring(p.translateY, { toValue: p.targetY, friction: 4, tension: 60, useNativeDriver: true }),
        Animated.sequence([
          Animated.timing(p.scale, { toValue: 1, duration: 180, useNativeDriver: true }),
          Animated.delay(250),
          Animated.timing(p.scale, { toValue: 0, duration: 350, useNativeDriver: true }),
        ]),
        Animated.sequence([
          Animated.delay(280),
          Animated.timing(p.opacity, { toValue: 0, duration: 450, useNativeDriver: true }),
        ]),
      ])
    );

    Animated.parallel(particleAnims).start(() => {
      setMilestoneBursts(prev => prev.filter(b => b.id !== burst.id));
    });
  }, [width, height]);

  const pop = useCallback((b: Bubble) => {
    if (b.done) return;
    b.done = true;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    playSound();

    _sessionPops += 1;
    if (_sessionPops > _sessionBest) {
      _sessionBest = _sessionPops;
      setSessionBest(_sessionBest);
    }
    setPopped(_sessionPops);

    // --- Milestone detection ---
    if (MILESTONES.includes(_sessionPops)) {
      triggerMilestone(_sessionPops);
    }

    // --- Streak logic ---
    const now = Date.now();
    const timeSinceLast = now - lastPopTimeRef.current;
    lastPopTimeRef.current = now;

    if (timeSinceLast <= streakWindowMs) {
      streakCountRef.current += 1;
    } else {
      streakCountRef.current = 1;
    }

    const currentStreak = streakCountRef.current;

    // Update best streak
    if (currentStreak > _sessionBestStreak) {
      _sessionBestStreak = currentStreak;
      setBestStreak(_sessionBestStreak);
    }

    // Clear pending reset timer and schedule a fresh one
    clearTimeout(streakResetRef.current);
    streakResetRef.current = setTimeout(() => {
      streakCountRef.current = 0;
    }, streakWindowMs);

    // Show streak label when chain is 2+
    if (currentStreak >= 2) {
      // Get approximate current y position of the bubble using internal _value
      // Safe read of current animation position without accessing private internals.
      const currentY: number = (b.yAnim as any).__getValue?.() ?? -1;
      const labelX = b.x + b.size / 2;
      const labelY = currentY > 0 ? currentY : height * 0.45;
      spawnStreakLabel(currentStreak, labelX, labelY);
    }

    // --- Pop animation ---
    b.yAnim.stopAnimation();
    Animated.parallel([
      Animated.spring(b.scale, { toValue: 1.5, friction: 3, useNativeDriver: true }),
      Animated.timing(b.opacity, { toValue: 0, duration: 200, useNativeDriver: true }),
    ]).start(() => {
      bubblesRef.current = bubblesRef.current.filter(x => x.id !== b.id);
      setBubbles([...bubblesRef.current]);
    });
  }, [height, playSound, spawnStreakLabel, streakWindowMs, triggerMilestone]);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: topPad + 8 }]}>
        <Pressable
          onPress={() => router.back()}
          style={({ pressed }) => [styles.back, { opacity: pressed ? 0.6 : 1 }]}
          accessibilityLabel="Back"
        >
          <Ionicons name="arrow-back" size={24} color="rgba(190,220,245,0.9)" />
        </Pressable>
        <Text style={styles.title}>🫧 {t('Bubble Pop')}</Text>
        <View style={styles.scoreCol}>
          <Pressable
            onPress={toggleSound}
            style={({ pressed }) => [styles.soundBtn, { opacity: pressed ? 0.7 : 1 }]}
            accessibilityLabel={soundOn ? 'Mute sound' : 'Play ambient sound'}
          >
            <Ionicons name={soundOn ? 'volume-high' : 'volume-mute-outline'} size={18} color="rgba(190,220,248,0.65)" />
          </Pressable>
          {popped > 0 && <Text style={styles.score}>{popped} 💥</Text>}
          {sessionBest > 0 && popped < sessionBest && (
            <Text style={styles.best}>{t('best')} {sessionBest}</Text>
          )}
          {bestStreak >= 2 && (
            <Text style={styles.bestStreak}>🔥 {t('best')} ×{bestStreak}</Text>
          )}
        </View>
      </View>

      {/* Bubbles */}
      <View style={StyleSheet.absoluteFillObject} pointerEvents="box-none">
        {bubbles.map(b => (
          <Animated.View
            key={b.id}
            style={{
              position: 'absolute',
              left: b.x,
              top: 0,
              opacity: b.opacity,
              transform: [{ translateY: b.yAnim }, { scale: b.scale }],
            }}
          >
            <View
              style={[
                styles.bubble,
                {
                  width: b.size, height: b.size, borderRadius: b.size / 2,
                  backgroundColor: b.color + 'BB', borderColor: b.color,
                  shadowColor: b.color,
                },
              ]}
              onStartShouldSetResponder={() => !b.done}
              onResponderGrant={() => pop(b)}
            >
              {/* gloss highlight */}
              <View style={[
                styles.shine,
                { width: b.size * 0.28, height: b.size * 0.15, borderRadius: b.size * 0.14 },
              ]} />
            </View>
          </Animated.View>
        ))}

        {/* Streak labels */}
        {streakLabels.map(label => (
          <Animated.View
            key={label.id}
            pointerEvents="none"
            style={[
              styles.streakLabel,
              {
                left: label.x,
                top: label.y,
                opacity: label.opacity,
                transform: [{ translateY: label.translateY }, { translateX: -36 }],
              },
            ]}
          >
            <Text style={styles.streakText}>{label.text}</Text>
          </Animated.View>
        ))}
      </View>

      {/* Milestone celebration overlays — above bubbles, below nothing */}
      {milestoneBursts.map(burst => (
        <View
          key={burst.id}
          style={StyleSheet.absoluteFillObject}
          pointerEvents="none"
        >
          {/* Full-screen colour flash */}
          <Animated.View
            style={[
              StyleSheet.absoluteFillObject,
              { backgroundColor: burst.flashColor, opacity: burst.flashOpacity },
            ]}
          />

          {/* Particles radiating from screen centre */}
          {burst.particles.map((p, i) => (
            <Animated.View
              key={i}
              style={{
                position: 'absolute',
                left: width / 2 - p.size / 2,
                top: height / 2 - p.size / 2,
                width: p.size,
                height: p.size,
                borderRadius: p.size / 2,
                backgroundColor: p.color,
                opacity: p.opacity,
                transform: [
                  { translateX: p.translateX },
                  { translateY: p.translateY },
                  { scale: p.scale },
                ],
              }}
            />
          ))}

          {/* Milestone count label */}
          <Animated.View
            style={[
              styles.milestoneLabelWrap,
              {
                opacity: burst.labelOpacity,
                transform: [{ scale: burst.labelScale }],
              },
            ]}
          >
            <Text style={styles.milestoneLabelText}>
              {burst.count === 10 ? '🎉' : burst.count === 25 ? '⭐' : burst.count === 50 ? '🌟' : burst.count === 100 ? '🏆' : '✨'}
            </Text>
            <Text style={styles.milestoneLabelCount}>{burst.count} {t('pops!')}</Text>
          </Animated.View>
        </View>
      ))}

      {popped === 0 && (
        <View style={styles.hint} pointerEvents="none">
          <Text style={styles.hintTxt}>{t('Tap the bubbles to pop them ✨')}</Text>
        </View>
      )}
    </View>
  );
}

export default function BubblesGame() {
  return (
    <GameErrorBoundary>
      <BubblesGameInner />
    </GameErrorBoundary>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#07192E' },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 16, paddingBottom: 12, zIndex: 10,
    borderBottomWidth: 1, borderBottomColor: 'rgba(120,180,220,0.1)',
  },
  back: { padding: 4, width: 44 },
  title: { color: 'rgba(190,220,248,0.97)', fontSize: 20, fontWeight: '700', fontFamily: 'Inter_700Bold' },
  scoreCol: { alignItems: 'flex-end', minWidth: 72 },
  score: { color: 'rgba(190,215,240,0.8)', fontSize: 17, fontWeight: '700', fontFamily: 'Inter_700Bold', textAlign: 'right' },
  best: { color: 'rgba(140,180,220,0.5)', fontSize: 11, fontFamily: 'Inter_400Regular', textAlign: 'right', marginTop: 1 },
  bestStreak: { color: 'rgba(255,180,60,0.6)', fontSize: 11, fontFamily: 'Inter_400Regular', textAlign: 'right', marginTop: 1 },
  bubble: {
    borderWidth: 2,
    alignItems: 'center', justifyContent: 'flex-start',
    paddingTop: '14%',
    shadowOpacity: 0.55, shadowRadius: 10, shadowOffset: { width: 0, height: 0 },
    elevation: 5,
  },
  shine: { backgroundColor: 'rgba(255,255,255,0.55)' },
  hint: { position: 'absolute', bottom: '22%', left: 0, right: 0, alignItems: 'center' },
  hintTxt: { color: 'rgba(120,190,230,0.38)', fontSize: 16, fontFamily: 'Inter_400Regular' },
  soundBtn: { padding: 6, marginBottom: 2 },
  streakLabel: {
    position: 'absolute',
    zIndex: 100,
  },
  streakText: {
    color: '#FFD060',
    fontSize: 22,
    fontWeight: '800',
    fontFamily: 'Inter_700Bold',
    textShadowColor: 'rgba(0,0,0,0.6)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  milestoneLabelWrap: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  milestoneLabelText: {
    fontSize: 64,
    textAlign: 'center',
  },
  milestoneLabelCount: {
    color: '#FFFFFF',
    fontSize: 32,
    fontWeight: '800',
    fontFamily: 'Inter_700Bold',
    textAlign: 'center',
    textShadowColor: 'rgba(0,0,0,0.7)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 8,
    marginTop: 4,
  },
});
