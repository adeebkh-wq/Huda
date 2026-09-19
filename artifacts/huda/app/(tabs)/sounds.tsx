/**
 * Sensory Music screen — calming ambient sounds.
 *
 * Features:
 *  - 9 built-in calming tracks (rain, ocean, forest, fire, stream, wind,
 *    white noise, singing bowls, piano).
 *  - One sound plays at a time; selecting another auto-swaps.
 *  - Per-track repeat toggle — loop a sound forever or play it once.
 *  - Volume slider.
 *  - Custom sounds: add by URL or device file, persisted to AsyncStorage.
 *  - Graceful "Unavailable" state when a URL cannot be loaded.
 */

import React, {
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import {
  ActivityIndicator,
  Alert,
  Animated,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import Slider from '@react-native-community/slider';
import { Audio } from 'expo-av';
import { Asset } from 'expo-asset';
import * as FileSystem from 'expo-file-system/legacy';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@/components/IoniconsSVG';
import { useApp } from '@/context/AppContext';
import { translateLabel } from '@/data/translations';
import { BUILT_IN_SOUNDS, type CalmingSound } from '@/data/calmingSounds';
import { AddSoundModal } from '@/components/AddSoundModal';

const STORAGE_KEY = 'huda_custom_sounds';

type LoadState = 'idle' | 'loading' | 'ready' | 'error';

export default function SoundsScreen() {
  const insets       = useSafeAreaInsets();
  const { appLanguage } = useApp();
  const t = (k: string) => translateLabel(k, appLanguage);

  const topPad    = Platform.OS === 'web' ? Math.max(insets.top, 67) : insets.top;
  const bottomPad = Platform.OS === 'web' ? 34 : insets.bottom;

  /* ── State ─────────────────────────────────────────────────────────── */
  const [customSounds, setCustomSounds] = useState<CalmingSound[]>([]);
  const [playingId,    setPlayingId]    = useState<string | null>(null);
  const [loadState,    setLoadState]    = useState<Record<string, LoadState>>({});
  const [volume,       setVolume]       = useState(0.8);
  const [showAdd,      setShowAdd]      = useState(false);
  // Per-sound repeat toggle: true = loop, false = play once.
  // Defaults to each sound's own `loop` property (all built-ins default to true).
  const [repeatMap,    setRepeatMap]    = useState<Record<string, boolean>>({});

  const soundRef     = useRef<Audio.Sound | null>(null);
  const volumeRef    = useRef(volume);
  const pulseAnim    = useRef(new Animated.Value(1)).current;
  // Tracks the live looping state for the currently-playing sound.
  // Using a ref (not status.isLooping) avoids stale-closure and expo-av
  // version inconsistencies where status.isLooping doesn't reflect the actual value.
  const isLoopingRef = useRef(true);

  // ── Web-only audio (bypass expo-av entirely on web) ──────────────────
  // Pre-resolved asset URIs keyed by sound.id so play() never awaits
  // anything before calling HTMLAudioElement.play() — browser autoplay
  // policy blocks audio when .play() is called after async gaps.
  const webAudioRef  = useRef<HTMLAudioElement | null>(null);
  const [webUrls, setWebUrls] = useState<Record<string, string>>({});

  /* ── Pre-resolve asset URIs for web (do this before any user gesture) ─ */
  useEffect(() => {
    if (Platform.OS !== 'web') return;
    const map: Record<string, string> = {};

    // Built-in sounds: Metro dev server serves bundled assets at this path.
    // Confirmed working via HEAD request: 200 OK, Content-Type: audio/wave.
    // Using direct path avoids Asset.fromModule which can return '' on web
    // when the manifest doesn't include a proper remote URL.
    for (const s of BUILT_IN_SOUNDS) {
      map[s.id] = `/assets/?unstable_path=./assets/sounds/calm/${s.id}.wav`;
    }

    // Custom user sounds use their stored URI directly.
    for (const s of customSounds) {
      if (s.uri) map[s.id] = s.uri;
    }

    console.log('[Sounds] web URLs resolved:', Object.keys(map).length, 'sounds');
    setWebUrls(map);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [customSounds.length]);

  /* ── Persist / load custom sounds ──────────────────────────────────── */
  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY)
      .then((raw) => { if (raw) setCustomSounds(JSON.parse(raw)); })
      .catch(() => {});
  }, []);

  const saveCustom = async (list: CalmingSound[]) => {
    setCustomSounds(list);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(list)).catch(() => {});
  };

  /* ── Pulse animation while playing ─────────────────────────────────── */
  useEffect(() => {
    if (playingId) {
      const loop = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, { toValue: 1.12, duration: 900, useNativeDriver: true }),
          Animated.timing(pulseAnim, { toValue: 1.00, duration: 900, useNativeDriver: true }),
        ]),
      );
      loop.start();
      return () => loop.stop();
    } else {
      pulseAnim.setValue(1);
    }
  }, [playingId, pulseAnim]);

  /* ── Audio helpers ──────────────────────────────────────────────────── */
  const stopCurrent = useCallback(async () => {
    if (Platform.OS === 'web') {
      const el = webAudioRef.current;
      if (!el) return;
      webAudioRef.current = null;
      el.pause();
      el.src = '';
      return;
    }
    const s = soundRef.current;
    if (!s) return;
    soundRef.current = null;
    try { await s.stopAsync(); } catch { /* ignore */ }
    try { await s.unloadAsync(); } catch { /* ignore */ }
  }, []);

  /** Returns the effective repeat setting for a sound (user override or default). */
  const getRepeat = useCallback((sound: CalmingSound): boolean => {
    if (sound.id in repeatMap) return repeatMap[sound.id];
    return sound.loop ?? true;
  }, [repeatMap]);

  const play = useCallback(async (sound: CalmingSound) => {
    const isLooping = sound.id in repeatMap
      ? repeatMap[sound.id]
      : (sound.loop ?? true);
    isLoopingRef.current = isLooping;

    // ── Web path: bypass expo-av, use HTMLAudioElement directly ──────────
    // All async work (URI resolution) is done on mount so that .play() can
    // be called synchronously here — the browser autoplay policy requires
    // .play() to happen within the user-gesture call stack with no awaits.
    if (Platform.OS === 'web') {
      // Toggle off if tapping the same card
      if (playingId === sound.id) {
        const el = webAudioRef.current;
        webAudioRef.current = null;
        if (el) { el.pause(); el.src = ''; }
        setPlayingId(null);
        return;
      }

      // Stop previous
      const prev = webAudioRef.current;
      webAudioRef.current = null;
      if (prev) { prev.pause(); prev.src = ''; }

      const url = webUrls[sound.id];
      if (!url) {
        console.warn('[Sounds] web URL not yet resolved for', sound.id);
        setLoadState((s) => ({ ...s, [sound.id]: 'error' }));
        return;
      }

      setPlayingId(sound.id);
      setLoadState((s) => ({ ...s, [sound.id]: 'loading' }));

      // Create element and call .play() — no awaits between here and .play()
      const el = new (window as any).Audio() as HTMLAudioElement;
      el.src    = url;
      el.loop   = isLooping;
      el.volume = volumeRef.current;
      webAudioRef.current = el;

      el.oncanplay = () => setLoadState((s) => ({ ...s, [sound.id]: 'ready' }));
      el.onended   = () => {
        if (!isLoopingRef.current) {
          setPlayingId(null);
          webAudioRef.current = null;
        }
      };
      el.onerror = () => {
        console.error('[Sounds] web audio error', el.error);
        setLoadState((s) => ({ ...s, [sound.id]: 'error' }));
        setPlayingId(null);
        webAudioRef.current = null;
      };

      el.play().then(() => {
        setLoadState((s) => ({ ...s, [sound.id]: 'ready' }));
      }).catch((err: Error) => {
        console.error('[Sounds] web play() rejected:', err);
        setLoadState((s) => ({ ...s, [sound.id]: 'error' }));
        setPlayingId(null);
        webAudioRef.current = null;
      });
      return;
    }

    // ── Native path ───────────────────────────────────────────────────────
    // Tapping the same card → toggle off
    if (playingId === sound.id) {
      await stopCurrent();
      setPlayingId(null);
      return;
    }

    await stopCurrent();
    setPlayingId(sound.id);
    setLoadState((s) => ({ ...s, [sound.id]: 'loading' }));

    try {
      // Configure audio session once before loading.
      await Audio.setAudioModeAsync({
        allowsRecordingIOS:         false,
        playsInSilentModeIOS:       true,
        staysActiveInBackground:    false,
        shouldDuckAndroid:          true,
        playThroughEarpieceAndroid: false,
      });

      // Resolve audio source.
      // Expo's asset downloader saves bundled files by hash with NO extension.
      // ExoPlayer needs either a file extension or proper Content-Type to pick
      // an extractor. We copy the downloaded asset to an explicit .wav path so
      // ExoPlayer finds the WAV extractor by extension.
      let source: { uri: string };
      if (typeof sound.source === 'number') {
        const asset = Asset.fromModule(sound.source);
        await asset.downloadAsync(); // populates localUri on standalone
        const dest = `${FileSystem.cacheDirectory}huda_sound_${sound.id}.wav`;
        const info = await FileSystem.getInfoAsync(dest);
        const tooSmall = !info.exists || (info as any).size < 1024;
        if (tooSmall) {
          if (asset.uri.startsWith('http')) {
            // Expo Go: asset.uri is an HTTP Metro URL.
            await FileSystem.downloadAsync(asset.uri, dest);
          } else {
            // Standalone APK: asset is a local file — use copyAsync.
            await FileSystem.copyAsync({ from: asset.localUri!, to: dest });
          }
        }
        source = { uri: dest };
      } else if (sound.uri) {
        source = { uri: sound.uri };
      } else {
        throw new Error('No audio source');
      }

      // createAsync with shouldPlay:true — expo-av queues playback internally
      // so it fires even before the sound is fully buffered (no dropped call).
      const { sound: avSound } = await Audio.Sound.createAsync(
        source,
        {
          shouldPlay:  true,
          isLooping:   isLooping,
          volume:      volumeRef.current,
          rate:        1.0,
          shouldCorrectPitch: false,
        },
        (status) => {
          if (!status.isLoaded) return;
          // Non-looping sound finished — reset UI.
          if (status.didJustFinish && !isLoopingRef.current) {
            setPlayingId(null);
            soundRef.current = null;
          }
        },
      );

      soundRef.current = avSound;
      setLoadState((s) => ({ ...s, [sound.id]: 'ready' }));
    } catch (err) {
      console.error('[Sounds] play failed:', err);
      soundRef.current = null;
      setPlayingId(null);
      setLoadState((s) => ({ ...s, [sound.id]: 'error' }));
    }
  }, [playingId, stopCurrent, repeatMap, webUrls]);

  /* ── Per-sound repeat toggle ────────────────────────────────────────── */
  const toggleRepeat = useCallback(async (sound: CalmingSound) => {
    const current = sound.id in repeatMap ? repeatMap[sound.id] : (sound.loop ?? true);
    const next    = !current;

    setRepeatMap((m) => ({ ...m, [sound.id]: next }));

    // If this sound is currently playing, flip the loop flag live
    if (playingId === sound.id) {
      isLoopingRef.current = next;
      if (Platform.OS === 'web') {
        if (webAudioRef.current) webAudioRef.current.loop = next;
      } else if (soundRef.current) {
        try { await soundRef.current.setIsLoopingAsync(next); } catch { /* ignore */ }
      }
    }
  }, [repeatMap, playingId]);

  /* ── Volume ─────────────────────────────────────────────────────────── */
  const handleVolume = useCallback(async (v: number) => {
    setVolume(v);
    volumeRef.current = v;
    if (Platform.OS === 'web') {
      if (webAudioRef.current) webAudioRef.current.volume = v;
    } else if (soundRef.current) {
      try { await soundRef.current.setVolumeAsync(v); } catch { /* ignore */ }
    }
  }, []);

  /* ── Cleanup on unmount ──────────────────────────────────────────────── */
  useEffect(() => () => { stopCurrent(); }, [stopCurrent]);

  /* ── Add / delete custom sound ──────────────────────────────────────── */
  const handleAdd = async (partial: Omit<CalmingSound, 'icon' | 'color'> & { icon?: string; color?: string }) => {
    const s: CalmingSound = {
      icon:  'musical-notes-outline',
      color: '#E91E63',
      loop:  true,
      ...partial,
    };
    await saveCustom([...customSounds, s]);
    setShowAdd(false);
  };

  const handleDelete = (id: string) => {
    Alert.alert('Remove sound?', 'This will delete it from your library.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Remove', style: 'destructive',
        onPress: async () => {
          if (playingId === id) { await stopCurrent(); setPlayingId(null); }
          await saveCustom(customSounds.filter((s) => s.id !== id));
        },
      },
    ]);
  };

  /* ── Render ─────────────────────────────────────────────────────────── */
  const allSounds   = [...BUILT_IN_SOUNDS, ...customSounds];
  const playingSound = allSounds.find((s) => s.id === playingId);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: topPad + 8 }]}>
        <Pressable
          onPress={async () => { await stopCurrent(); router.back(); }}
          style={({ pressed }) => [styles.backBtn, { opacity: pressed ? 0.7 : 1 }]}
          accessibilityLabel="Go back"
        >
          <Ionicons name="arrow-back" size={24} color="rgba(200,220,230,0.9)" />
        </Pressable>
        <Text style={styles.headerTitle}>{t('Sensory Music')}</Text>
        <Pressable
          onPress={() => setShowAdd(true)}
          style={({ pressed }) => [styles.addBtn, { opacity: pressed ? 0.7 : 1 }]}
          accessibilityLabel="Add custom sound"
        >
          <Ionicons name="add" size={22} color="#2A9D8F" />
        </Pressable>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: bottomPad + 24 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Now Playing bar */}
        {playingSound && (
          <View style={[styles.nowPlaying, { borderColor: playingSound.color + '66' }]}>
            <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
              <View style={[styles.nowPlayingDot, { backgroundColor: playingSound.color }]} />
            </Animated.View>
            <Text style={styles.nowPlayingText} numberOfLines={1}>
              {t('Now Playing')}  ·  {playingSound.name}
            </Text>
            <Pressable onPress={() => { stopCurrent(); setPlayingId(null); }} hitSlop={12}>
              <Ionicons name="stop-circle-outline" size={22} color="#90A4AE" />
            </Pressable>
          </View>
        )}

        {/* Volume slider */}
        <View style={styles.volumeRow}>
          <Ionicons name="volume-low-outline" size={18} color="#546E7A" />
          <Slider
            style={styles.slider}
            minimumValue={0}
            maximumValue={1}
            step={0.05}
            value={volume}
            onValueChange={handleVolume}
            minimumTrackTintColor="#2A9D8F"
            maximumTrackTintColor="#263B50"
            thumbTintColor="#2A9D8F"
            accessibilityLabel="Volume"
          />
          <Ionicons name="volume-high-outline" size={18} color="#546E7A" />
        </View>

        {/* Subtitle */}
        <Text style={styles.subtitle}>{t('Calming Sounds')}</Text>

        {/* Built-in sound cards */}
        {BUILT_IN_SOUNDS.map((sound) => (
          <SoundCard
            key={sound.id}
            sound={sound}
            isPlaying={playingId === sound.id}
            isRepeating={getRepeat(sound)}
            loadState={loadState[sound.id] ?? 'idle'}
            onPress={() => play(sound)}
            onRepeatPress={() => toggleRepeat(sound)}
          />
        ))}

        {/* My Sounds section */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>{t('My Sounds')}</Text>
          <Pressable
            onPress={() => setShowAdd(true)}
            style={({ pressed }) => [styles.sectionAddBtn, { opacity: pressed ? 0.7 : 1 }]}
          >
            <Ionicons name="add-circle-outline" size={18} color="#2A9D8F" />
            <Text style={styles.sectionAddText}>{t('Add Custom Sound')}</Text>
          </Pressable>
        </View>

        {customSounds.length === 0 ? (
          <View style={styles.emptyBox}>
            <Ionicons name="musical-notes-outline" size={36} color="#263B50" />
            <Text style={styles.emptyText}>{t('No custom sounds yet.\nTap + to add your own.')}</Text>
          </View>
        ) : (
          customSounds.map((sound) => (
            <SoundCard
              key={sound.id}
              sound={sound}
              isPlaying={playingId === sound.id}
              isRepeating={getRepeat(sound)}
              loadState={loadState[sound.id] ?? 'idle'}
              onPress={() => play(sound)}
              onRepeatPress={() => toggleRepeat(sound)}
              onLongPress={() => handleDelete(sound.id)}
            />
          ))
        )}
      </ScrollView>

      <AddSoundModal visible={showAdd} onAdd={handleAdd} onClose={() => setShowAdd(false)} />
    </View>
  );
}

