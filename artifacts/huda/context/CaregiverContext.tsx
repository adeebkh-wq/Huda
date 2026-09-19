import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { ColorTheme, TileSize } from '@/constants/colorThemes';

export interface EmotionCheckIn {
  id: string;
  emotion: string;
  color: string;
  timestamp: number;
}

export interface CaregiverSettings {
  fontSize: 'small' | 'medium' | 'large';
  /** Tile grid density — small shows more (smaller) tiles, large shows fewer (bigger) tiles. */
  tileSize: TileSize;
  /** Colour-blind accessible palette override. */
  colorTheme: ColorTheme;
  reducedMotion: boolean;
  darkMode: boolean;
}

interface CaregiverContextValue {
  isUnlocked: boolean;
  caregiverPin: string | null;
  settings: CaregiverSettings;
  emotionHistory: EmotionCheckIn[];
  kioskMode: boolean;
  validatePin: (pin: string) => boolean;
  setNewPin: (pin: string) => Promise<void>;
  clearPin: () => Promise<void>;
  lock: () => void;
  updateSettings: (partial: Partial<CaregiverSettings>) => Promise<void>;
  addEmotionCheckIn: (emotion: string, color: string) => Promise<void>;
  setKioskMode: (enabled: boolean) => Promise<void>;
  isLoaded: boolean;
}

const DEFAULT_SETTINGS: CaregiverSettings = {
  fontSize: 'medium',
  tileSize: 'medium',
  colorTheme: 'default',
  reducedMotion: false,
  darkMode: false,
};

const CAREGIVER_PIN_KEY = 'huda_caregiver_pin';
const SETTINGS_KEY = 'huda_settings';
const EMOTION_HISTORY_KEY = 'huda_emotion_history';
const KIOSK_MODE_KEY = 'huda_kiosk_mode';

export const CaregiverContext = createContext<CaregiverContextValue | null>(null);

export function CaregiverProvider({ children }: { children: React.ReactNode }) {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [caregiverPin, setCaregiverPin] = useState<string | null>(null);
  const [settings, setSettings] = useState<CaregiverSettings>(DEFAULT_SETTINGS);
  const [emotionHistory, setEmotionHistory] = useState<EmotionCheckIn[]>([]);
  const [kioskMode, setKioskModeState] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const [pinStr, settingsStr, historyStr, kioskStr] = await Promise.all([
          AsyncStorage.getItem(CAREGIVER_PIN_KEY),
          AsyncStorage.getItem(SETTINGS_KEY),
          AsyncStorage.getItem(EMOTION_HISTORY_KEY),
          AsyncStorage.getItem(KIOSK_MODE_KEY),
        ]);
        if (pinStr) setCaregiverPin(pinStr);
        if (settingsStr) setSettings({ ...DEFAULT_SETTINGS, ...JSON.parse(settingsStr) });
        if (historyStr) setEmotionHistory(JSON.parse(historyStr));
        if (kioskStr) setKioskModeState(kioskStr === 'true');
      } catch (_) {}
      setIsLoaded(true);
    })();
  }, []);

  const validatePin = useCallback(
    (pin: string) => {
      if (!caregiverPin) {
        setIsUnlocked(true);
        return true;
      }
      const ok = pin === caregiverPin;
      if (ok) setIsUnlocked(true);
      return ok;
    },
    [caregiverPin],
  );

  const setNewPin = useCallback(async (pin: string) => {
    setCaregiverPin(pin);
    await AsyncStorage.setItem(CAREGIVER_PIN_KEY, pin);
  }, []);

  const clearPin = useCallback(async () => {
    setCaregiverPin(null);
    await AsyncStorage.removeItem(CAREGIVER_PIN_KEY);
  }, []);

  const lock = useCallback(() => {
    setIsUnlocked(false);
  }, []);

  const updateSettings = useCallback(async (partial: Partial<CaregiverSettings>) => {
    setSettings((prev) => {
      const next = { ...prev, ...partial };
      AsyncStorage.setItem(SETTINGS_KEY, JSON.stringify(next)).catch(() => {});
      return next;
    });
  }, []);

  const addEmotionCheckIn = useCallback(async (emotion: string, color: string) => {
    const entry: EmotionCheckIn = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      emotion,
      color,
      timestamp: Date.now(),
    };
    setEmotionHistory((prev) => {
      const next = [entry, ...prev].slice(0, 200);
      AsyncStorage.setItem(EMOTION_HISTORY_KEY, JSON.stringify(next)).catch(() => {});
      return next;
    });
  }, []);

  const setKioskMode = useCallback(async (enabled: boolean) => {
    setKioskModeState(enabled);
    await AsyncStorage.setItem(KIOSK_MODE_KEY, String(enabled));
  }, []);

  return (
    <CaregiverContext.Provider
      value={{
        isUnlocked,
        caregiverPin,
        settings,
        emotionHistory,
        kioskMode,
        validatePin,
        setNewPin,
        clearPin,
        lock,
        updateSettings,
        addEmotionCheckIn,
        setKioskMode,
        isLoaded,
      }}
    >
      {children}
    </CaregiverContext.Provider>
  );
}

export function useCaregiver() {
  const ctx = useContext(CaregiverContext);
  if (!ctx) throw new Error('useCaregiver must be used within CaregiverProvider');
  return ctx;
}
