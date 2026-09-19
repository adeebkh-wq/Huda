/**
 * useGameSound — preloads a short sound effect for interactive playback.
 * Call playSound() on each user interaction (tap, draw, spin).
 * Rapid calls rewind and replay rather than stacking multiple instances.
 *
 * Usage:
 *   const { soundOn, toggleSound, playSound } = useGameSound('bubbles');
 */
import { useCallback, useEffect, useRef, useState } from 'react';
import { Platform } from 'react-native';
import { Audio, InterruptionModeIOS, InterruptionModeAndroid } from 'expo-av';
import GAME_SOUNDS from '@/assets/sounds/index';

export type GameSoundKey = keyof typeof GAME_SOUNDS;

export function useGameSound(soundKey: GameSoundKey) {
  // expo-av v14 has a DeviceEventEmitter bug on web triggered by the
  // onPlaybackStatusUpdate callback. Game sounds pass `null` for that callback,
  // so they are safe to use on web. No platform guard needed here.

  const soundRef   = useRef<Audio.Sound | null>(null);
  const loadedRef  = useRef(false);
  const soundOnRef = useRef(true);
  const [soundOn, setSoundOn] = useState(true);

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      // setAudioModeAsync is isolated so a failure here doesn't block sound loading.
      // playsInSilentModeIOS: true is essential — without it iOS silent mode drops all audio.
      // On web this call is a no-op.
      try {
        await Audio.setAudioModeAsync({
          allowsRecordingIOS:         false,
          interruptionModeIOS:        InterruptionModeIOS.DoNotMix,
          playsInSilentModeIOS:       true,
          staysActiveInBackground:    false,
          interruptionModeAndroid:    InterruptionModeAndroid.DoNotMix,
          shouldDuckAndroid:          true,
          playThroughEarpieceAndroid: false,
        });
      } catch (_) { /* non-blocking — audio mode is best-effort */ }

      try {
        // downloadFirst: false — assets are bundled by Metro, no network fetch needed.
        // null status callback avoids the DeviceEventEmitter crash on web (expo-av v14).
        const { sound } = await Audio.Sound.createAsync(
          GAME_SOUNDS[soundKey],
          { volume: 0.75, shouldPlay: false },
          null,
          false,
        );
        if (!mounted) { await sound.unloadAsync(); return; }
        soundRef.current  = sound;
        loadedRef.current = true;
      } catch (_) { /* non-critical — game works without sound */ }
    };
    load();

    return () => {
      mounted = false;
      loadedRef.current = false;
      soundRef.current?.unloadAsync().catch(() => {});
      soundRef.current = null;
    };
  }, [soundKey]);

  /**
   * Replay from the start. Safe to call rapidly — replayAsync() atomically
   * stops, seeks to 0, and plays, avoiding the seek-while-playing failure that
   * setPositionAsync(0) + playAsync() can hit.
   */
  const playSound = useCallback(async () => {
    if (!soundOnRef.current || !loadedRef.current) return;
    const s = soundRef.current;
    if (!s) return;
    try {
      const status = await s.getStatusAsync();
      if (!status.isLoaded) return;
      try {
        await s.replayAsync();
      } catch {
        // replayAsync can fail on some Android versions — fall back to stop + seek + play
        await s.stopAsync().catch(() => {});
        await s.playFromPositionAsync(0);
      }
    } catch (_) { /* swallow playback errors */ }
  }, []);

  const toggleSound = useCallback(() => {
    const next = !soundOnRef.current;
    soundOnRef.current = next;
    setSoundOn(next);
  }, []);

  return { soundOn, toggleSound, playSound };
}
