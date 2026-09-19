import React, { useRef, useState } from 'react';
import {
  Animated,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@/components/IoniconsSVG';
import * as Haptics from 'expo-haptics';
import { useGameSound } from '@/hooks/useGameSound';
import { useApp } from '@/context/AppContext';
import { translateLabel } from '@/data/translations';


import { GameErrorBoundary } from '@/components/GameErrorBoundary';

function getSpeedLabel(degPerFrame: number): { label: string; color: string } {
  const abs = Math.abs(degPerFrame);
  if (abs < 0.5) return { label: 'still', color: '#888' };
  if (abs < 4)   return { label: 'slow',  color: '#4dd0e1' };
  if (abs < 12)  return { label: 'fast',  color: '#ba68c8' };
  return           { label: 'woah!', color: '#f06292' };
}

function SpinnerGameInner() {
  const insets = useSafeAreaInsets();
  const topPad = Platform.OS === 'web' ? Math.max(insets.top, 67) : insets.top;

  const rotation    = useRef(new Animated.Value(0)).current;
  const rotDeg      = useRef(0);
  const lastAngle   = useRef<number | null>(null);
  const lastTime    = useRef(Date.now());
  const decayAnim   = useRef<Animated.CompositeAnimation | null>(null);
  const zoneLayout  = useRef({ cx: 180, cy: 280 });

  const [speed, setSpeed] = useState<{ label: string; color: string }>({ label: 'still', color: '#888' });
  const { soundOn, toggleSound, playSound } = useGameSound('spinner');
  const { appLanguage } = useApp();
  const t = (key: string) => translateLabel(key, appLanguage);

  rotation.addListener(({ value }) => { rotDeg.current = value; });

  const angle = (x: number, y: number) =>
    Math.atan2(y - zoneLayout.current.cy, x - zoneLayout.current.cx) * (180 / Math.PI);

  // Build panResponder imperatively (not via hook) so we can reference zoneLayout
  const panResponder = useRef(
    (() => {
      const { PanResponder } = require('react-native');
      return PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onMoveShouldSetPanResponder:  () => true,

        onPanResponderGrant: (evt: any) => {
          if (decayAnim.current) { decayAnim.current.stop(); decayAnim.current = null; }
          lastAngle.current = angle(evt.nativeEvent.pageX, evt.nativeEvent.pageY);
          lastTime.current  = Date.now();
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          playSound();
        },

        onPanResponderMove: (evt: any) => {
          const newA = angle(evt.nativeEvent.pageX, evt.nativeEvent.pageY);
          if (lastAngle.current === null) { lastAngle.current = newA; return; }
          let delta = newA - lastAngle.current;
          if (delta >  180) delta -= 360;
          if (delta < -180) delta += 360;

          const now = Date.now();
          const dt  = Math.max(now - lastTime.current, 1);
          const vel = (delta / dt) * 16;

          rotDeg.current += delta;
          rotation.setValue(rotDeg.current);
          lastAngle.current = newA;
          lastTime.current  = now;
          (rotation as any)._velocity = vel;
          setSpeed(getSpeedLabel(vel));
        },

        onPanResponderRelease: () => {
          lastAngle.current = null;
          const vel = (rotation as any)._velocity ?? 0;
          if (Math.abs(vel) < 0.5) { setSpeed({ label: 'still', color: '#888' }); return; }

          const anim = Animated.decay(rotation, { velocity: vel, deceleration: 0.994, useNativeDriver: false });
          decayAnim.current = anim;
          anim.start(({ finished }) => {
            if (finished) { decayAnim.current = null; setSpeed({ label: 'still', color: '#888' }); }
          });
        },
      });
    })()
  ).current;

  const spin = rotation.interpolate({
    inputRange: [0, 360], outputRange: ['0deg', '360deg'], extrapolate: 'extend',
  });

  return (
    <View style={styles.container}>
      {/* Header — outside pan zone so back button is always tappable */}
      <View style={[styles.header, { paddingTop: topPad + 8 }]}>
        <Pressable
          onPress={() => router.back()}
          style={({ pressed }) => [styles.back, { opacity: pressed ? 0.6 : 1 }]}
          accessibilityLabel="Back"
        >
          <Ionicons name="arrow-back" size={24} color="rgba(190,210,230,0.9)" />
        </Pressable>
        <Text style={styles.title}>🌀 {t('Fidget Spinner')}</Text>
        <View style={styles.headerRight}>
          <Pressable
            onPress={toggleSound}
            style={({ pressed }) => [styles.soundBtn, { opacity: pressed ? 0.7 : 1 }]}
            accessibilityLabel={soundOn ? 'Mute sound' : 'Play ambient sound'}
          >
            <Ionicons name={soundOn ? 'volume-high' : 'volume-mute-outline'} size={20} color="rgba(210,200,240,0.65)" />
          </Pressable>
          <Text style={[styles.speedBadge, { color: speed.color }]}>{t(speed.label)}</Text>
        </View>
      </View>

      {/* Pan zone — full remaining area so spinning feels natural */}
      <View
        style={styles.panZone}
        onLayout={(e) => {
          const { x, y, width, height } = e.nativeEvent.layout;
          zoneLayout.current = { cx: x + width / 2, cy: y + height / 2 };
        }}
        {...panResponder.panHandlers}
      >
        <Animated.View style={[styles.spinnerWrap, { transform: [{ rotate: spin }] }]}>
          <View style={[styles.lobe, { backgroundColor: '#4dd0e1', transform: [{ rotate: '0deg'   }, { translateY: -80 }] }]} />
          <View style={[styles.lobe, { backgroundColor: '#ba68c8', transform: [{ rotate: '120deg' }, { translateY: -80 }] }]} />
          <View style={[styles.lobe, { backgroundColor: '#f06292', transform: [{ rotate: '240deg' }, { translateY: -80 }] }]} />
          <View style={styles.centerCap} />
        </Animated.View>
        <Text style={styles.hint}>{t('Drag to spin')}</Text>
      </View>
    </View>
  );
}

const LOBE_SIZE = 110;

export default function SpinnerGame() {
  return (
    <GameErrorBoundary>
      <SpinnerGameInner />
    </GameErrorBoundary>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0d0d1a' },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 16, paddingBottom: 12, zIndex: 10,
    borderBottomWidth: 1, borderBottomColor: 'rgba(120,100,180,0.12)',
  },
  back:       { padding: 4, width: 44 },
  title:      { color: 'rgba(210,200,240,0.97)', fontSize: 20, fontWeight: '700', fontFamily: 'Inter_700Bold' },
  speedBadge: { fontSize: 16, fontWeight: '700', fontFamily: 'Inter_700Bold', minWidth: 60, textAlign: 'right', letterSpacing: 1, textTransform: 'uppercase' },
  panZone:    { flex: 1, alignItems: 'center', justifyContent: 'center' },
  spinnerWrap:{ width: 220, height: 220, alignItems: 'center', justifyContent: 'center' },
  lobe: {
    position: 'absolute',
    width: LOBE_SIZE, height: LOBE_SIZE, borderRadius: LOBE_SIZE / 2, opacity: 0.88,
  },
  centerCap: {
    width: 48, height: 48, borderRadius: 24,
    backgroundColor: '#1e1e3a', borderWidth: 3, borderColor: '#ffffff22',
  },
  hint:       { position: 'absolute', bottom: 40, color: '#444', fontSize: 16 },
  headerRight:{ flexDirection: 'row', alignItems: 'center', gap: 4 },
  soundBtn:   { padding: 4 },
});
