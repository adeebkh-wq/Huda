import React, { useRef, useState, useCallback } from 'react';
import {
  Animated,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
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

const COLORS = ['#4dd0e1', '#ba68c8', '#f06292', '#81c784', '#ffb74d', '#e57373'];
let colorIndex = 0;

interface Orb {
  id: number;
  x: number;
  y: number;
  color: string;
  opacity: Animated.Value;
  translateY: Animated.Value;
  scale: Animated.Value;
}

let nextId = 0;

function GlowGameInner() {
  const insets = useSafeAreaInsets();
  const topPad = Platform.OS === 'web' ? Math.max(insets.top, 67) : insets.top;

  const { soundOn, toggleSound, playSound } = useGameSound('glow');
  const { appLanguage } = useApp();
  const t = (key: string) => translateLabel(key, appLanguage);
  const [orbs, setOrbs] = useState<Orb[]>([]);
  const orbsRef = useRef<Orb[]>([]);

  const spawnOrb = useCallback((x: number, y: number) => {
    const color   = COLORS[colorIndex % COLORS.length];
    colorIndex++;

    const opacity    = new Animated.Value(0);
    const translateY = new Animated.Value(0);
    const scale      = new Animated.Value(0.3);
    const id         = nextId++;

    const orb: Orb = { id, x, y, color, opacity, translateY, scale };
    orbsRef.current = [...orbsRef.current, orb];
    setOrbs([...orbsRef.current]);

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    playSound();

    Animated.parallel([
      Animated.spring(scale, { toValue: 1, useNativeDriver: true, damping: 10, stiffness: 120 }),
      Animated.sequence([
        Animated.timing(opacity, { toValue: 0.9, duration: 300,  useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 0,   duration: 2700, useNativeDriver: true }),
      ]),
      Animated.timing(translateY, { toValue: -160, duration: 3000, useNativeDriver: true }),
    ]).start(() => {
      orbsRef.current = orbsRef.current.filter((o) => o.id !== id);
      setOrbs([...orbsRef.current]);
    });
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
          <Ionicons name="arrow-back" size={24} color="rgba(180,200,230,0.9)" />
        </Pressable>
        <Text style={styles.title}>✨ {t('Magic Glow')}</Text>
        <Pressable
          onPress={toggleSound}
          style={({ pressed }) => [styles.soundBtn, { opacity: pressed ? 0.7 : 1 }]}
          accessibilityLabel={soundOn ? 'Mute sound' : 'Play ambient sound'}
        >
          <Ionicons name={soundOn ? 'volume-high' : 'volume-mute-outline'} size={22} color="rgba(210,195,245,0.7)" />
        </Pressable>
      </View>

      {/* Tap area */}
      <TouchableWithoutFeedback
        onPress={(e) => spawnOrb(e.nativeEvent.pageX, e.nativeEvent.pageY)}
      >
        <View style={styles.canvas}>
          {orbs.map((orb) => (
            <Animated.View
              key={orb.id}
              style={[
                styles.orb,
                {
                  left:            orb.x - 55,
                  top:             orb.y - 55,
                  backgroundColor: orb.color,
                  shadowColor:     orb.color,
                  opacity:         orb.opacity,
                  transform:       [{ translateY: orb.translateY }, { scale: orb.scale }],
                },
              ]}
            />
          ))}
          <Text style={styles.hint}>{t('Tap anywhere to glow')}</Text>
        </View>
      </TouchableWithoutFeedback>
    </View>
  );
}

export default function GlowGame() {
  return (
    <GameErrorBoundary>
      <GlowGameInner />
    </GameErrorBoundary>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#05050f' },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 16, paddingBottom: 12, zIndex: 10,
    borderBottomWidth: 1, borderBottomColor: 'rgba(100,80,160,0.1)',
  },
  back:   { padding: 4, width: 44 },
  title:  { color: 'rgba(210,195,245,0.97)', fontSize: 20, fontWeight: '700', fontFamily: 'Inter_700Bold' },
  canvas: { flex: 1 },
  orb: {
    position: 'absolute',
    width: 110, height: 110, borderRadius: 55,
    shadowOffset: { width: 0, height: 0 }, shadowOpacity: 1, shadowRadius: 40, elevation: 20,
  },
  hint: { position: 'absolute', bottom: 60, alignSelf: 'center', color: '#1a1a2e', fontSize: 16 },
  soundBtn: { padding: 4, width: 44, alignItems: 'center', justifyContent: 'center' },
});
