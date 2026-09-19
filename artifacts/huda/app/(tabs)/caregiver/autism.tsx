import React, { useState } from 'react';
import {
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
import { getAutismContent, type AutismSection } from '@/data/autismTranslations';

// ── Component ─────────────────────────────────────────────────────────────────

export default function AutismScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { appLanguage } = useApp();
  const [expanded, setExpanded] = useState<string | null>('what');

  const content = getAutismContent(appLanguage);

  const toggle = (id: string) =>
    setExpanded((prev) => (prev === id ? null : id));

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View
        style={[
          styles.header,
          {
            paddingTop: insets.top + 8,
            backgroundColor: colors.card,
            borderBottomColor: colors.border,
          },
        ]}
      >
        <Pressable
          onPress={() => router.back()}
          style={({ pressed }) => [styles.backBtn, { opacity: pressed ? 0.6 : 1 }]}
          accessibilityLabel="Back"
        >
          <Ionicons name="arrow-back" size={24} color={colors.foreground} />
        </Pressable>
        <Text style={[styles.title, { color: colors.foreground }]}>
          {content.screenTitle}
        </Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 32 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Intro banner */}
        <View style={[styles.banner, { backgroundColor: '#2B78BE18', borderColor: '#2B78BE40' }]}>
          <Text style={[styles.bannerText, { color: colors.foreground }]}>
            {content.banner}
          </Text>
        </View>

        {/* Accordion sections */}
        {content.sections.map((section) => (
          <SectionCard
            key={section.id}
            section={section}
            expanded={expanded === section.id}
            onToggle={() => toggle(section.id)}
            colors={colors}
          />
        ))}

        <Text style={[styles.footer, { color: colors.mutedForeground }]}>
          {content.footer}
        </Text>
      </ScrollView>
    </View>
  );
}

// ── Section card ──────────────────────────────────────────────────────────────

function SectionCard({
  section,
  expanded,
  onToggle,
  colors,
}: {
  section: AutismSection;
  expanded: boolean;
  onToggle: () => void;
  colors: any;
}) {
  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: colors.card,
          borderColor: expanded ? section.color + '60' : colors.border,
          borderLeftColor: section.color,
        },
      ]}
    >
      {/* Header row */}
      <Pressable
        onPress={onToggle}
        style={({ pressed }) => [styles.cardHeader, { opacity: pressed ? 0.75 : 1 }]}
        accessibilityRole="button"
        accessibilityState={{ expanded }}
      >
        <View style={[styles.cardIcon, { backgroundColor: section.color + '20' }]}>
          <Ionicons name={section.icon as any} size={20} color={section.color} />
        </View>
        <Text style={[styles.cardTitle, { color: colors.foreground, flex: 1 }]}>
          {section.title}
        </Text>
        <Ionicons
          name={expanded ? 'chevron-up' : 'chevron-down'}
          size={18}
          color={colors.mutedForeground}
        />
      </Pressable>

      {/* Body */}
      {expanded && (
        <View style={styles.cardBody}>
          {section.body ? (
            <Text style={[styles.bodyText, { color: colors.foreground }]}>
              {section.body}
            </Text>
          ) : null}

          {section.subsections
            ? section.subsections.map((sub) => (
                <View key={sub.label} style={styles.subsection}>
                  <Text style={[styles.subLabel, { color: section.color }]}>
                    {sub.label}
                  </Text>
                  {sub.items.map((item, i) => (
                    <BulletRow key={i} text={item} color={section.color} colors={colors} />
                  ))}
                </View>
              ))
            : null}

          {section.items
            ? section.items.map((item, i) => (
                <BulletRow key={i} text={item} color={section.color} colors={colors} />
              ))
            : null}

          {section.body2 ? (
            <Text style={[styles.bodyText, { color: colors.foreground, marginTop: 10 }]}>
              {section.body2}
            </Text>
          ) : null}

          {section.note ? (
            <View style={[styles.note, { backgroundColor: section.color + '14', borderColor: section.color + '40' }]}>
              <Text style={[styles.noteText, { color: colors.foreground }]}>
                {section.note}
              </Text>
            </View>
          ) : null}

          {section.source ? (
            <Text style={[styles.source, { color: colors.mutedForeground }]}>
              {section.source}
            </Text>
          ) : null}
        </View>
      )}
    </View>
  );
}

function BulletRow({ text, color, colors }: { text: string; color: string; colors: any }) {
  return (
    <View style={styles.bullet}>
      <View style={[styles.dot, { backgroundColor: color }]} />
      <Text style={[styles.bulletText, { color: colors.foreground }]}>{text}</Text>
    </View>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────────

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
  title: { fontSize: 18, fontWeight: '700', fontFamily: 'Inter_700Bold' },

  scrollContent: { padding: 16, gap: 12 },

  banner: {
    borderRadius: 14,
    borderWidth: 1,
    padding: 14,
  },
  bannerText: {
    fontSize: 13,
    fontFamily: 'Inter_400Regular',
    lineHeight: 20,
    fontStyle: 'italic',
  },

  card: {
    borderRadius: 16,
    borderWidth: 1,
    borderLeftWidth: 4,
    overflow: 'hidden',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 12,
  },
  cardIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '700',
    fontFamily: 'Inter_700Bold',
  },

  cardBody: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    gap: 6,
  },
  bodyText: {
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
    lineHeight: 22,
  },

  subsection: { marginTop: 10, gap: 4 },
  subLabel: {
    fontSize: 13,
    fontWeight: '700',
    fontFamily: 'Inter_700Bold',
    marginBottom: 4,
  },

  bullet: { flexDirection: 'row', alignItems: 'flex-start', gap: 10, paddingVertical: 3 },
  dot: { width: 7, height: 7, borderRadius: 4, marginTop: 7, flexShrink: 0 },
  bulletText: { flex: 1, fontSize: 14, fontFamily: 'Inter_400Regular', lineHeight: 22 },

  note: {
    marginTop: 10,
    borderRadius: 10,
    borderWidth: 1,
    padding: 12,
  },
  noteText: { fontSize: 13, fontFamily: 'Inter_400Regular', lineHeight: 20 },

  source: { fontSize: 11, fontFamily: 'Inter_400Regular', marginTop: 8 },

  footer: {
    fontSize: 11,
    fontFamily: 'Inter_400Regular',
    lineHeight: 17,
    textAlign: 'center',
    marginTop: 8,
  },
});
