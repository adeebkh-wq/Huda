import React, { useState } from 'react';
import {
  Alert,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
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
import { PinModal } from '@/components/PinModal';
import { SUPPORTED_LANGUAGES, translateLabel, type LanguageCode } from '@/data/translations';
import { COLOR_THEME_LABELS, COLOR_THEME_SWATCHES, type ColorTheme } from '@/constants/colorThemes';

export default function SettingsScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { ttsRate, ttsPitch, updateTtsSettings, appLanguage, setAppLanguage, resetToFactoryDefaults } = useApp();
  const t = (key: string) => translateLabel(key, appLanguage);
  const {
    settings, updateSettings, caregiverPin, setNewPin, clearPin,
    kioskMode, setKioskMode, validatePin,
  } = useCaregiver();

  // Kiosk PIN gate: 'enable' | 'disable' | null
  const [kioskPinPurpose, setKioskPinPurpose] = useState<'enable' | 'disable' | null>(null);


  const topPad    = Platform.OS === 'web' ? Math.max(insets.top, 67) : insets.top;
  const bottomPad = Platform.OS === 'web' ? 34 : insets.bottom;

  const handleKioskToggle = (v: boolean) => {
    if (v && !caregiverPin) {
      Alert.alert(
        'Set a PIN first',
        'Kiosk Mode needs a caregiver PIN so children cannot unlock it. Set a PIN in the Security section first, then enable Kiosk Mode.',
        [{ text: 'OK' }],
      );
      return;
    }
    setKioskPinPurpose(v ? 'enable' : 'disable');
  };

  const handleFactoryReset = () => {
    Alert.alert(
      'Restore Factory Defaults',
      'This will remove all custom photos, voice recordings, added tiles, and usage history. Original icons and images will be restored.\n\nThis cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset Everything',
          style: 'destructive',
          onPress: async () => {
            await resetToFactoryDefaults();
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
            Alert.alert('Done', 'All tiles have been restored to factory defaults.');
          },
        },
      ],
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { paddingTop: topPad + 8, backgroundColor: colors.card, borderBottomColor: colors.border }]}>
        <Pressable
          onPress={() => router.back()}
          style={({ pressed }) => [styles.backBtn, { opacity: pressed ? 0.6 : 1 }]}
        >
          <Ionicons name="arrow-back" size={24} color={colors.foreground} />
        </Pressable>
        <Text style={[styles.title, { color: colors.foreground }]}>{t('Settings')}</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        contentContainerStyle={[styles.content, { paddingBottom: bottomPad + 20 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Language */}
        <Section title={t('Language')} icon="language-outline" colors={colors}>
          <Text style={[styles.sectionDesc, { color: colors.mutedForeground }]}>
            Tile labels and speech will switch to the selected language.
          </Text>
          <View style={styles.langGrid}>
            {SUPPORTED_LANGUAGES.map((lang) => {
              const selected = appLanguage === lang.code;
              return (
                <Pressable
                  key={lang.code}
                  onPress={() => {
                    setAppLanguage(lang.code as LanguageCode);
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
                  }}
                  style={[
                    styles.langChip,
                    {
                      backgroundColor: selected ? colors.primary : colors.secondary,
                      borderColor:     selected ? colors.primary : colors.border,
                    },
                  ]}
                >
                  <Text style={[styles.langNative, { color: selected ? '#fff' : colors.foreground }]}>
                    {lang.native}
                  </Text>
                  <Text style={[styles.langName, { color: selected ? 'rgba(255,255,255,0.75)' : colors.mutedForeground }]}>
                    {lang.name}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </Section>

        {/* TTS Settings */}
        <Section title={t('Voice Settings')} icon="volume-high-outline" colors={colors}>
          <SliderRow
            label={t('Speech Speed')}
            value={ttsRate}
            min={0.3}
            max={1.5}
            step={0.05}
            format={(v) => `${Math.round(v * 100)}%`}
            onChange={(v) => updateTtsSettings(v, ttsPitch)}
            colors={colors}
          />
          <SliderRow
            label={t('Speech Pitch')}
            value={ttsPitch}
            min={0.5}
            max={2.0}
            step={0.1}
            format={(v) => `${v.toFixed(1)}×`}
            onChange={(v) => updateTtsSettings(ttsRate, v)}
            colors={colors}
          />
        </Section>

        {/* Display */}
        <Section title={t('Display')} icon="eye-outline" colors={colors}>
          <ToggleRow
            label={t('Reduced Motion')}
            sub="Reduces animations throughout the app"
            value={settings.reducedMotion}
            onChange={(v) => updateSettings({ reducedMotion: v })}
            colors={colors}
          />
        </Section>

        {/* Colour Theme */}
        <Section title={t('Colour Theme')} icon="color-palette-outline" colors={colors}>
          <Text style={[styles.sectionDesc, { color: colors.mutedForeground }]}>
            Choose a palette that works best for your child's vision.
          </Text>
          <View style={styles.themeGrid}>
            {(Object.keys(COLOR_THEME_LABELS) as ColorTheme[]).map((themeKey) => {
              const active = (settings.colorTheme ?? 'default') === themeKey;
              const swatches = COLOR_THEME_SWATCHES[themeKey];
              return (
                <Pressable
                  key={themeKey}
                  onPress={() => updateSettings({ colorTheme: themeKey })}
                  style={[
                    styles.themeChip,
                    {
                      backgroundColor: active ? colors.primary + '22' : colors.secondary,
                      borderColor:     active ? colors.primary : colors.border,
                    },
                  ]}
                >
                  <View style={styles.themeSwatches}>
                    {swatches.map((s, i) => (
                      <View key={i} style={[styles.themeSwatch, { backgroundColor: s }]} />
                    ))}
                  </View>
                  <Text style={[styles.themeChipText, { color: active ? colors.primary : colors.foreground }]}>
                    {COLOR_THEME_LABELS[themeKey]}
                  </Text>
                  {active && (
                    <Ionicons name="checkmark-circle" size={16} color={colors.primary} />
                  )}
                </Pressable>
              );
            })}
          </View>
        </Section>

        {/* Text Size */}
        <Section title={t('Text Size')} icon="text-outline" colors={colors}>
          <View style={styles.fontSizeRow}>
            {(['small', 'medium', 'large'] as const).map((size) => {
              const sizeLabel: Record<string, string> = { small: t('Small'), medium: t('Medium'), large: t('Large') };
              return (
                <Pressable
                  key={size}
                  onPress={() => updateSettings({ fontSize: size })}
                  style={[
                    styles.fontSizeBtn,
                    {
                      backgroundColor: settings.fontSize === size ? colors.primary : colors.secondary,
                      borderColor:     settings.fontSize === size ? colors.primary : colors.border,
                    },
                  ]}
                >
                  <Text style={[styles.fontSizeBtnText, { color: settings.fontSize === size ? '#fff' : colors.foreground }]}>
                    {sizeLabel[size]}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </Section>

        {/* Tile Size */}
        <Section title={t('Tile Size')} icon="grid-outline" colors={colors}>
          <Text style={[styles.sectionDesc, { color: colors.mutedForeground }]}>
            Controls how large the communication tiles appear on the board.
          </Text>
          <View style={styles.fontSizeRow}>
            {(['small', 'medium', 'large'] as const).map((size) => {
              const sizeLabel: Record<string, string> = { small: t('Small'), medium: t('Medium'), large: t('Large') };
              const active = (settings.tileSize ?? 'medium') === size;
              return (
                <Pressable
                  key={size}
                  onPress={() => updateSettings({ tileSize: size })}
                  style={[
                    styles.fontSizeBtn,
                    {
                      backgroundColor: active ? colors.primary : colors.secondary,
                      borderColor:     active ? colors.primary : colors.border,
                    },
                  ]}
                >
                  <Text style={[styles.fontSizeBtnText, { color: active ? '#fff' : colors.foreground }]}>
                    {sizeLabel[size]}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </Section>

        {/* PIN Settings */}
        <Section title={t('Security')} icon="shield-outline" colors={colors}>
          <Pressable
            onPress={() => {
              Alert.alert(
                caregiverPin ? 'Change Caregiver PIN' : 'Set Caregiver PIN',
                'A 4-digit PIN will be required to enter Caregiver Mode.',
                [
                  { text: 'Cancel', style: 'cancel' },
                  {
                    text: caregiverPin ? 'Change' : 'Set',
                    onPress: () => {
                      setNewPin('1234');
                      Alert.alert('PIN Set', 'Caregiver PIN set to 1234 (demo). Tap "Change" to update.');
                    },
                  },
                  caregiverPin ? { text: 'Remove PIN', style: 'destructive', onPress: clearPin } : null,
                ].filter(Boolean) as any,
              );
            }}
            style={({ pressed }) => [styles.actionRow, { opacity: pressed ? 0.7 : 1, borderBottomColor: colors.border }]}
          >
            <Text style={[styles.actionLabel, { color: colors.foreground }]}>
              {caregiverPin ? t('Change Caregiver PIN') : t('Set Caregiver PIN')}
            </Text>
            <Ionicons name="chevron-forward" size={18} color={colors.mutedForeground} />
          </Pressable>
        </Section>

        {/* Kiosk Mode */}
        <Section title={t('Kiosk Mode')} icon="lock-closed-outline" colors={colors}>
          <Text style={[styles.sectionDesc, { color: colors.mutedForeground }]}>
            Locks the device to Huda so children cannot leave the app. A caregiver PIN is required to exit.
          </Text>
          <ToggleRow
            label={t('Enable Kiosk Mode')}
            sub={kioskMode ? 'Active — tap the padlock icon to exit' : 'Disabled'}
            value={kioskMode}
            onChange={handleKioskToggle}
            colors={colors}
          />
          {Platform.OS === 'ios' && (
            <View style={[styles.guidedAccessCard, { backgroundColor: colors.secondary, borderColor: colors.border }]}>
              <Ionicons name="information-circle-outline" size={18} color={colors.primary} />
              <View style={{ flex: 1 }}>
                <Text style={[styles.guidedAccessTitle, { color: colors.foreground }]}>Boot lock on iOS</Text>
                <Text style={[styles.guidedAccessBody, { color: colors.mutedForeground }]}>
                  1. Open Settings → Accessibility → Guided Access{'\n'}
                  2. Turn on Guided Access and set a passcode{'\n'}
                  3. In Huda, triple-click the side button to start a session
                </Text>
              </View>
            </View>
          )}
        </Section>

        {/* Support Huda */}
        <Section title="Support Huda 💚" icon="heart-outline" colors={colors}>
          <Text style={[styles.supportHeading, { color: colors.foreground }]}>
            Why is Huda free?
          </Text>
          <Text style={[styles.sectionDesc, { color: colors.mutedForeground }]}>
            Every child deserves a voice — regardless of their family's budget. Huda was built
            by a solo developer who believes AAC tools should be available to every family. It
            will always be free for every child, every family, everywhere.
          </Text>
          <Text style={[styles.supportHeading, { color: colors.foreground, marginTop: 14 }]}>
            Help keep Huda running
          </Text>
          <Text style={[styles.sectionDesc, { color: colors.mutedForeground }]}>
            Building and maintaining Huda takes real time and real cost — servers, design,
            accessibility research, and countless hours of care. If Huda has helped your
            child communicate, your support means the world and keeps this app growing for
            families everywhere.
          </Text>
          <Text style={[styles.sectionDesc, { color: colors.mutedForeground, marginTop: 10 }]}>
            To contribute or get in touch, reach out directly:
          </Text>
          <Pressable
            onPress={() => Linking.openURL('mailto:hudaworld8@gmail.com')}
            style={({ pressed }) => [
              styles.emailBtn,
              { borderColor: colors.primary, opacity: pressed ? 0.7 : 1 },
            ]}
          >
            <Text style={[styles.emailBtnText, { color: colors.primary }]}>
              hudaworld8@gmail.com
            </Text>
          </Pressable>
        </Section>

        {/* Factory Reset */}
        <Section title={t('Reset')} icon="refresh-outline" colors={colors}>
          <Text style={[styles.sectionDesc, { color: colors.mutedForeground }]}>
            Remove all custom photos, voice recordings, and added tiles — restoring every board to its original icons and images.
          </Text>
          <Pressable
            onPress={handleFactoryReset}
            style={({ pressed }) => [styles.resetBtn, { borderColor: '#E63946', opacity: pressed ? 0.75 : 1 }]}
          >
            <Ionicons name="refresh" size={16} color="#E63946" />
            <Text style={styles.resetBtnText}>{t('Restore Factory Defaults')}</Text>
          </Pressable>
        </Section>

        <View style={styles.versionRow}>
          <Text style={[styles.versionText, { color: colors.mutedForeground }]}>
            Huda v1.0.0 · Offline AAC
          </Text>
        </View>
      </ScrollView>

      <PinModal
        visible={kioskPinPurpose === 'enable'}
        title="Confirm Caregiver PIN to Enable Kiosk"
        validatePin={validatePin}
        onSuccess={async () => {
          setKioskPinPurpose(null);
          await setKioskMode(true);
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
        }}
        onCancel={() => setKioskPinPurpose(null)}
      />

      <PinModal
        visible={kioskPinPurpose === 'disable'}
        title="Confirm Caregiver PIN to Disable Kiosk"
        validatePin={validatePin}
        onSuccess={async () => {
          setKioskPinPurpose(null);
          await setKioskMode(false);
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
        }}
        onCancel={() => setKioskPinPurpose(null)}
      />
    </View>
  );
}

// ─── Sub-components ──────────────────────────────────────────────────────────

function Section({
  title, icon, colors, children,
}: { title: string; icon: string; colors: any; children: React.ReactNode }) {
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

function ToggleRow({
  label, sub, value, onChange, colors,
}: { label: string; sub: string; value: boolean; onChange: (v: boolean) => void; colors: any }) {
  return (
    <View style={[styles.toggleRow, { borderTopColor: colors.border }]}>
      <View style={{ flex: 1 }}>
        <Text style={[styles.rowLabel, { color: colors.foreground }]}>{label}</Text>
        <Text style={[styles.rowSub,   { color: colors.mutedForeground }]}>{sub}</Text>
      </View>
      <Switch
        value={value}
        onValueChange={onChange}
        trackColor={{ false: colors.border, true: colors.primary }}
        thumbColor="#fff"
      />
    </View>
  );
}

function SliderRow({
  label, value, min, max, step, format, onChange, colors,
}: {
  label: string; value: number; min: number; max: number; step: number;
  format: (v: number) => string; onChange: (v: number) => void; colors: any;
}) {
  const steps       = Math.round((max - min) / step);
  const currentStep = Math.round((value - min) / step);
  return (
    <View style={[styles.sliderRow, { borderTopColor: colors.border }]}>
      <View style={styles.sliderHeader}>
        <Text style={[styles.rowLabel,    { color: colors.foreground }]}>{label}</Text>
        <Text style={[styles.sliderValue, { color: colors.primary }]}>{format(value)}</Text>
      </View>
      <View style={styles.sliderBtns}>
        <Pressable
          onPress={() => onChange(Math.max(min, Math.round((value - step) / step) * step))}
          style={[styles.sliderBtn, { backgroundColor: colors.secondary }]}
        >
          <Ionicons name="remove" size={18} color={colors.foreground} />
        </Pressable>
        <View style={[styles.sliderTrack, { backgroundColor: colors.border }]}>
          <View style={[styles.sliderFill, { backgroundColor: colors.primary, width: `${(currentStep / steps) * 100}%` }]} />
        </View>
        <Pressable
          onPress={() => onChange(Math.min(max, Math.round((value + step) / step) * step))}
          style={[styles.sliderBtn, { backgroundColor: colors.secondary }]}
        >
          <Ionicons name="add" size={18} color={colors.foreground} />
        </Pressable>
      </View>
    </View>
  );
}

// ─── Styles ──────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 16, paddingBottom: 12, borderBottomWidth: 1,
  },
  backBtn: { padding: 4, width: 40 },
  title:   { fontSize: 20, fontWeight: '700', fontFamily: 'Inter_700Bold' },
  content: { padding: 16, gap: 16 },

  section: {
    borderRadius: 16, borderWidth: 1, padding: 16, gap: 12,
    shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 4,
    shadowOffset: { width: 0, height: 1 }, elevation: 1,
  },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 4 },
  sectionTitle:  { fontSize: 16, fontWeight: '700', fontFamily: 'Inter_700Bold' },
  sectionDesc:   { fontSize: 13, fontFamily: 'Inter_400Regular', lineHeight: 18 },

  toggleRow: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    paddingTop: 12, borderTopWidth: StyleSheet.hairlineWidth,
  },
  rowLabel: { fontSize: 15, fontWeight: '600', fontFamily: 'Inter_600SemiBold' },
  rowSub:   { fontSize: 12, fontFamily: 'Inter_400Regular', marginTop: 2 },

  sliderRow: { paddingTop: 12, borderTopWidth: StyleSheet.hairlineWidth, gap: 10 },
  sliderHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  sliderValue:  { fontSize: 14, fontWeight: '700', fontFamily: 'Inter_700Bold' },
  sliderBtns:   { flexDirection: 'row', alignItems: 'center', gap: 10 },
  sliderBtn:    { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
  sliderTrack:  { flex: 1, height: 6, borderRadius: 3, overflow: 'hidden' },
  sliderFill:   { height: '100%', borderRadius: 3 },

  fontSizeRow: { flexDirection: 'row', gap: 10 },
  fontSizeBtn: { flex: 1, paddingVertical: 10, borderRadius: 12, alignItems: 'center', borderWidth: 1.5 },
  fontSizeBtnText: { fontSize: 14, fontWeight: '600', fontFamily: 'Inter_600SemiBold' },

  actionRow: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingVertical: 12, borderTopWidth: StyleSheet.hairlineWidth,
  },
  actionLabel: { fontSize: 15, fontFamily: 'Inter_500Medium' },

  themeGrid: { flexDirection: 'column', gap: 8, marginTop: 8 },
  themeChip: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    paddingHorizontal: 14, paddingVertical: 12, borderRadius: 14, borderWidth: 1.5,
  },
  themeSwatches: { flexDirection: 'row', gap: 3 },
  themeSwatch: { width: 14, height: 14, borderRadius: 7 },
  themeChipText: { flex: 1, fontSize: 14, fontWeight: '600', fontFamily: 'Inter_600SemiBold' },

  langGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 4 },
  langChip: {
    paddingHorizontal: 14, paddingVertical: 8, borderRadius: 12,
    borderWidth: 1.5, alignItems: 'center', minWidth: 80,
  },
  langNative: { fontSize: 14, fontWeight: '700', fontFamily: 'Inter_700Bold' },
  langName:   { fontSize: 10, fontFamily: 'Inter_400Regular', marginTop: 1 },

  guidedAccessCard: {
    flexDirection: 'row', alignItems: 'flex-start', gap: 10,
    borderRadius: 12, borderWidth: 1, padding: 12, marginTop: 4,
  },
  guidedAccessTitle: { fontSize: 13, fontWeight: '700', fontFamily: 'Inter_700Bold', marginBottom: 4 },
  guidedAccessBody:  { fontSize: 12, fontFamily: 'Inter_400Regular', lineHeight: 17 },

  supportHeading: {
    fontSize: 15, fontWeight: '700', fontFamily: 'Inter_700Bold', marginBottom: 4,
  },
  emailBtn: {
    marginTop: 10, borderWidth: 2, borderRadius: 14,
    paddingVertical: 14, paddingHorizontal: 16, alignItems: 'center',
  },
  emailBtnText: {
    fontSize: 15, fontWeight: '700', fontFamily: 'Inter_700Bold',
  },
  resetBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    paddingVertical: 13, borderRadius: 14, borderWidth: 1.5, marginTop: 4,
  },
  resetBtnText: { color: '#E63946', fontSize: 15, fontWeight: '700', fontFamily: 'Inter_700Bold' },

  versionRow: { alignItems: 'center', paddingVertical: 8 },
  versionText: { fontSize: 12, fontFamily: 'Inter_400Regular' },
});
