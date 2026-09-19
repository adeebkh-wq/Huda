import React, { useState } from 'react';
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
import { useColors } from '@/hooks/useColors';
import { useApp } from '@/context/AppContext';
import { useCaregiver } from '@/context/CaregiverContext';
import { translateLabel } from '@/data/translations';

const EMOTIONS = [
  { id: 'happy',   label: 'Happy',   icon: 'happy',         color: '#F59E0B', bg: '#FEF3C7' },
  { id: 'sad',     label: 'Sad',     icon: 'sad',           color: '#3B82F6', bg: '#DBEAFE' },
  { id: 'angry',   label: 'Angry',   icon: 'flame',         color: '#EF4444', bg: '#FEE2E2' },
  { id: 'scared',  label: 'Scared',  icon: 'warning',       color: '#8B5CF6', bg: '#EDE9FE' },
  { id: 'tired',   label: 'Tired',   icon: 'moon',          color: '#64748B', bg: '#F1F5F9' },
  { id: 'sick',    label: 'Sick',    icon: 'medical',       color: '#10B981', bg: '#D1FAE5' },
  { id: 'excited', label: 'Excited', icon: 'star',          color: '#F97316', bg: '#FFEDD5' },
  { id: 'calm',    label: 'Calm',    icon: 'leaf',          color: '#2D9A57', bg: '#D1FAE5' },
  { id: 'loved',   label: 'Loved',   icon: 'heart',         color: '#EC4899', bg: '#FCE7F3' },
  { id: 'ok',      label: 'OK',      icon: 'thumbs-up',     color: '#2A9D8F', bg: '#CCFBF1' },
  { id: 'hurt',    label: 'Hurt',    icon: 'bandage',       color: '#DC2626', bg: '#FEE2E2' },
  { id: 'bored',   label: 'Bored',   icon: 'remove-circle', color: '#94A3B8', bg: '#F8FAFC' },
];

const QUICK_PHRASES = [
  { id: 'break',  label: 'I need a break', icon: 'pause-circle', color: '#7C4DBC' },
  { id: 'loud',   label: 'Too loud',       icon: 'volume-high',  color: '#E63946' },
  { id: 'bright', label: 'Too bright',     icon: 'sunny',        color: '#C98A1A' },
  { id: 'help',   label: 'Help me',        icon: 'help-circle',  color: '#2D9A57' },
];

export default function FeelingsScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { speakTile, addToSentence, appLanguage } = useApp();
  const { addEmotionCheckIn } = useCaregiver();
  const [selected, setSelected] = useState<string | null>(null);
  const topPad = Platform.OS === 'web' ? Math.max(insets.top, 67) : insets.top;
  const bottomPad = Platform.OS === 'web' ? 34 : insets.bottom;

  const t = (key: string) => translateLabel(key, appLanguage);

  const handleEmotion = (e: typeof EMOTIONS[0]) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
    setSelected(e.id);
    const fakeTile = { id: e.id, label: t(e.label), icon: e.icon, iconLib: 'Ionicons' as const, color: e.color, boardId: 'feelings' };
    addToSentence(fakeTile);
    speakTile(fakeTile);
    addEmotionCheckIn(e.label, e.color).catch(() => {});
  };

  const handlePhrase = (p: typeof QUICK_PHRASES[0]) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy).catch(() => {});
    const fakeTile = { id: p.id, label: t(p.label), icon: p.icon, iconLib: 'Ionicons' as const, color: p.color, boardId: 'quick' };
    speakTile(fakeTile);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: topPad + 8, backgroundColor: colors.card, borderBottomColor: colors.border }]}>
        <Pressable
          onPress={() => router.back()}
          style={({ pressed }) => [styles.backBtn, { opacity: pressed ? 0.6 : 1 }]}
          accessibilityLabel="Go back"
        >
          <Ionicons name="arrow-back" size={24} color={colors.foreground} />
        </Pressable>
        <Text style={[styles.headerTitle, { color: colors.foreground }]}>{t("How I'm Feeling")}</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        contentContainerStyle={[styles.content, { paddingBottom: bottomPad + 16 }]}
        showsVerticalScrollIndicator={false}
      >
        <Text style={[styles.sectionLabel, { color: colors.mutedForeground }]}>
          {t('Tap how you feel right now')}
        </Text>

        <View style={styles.grid}>
          {EMOTIONS.map((e) => (
            <Pressable
              key={e.id}
              onPress={() => handleEmotion(e)}
              style={({ pressed }) => [
                styles.emotionCard,
                {
                  backgroundColor: selected === e.id ? e.color : e.bg,
                  borderColor: selected === e.id ? e.color : 'transparent',
                  transform: [{ scale: pressed ? 0.93 : 1 }],
                },
              ]}
              accessibilityLabel={e.label}
              accessibilityRole="button"
            >
              <Ionicons name={e.icon as any} size={36} color={selected === e.id ? '#fff' : e.color} />
              <Text style={[styles.emotionLabel, { color: selected === e.id ? '#fff' : e.color }]}>
                {t(e.label)}
              </Text>
            </Pressable>
          ))}
        </View>

        <Text style={[styles.sectionLabel, { color: colors.mutedForeground, marginTop: 20 }]}>
          {t('Quick phrases')}
        </Text>
        {QUICK_PHRASES.map((p) => (
          <Pressable
            key={p.id}
            onPress={() => handlePhrase(p)}
            style={({ pressed }) => [styles.phraseBtn, { backgroundColor: p.color, opacity: pressed ? 0.85 : 1 }]}
            accessibilityLabel={p.label}
          >
            <Ionicons name={p.icon as any} size={22} color="#fff" />
            <Text style={styles.phraseText}>{t(p.label)}</Text>
          </Pressable>
        ))}

        <Pressable
          onPress={() => router.push('/(tabs)/calm')}
          style={({ pressed }) => [styles.calmBtn, { backgroundColor: colors.primary, opacity: pressed ? 0.85 : 1 }]}
          accessibilityLabel="Go to calm down tools"
        >
          <Ionicons name="leaf-outline" size={22} color="#fff" />
          <Text style={styles.calmBtnText}>{t('Calm-Down Tools')}</Text>
          <Ionicons name="chevron-forward" size={18} color="rgba(255,255,255,0.7)" />
        </Pressable>
      </ScrollView>
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
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    fontFamily: 'Inter_700Bold',
  },
  content: {
    padding: 16,
    gap: 12,
  },
  sectionLabel: {
    fontSize: 14,
    fontFamily: 'Inter_500Medium',
    fontWeight: '500',
    marginBottom: 4,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  emotionCard: {
    width: '30%',
    minWidth: 90,
    aspectRatio: 1,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    borderWidth: 2.5,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  emotionLabel: {
    fontSize: 13,
    fontWeight: '700',
    fontFamily: 'Inter_700Bold',
    textAlign: 'center',
  },
  phraseBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 18,
    paddingVertical: 16,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  phraseText: {
    flex: 1,
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
    fontFamily: 'Inter_700Bold',
  },
  calmBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 18,
    paddingVertical: 18,
    borderRadius: 18,
    marginTop: 8,
    shadowColor: '#2A9D8F',
    shadowOpacity: 0.3,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 5,
  },
  calmBtnText: {
    flex: 1,
    color: '#fff',
    fontSize: 17,
    fontWeight: '700',
    fontFamily: 'Inter_700Bold',
  },
});
