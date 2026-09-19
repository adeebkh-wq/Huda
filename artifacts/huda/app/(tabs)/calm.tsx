import React, { useEffect, useRef, useState } from 'react';
import {
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
import { BreathingAnimation } from '@/components/BreathingAnimation';
import { useApp } from '@/context/AppContext';
import { translateLabel } from '@/data/translations';

const PHASES = ['Breathe In', 'Hold', 'Breathe Out', 'Rest'];
const PHASE_DURATIONS = [4000, 2000, 4000, 1000];

export default function CalmScreen() {
  const insets = useSafeAreaInsets();
  const { appLanguage } = useApp();
  const t = (key: string) => translateLabel(key, appLanguage);
  const [active, setActive] = useState(false);
  const [phaseIdx, setPhaseIdx] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const [totalSeconds, setTotalSeconds] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const phaseRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const topPad = Platform.OS === 'web' ? Math.max(insets.top, 67) : insets.top;
  const bottomPad = Platform.OS === 'web' ? 34 : insets.bottom;

  const stopAll = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (phaseRef.current) clearTimeout(phaseRef.current);
    timerRef.current = null;
    phaseRef.current = null;
  };

  const startCycle = (idx: number) => {
    const duration = PHASE_DURATIONS[idx];
    phaseRef.current = setTimeout(() => {
      const next = (idx + 1) % PHASES.length;
      setPhaseIdx(next);
      startCycle(next);
    }, duration);
  };

  const handleToggle = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
    if (active) {
      stopAll();
      setActive(false);
      setPhaseIdx(0);
    } else {
      setActive(true);
      setPhaseIdx(0);
      startCycle(0);
      timerRef.current = setInterval(() => {
        setTotalSeconds((s) => s + 1);
      }, 1000);
    }
  };

  useEffect(() => () => stopAll(), []);

  const mins = String(Math.floor(totalSeconds / 60)).padStart(2, '0');
  const secs = String(totalSeconds % 60).padStart(2, '0');

  return (
    <View style={[styles.container]}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: topPad + 8 }]}>
        <Pressable
          onPress={() => { stopAll(); router.back(); }}
          style={({ pressed }) => [styles.backBtn, { opacity: pressed ? 0.7 : 1 }]}
          accessibilityLabel="Go back"
        >
          <Ionicons name="arrow-back" size={24} color="rgba(200,220,230,0.9)" />
        </Pressable>
        <Text style={styles.headerTitle}>{t('Calm Down')}</Text>
        <View style={{ width: 40 }} />
      </View>

      <View style={[styles.body, { paddingBottom: bottomPad + 16 }]}>
        {/* Timer */}
        <Text style={styles.timer}>{mins}:{secs}</Text>

        {/* Phase label */}
        <Text style={styles.phase}>{active ? t(PHASES[phaseIdx]) : t('Ready')}</Text>

        {/* Breathing circle */}
        <BreathingAnimation size={220} active={active} />

        {/* Start / Stop */}
        <Pressable
          onPress={handleToggle}
          style={({ pressed }) => [styles.mainBtn, { opacity: pressed ? 0.85 : 1 }]}
          accessibilityLabel={active ? 'Stop breathing exercise' : 'Start breathing exercise'}
        >
          <Ionicons name={active ? 'stop-circle' : 'play-circle'} size={28} color="#fff" />
          <Text style={styles.mainBtnText}>{active ? t('Stop') : t('Start Breathing')}</Text>
        </Pressable>

        {/* Quick tools */}
        <View style={styles.tools}>
          <ToolCard icon="timer-outline" label={t('Sensory Break\n5 minutes')} color="#7C4DBC" />
          <ToolCard icon="volume-mute-outline" label={t('Mute\nSounds')} color="#2B78BE" />
          <ToolCard icon="contrast-outline" label={t('Dim\nScreen')} color="#526475" />
        </View>

        <Text style={styles.tip}>
          {t('Take your time. You are safe.\nBreathe slowly and gently.')}
        </Text>

        {/* Sensory entry buttons row */}
        <View style={styles.entryRow}>
          <Pressable
            onPress={() => { stopAll(); router.push('/(tabs)/sounds'); }}
            style={({ pressed }) => [styles.entryBtn, styles.entryBtnMusic, { opacity: pressed ? 0.8 : 1 }]}
            accessibilityLabel="Open Sensory Music"
          >
            <Ionicons name="musical-notes-outline" size={20} color="#4fc3f7" />
            <Text style={[styles.entryBtnText, { color: '#4fc3f7' }]}>{t('Sensory Music')}</Text>
            <Ionicons name="chevron-forward" size={14} color="#4fc3f740" />
          </Pressable>

          <Pressable
            onPress={() => { stopAll(); router.push('/(tabs)/games'); }}
            style={({ pressed }) => [styles.entryBtn, styles.entryBtnGames, { opacity: pressed ? 0.8 : 1 }]}
            accessibilityLabel="Open Sensory Games"
          >
            <Ionicons name="game-controller-outline" size={20} color="#ba68c8" />
            <Text style={[styles.entryBtnText, { color: '#ba68c8' }]}>{t('Sensory Games')}</Text>
            <Ionicons name="chevron-forward" size={14} color="#ba68c840" />
          </Pressable>
        </View>
      </View>
    </View>
  );
}

function ToolCard({ icon, label, color }: { icon: string; label: string; color: string }) {
  return (
    <Pressable
      style={({ pressed }) => [styles.toolCard, { backgroundColor: color, opacity: pressed ? 0.8 : 1 }]}
      accessibilityLabel={label.replace('\n', ' ')}
    >
      <Ionicons name={icon as any} size={28} color="#fff" />
      <Text style={styles.toolLabel}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0D1B2A',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  backBtn: { padding: 4, width: 40 },
  headerTitle: {
    color: 'rgba(200,220,230,0.95)',
    fontSize: 20,
    fontWeight: '700',
    fontFamily: 'Inter_700Bold',
  },
  body: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 20,
    paddingHorizontal: 24,
  },
  timer: {
    color: 'rgba(170,200,220,0.6)',
    fontSize: 36,
    fontWeight: '700',
    fontFamily: 'Inter_700Bold',
    letterSpacing: 4,
  },
  phase: {
    color: 'rgba(200,220,240,0.9)',
    fontSize: 22,
    fontWeight: '600',
    fontFamily: 'Inter_600SemiBold',
    letterSpacing: 0.5,
  },
  mainBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#2A9D8F',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 32,
    shadowColor: '#2A9D8F',
    shadowOpacity: 0.5,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },
  mainBtnText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
    fontFamily: 'Inter_700Bold',
  },
  tools: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  toolCard: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 16,
    borderRadius: 16,
    gap: 8,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 4,
  },
  toolLabel: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '600',
    fontFamily: 'Inter_600SemiBold',
    textAlign: 'center',
    lineHeight: 15,
  },
  tip: {
    color: 'rgba(160,190,210,0.6)',
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
    textAlign: 'center',
    lineHeight: 22,
    marginTop: 4,
  },
  entryRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 4,
    width: '100%',
  },
  entryBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderRadius: 18,
  },
  entryBtnMusic: {
    backgroundColor: '#4fc3f712',
    borderColor: '#4fc3f730',
  },
  entryBtnGames: {
    backgroundColor: '#ba68c812',
    borderColor: '#ba68c830',
  },
  entryBtnText: {
    fontSize: 13,
    fontWeight: '600',
    fontFamily: 'Inter_600SemiBold',
    flex: 1,
  },
});
