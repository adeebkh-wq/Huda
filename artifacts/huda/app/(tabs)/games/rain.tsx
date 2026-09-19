import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  AppState,
  AppStateStatus,
  Animated,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  useWindowDimensions,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useApp } from '@/context/AppContext';
import { translateLabel } from '@/data/translations';


import { Ionicons } from '@/components/IoniconsSVG';
import * as Haptics from 'expo-haptics';
import { useGameSound } from '@/hooks/useGameSound';
import { GameErrorBoundary } from '@/components/GameErrorBoundary';

interface Drop {
  id: number;
  xVal: Animated.Value;
  yVal: Animated.Value;
  h: number;
  w: number;
  alpha: number;
}

interface Ripple {
  id: string;
  x: number;
  y: number;
  scale: Animated.Value;
  /** Pre-computed once at spawn (scale × 0.4) — never recreated during render. */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  scaleY: any;
  opacity: Animated.Value;
}

let _ripId = 0;
const DROPS = 24;
const IDLE_DELAY_MS = 8000;

function RainGameInner() {
  const { width, height } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const topPad = Platform.OS === 'web' ? Math.max(insets.top, 67) : insets.top;
  const { soundOn, toggleSound, playSound } = useGameSound('rain');
  const { appLanguage } = useApp();
  const t = (key: string) => translateLabel(key, appLanguage);

  const [drops] = useState<Drop[]>(() =>
    Array.from({ length: DROPS }, (_, i) => ({
      id: i,
      xVal: new Animated.Value(Math.random() * width),
      yVal: new Animated.Value(-Math.random() * height),
      h: 10 + Math.random() * 24,
      w: 1 + Math.random() * 1.3,
      alpha: 0.22 + Math.random() * 0.44,
    }))
  );
  const [ripples, setRipples] = useState<Ripple[]>([]);
  const dropaAnims = useRef<Animated.CompositeAnimation[]>([]);
  const isActiveRef = useRef(true);

  // ── Idle nudge ────────────────────────────────────────────────────────────
  const [showNudge, setShowNudge] = useState(false);
  const nudgeScale      = useRef(new Animated.Value(0.1)).current;
  const nudgeOpacity    = useRef(new Animated.Value(0)).current;
  // Pre-computed once — never recreated during render to avoid orphaned animation nodes.
  const nudgeScaleYAnim = useRef(Animated.multiply(nudgeScale, new Animated.Value(0.4))).current;
  const idleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const nudgeAnimRef = useRef<Animated.CompositeAnimation | null>(null);

  const hideNudge = useCallback(() => {
    nudgeAnimRef.current?.stop();
    nudgeAnimRef.current = null;
    nudgeScale.setValue(0.1);
    nudgeOpacity.setValue(0);
    setShowNudge(false);
  }, [nudgeScale, nudgeOpacity]);

  const startNudge = useCallback(() => {
    if (!isActiveRef.current) return;
    nudgeScale.setValue(0.1);
    nudgeOpacity.setValue(0);
    setShowNudge(true);
    const loop = Animated.loop(
      Animated.sequence([
        Animated.parallel([
          Animated.timing(nudgeScale, {
            toValue: 1,
            duration: 1200,
            useNativeDriver: true,
          }),
          Animated.sequence([
            Animated.timing(nudgeOpacity, {
              toValue: 0.45,
              duration: 400,
              useNativeDriver: true,
            }),
            Animated.timing(nudgeOpacity, {
              toValue: 0,
              duration: 800,
              useNativeDriver: true,
            }),
          ]),
        ]),
        Animated.delay(700),
      ])
    );
    nudgeAnimRef.current = loop;
    loop.start();
  }, [nudgeScale, nudgeOpacity]);

  const resetIdleTimer = useCallback(() => {
    if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    hideNudge();
    if (!isActiveRef.current) return;
    idleTimerRef.current = setTimeout(startNudge, IDLE_DELAY_MS);
  }, [hideNudge, startNudge]);

  // Start idle timer on mount; clear on unmount.
  useEffect(() => {
    resetIdleTimer();
    return () => {
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
      hideNudge();
    };
  }, [resetIdleTimer, hideNudge]);
  // ─────────────────────────────────────────────────────────────────────────

  const animDrop = useCallback((drop: Drop) => {
    if (!isActiveRef.current) return null;
    const safeLeft = insets.left;
    const safeRight = insets.right;
    drop.xVal.setValue(safeLeft + Math.random() * (width - safeLeft - safeRight - 2));
    drop.yVal.setValue(-drop.h - Math.random() * height * 0.4);
    const a = Animated.timing(drop.yVal, {
      toValue: height + 20,
      duration: 650 + Math.random() * 1100,
      useNativeDriver: true,
    });
    a.start(({ finished }) => { if (finished) animDrop(drop); });
    return a;
  }, [width, height, insets.left, insets.right]);

  // When dimensions change, stop all in-flight animations and snap every drop
  // above the new top edge so none remain visible outside the new bounds.
  useEffect(() => {
    dropaAnims.current.forEach(a => a.stop());
    dropaAnims.current = [];
    drops.forEach(d => {
      d.yVal.setValue(-d.h - 10);
    });
  }, [width, height, drops]);

  useEffect(() => {
    const timeouts: ReturnType<typeof setTimeout>[] = [];
    drops.forEach((d, i) => {
      const t = setTimeout(() => {
        const a = animDrop(d);
        if (a) dropaAnims.current.push(a);
      }, i * 55);
      timeouts.push(t);
    });
    return () => {
      timeouts.forEach(t => clearTimeout(t));
      dropaAnims.current.forEach(a => a.stop());
      dropaAnims.current = [];
    };
  }, [drops, animDrop]);

  useEffect(() => {
    const handleAppState = (nextState: AppStateStatus) => {
      if (nextState === 'active') {
        // Resume: restart all drop animations from above the screen
        isActiveRef.current = true;
        dropaAnims.current.forEach(a => a.stop());
        dropaAnims.current = [];
        drops.forEach((d, i) => {
          setTimeout(() => {
            const a = animDrop(d);
            if (a) dropaAnims.current.push(a);
          }, i * 55);
        });
        // Restart idle timer when returning to foreground
        resetIdleTimer();
      } else {
        // Pause: stop all in-flight drop animations and clear any mid-animation
        // ripples so they don't reappear in a frozen/invisible state on resume.
        isActiveRef.current = false;
        dropaAnims.current.forEach(a => a.stop());
        dropaAnims.current = [];
        drops.forEach(d => d.yVal.setValue(-d.h - 10));
        setRipples([]);
        // Cancel idle timer and hide nudge while backgrounded
        if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
        hideNudge();
      }
    };
    const sub = AppState.addEventListener('change', handleAppState);
    return () => sub.remove();
  }, [drops, animDrop, resetIdleTimer, hideNudge]);

  const spawnRipple = useCallback((x: number, y: number) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    playSound();
    // Reset idle timer on every tap
    resetIdleTimer();
    const id = String(_ripId++);
    const scale  = new Animated.Value(0.12);
    const opacity = new Animated.Value(0.9);
    // Compute scaleY once here so the render never calls Animated.multiply().
    const scaleY = Animated.multiply(scale, new Animated.Value(0.4));
    setRipples(p => [...p.slice(-28), { id, x, y, scale, scaleY, opacity }]);
    Animated.parallel([
      Animated.timing(scale, { toValue: 1, duration: 720, useNativeDriver: true }),
      Animated.timing(opacity, { toValue: 0, duration: 720, useNativeDriver: true }),
    ]).start(() => setRipples(p => p.filter(r => r.id !== id)));
  }, [resetIdleTimer, playSound]);

  const nudgeCx = width / 2;
  const nudgeCy = height / 2;

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: topPad + 8 }]}>
        <Pressable
          onPress={() => router.back()}
          style={({ pressed }) => [styles.back, { opacity: pressed ? 0.6 : 1 }]}
          accessibilityLabel="Back"
        >
          <Ionicons name="arrow-back" size={24} color="rgba(160,220,235,0.9)" />
        </Pressable>
        <Text style={styles.title}>🌧️ {t('Rain & Ripples')}</Text>
        <Pressable
          onPress={toggleSound}
          style={({ pressed }) => [styles.soundBtn, { opacity: pressed ? 0.7 : 1 }]}
          accessibilityLabel={soundOn ? 'Mute sound' : 'Play ambient sound'}
        >
          <Ionicons name={soundOn ? 'volume-high' : 'volume-mute-outline'} size={22} color="rgba(160,220,235,0.7)" />
        </Pressable>
      </View>

      <TouchableWithoutFeedback
        onPress={e => spawnRipple(e.nativeEvent.locationX, e.nativeEvent.locationY)}
      >
        <View style={StyleSheet.absoluteFillObject}>
          {/* Falling drops */}
          {drops.map(d => (
            <Animated.View
              key={d.id}
              pointerEvents="none"
              style={[styles.drop, {
                width: d.w, height: d.h, opacity: d.alpha,
                transform: [{ translateX: d.xVal }, { translateY: d.yVal }],
              }]}
            />
          ))}

          {/* Ripples */}
          {ripples.map(r => (
            <Animated.View
              key={r.id}
              pointerEvents="none"
              style={[styles.ripple, {
                left: r.x - 52,
                top: r.y - 24,
                opacity: r.opacity,
                transform: [
                  { scaleX: r.scale },
                  { scaleY: r.scaleY },
                ],
              }]}
            />
          ))}

          {/* Ghost nudge ripple — shown after idle timeout */}
          {showNudge && (
            <Animated.View
              pointerEvents="none"
              style={[styles.nudgeRipple, {
                left: nudgeCx - 52,
                top: nudgeCy - 24,
                opacity: nudgeOpacity,
                transform: [
                  { scaleX: nudgeScale },
                  { scaleY: nudgeScaleYAnim },
                ],
              }]}
            />
          )}
        </View>
      </TouchableWithoutFeedback>

      <View style={styles.hint} pointerEvents="none">
        <Text style={styles.hintTxt}>{t('Tap anywhere to make ripples 💧')}</Text>
      </View>
    </View>
  );
}

