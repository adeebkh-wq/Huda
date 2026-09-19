import React, { useRef, useState, useCallback, useEffect } from 'react';
import {
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@/components/IoniconsSVG';
import Svg, { Path } from 'react-native-svg';
import * as Haptics from 'expo-haptics';
import { useApp } from '@/context/AppContext';
import { translateLabel } from '@/data/translations';


import { useGameSound } from '@/hooks/useGameSound';
import { GameErrorBoundary } from '@/components/GameErrorBoundary';

const STROKE_COLORS = [
  '#4dd0e1', '#ba68c8', '#f06292', '#81c784',
  '#ffb74d', '#e57373', '#90caf9', '#a5d6a7',
];
let colorIndex = 0;

interface Stroke {
  id: number;
  color: string;
  paths: [string, string, string, string];
}

function buildMirroredPaths(
  points: { x: number; y: number }[],
  cx: number,
  cy: number,
): [string, string, string, string] {
  if (points.length < 2) {
    const p   = points[0] ?? { x: cx, y: cy };
    const dot = (fx: number, fy: number) => `M ${fx} ${fy} L ${fx + 0.1} ${fy + 0.1}`;
    return [
      dot(p.x, p.y),
      dot(2 * cx - p.x, p.y),
      dot(p.x, 2 * cy - p.y),
      dot(2 * cx - p.x, 2 * cy - p.y),
    ];
  }
  const build = (flipX: boolean, flipY: boolean) => {
    const fx = (x: number) => (flipX ? 2 * cx - x : x);
    const fy = (y: number) => (flipY ? 2 * cy - y : y);
    return points.map((pt, i) => `${i === 0 ? 'M' : 'L'} ${fx(pt.x)} ${fy(pt.y)}`).join(' ');
  };
  return [build(false, false), build(true, false), build(false, true), build(true, true)];
}

function MirrorGameInner() {
  const { width, height } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const topPad = Platform.OS === 'web' ? Math.max(insets.top, 67) : insets.top;

  const canvasSize    = useRef({ w: width, h: height });
  const canvasViewRef = useRef<View>(null);

  const { soundOn, toggleSound, playSound } = useGameSound('mirror');
  const { appLanguage } = useApp();
  const t = (key: string) => translateLabel(key, appLanguage);
  const [strokes, setStrokes] = useState<Stroke[]>([]);
  const strokesRef            = useRef<Stroke[]>([]);
  const currentPoints         = useRef<{ x: number; y: number }[]>([]);
  const currentStrokeId       = useRef(0);

  // Keep latest callbacks in refs so gestures created once always call current version.
  const playSoundRef = useRef(playSound);
  playSoundRef.current = playSound;

  const startStroke = useCallback((x: number, y: number) => {
    const color = STROKE_COLORS[colorIndex % STROKE_COLORS.length];
    colorIndex++;
    const id = Date.now();
    currentStrokeId.current = id;
    currentPoints.current   = [{ x, y }];
    const { w, h } = canvasSize.current;
    const newStroke: Stroke = {
      id, color,
      paths: buildMirroredPaths([{ x, y }], w / 2, h / 2),
    };
    strokesRef.current = [...strokesRef.current, newStroke];
    setStrokes([...strokesRef.current]);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    playSoundRef.current();
  }, []);

  const extendStroke = useCallback((x: number, y: number) => {
    currentPoints.current.push({ x, y });
    const { w, h } = canvasSize.current;
    const paths = buildMirroredPaths(currentPoints.current, w / 2, h / 2);
    const id    = currentStrokeId.current;
    strokesRef.current = strokesRef.current.map((s) =>
      s.id === id ? { ...s, paths } : s
    );
    setStrokes([...strokesRef.current]);
  }, []);

  const startStrokeRef  = useRef(startStroke);
  const extendStrokeRef = useRef(extendStroke);
  startStrokeRef.current  = startStroke;
  extendStrokeRef.current = extendStroke;

  // ── Native gesture (iOS / Android) ──────────────────────────────────────────
  // Gesture.Manual() bypasses Pan's system-level touch slop on Android.
  // manager.activate() in onTouchesDown lets us receive every move event
  // from the very first pixel — no activation delay, no missed stroke start.
  const drawGesture = useRef(
    Gesture.Manual()
      .runOnJS(true)
      .onTouchesDown((e, manager) => {
        manager.activate();
        const touch = e.changedTouches[0];
        if (touch) startStrokeRef.current(touch.x, touch.y);
      })
      .onTouchesMove((e) => {
        const touch = e.changedTouches[0];
        if (touch) extendStrokeRef.current(touch.x, touch.y);
      })
      .onTouchesUp((_, manager) => {
        manager.end();
      })
      .onTouchesCancelled((_, manager) => {
        manager.fail();
      })
  ).current;

  // ── Web mouse handlers ───────────────────────────────────────────────────────
  // React Native Web filters unknown props on View, so we attach listeners
  // directly to the underlying DOM element via useEffect. This responds to
  // both real browser events and Playwright's simulated mouse events.
  useEffect(() => {
    if (Platform.OS !== 'web') return;
    // On React Native Web the ref IS the DOM element directly.
    const domEl = canvasViewRef.current as unknown as HTMLElement | null;
    if (!domEl?.addEventListener) return;

    const onMouseDown = (e: MouseEvent) => {
      const rect = domEl.getBoundingClientRect();
      startStrokeRef.current(e.clientX - rect.left, e.clientY - rect.top);
    };
    const onMouseMove = (e: MouseEvent) => {
      if (!e.buttons) return;
      const rect = domEl.getBoundingClientRect();
      extendStrokeRef.current(e.clientX - rect.left, e.clientY - rect.top);
    };

    domEl.addEventListener('mousedown', onMouseDown);
    domEl.addEventListener('mousemove', onMouseMove);
    return () => {
      domEl.removeEventListener('mousedown', onMouseDown);
      domEl.removeEventListener('mousemove', onMouseMove);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const clearAll = useCallback(() => {
    strokesRef.current    = [];
    currentPoints.current = [];
    setStrokes([]);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
  }, []);

  // ── Canvas content ───────────────────────────────────────────────────────────
  const canvasContent = (
    <View
      ref={canvasViewRef}
      style={styles.canvas}
      onLayout={(e) => {
        const { width: w, height: h } = e.nativeEvent.layout;
        canvasSize.current = { w, h };
      }}
    >
      {/* Axis guides */}
      <View style={[styles.axis, styles.axisH]} />
      <View style={[styles.axis, styles.axisV]} />

      {/* SVG render layer — must never intercept pointer/touch events */}
      <View style={StyleSheet.absoluteFill} pointerEvents="none">
        <Svg width="100%" height="100%" style={StyleSheet.absoluteFill}>
          {strokes.map((stroke) =>
            stroke.paths.map((d, qi) => (
              <Path
                key={`${stroke.id}-${qi}`}
                d={d}
                stroke={stroke.color}
                strokeWidth={3}
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
                opacity={0.9}
              />
            ))
          )}
        </Svg>
      </View>

      <Text style={styles.hint}>{t('Draw — mirrored 4 ways')}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: topPad + 8 }]}>
        <Pressable
          onPress={() => router.back()}
          style={({ pressed }) => [styles.back, { opacity: pressed ? 0.6 : 1 }]}
          accessibilityLabel="Back"
        >
          <Ionicons name="arrow-back" size={24} color="rgba(180,210,240,0.9)" />
        </Pressable>
        <Text style={styles.title}>🪞 {t('Mirror Draw')}</Text>
        <View style={styles.headerRight}>
          <Pressable
            onPress={toggleSound}
            style={({ pressed }) => [styles.soundBtn, { opacity: pressed ? 0.7 : 1 }]}
            accessibilityLabel={soundOn ? 'Mute sound' : 'Play ambient sound'}
          >
            <Ionicons
              name={soundOn ? 'volume-high' : 'volume-mute-outline'}
              size={20}
              color="rgba(180,210,248,0.65)"
            />
          </Pressable>
          <Pressable
            onPress={clearAll}
            style={({ pressed }) => [styles.newBtn, { opacity: pressed ? 0.7 : 1 }]}
            accessibilityLabel="Clear canvas"
          >
            <Text style={styles.newText}>{t('New')}</Text>
          </Pressable>
        </View>
      </View>

      {/* On native wrap with GestureDetector; on web the View handles mouse events directly */}
      {Platform.OS === 'web'
        ? canvasContent
        : <GestureDetector gesture={drawGesture}>{canvasContent}</GestureDetector>
      }
    </View>
  );
}

export default function MirrorGame() {
  return (
    <GameErrorBoundary>
      <MirrorGameInner />
    </GameErrorBoundary>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#080812' },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 16, paddingBottom: 12, zIndex: 10,
    borderBottomWidth: 1, borderBottomColor: 'rgba(80,100,180,0.1)',
  },
  back:    { padding: 4, width: 44 },
  title:   { color: 'rgba(180,210,248,0.97)', fontSize: 20, fontWeight: '700', fontFamily: 'Inter_700Bold' },
  newBtn:  {
    backgroundColor: '#12122a', borderWidth: 1, borderColor: '#4dd0e140',
    paddingHorizontal: 16, paddingVertical: 6, borderRadius: 16,
  },
  newText: { color: '#4dd0e1', fontSize: 14, fontWeight: '600', fontFamily: 'Inter_600SemiBold' },
  canvas:  { flex: 1 },
  axis:    { position: 'absolute', backgroundColor: '#ffffff08' },
  axisH:   { top: '50%', left: 0, right: 0, height: 1 },
  axisV:   { left: '50%', top: 0, bottom: 0, width: 1 },
  hint:        { position: 'absolute', bottom: 60, alignSelf: 'center', color: '#18183a', fontSize: 16 },
  headerRight: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  soundBtn:    { padding: 4 },
});
