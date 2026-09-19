import React, { useMemo } from 'react';
import {
  Linking,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useAuth, useUser } from '@clerk/expo';
import { Ionicons } from '@/components/IoniconsSVG';
import * as Haptics from 'expo-haptics';
import { useColors } from '@/hooks/useColors';
import { useApp } from '@/context/AppContext';
import { useCaregiver } from '@/context/CaregiverContext';
import { translateLabel } from '@/data/translations';
import { clearAuthCache } from '@/context/OfflineAuthContext';
import { useLocalAdmin } from '@/context/LocalAdminContext';

export default function CaregiverDashboard() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { boards, usageStats, appLanguage } = useApp();
  const t = (key: string) => translateLabel(key, appLanguage);
  const { lock, emotionHistory } = useCaregiver();
  const { signOut } = useAuth();
  const { user } = useUser();
  const { isLocalAdminSignedIn, localAdminName, signOutLocalAdmin } = useLocalAdmin();
  const topPad = Platform.OS === 'web' ? Math.max(insets.top, 67) : insets.top;
  const bottomPad = Platform.OS === 'web' ? 34 : insets.bottom;

  // Top 5 used tiles
  const topTiles = useMemo(() => {
    const allTiles = boards.flatMap((b) => b.tiles);
    return allTiles
      .filter((t) => (usageStats[t.id] ?? 0) > 0)
      .sort((a, b) => (usageStats[b.id] ?? 0) - (usageStats[a.id] ?? 0))
      .slice(0, 5);
  }, [boards, usageStats]);

  // Today's emotion check-ins
  const todayEmotions = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return emotionHistory.filter((e) => e.timestamp >= today.getTime());
  }, [emotionHistory]);

  const handleLock = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning).catch(() => {});
    lock();
    router.back();
  };

  const handleSignOut = async () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning).catch(() => {});
    if (isLocalAdminSignedIn) {
      await signOutLocalAdmin();
      return;
    }
    await clearAuthCache();
    await signOut();
    // Do NOT call router.replace here — (tabs)/_layout.tsx's <Redirect href="/" />
    // fires automatically once isSignedIn becomes false, avoiding double-navigate.
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { paddingTop: topPad + 8, backgroundColor: colors.card, borderBottomColor: colors.border }]}>
        <Pressable
          onPress={() => router.back()}
          style={({ pressed }) => [styles.backBtn, { opacity: pressed ? 0.6 : 1 }]}
          accessibilityLabel="Back to communication board"
        >
          <Ionicons name="arrow-back" size={24} color={colors.foreground} />
        </Pressable>
        <Text style={[styles.title, { color: colors.foreground }]}>{t('Caregiver Mode')}</Text>
        <Pressable
          onPress={handleLock}
          style={({ pressed }) => [styles.lockBtn, { opacity: pressed ? 0.6 : 1, backgroundColor: colors.secondary }]}
          accessibilityLabel="Lock caregiver mode"
        >
          <Ionicons name="lock-closed" size={16} color={colors.mutedForeground} />
          <Text style={[styles.lockText, { color: colors.mutedForeground }]}>{t('Lock')}</Text>
        </Pressable>
      </View>

      <ScrollView
        contentContainerStyle={[styles.content, { paddingBottom: bottomPad + 20 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Account row */}
        {(user || isLocalAdminSignedIn) && (
          <View style={[styles.accountCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <View style={[styles.accountAvatar, { backgroundColor: colors.primary + '22' }]}>
              <Ionicons name="person" size={20} color={colors.primary} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.accountEmail, { color: colors.foreground }]} numberOfLines={1}>
                {isLocalAdminSignedIn
                  ? localAdminName ?? 'Local Caregiver'
                  : user?.primaryEmailAddress?.emailAddress ?? 'Caregiver Account'}
              </Text>
              <Text style={[styles.accountSub, { color: colors.mutedForeground }]}>
                {isLocalAdminSignedIn
                  ? 'Device-only account · no email required'
                  : 'Cloud caregiver account'}
              </Text>
            </View>
            <Pressable
              onPress={handleSignOut}
              style={({ pressed }) => [styles.signOutBtn, { opacity: pressed ? 0.7 : 1 }]}
            >
              <Ionicons name="log-out-outline" size={18} color={colors.mutedForeground} />
            </Pressable>
          </View>
        )}

        {/* Nav Cards */}
        <View style={styles.navGrid}>
          <NavCard
            icon="settings-outline"
            label={t('Settings')}
            sub={t('TTS, font, display')}
            color="#2A9D8F"
            onPress={() => router.push('/(tabs)/caregiver/settings')}
            colors={colors}
          />
          <NavCard
            icon="bar-chart-outline"
            label={t('Reports')}
            sub={t('Usage & emotions')}
            color="#7C4DBC"
            onPress={() => router.push('/(tabs)/caregiver/reports')}
            colors={colors}
          />
          <NavCard
            icon="grid-outline"
            label={t('Boards')}
            sub={t('Manage tiles')}
            color="#E07B39"
            onPress={() => router.push('/(tabs)/caregiver/boards')}
            colors={colors}
          />
          <NavCard
            icon="book-outline"
            label={t('Social Stories')}
            sub="@hudaautismworld"
            color="#2B78BE"
            onPress={() => Linking.openURL('https://www.instagram.com/hudaautismworld?igsh=aGJvZmZpd3RsN25k&utm_source=qr')}
            colors={colors}
          />
          <NavCard
            icon="ribbon-outline"
            label={t('About Autism')}
            sub={t('Signs, strengths & more')}
            color="#E05C6A"
            onPress={() => router.push('/(tabs)/caregiver/autism')}
            colors={colors}
          />
        </View>

        {/* Top words */}
        {topTiles.length > 0 && (
          <Section title={t('Most Used Words')} icon="trending-up-outline" colors={colors}>
            {topTiles.map((tile) => (
              <View key={tile.id} style={[styles.statRow, { borderBottomColor: colors.border }]}>
                <View style={[styles.tileColor, { backgroundColor: tile.color }]} />
                <Text style={[styles.statLabel, { color: colors.foreground }]}>{tile.label}</Text>
                <Text style={[styles.statCount, { color: colors.mutedForeground }]}>
                  {usageStats[tile.id] ?? 0}×
                </Text>
              </View>
            ))}
          </Section>
        )}

        {/* Today's emotions */}
        <Section title={t("Today's Feelings")} icon="happy-outline" colors={colors}>
          {todayEmotions.length === 0 ? (
            <Text style={[styles.empty, { color: colors.mutedForeground }]}>{t('No check-ins yet today')}</Text>
          ) : (
            <View style={styles.emotionRow}>
              {todayEmotions.slice(0, 8).map((e) => (
                <View key={e.id} style={[styles.emotionDot, { backgroundColor: e.color }]}>
                  <Text style={styles.emotionDotText}>{e.emotion[0]}</Text>
                </View>
              ))}
            </View>
          )}
        </Section>
      </ScrollView>
    </View>
  );
}

