import { useEffect, useRef } from 'react';
import { AppState, AppStateStatus } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Crypto from 'expo-crypto';
import { useAuth } from '@clerk/expo';

const DEVICE_ID_KEY = 'huda_device_id';
const API_BASE = process.env.EXPO_PUBLIC_DOMAIN
  ? `https://${process.env.EXPO_PUBLIC_DOMAIN}`
  : '';

async function getOrCreateDeviceId(): Promise<string> {
  const existing = await AsyncStorage.getItem(DEVICE_ID_KEY);
  if (existing) return existing;
  const fresh = await Crypto.randomUUID();
  await AsyncStorage.setItem(DEVICE_ID_KEY, fresh);
  return fresh;
}

async function registerDevice(userId: string, token: string) {
  const deviceId = await getOrCreateDeviceId();
  await fetch(`${API_BASE}/api/device/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify({ deviceId, userId }),
  });
}

async function checkDevice(token: string): Promise<boolean> {
  const deviceId = await AsyncStorage.getItem(DEVICE_ID_KEY);
  if (!deviceId) return true; // no record yet — allow
  const res = await fetch(`${API_BASE}/api/device/check?deviceId=${deviceId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) return true; // network error — allow optimistically
  const json = await res.json();
  return json.isActive !== false;
}

/**
 * Registers this device on mount and re-checks when the app comes to foreground.
 * Signs the user out if the backend reports a different device is active.
 */
export function useDeviceSession() {
  const { isSignedIn, getToken, signOut } = useAuth();
  const checked = useRef(false);

  const verify = async () => {
    try {
      const token = await getToken();
      if (!token) return;
      const ok = await checkDevice(token);
      if (!ok) {
        await signOut();
      }
    } catch {
      // Network errors are non-fatal
    }
  };

  useEffect(() => {
    if (!isSignedIn) return;

    // Register + check on first mount
    if (!checked.current) {
      checked.current = true;
      (async () => {
        try {
          const token = await getToken();
          if (!token) return;
          await registerDevice('self', token);
          await verify();
        } catch {}
      })();
    }

    // Re-check whenever app comes back to foreground
    const sub = AppState.addEventListener('change', (state: AppStateStatus) => {
      if (state === 'active') verify();
    });

    return () => sub.remove();
  }, [isSignedIn]);
}
