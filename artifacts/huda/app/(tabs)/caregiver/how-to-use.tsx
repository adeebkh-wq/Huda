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
import { useApp } from '@/context/AppContext';
import { useColors } from '@/hooks/useColors';
import { HOW_TO_GUIDE } from '@/data/howToGuide';

export default function HowToUseScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { appLanguage } = useApp();
  const guide = HOW_TO_GUIDE[appLanguage];
  const isRtl = appLanguage === 'ar';
  const rowDirection = isRtl ? 'row-reverse' : 'row';
  const textDirection = isRtl
    ? { writingDirection: 'rtl' as const, textAlign: 'right' as const }
    : { writingDirection: 'ltr' as const, textAlign: 'left' as const };
  const topPad = Platform.OS === 'web' ? Math.max(insets.top, 67) : insets.top;
  const bottomPad = Platform.OS === 'web' ? 34 : insets.bottom;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View
        style={[
          styles.header,
          {
            paddingTop: topPad + 8,
            backgroundColor: colors.card,
            borderBottomColor: colors.border,
            flexDirection: rowDirection,
          },
        ]}
      >
        <Pressable
          onPress={() => router.back()}
          style={({ pressed }) => [styles.backBtn, { opacity: pressed ? 0.6 : 1 }]}
          accessibilityRole="button"
          accessibilityLabel={guide.backLabel}
        >
          <Ionicons
            name="arrow-back"
            size={24}
            color={colors.foreground}
            style={isRtl ? { transform: [{ scaleX: -1 }] } : undefined}
          />
        </Pressable>
        <Text
          style={[styles.title, { color: colors.foreground }]}
          numberOfLines={2}
          accessibilityRole="header"
        >
          {guide.title}
        </Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        contentContainerStyle={[styles.content, { paddingBottom: bottomPad + 24 }]}
        showsVerticalScrollIndicator={false}
      >
        <View
          style={[
            styles.introCard,
            {
              backgroundColor: colors.card,
              borderColor: colors.border,
              flexDirection: rowDirection,
            },
          ]}
        >
          <View style={[styles.introIcon, { backgroundColor: colors.primary + '20' }]}>
            <Ionicons name="chatbubble-ellipses" size={25} color={colors.primary} />
          </View>
          <View style={styles.introCopy}>
            <Text style={[styles.introTitle, { color: colors.foreground }, textDirection]}>
              {guide.introTitle}
            </Text>
            <Text style={[styles.body, { color: colors.mutedForeground }, textDirection]}>
              {guide.introBody}
            </Text>
          </View>
        </View>

        {guide.sections.map((section) => (
          <View
            key={section.title}
            style={[
              styles.sectionCard,
              { backgroundColor: colors.card, borderColor: colors.border },
            ]}
          >
            <View style={[styles.sectionHeader, { flexDirection: rowDirection }]}>
              <View style={[styles.sectionIcon, { backgroundColor: colors.primary + '20' }]}>
                <Ionicons name={section.icon as any} size={19} color={colors.primary} />
              </View>
              <Text
                style={[styles.sectionTitle, { color: colors.foreground }, textDirection]}
                accessibilityRole="header"
              >
                {section.title}
              </Text>
            </View>

            <View style={styles.steps}>
              {section.steps.map((step) => (
                <View
                  key={step.title}
                  style={[styles.stepRow, { flexDirection: rowDirection }]}
                >
                  <View style={[styles.stepIcon, { backgroundColor: colors.secondary }]}>
                    <Ionicons name={step.icon as any} size={17} color={colors.primary} />
                  </View>
                  <View style={styles.stepCopy}>
                    <Text style={[styles.stepTitle, { color: colors.foreground }, textDirection]}>
                      {step.title}
                    </Text>
                    <Text style={[styles.body, { color: colors.mutedForeground }, textDirection]}>
                      {step.body}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          </View>
        ))}

        <View
          style={[
            styles.sectionCard,
            { backgroundColor: colors.card, borderColor: colors.border },
          ]}
        >
          <View style={[styles.sectionHeader, { flexDirection: rowDirection }]}>
            <View style={[styles.sectionIcon, { backgroundColor: colors.primary + '20' }]}>
              <Ionicons name="language-outline" size={19} color={colors.primary} />
            </View>
            <Text style={[styles.sectionTitle, { color: colors.foreground }, textDirection]}>
              {guide.languageTitle}
            </Text>
          </View>
          <Text style={[styles.body, { color: colors.mutedForeground }, textDirection]}>
            {guide.languageInstructions}
          </Text>
          <View style={[styles.languageGrid, { flexDirection: isRtl ? 'row-reverse' : 'row' }]}>
            {guide.languageNames.map((language) => (
              <View
                key={language}
                style={[
                  styles.languageChip,
                  { backgroundColor: colors.secondary, borderColor: colors.border },
                ]}
              >
                <Text
                  style={[
                    styles.languageText,
                    {
                      color: colors.foreground,
                      writingDirection: isRtl ? 'rtl' : 'ltr',
                    },
                  ]}
                >
                  {language}
                </Text>
              </View>
            ))}
          </View>
        </View>

        <View
          style={[
            styles.offlineCard,
            {
              backgroundColor: colors.primary + '12',
              borderColor: colors.primary + '44',
              flexDirection: rowDirection,
            },
          ]}
        >
          <View style={[styles.offlineIcon, { backgroundColor: colors.primary + '20' }]}>
            <Ionicons name="shield-checkmark" size={20} color={colors.primary} />
          </View>
          <View style={styles.introCopy}>
            <Text style={[styles.stepTitle, { color: colors.foreground }, textDirection]}>
              {guide.offlineTitle}
            </Text>
            <Text style={[styles.body, { color: colors.mutedForeground }, textDirection]}>
              {guide.offlineBody}
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
  },
  backBtn: { padding: 4, width: 40, alignItems: 'center' },
  title: {
    flex: 1,
    textAlign: 'center',
    fontSize: 20,
    fontWeight: '700',
    fontFamily: 'Inter_700Bold',
  },
  headerSpacer: { width: 40 },
  content: { padding: 16, gap: 14 },
  introCard: {
    alignItems: 'flex-start',
    gap: 14,
    padding: 18,
    borderRadius: 20,
    borderWidth: 1,
  },
  introIcon: {
    width: 48,
    height: 48,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  introCopy: { flex: 1, gap: 6 },
  introTitle: {
    fontSize: 18,
    fontWeight: '700',
    fontFamily: 'Inter_700Bold',
  },
  sectionCard: {
    padding: 16,
    borderRadius: 18,
    borderWidth: 1,
    gap: 14,
  },
  sectionHeader: { alignItems: 'center', gap: 10 },
  sectionIcon: {
    width: 36,
    height: 36,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionTitle: {
    flex: 1,
    fontSize: 17,
    fontWeight: '700',
    fontFamily: 'Inter_700Bold',
  },
  steps: { gap: 16 },
  stepRow: { alignItems: 'flex-start', gap: 11 },
  stepIcon: {
    width: 34,
    height: 34,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepCopy: { flex: 1, gap: 4 },
  stepTitle: {
    fontSize: 15,
    fontWeight: '600',
    fontFamily: 'Inter_600SemiBold',
  },
  body: {
    fontSize: 14,
    lineHeight: 21,
    fontFamily: 'Inter_400Regular',
  },
  languageGrid: { flexWrap: 'wrap', gap: 8 },
  languageChip: {
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 11,
    paddingVertical: 7,
  },
  languageText: {
    fontSize: 13,
    fontWeight: '500',
    fontFamily: 'Inter_500Medium',
  },
  offlineCard: {
    alignItems: 'flex-start',
    gap: 12,
    padding: 16,
    borderRadius: 18,
    borderWidth: 1,
  },
  offlineIcon: {
    width: 38,
    height: 38,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
