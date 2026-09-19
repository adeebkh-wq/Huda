import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Speech from 'expo-speech';
import { Audio } from 'expo-av';
import { DEFAULT_BOARDS, ALPHA_PALETTE, type Board, type Tile, type IconLib } from '@/data/defaultBoards';
import {
  translateLabel, LANGUAGE_TO_BCP47, LANGUAGE_ALPHABETS, ALPHABET_BOARD_NAMES,
  type LanguageCode,
} from '@/data/translations';

// Per-tile customisations applied on top of default tiles
export interface TileCustomization {
  imageUri?: string;   // local URI (camera roll / downloaded)
  audioUri?: string;   // local URI (recorded mic audio)
  customLabel?: string;
}

/** Game preferences that belong to the child, not the caregiver device. */
export interface ChildGameSettings {
  /** How quickly taps must follow each other to build a bubble-pop streak. */
  streakWindowMs: 1000 | 1500 | 2500;
}

const DEFAULT_CHILD_GAME_SETTINGS: ChildGameSettings = {
  streakWindowMs: 1500,
};

interface AppContextValue {
  boards: Board[];
  currentBoardId: string;
  sentence: Tile[];
  ttsRate: number;
  ttsPitch: number;
  usageStats: Record<string, number>;
  tileCustomizations: Record<string, TileCustomization>;
  childGameSettings: ChildGameSettings;
  appLanguage: LanguageCode;
  isLoaded: boolean;
  quietMode: boolean;
  isSpeaking: boolean;

  updateChildGameSettings: (partial: Partial<ChildGameSettings>) => Promise<void>;
  addToSentence: (tile: Tile) => void;
  removeLastTile: () => void;
  clearSentence: () => void;
  speakSentence: () => Promise<void>;
  speakTile: (tile: Tile) => void;
  setCurrentBoard: (boardId: string) => void;
  getCurrentBoard: () => Board | undefined;
  getQuickAccessTiles: () => Tile[];
  setQuietMode: (on: boolean) => void;
  updateTtsSettings: (rate: number, pitch: number) => void;
  setAppLanguage: (code: LanguageCode) => Promise<void>;
  resetToFactoryDefaults: () => Promise<void>;

  // Customisation
  setTileCustomization: (tileId: string, data: Partial<TileCustomization>) => Promise<void>;
  clearTileCustomization: (tileId: string) => Promise<void>;
  addCustomTile: (tile: Tile) => Promise<void>;
  removeCustomTile: (tileId: string) => Promise<void>;
}

const AppContext = createContext<AppContextValue | null>(null);

