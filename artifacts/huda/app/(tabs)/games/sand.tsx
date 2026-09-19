import React, { useRef, useState, useCallback } from 'react';
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

const GRAIN_COLORS = ['#c8a97e', '#d4b896', '#e0c9a6', '#b8965e', '#dfc090', '#f0d8b0'];
const FADE_DELAY   = 9000;

interface Grain {
  id: number;
  x: number;
  y: number;
  size: number;
  color: string;
  opacity: Animated.Value;
}

let nextId = 0;

function SandGameInner() {
  const insets = useSafeAreaInsets();
  const topPad = Platform.OS === 'web' ? Math.max(insets.top, 67) : insets.top;

  const { soundOn, toggleSound, playSound } = useGameSound('sand');
  const { appLanguage } = useApp();
  const t = (key: string) => translateLabel(key, appLanguage);
  const [grains, setGrains] = useState<Grain[]>([]);
  const grainsRef      = useRef<Grain[]>([]);
  const lastPos        = useRef<{ x: number; y: number } | null>(null);
  const hapticsThrottle = useRef(0);

  const addGrain = useCallback((x: number, y: number) => {
    const count     = 4 + Math.floor(Math.random() * 4);
    const newGrains: Grain[] = [];

    for (let i = 0; i < count; i++) {
      const gx      = x + (Math.random() - 0.5) * 14;
      const gy      = y + (Math.random() - 0.5) * 14;
      const size    = 2 + Math.random() * 3;
      const color   = GRAIN_COLORS[Math.floor(Math.random() * GRAIN_COLORS.length)];
      const opacity = new Animated.Value(0.85 + Math.random() * 0.15);
      const id      = nextId++;
      newGrains.push({ id, x: gx, y: gy, size, color, opacity });

      setTimeout(() => {
        Animated.timing(opacity, { toValue: 0, duration: 1200, useNativeDriver: true })
          .start(() => {
            grainsRef.current = grainsRef.current.filter((g) => g.id !== id);
            setGrains([...grainsRef.current]);
          });
      }, FADE_DELAY);
    }

    grainsRef.current = [...grainsRef.current, ...newGrains];
    setGrains([...grainsRef.current]);
  }, []);

  const panResponder = useRef(
    (() => {
      const { PanResponder } = require('react-native');
      return PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onMoveShouldSetPanResponder:  () => true,

        onPanResponderGrant: (evt: any) => {
          const { pageX, pageY } = evt.nativeEvent;
          lastPos.current = { x: pageX, y: pageY };
          addGrain(pageX, pageY);
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          playSound();
        },

        onPanResponderMove: (evt: any) => {
          const { pageX, pageY } = evt.nativeEvent;
          const last = lastPos.current;
          if (last) {
            const dist = Math.hypot(pageX - last.x, pageY - last.y);
            if (dist < 8) return;
          }
          lastPos.current = { x: pageX, y: pageY };
          addGrain(pageX, pageY);
          const now = Date.now();
          if (now - hapticsThrottle.current > 80) {
            hapticsThrottle.current = now;
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            playSound();
          }
        },

        onPanResponderRelease: () => { lastPos.current = null; },
      });
    })()
  ).current;

  const clearAll = useCallback(() => {
    grainsRef.current = [];
    setGrains([]);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  }, []);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: topPad + 8 }]}>
        <Pressable
          onPress={() => router.back()}
          style={({ pressed }) => [styles.back, { opacity: pressed ? 0.6 : 1 }]}
          accessibilityLabel="Back"
        >
          <Ionicons name="arrow-back" size={24} color="rgba(200,180,140,0.9)" />
        </Pressable>
        <Text style={styles.title}>🏖️ {t('Sand Doodle')}</Text>
        <View style={styles.headerRight}>
          <Pressable
            onPress={toggleSound}
            style={({ pressed }) => [styles.soundBtn, { opacity: pressed ? 0.7 : 1 }]}
            accessibilityLabel={soundOn ? 'Mute sound' : 'Play ambient sound'}
          >
            <Ionicons name={soundOn ? 'volume-high' : 'volume-mute-outline'} size={20} color="rgba(200,180,140,0.65)" />
          </Pressable>
          <Pressable
            onPress={clearAll}
            style={({ pressed }) => [styles.clearBtn, { opacity: pressed ? 0.7 : 1 }]}
            accessibilityLabel="Clear canvas"
          >
            <Text style={styles.clearText}>{t('Clear')}</Text>
          </Pressable>
        </View>
      </View>

      {/* Draw zone */}
      <View style={styles.canvas} {...panResponder.panHandlers}>
        {grains.map((grain) => (
          <Animated.View
            key={grain.id}
            style={[
              styles.grain,
              {
                left:            grain.x - grain.size / 2,
                top:             grain.y - grain.size / 2,
                width:           grain.size,
                height:          grain.size,
                borderRadius:    grain.size / 2,
                backgroundColor: grain.color,
                opacity:         grain.opacity,
              },
            ]}
          />
        ))}
        <Text style={styles.hint}>{t('Draw with your finger')}</Text>
      </View>
    </View>
  );
}

export default function SandGame() {
  return (
    <GameErrorBoundary>
      <SandGameInner />
    </GameErrorBoundary>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#1a1208' },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 16, paddingBottom: 12, zIndex: 10,
    borderBottomWidth: 1, borderBottomColor: 'rgba(140,110,50,0.15)',
  },
  back:      { padding: 4, width: 44 },
  title:     { color: 'rgba(220,195,150,0.97)', fontSize: 20, fontWeight: '700', fontFamily: 'Inter_700Bold' },
  clearBtn:  { backgroundColor: '#2a2010', borderWidth: 1, borderColor: '#5a4a2a', paddingHorizontal: 16, paddingVertical: 6, borderRadius: 16 },
  clearText: { color: '#c8a97e', fontSize: 14, fontWeight: '600', fontFamily: 'Inter_600SemiBold' },
  canvas:    { flex: 1 },
  grain:     { position: 'absolute' },
  hint:        { position: 'absolute', bottom: 60, alignSelf: 'center', color: '#3a2e18', fontSize: 16 },
  headerRight: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  soundBtn:    { padding: 4 },
});
