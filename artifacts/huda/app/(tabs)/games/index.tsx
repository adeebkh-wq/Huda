import React from 'react';
import {
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@/components/IoniconsSVG';
import * as Haptics from 'expo-haptics';
import { useApp } from '@/context/AppContext';
import { translateLabel } from '@/data/translations';

const GAMES = [
  {
    id: 'bubbles',
    title: 'Bubble Pop',
    description: 'Float and pop colourful bubbles',
    icon: 'ellipse' as const,
    color: '#2B78BE',
    bg: '#0D2A45',
    route: '/(tabs)/games/bubbles',
  },
  {
    id: 'rain',
    title: 'Rain & Ripples',
    description: 'Tap to make calming water rings',
    icon: 'water' as const,
    color: '#2A9D8F',
    bg: '#0A2420',
    route: '/(tabs)/games/rain',
  },
  {
    id: 'spinner',
    title: 'Fidget Spinner',
    description: 'Swipe to spin a colourful spinner',
    icon: 'sync' as const,
    color: '#7C4DBC',
    bg: '#150A28',
    route: '/(tabs)/games/spinner',
  },
  {
    id: 'glow',
    title: 'Magic Glow',
    description: 'Touch to light up the dark',
    icon: 'sunny' as const,
    color: '#C98A1A',
    bg: '#160E00',
    route: '/(tabs)/games/glow',
  },
  {
    id: 'sand',
    title: 'Sand Doodle',
    description: 'Draw in warm sand that fades away',
    icon: 'brush' as const,
    color: '#D4650A',
    bg: '#160900',
    route: '/(tabs)/games/sand',
  },
  {
    id: 'mirror',
    title: 'Mirror Draw',
    description: 'Create beautiful symmetry patterns',
    icon: 'color-palette' as const,
    color: '#D0457E',
    bg: '#180A12',
    route: '/(tabs)/games/mirror',
  },
];

export default function GamesHub() {
  const insets = useSafeAreaInsets();
  const { appLanguage } = useApp();
  const t = (key: string) => translateLabel(key, appLanguage);
  const topPad = Platform.OS === 'web' ? Math.max(insets.top, 67) : insets.top;
  const bottomPad = Platform.OS === 'web' ? 34 : insets.bottom;

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: topPad + 8 }]}>
        <Pressable
          onPress={() => router.back()}
          style={({ pressed }) => [styles.backBtn, { opacity: pressed ? 0.6 : 1 }]}
          accessibilityLabel="Go back"
        >
          <Ionicons name="arrow-back" size={24} color="rgba(200,220,230,0.9)" />
        </Pressable>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>🎮 {t('Sensory Games')}</Text>
          <Text style={styles.headerSub}>{t('No rules · No score · Just calm')}</Text>
        </View>
        <View style={{ width: 44 }} />
      </View>

      <ScrollView
        contentContainerStyle={[styles.grid, { paddingBottom: bottomPad + 24 }]}
        showsVerticalScrollIndicator={false}
      >
        {GAMES.map((game) => (
          <Pressable
            key={game.id}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
              router.push(game.route as any);
            }}
            style={({ pressed }) => [
              styles.card,
              { backgroundColor: game.bg, borderColor: game.color + '50', opacity: pressed ? 0.85 : 1 },
            ]}
            accessibilityLabel={`${game.title}: ${game.description}`}
          >
            <View style={[styles.iconCircle, { backgroundColor: game.color + '28' }]}>
              <Ionicons name={game.icon} size={32} color={game.color} />
            </View>
            <View style={styles.cardText}>
              <Text style={styles.cardTitle}>{t(game.title)}</Text>
              <Text style={styles.cardDesc}>{t(game.description)}</Text>
            </View>
            <View style={[styles.playChip, { backgroundColor: game.color }]}>
              <Ionicons name="play" size={13} color="#fff" />
              <Text style={styles.playText}>{t('Play')}</Text>
            </View>
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0D1B2A' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.08)',
  },
  backBtn: { padding: 4, width: 44 },
  headerCenter: { alignItems: 'center', gap: 3 },
  headerTitle: {
    color: 'rgba(220,235,245,0.97)',
    fontSize: 20,
    fontWeight: '700',
    fontFamily: 'Inter_700Bold',
  },
  headerSub: {
    color: 'rgba(160,190,210,0.55)',
    fontSize: 12,
    fontFamily: 'Inter_400Regular',
  },
  grid: { padding: 16, gap: 12 },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 20,
    borderWidth: 1,
    padding: 16,
    gap: 14,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 4,
  },
  iconCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardText: { flex: 1, gap: 4 },
  cardTitle: {
    color: 'rgba(220,235,245,0.97)',
    fontSize: 17,
    fontWeight: '700',
    fontFamily: 'Inter_700Bold',
  },
  cardDesc: {
    color: 'rgba(160,190,210,0.65)',
    fontSize: 13,
    fontFamily: 'Inter_400Regular',
  },
  playChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
  },
  playText: { color: '#fff', fontSize: 13, fontWeight: '700', fontFamily: 'Inter_700Bold' },
});
