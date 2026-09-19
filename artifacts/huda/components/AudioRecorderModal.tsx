import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  Alert,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Audio } from 'expo-av';
import { Ionicons } from '@/components/IoniconsSVG';
import * as Haptics from 'expo-haptics';
import { useColors } from '@/hooks/useColors';

interface Props {
  visible: boolean;
  tileLabel: string;
  onSave: (audioUri: string) => void;
  onCancel: () => void;
}

type Phase = 'idle' | 'recording' | 'recorded' | 'playing';

export function AudioRecorderModal({ visible, tileLabel, onSave, onCancel }: Props) {
  const colors = useColors();
  const [phase, setPhase] = useState<Phase>('idle');
  const [duration, setDuration] = useState(0);
  const [recordedUri, setRecordedUri] = useState<string | null>(null);
  const recordingRef = useRef<Audio.Recording | null>(null);
  const soundRef    = useRef<Audio.Sound | null>(null);
  const timerRef    = useRef<ReturnType<typeof setInterval> | null>(null);

  const stopTimer = () => {
    if (timerRef.current) { clearInterval(timerRef.current); timerRef.current = null; }
  };

  const cleanup = useCallback(async () => {
    stopTimer();
    try { await recordingRef.current?.stopAndUnloadAsync(); } catch {}
    try { await soundRef.current?.unloadAsync(); } catch {}
    recordingRef.current = null;
    soundRef.current     = null;
  }, []);

  useEffect(() => {
    if (!visible) { cleanup(); setPhase('idle'); setDuration(0); setRecordedUri(null); }
  }, [visible, cleanup]);

  const startRecording = async () => {
    try {
      const { granted } = await Audio.requestPermissionsAsync();
      if (!granted) { Alert.alert('Permission needed', 'Microphone access is required to record audio.'); return; }
      await Audio.setAudioModeAsync({ allowsRecordingIOS: true, playsInSilentModeIOS: true });
      const { recording } = await Audio.Recording.createAsync(Audio.RecordingOptionsPresets.HIGH_QUALITY);
      recordingRef.current = recording;
      setPhase('recording');
      setDuration(0);
      timerRef.current = setInterval(() => setDuration((d) => d + 1), 1000);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy).catch(() => {});
    } catch (e) {
      Alert.alert('Error', 'Could not start recording.');
    }
  };

  const stopRecording = async () => {
    stopTimer();
    try {
      await recordingRef.current?.stopAndUnloadAsync();
      const uri = recordingRef.current?.getURI();
      recordingRef.current = null;
      if (uri) { setRecordedUri(uri); setPhase('recorded'); }
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
    } catch {
      setPhase('idle');
    }
  };

  const playback = async () => {
    if (!recordedUri) return;
    try {
      if (soundRef.current) { await soundRef.current.unloadAsync(); soundRef.current = null; }
      await Audio.setAudioModeAsync({ allowsRecordingIOS: false, playsInSilentModeIOS: true });
      const { sound } = await Audio.Sound.createAsync({ uri: recordedUri });
      soundRef.current = sound;
      setPhase('playing');
      await sound.playAsync();
      sound.setOnPlaybackStatusUpdate((s) => { if (!s.isLoaded || !s.isPlaying) setPhase('recorded'); });
    } catch {}
  };

  const reset = async () => {
    await cleanup();
    setRecordedUri(null);
    setDuration(0);
    setPhase('idle');
  };

  const handleSave = () => {
    if (recordedUri) onSave(recordedUri);
  };

  const fmtSec = (s: number) => `${String(Math.floor(s / 60)).padStart(2,'0')}:${String(s % 60).padStart(2,'0')}`;

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onCancel}>
      <View style={styles.backdrop}>
        <View style={[styles.sheet, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.title, { color: colors.foreground }]}>Record Audio</Text>
          <Text style={[styles.sub, { color: colors.mutedForeground }]}>
            This sound will play when "{tileLabel}" is tapped
          </Text>

          {/* Visualiser ring */}
          <View style={[styles.ring, {
            borderColor: phase === 'recording' ? '#E63946' : phase === 'playing' ? colors.primary : colors.border,
            backgroundColor: phase === 'recording' ? '#E6394615' : phase === 'playing' ? colors.primary + '15' : colors.secondary,
          }]}>
            <Ionicons
              name={phase === 'playing' ? 'volume-high' : 'mic'}
              size={40}
              color={phase === 'recording' ? '#E63946' : phase === 'playing' ? colors.primary : colors.mutedForeground}
            />
            {phase === 'recording' && <View style={styles.recDot} />}
          </View>

          <Text style={[styles.timer, { color: phase === 'recording' ? '#E63946' : colors.foreground }]}>
            {phase === 'recording' ? fmtSec(duration) : phase === 'recorded' || phase === 'playing' ? `${fmtSec(duration)} recorded` : 'Ready'}
          </Text>

          {/* Controls */}
          {phase === 'idle' && (
            <Pressable onPress={startRecording} style={[styles.bigBtn, { backgroundColor: '#E63946' }]}>
              <Ionicons name="mic" size={22} color="#fff" />
              <Text style={styles.bigBtnText}>Start Recording</Text>
            </Pressable>
          )}

          {phase === 'recording' && (
            <Pressable onPress={stopRecording} style={[styles.bigBtn, { backgroundColor: colors.foreground }]}>
              <Ionicons name="stop-circle" size={22} color={colors.card} />
              <Text style={[styles.bigBtnText, { color: colors.card }]}>Stop Recording</Text>
            </Pressable>
          )}

          {(phase === 'recorded' || phase === 'playing') && (
            <View style={styles.actionRow}>
              <Pressable onPress={playback} style={[styles.smBtn, { backgroundColor: colors.primary }]} disabled={phase === 'playing'}>
                <Ionicons name="play" size={18} color="#fff" />
                <Text style={styles.smBtnText}>{phase === 'playing' ? 'Playing…' : 'Preview'}</Text>
              </Pressable>
              <Pressable onPress={reset} style={[styles.smBtn, { backgroundColor: colors.secondary, borderWidth: 1, borderColor: colors.border }]}>
                <Ionicons name="refresh" size={18} color={colors.foreground} />
                <Text style={[styles.smBtnText, { color: colors.foreground }]}>Re-record</Text>
              </Pressable>
            </View>
          )}

          {/* Footer */}
          <View style={styles.footer}>
            <Pressable onPress={onCancel} style={[styles.footerBtn, { backgroundColor: colors.secondary }]}>
              <Text style={[styles.footerBtnText, { color: colors.mutedForeground }]}>Cancel</Text>
            </Pressable>
            <Pressable
              onPress={handleSave}
              disabled={!recordedUri}
              style={[styles.footerBtn, { backgroundColor: colors.primary, opacity: recordedUri ? 1 : 0.4 }]}
            >
              <Ionicons name="checkmark" size={18} color="#fff" />
              <Text style={[styles.footerBtnText, { color: '#fff' }]}>Use This Audio</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.55)', justifyContent: 'center', alignItems: 'center', padding: 24 },
  sheet: { width: '100%', maxWidth: 380, borderRadius: 24, borderWidth: 1, padding: 24, gap: 16, alignItems: 'center' },
  title: { fontSize: 20, fontWeight: '700', fontFamily: 'Inter_700Bold' },
  sub:   { fontSize: 13, fontFamily: 'Inter_400Regular', textAlign: 'center' },
  ring: {
    width: 110, height: 110, borderRadius: 55, borderWidth: 2.5,
    alignItems: 'center', justifyContent: 'center', position: 'relative',
  },
  recDot: {
    position: 'absolute', top: 10, right: 10,
    width: 12, height: 12, borderRadius: 6, backgroundColor: '#E63946',
  },
  timer: { fontSize: 18, fontWeight: '700', fontFamily: 'Inter_700Bold', letterSpacing: 2 },
  bigBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    paddingHorizontal: 28, paddingVertical: 14, borderRadius: 16, width: '100%', justifyContent: 'center',
  },
  bigBtnText: { color: '#fff', fontSize: 16, fontWeight: '700', fontFamily: 'Inter_700Bold' },
  actionRow: { flexDirection: 'row', gap: 10, width: '100%' },
  smBtn: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 6, paddingVertical: 12, borderRadius: 14,
  },
  smBtnText: { color: '#fff', fontSize: 14, fontWeight: '600', fontFamily: 'Inter_600SemiBold' },
  footer: { flexDirection: 'row', gap: 10, width: '100%', marginTop: 4 },
  footerBtn: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 6, paddingVertical: 13, borderRadius: 14,
  },
  footerBtnText: { fontSize: 15, fontWeight: '700', fontFamily: 'Inter_700Bold' },
});