export default function RainGame() {
  return (
    <GameErrorBoundary>
      <RainGameInner />
    </GameErrorBoundary>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#051520' },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 16, paddingBottom: 12, zIndex: 10,
    borderBottomWidth: 1, borderBottomColor: 'rgba(100,190,220,0.09)',
  },
  back: { padding: 4, width: 44 },
  title: { color: 'rgba(160,225,245,0.97)', fontSize: 20, fontWeight: '700', fontFamily: 'Inter_700Bold' },
  drop: {
    position: 'absolute', top: 0, left: 0,
    backgroundColor: 'rgba(120,210,235,0.65)', borderRadius: 1,
  },
  ripple: {
    position: 'absolute',
    width: 104, height: 104, borderRadius: 52,
    borderWidth: 2.5, borderColor: 'rgba(42,157,143,0.85)',
  },
  nudgeRipple: {
    position: 'absolute',
    width: 104, height: 104, borderRadius: 52,
    borderWidth: 2, borderColor: 'rgba(120,210,235,0.7)',
  },
  hint: { position: 'absolute', bottom: '14%', left: 0, right: 0, alignItems: 'center' },
  hintTxt: { color: 'rgba(80,180,210,0.35)', fontSize: 15, fontFamily: 'Inter_400Regular' },
  soundBtn: { padding: 4, width: 44, alignItems: 'center', justifyContent: 'center' },
});