/* ── SoundCard ────────────────────────────────────────────────────────── */
function SoundCard({
  sound, isPlaying, isRepeating, loadState, onPress, onRepeatPress, onLongPress,
}: {
  sound: CalmingSound;
  isPlaying: boolean;
  isRepeating: boolean;
  loadState: LoadState;
  onPress: () => void;
  onRepeatPress: () => void;
  onLongPress?: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      onLongPress={onLongPress}
      style={({ pressed }) => [
        styles.card,
        isPlaying && { borderColor: sound.color + '88', backgroundColor: sound.color + '18' },
        { opacity: pressed ? 0.85 : 1 },
      ]}
      accessibilityLabel={`${isPlaying ? 'Stop' : 'Play'} ${sound.name}`}
      accessibilityRole="button"
    >
      {/* Left accent bar */}
      <View style={[styles.cardAccent, { backgroundColor: sound.color }]} />

      {/* Icon */}
      <View style={[styles.cardIconWrap, { backgroundColor: sound.color + '22' }]}>
        <Ionicons name={sound.icon as any} size={28} color={sound.color} />
      </View>

      {/* Text */}
      <View style={styles.cardText}>
        <Text style={styles.cardName}>{sound.name}</Text>
        <Text style={styles.cardDesc} numberOfLines={1}>{sound.description}</Text>
        {loadState === 'error' && (
          <Text style={styles.cardError}>⚠ Unavailable</Text>
        )}
      </View>

      {/* Repeat toggle */}
      <Pressable
        onPress={(e) => { e.stopPropagation?.(); onRepeatPress(); }}
        hitSlop={10}
        style={styles.repeatBtn}
        accessibilityLabel={isRepeating ? 'Turn off repeat' : 'Turn on repeat'}
        accessibilityRole="button"
      >
        <Ionicons
          name="repeat"
          size={18}
          color={isRepeating ? sound.color : '#2E4155'}
        />
      </Pressable>

      {/* Play / pause */}
      <View style={styles.cardAction}>
        {loadState === 'loading' ? (
          <ActivityIndicator color={sound.color} size="small" />
        ) : (
          <View style={[styles.playBtn, { backgroundColor: isPlaying ? sound.color : sound.color + '33' }]}>
            <Ionicons
              name={isPlaying ? 'pause' : 'play'}
              size={18}
              color={isPlaying ? '#fff' : sound.color}
            />
          </View>
        )}
      </View>

      {/* Custom badge */}
      {sound.custom && (
        <View style={styles.customBadge}>
          <Text style={styles.customBadgeText}>MY</Text>
        </View>
      )}
    </Pressable>
  );
}

