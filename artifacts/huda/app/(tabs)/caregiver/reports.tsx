import React, { useMemo } from 'react';
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
import { useColors } from '@/hooks/useColors';
import { useApp } from '@/context/AppContext';
import { useCaregiver } from '@/context/CaregiverContext';
import { translateLabel } from '@/data/translations';

function dayLabel(ts: number) {
  const d = new Date(ts);
  return d.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' });
}

export default function ReportsScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { boards, usageStats, appLanguage } = useApp();
  const t = (key: string) => translateLabel(key, appLanguage);
  const { emotionHistory } = useCaregiver();
  const topPad = Platform.OS === 'web' ? Math.max(insets.top, 67) : insets.top;
  const bottomPad = Platform.OS === 'web' ? 34 : insets.bottom;

  const topTiles = useMemo(() => {
    const allTiles = boards.flatMap((b) => b.tiles);
    return allTiles
      .filter((t) => (usageStats[t.id] ?? 0) > 0)
      .sort((a, b) => (usageStats[b.id] ?? 0) - (usageStats[a.id] ?? 0))
      .slice(0, 10);
  }, [boards, usageStats]);

  const totalWords = useMemo(
    () => Object.values(usageStats).reduce((a, b) => a + b, 0),
    [usageStats],
  );

  // Group emotion history by day
  const emotionsByDay = useMemo(() => {
    const groups: Record<string, typeof emotionHistory> = {};
    for (const e of emotionHistory.slice(0, 50)) {
      const key = dayLabel(e.timestamp);
      if (!groups[key]) groups[key] = [];
      groups[key].push(e);
    }
    return Object.entries(groups).slice(0, 7);
  }, [emotionHistory]);

  const maxCount = useMemo(
    () => Math.max(1, ...topTiles.map((t) => usageStats[t.id] ?? 0)),
    [topTiles, usageStats],
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { paddingTop: topPad + 8, backgroundColor: colors.card, borderBottomColor: colors.border }]}>
        <Pressable
          onPress={() => router.back()}
          style={({ pressed }) => [styles.backBtn, { opacity: pressed ? 0.6 : 1 }]}
        >
          <Ionicons name="arrow-back" size={24} color={colors.foreground} />
        </Pressable>
        <Text style={[styles.title, { color: colors.foreground }]}>{t('Usage Reports')}</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        contentContainerStyle={[styles.content, { paddingBottom: bottomPad + 20 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Summary stats */}
        <View style={styles.statsRow}>
          <StatCard label={t('Total Words')} value={totalWords.toString()} icon="chatbubbles-outline" color={colors.primary} cardBg={colors.card} borderColor={colors.border} fgColor={colors.foreground} mutedColor={colors.mutedForeground} />
          <StatCard label={t('Unique Tiles')} value={Object.keys(usageStats).length.toString()} icon="grid-outline" color="#7C4DBC" cardBg={colors.card} borderColor={colors.border} fgColor={colors.foreground} mutedColor={colors.mutedForeground} />
          <StatCard label={t('Check-ins')} value={emotionHistory.length.toString()} icon="happy-outline" color="#D0457E" cardBg={colors.card} borderColor={colors.border} fgColor={colors.foreground} mutedColor={colors.mutedForeground} />
        </View>

        {/* Top Words Bar Chart */}
        <Section title={t('Top Words Used')} icon="bar-chart-outline" colors={colors}>
          {topTiles.length === 0 ? (
            <Text style={[styles.empty, { color: colors.mutedForeground }]}>
              {t('No words used yet. Start tapping tiles on the board!')}
            </Text>
          ) : (
            topTiles.map((tile) => {
              const count = usageStats[tile.id] ?? 0;
              const pct = (count / maxCount) * 100;
              return (
                <View key={tile.id} style={styles.barRow}>
                  <View style={[styles.barDot, { backgroundColor: tile.color }]} />
                  <Text style={[styles.barLabel, { color: colors.foreground }]} numberOfLines={1}>
                    {tile.label}
                  </Text>
                  <View style={[styles.barTrack, { backgroundColor: colors.border }]}>
                    <View style={[styles.barFill, { backgroundColor: tile.color, width: `${pct}%` }]} />
                  </View>
                  <Text style={[styles.barCount, { color: colors.mutedForeground }]}>{count}</Text>
                </View>
              );
            })
          )}
        </Section>

        {/* Emotion History */}
        <Section title={t('Emotion Check-ins')} icon="heart-outline" colors={colors}>
          {emotionsByDay.length === 0 ? (
            <Text style={[styles.empty, { color: colors.mutedForeground }]}>
              {t('No check-ins yet. Use the Feelings screen to record emotions.')}
            </Text>
          ) : (
            emotionsByDay.map(([day, entries]) => (
              <View key={day} style={[styles.dayRow, { borderBottomColor: colors.border }]}>
                <Text style={[styles.dayLabel, { color: colors.mutedForeground }]}>{day}</Text>
                <View style={styles.dayEmotions}>
                  {entries.map((e) => (
                    <View key={e.id} style={[styles.emotionChip, { backgroundColor: e.color + '33', borderColor: e.color }]}>
                      <Text style={[styles.emotionChipText, { color: e.color }]}>{e.emotion}</Text>
                    </View>
                  ))}
                </View>
              </View>
            ))
          )}
        </Section>

        {/* Export note */}
        <View style={[styles.exportCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Ionicons name="document-text-outline" size={20} color={colors.mutedForeground} />
          <Text style={[styles.exportText, { color: colors.mutedForeground }]}>
            All data is stored privately on this device. To share progress with a therapist, take a screenshot of this report. Automatic cloud sync is never performed.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

function StatCard({ label, value, icon, color, cardBg, borderColor, fgColor, mutedColor }: any) {
  return (
    <View style={[styles.statCard, { backgroundColor: cardBg, borderColor }]}>
      <Ionicons name={icon} size={20} color={color} />
      <Text style={[styles.statValue, { color: fgColor }]}>{value}</Text>
      <Text style={[styles.statLabel, { color: mutedColor }]}>{label}</Text>
    </View>
  );
}

function Section({ title, icon, colors, children }: { title: string; icon: string; colors: any; children: React.ReactNode }) {
  return (
    <View style={[styles.section, { backgroundColor: colors.card, borderColor: colors.border }]}>
      <View style={styles.sectionHeader}>
        <Ionicons name={icon as any} size={18} color={colors.primary} />
        <Text style={[styles.sectionTitle, { color: colors.foreground }]}>{title}</Text>
      </View>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
  },
  backBtn: { padding: 4, width: 40 },
  title: { fontSize: 20, fontWeight: '700', fontFamily: 'Inter_700Bold' },
  content: { padding: 16, gap: 16 },
  statsRow: { flexDirection: 'row', gap: 10 },
  statCard: {
    flex: 1,
    alignItems: 'center',
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    gap: 4,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 1 },
    elevation: 1,
  },
  statValue: { fontSize: 22, fontWeight: '700', fontFamily: 'Inter_700Bold' },
  statLabel: { fontSize: 11, fontFamily: 'Inter_400Regular', textAlign: 'center' },
  section: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
    gap: 12,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 1 },
    elevation: 1,
  },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 4 },
  sectionTitle: { fontSize: 16, fontWeight: '700', fontFamily: 'Inter_700Bold' },
  barRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  barDot: { width: 10, height: 10, borderRadius: 5 },
  barLabel: { width: 80, fontSize: 13, fontFamily: 'Inter_500Medium' },
  barTrack: { flex: 1, height: 8, borderRadius: 4, overflow: 'hidden' },
  barFill: { height: '100%', borderRadius: 4 },
  barCount: { width: 32, textAlign: 'right', fontSize: 12, fontFamily: 'Inter_500Medium' },
  dayRow: {
    paddingVertical: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
    gap: 6,
  },
  dayLabel: { fontSize: 12, fontFamily: 'Inter_500Medium' },
  dayEmotions: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  emotionChip: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
  },
  emotionChipText: { fontSize: 12, fontWeight: '600', fontFamily: 'Inter_600SemiBold' },
  empty: { fontSize: 14, fontFamily: 'Inter_400Regular', lineHeight: 20 },
  exportCard: {
    flexDirection: 'row',
    gap: 12,
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    alignItems: 'flex-start',
  },
  exportText: { flex: 1, fontSize: 12, fontFamily: 'Inter_400Regular', lineHeight: 18 },
});