const STORAGE = {
  usageStats:        'huda_usage_stats',
  ttsSettings:       'huda_tts_settings',
  tileCustomizations:'huda_tile_customizations',
  customTiles:       'huda_custom_tiles',
  childGameSettings: 'huda_child_game_settings',
  appLanguage:       'huda_app_language',
};

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [defaultBoards]        = useState<Board[]>(DEFAULT_BOARDS);
  const [customTiles, setCustomTiles]                   = useState<Tile[]>([]);
  const [currentBoardId, setCurrentBoardId]             = useState('core');
  const [sentence, setSentence]                         = useState<Tile[]>([]);
  const [ttsRate, setTtsRate]                           = useState(0.75);
  const [ttsPitch, setTtsPitch]                         = useState(1.0);
  const [usageStats, setUsageStats]                     = useState<Record<string, number>>({});
  const [tileCustomizations, setTileCustomizations]     = useState<Record<string, TileCustomization>>({});
  const [childGameSettings, setChildGameSettings]       = useState<ChildGameSettings>(DEFAULT_CHILD_GAME_SETTINGS);
  const [appLanguage, setAppLanguageState]              = useState<LanguageCode>('en');
  const [isLoaded, setIsLoaded]                         = useState(false);
  const [quietMode, setQuietMode]                       = useState(false);
  const [isSpeaking, setIsSpeaking]                     = useState(false);
  const soundRef = useRef<Audio.Sound | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const [statsStr, ttsStr, customStr, tilesStr, gameStr, langStr] = await Promise.all([
          AsyncStorage.getItem(STORAGE.usageStats),
          AsyncStorage.getItem(STORAGE.ttsSettings),
          AsyncStorage.getItem(STORAGE.tileCustomizations),
          AsyncStorage.getItem(STORAGE.customTiles),
          AsyncStorage.getItem(STORAGE.childGameSettings),
          AsyncStorage.getItem(STORAGE.appLanguage),
        ]);
        if (statsStr)  setUsageStats(JSON.parse(statsStr));
        if (customStr) setTileCustomizations(JSON.parse(customStr));
        if (tilesStr)  setCustomTiles(JSON.parse(tilesStr));
        if (ttsStr) {
          const { rate, pitch } = JSON.parse(ttsStr);
          if (typeof rate  === 'number') setTtsRate(rate);
          if (typeof pitch === 'number') setTtsPitch(pitch);
        }
        if (gameStr) setChildGameSettings({ ...DEFAULT_CHILD_GAME_SETTINGS, ...JSON.parse(gameStr) });
        if (langStr) setAppLanguageState(langStr as LanguageCode);
      } catch (_) {}
      setIsLoaded(true);
    })();
  }, []);

  // Merge default boards with custom tiles + apply customisations + translations
  const boards = useMemo<Board[]>(() => {
    const translate = (label: string) => translateLabel(label, appLanguage);

    return defaultBoards.map((board) => {
      // ── Alphabet board: swap tiles for the script of the current language ──
      if (board.id === 'alphabet') {
        const letters = LANGUAGE_ALPHABETS[appLanguage];
        const langTiles: Tile[] = letters.map((letter, i) => ({
          id:      `alpha-${i}`,
          label:   letter,
          icon:    'text' as const,
          iconLib: 'Ionicons' as IconLib,
          color:   ALPHA_PALETTE[i % ALPHA_PALETTE.length],
          boardId: 'alphabet',
        }));
        return {
          ...board,
          name:  ALPHABET_BOARD_NAMES[appLanguage] ?? 'Alphabet',
          tiles: langTiles,
        };
      }

      const boardCustomTiles = customTiles.filter((t) => t.boardId === board.id);
      const mergedTiles = [...board.tiles, ...boardCustomTiles].map((tile) => {
        const custom = tileCustomizations[tile.id];
        // Translate the default English label, then let a caregiver customLabel override it.
        const translatedLabel = translate(tile.label);
        return {
          ...tile,
          imageUri: custom?.imageUri    ?? tile.imageUri,
          audioUri: custom?.audioUri    ?? tile.audioUri,
          label:    custom?.customLabel ?? translatedLabel,
        };
      });
      return { ...board, tiles: mergedTiles };
    });
  }, [defaultBoards, customTiles, tileCustomizations, appLanguage]);

  const addToSentence = useCallback((tile: Tile) => {
    setSentence((prev) => [...prev, tile]);
    setUsageStats((prev) => {
      const next = { ...prev, [tile.id]: (prev[tile.id] ?? 0) + 1 };
      AsyncStorage.setItem(STORAGE.usageStats, JSON.stringify(next)).catch(() => {});
      return next;
    });
  }, []);

  const removeLastTile = useCallback(() => setSentence((p) => p.slice(0, -1)), []);
  const clearSentence  = useCallback(() => setSentence([]), []);

  // Play audio URI (recorded mic) and return true if played, false if should use TTS
  const tryPlayAudio = useCallback(async (audioUri: string): Promise<boolean> => {
    // Stop and unload any previous sound first — keep this OUTSIDE the main
    // try/catch so a failed unload doesn't prevent the new sound from playing.
    const prev = soundRef.current;
    soundRef.current = null;
    if (prev) {
      try { await prev.stopAsync(); } catch {}
      try { await prev.unloadAsync(); } catch {}
    }

    try {
      await Audio.setAudioModeAsync({ playsInSilentModeIOS: true, playThroughEarpieceAndroid: false });
      const { sound } = await Audio.Sound.createAsync({ uri: audioUri });
      soundRef.current = sound;
      setIsSpeaking(true);
      await sound.playAsync();
      // Use didJustFinish (not !isPlaying) so we don't fire on the brief
      // instant between createAsync and playAsync where isPlaying is still false.
      sound.setOnPlaybackStatusUpdate((status) => {
        if (!status.isLoaded || status.didJustFinish) {
          setIsSpeaking(false);
        }
      });
      return true;
    } catch {
      setIsSpeaking(false);
      return false;
    }
  }, []);

  const doSpeak = useCallback((text: string) => {
    const language = LANGUAGE_TO_BCP47[appLanguage] ?? 'en-US';
    Speech.stop();
    setIsSpeaking(true);
    Speech.speak(text, {
      rate:      ttsRate,
      pitch:     ttsPitch,
      language,
      onDone:    () => setIsSpeaking(false),
      onError:   () => setIsSpeaking(false),
      onStopped: () => setIsSpeaking(false),
    });
  }, [ttsRate, ttsPitch, appLanguage]);

  const speakSentence = useCallback(async () => {
    if (!sentence.length) return;

    // Single tile with a custom recording → play the audio directly.
    if (sentence.length === 1 && sentence[0].audioUri) {
      const played = await tryPlayAudio(sentence[0].audioUri);
      if (played) return;
    }

    // Multi-tile sentence or no audio → TTS for the combined text.
    const text = sentence.map((t) => t.label).join(' ');
    if (!text) return;
    doSpeak(text);
  }, [sentence, tryPlayAudio, doSpeak]);

  const speakTile = useCallback(async (tile: Tile) => {
    const custom   = tileCustomizations[tile.id];
    const audioUri = tile.audioUri ?? custom?.audioUri;
    if (audioUri) {
      const played = await tryPlayAudio(audioUri);
      if (played) return;
    }
    doSpeak(tile.label);
  }, [tileCustomizations, tryPlayAudio, doSpeak]);

  const setCurrentBoard = useCallback((id: string) => setCurrentBoardId(id), []);

  const getCurrentBoard = useCallback(
    () => boards.find((b) => b.id === currentBoardId),
    [boards, currentBoardId],
  );

  const getQuickAccessTiles = useCallback(() => {
    const allTiles = boards.flatMap((b) => b.tiles);
    return allTiles
      .filter((t) => (usageStats[t.id] ?? 0) > 0)
      .sort((a, b) => (usageStats[b.id] ?? 0) - (usageStats[a.id] ?? 0))
      .slice(0, 12);
  }, [boards, usageStats]);

  const updateTtsSettings = useCallback((rate: number, pitch: number) => {
    setTtsRate(rate);
    setTtsPitch(pitch);
    AsyncStorage.setItem(STORAGE.ttsSettings, JSON.stringify({ rate, pitch })).catch(() => {});
  }, []);

  const setAppLanguage = useCallback(async (code: LanguageCode) => {
    setAppLanguageState(code);
    await AsyncStorage.setItem(STORAGE.appLanguage, code);
  }, []);

  /** Clears all tile customisations, custom tiles, and usage history. */
  const resetToFactoryDefaults = useCallback(async () => {
    await Promise.all([
      AsyncStorage.removeItem(STORAGE.tileCustomizations),
      AsyncStorage.removeItem(STORAGE.customTiles),
      AsyncStorage.removeItem(STORAGE.usageStats),
    ]);
    setTileCustomizations({});
    setCustomTiles([]);
    setUsageStats({});
  }, []);

  const setTileCustomization = useCallback(async (tileId: string, data: Partial<TileCustomization>) => {
    setTileCustomizations((prev) => {
      const next = { ...prev, [tileId]: { ...prev[tileId], ...data } };
      AsyncStorage.setItem(STORAGE.tileCustomizations, JSON.stringify(next)).catch(() => {});
      return next;
    });
  }, []);

  const clearTileCustomization = useCallback(async (tileId: string) => {
    setTileCustomizations((prev) => {
      const next = { ...prev };
      delete next[tileId];
      AsyncStorage.setItem(STORAGE.tileCustomizations, JSON.stringify(next)).catch(() => {});
      return next;
    });
  }, []);

  const addCustomTile = useCallback(async (tile: Tile) => {
    setCustomTiles((prev) => {
      const next = [...prev.filter((t) => t.id !== tile.id), tile];
      AsyncStorage.setItem(STORAGE.customTiles, JSON.stringify(next)).catch(() => {});
      return next;
    });
  }, []);

  const removeCustomTile = useCallback(async (tileId: string) => {
    setCustomTiles((prev) => {
      const next = prev.filter((t) => t.id !== tileId);
      AsyncStorage.setItem(STORAGE.customTiles, JSON.stringify(next)).catch(() => {});
      return next;
    });
  }, []);

  const updateChildGameSettings = useCallback(async (partial: Partial<ChildGameSettings>) => {
    setChildGameSettings((prev) => {
      const next = { ...prev, ...partial };
      AsyncStorage.setItem(STORAGE.childGameSettings, JSON.stringify(next)).catch(() => {});
      return next;
    });
  }, []);

  return (
    <AppContext.Provider
      value={{
        boards, currentBoardId, sentence, ttsRate, ttsPitch,
        usageStats, tileCustomizations, childGameSettings, appLanguage, isLoaded, quietMode, isSpeaking,
        addToSentence, removeLastTile, clearSentence, speakSentence, speakTile,
        setCurrentBoard, getCurrentBoard, getQuickAccessTiles, setQuietMode,
        updateTtsSettings, updateChildGameSettings,
        setAppLanguage, resetToFactoryDefaults,
        setTileCustomization, clearTileCustomization,
        addCustomTile, removeCustomTile,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