/* ── Styles ───────────────────────────────────────────────────────────── */
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0D1B2A' },
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
  addBtn: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2A9D8F22',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#2A9D8F44',
  },
  scroll: { flex: 1 },
  scrollContent: { paddingHorizontal: 16, gap: 12 },

  nowPlaying: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#152232',
    borderRadius: 14,
    borderWidth: 1,
    padding: 12,
  },
  nowPlayingDot: { width: 10, height: 10, borderRadius: 5 },
  nowPlayingText: {
    flex: 1,
    color: '#B0C4D8',
    fontSize: 13,
    fontFamily: 'Inter_600SemiBold',
    fontWeight: '600',
  },

  volumeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#152232',
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 6,
  },
  slider: { flex: 1, height: 36 },

  subtitle: {
    color: '#546E7A',
    fontSize: 11,
    fontWeight: '700',
    fontFamily: 'Inter_700Bold',
    textTransform: 'uppercase',
    letterSpacing: 1.2,
    marginTop: 4,
  },

  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#152232',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#1E3040',
    overflow: 'hidden',
    gap: 10,
    paddingRight: 10,
    paddingVertical: 14,
    minHeight: 78,
  },
  cardAccent: { width: 4, alignSelf: 'stretch', borderRadius: 2 },
  cardIconWrap: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardText: { flex: 1, gap: 3 },
  cardName: {
    color: '#D0E8F0',
    fontSize: 15,
    fontWeight: '600',
    fontFamily: 'Inter_600SemiBold',
  },
  cardDesc: {
    color: '#546E7A',
    fontSize: 12,
    fontFamily: 'Inter_400Regular',
  },
  cardError: {
    color: '#E57373',
    fontSize: 11,
    fontFamily: 'Inter_400Regular',
    marginTop: 2,
  },

  repeatBtn: {
    width: 34,
    height: 34,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardAction: { alignItems: 'center', justifyContent: 'center', width: 42 },
  playBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
  },

  customBadge: {
    position: 'absolute',
    top: 8,
    right: 54,
    backgroundColor: '#2A9D8F',
    borderRadius: 4,
    paddingHorizontal: 4,
    paddingVertical: 1,
  },
  customBadgeText: {
    color: '#fff',
    fontSize: 9,
    fontWeight: '700',
    fontFamily: 'Inter_700Bold',
    letterSpacing: 0.5,
  },

  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  sectionTitle: {
    color: '#546E7A',
    fontSize: 11,
    fontWeight: '700',
    fontFamily: 'Inter_700Bold',
    textTransform: 'uppercase',
    letterSpacing: 1.2,
  },
  sectionAddBtn: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  sectionAddText: {
    color: '#2A9D8F',
    fontSize: 13,
    fontFamily: 'Inter_600SemiBold',
    fontWeight: '600',
  },

  emptyBox: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    paddingVertical: 32,
    backgroundColor: '#152232',
    borderRadius: 16,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: '#1E3040',
  },
  emptyText: {
    color: '#3A5068',
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
    textAlign: 'center',
    lineHeight: 22,
  },
});