function NavCard({
  icon, label, sub, color, onPress, colors, comingSoon = false,
}: {
  icon: string; label: string; sub: string; color: string;
  onPress: () => void; colors: any; comingSoon?: boolean;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.navCard,
        { backgroundColor: colors.card, borderColor: colors.border, opacity: pressed ? 0.7 : 1 },
      ]}
    >
      <View style={[styles.navIcon, { backgroundColor: color + '22' }]}>
        <Ionicons name={icon as any} size={22} color={color} />
      </View>
      <Text style={[styles.navLabel, { color: colors.foreground }]}>{label}</Text>
      <Text style={[styles.navSub, { color: colors.mutedForeground }]} numberOfLines={1}>{comingSoon ? 'Coming soon' : sub}</Text>
    </Pressable>
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
  lockBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    paddingHorizontal: 12, paddingVertical: 7, borderRadius: 12,
  },
  lockText: { fontSize: 13, fontWeight: '600', fontFamily: 'Inter_600SemiBold' },
  content: { padding: 16, gap: 16 },

  accountCard: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    padding: 14, borderRadius: 16, borderWidth: 1,
  },
  accountAvatar: {
    width: 40, height: 40, borderRadius: 20,
    alignItems: 'center', justifyContent: 'center',
  },
  accountEmail: { fontSize: 14, fontWeight: '600', fontFamily: 'Inter_600SemiBold' },
  accountSub: { fontSize: 12, fontFamily: 'Inter_400Regular', marginTop: 1 },
  signOutBtn: { padding: 8 },

  navGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  navCard: {
    width: '47%', padding: 16, borderRadius: 16, borderWidth: 1, gap: 8,
    shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 }, elevation: 2,
  },
  navIcon: {
    width: 44, height: 44, borderRadius: 12,
    alignItems: 'center', justifyContent: 'center',
  },
  navLabel: { fontSize: 15, fontWeight: '700', fontFamily: 'Inter_700Bold' },
  navSub: { fontSize: 12, fontFamily: 'Inter_400Regular' },
  section: {
    borderRadius: 16, borderWidth: 1, padding: 16, gap: 12,
    shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 4,
    shadowOffset: { width: 0, height: 1 }, elevation: 1,
  },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  sectionTitle: { fontSize: 16, fontWeight: '700', fontFamily: 'Inter_700Bold' },
  statRow: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    paddingVertical: 8, borderBottomWidth: StyleSheet.hairlineWidth,
  },
  tileColor: { width: 12, height: 12, borderRadius: 6 },
  statLabel: { flex: 1, fontSize: 15, fontFamily: 'Inter_500Medium' },
  statCount: { fontSize: 14, fontFamily: 'Inter_600SemiBold', fontWeight: '600' },
  emotionRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  emotionDot: {
    width: 40, height: 40, borderRadius: 20,
    alignItems: 'center', justifyContent: 'center',
  },
  emotionDotText: { color: '#fff', fontSize: 14, fontWeight: '700' },
  empty: { fontSize: 14, fontFamily: 'Inter_400Regular' },
});
