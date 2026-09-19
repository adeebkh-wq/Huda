/**
 * OfflineAuthContext
 *
 * Stores a lightweight AsyncStorage flag ("huda_auth_cached") so the app can
 * route registered users to the main board even when the device is offline and
 * Clerk cannot complete its token-refresh network call.
 *
 * Usage:
 *   - Call markAuthCached() after every successful sign-in / sign-up finalize.
 *   - Call clearAuthCache() in the sign-out handler.
 *   - Route guards read { cachedSignedIn, isReady } via useOfflineAuth().
 *
 * Security note: this flag is not a substitute for a real session — it only
 * controls client-side routing while offline.  Clerk still validates the token
 * against its servers whenever the device is back online, and clears the
 * session if it is invalid, at which point route guards clear the flag too.
 */

import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CACHE_KEY = 'huda_auth_cached';

// ── Public helpers ─────────────────────────────────────────────────────────────

/** Call after a successful sign-in or sign-up finalize. */
export async function markAuthCached(): Promise<void> {
  try { await AsyncStorage.setItem(CACHE_KEY, 'true'); } catch (_) {}
}

/** Call in the sign-out handler. */
export async function clearAuthCache(): Promise<void> {
  try { await AsyncStorage.removeItem(CACHE_KEY); } catch (_) {}
}

// ── Context ────────────────────────────────────────────────────────────────────

interface OfflineAuthCtx {
  /** True if a previous successful auth was recorded locally. */
  cachedSignedIn: boolean;
  /** False until the AsyncStorage read has completed (~10–50 ms). */
  isReady: boolean;
}

const OfflineAuthContext = createContext<OfflineAuthCtx>({
  cachedSignedIn: false,
  isReady: false,
});

export function OfflineAuthProvider({ children }: { children: React.ReactNode }) {
  const [cachedSignedIn, setCachedSignedIn] = useState(false);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(CACHE_KEY)
      .then((v) => setCachedSignedIn(v === 'true'))
      .catch(() => {})
      .finally(() => setIsReady(true));
  }, []);

  return (
    <OfflineAuthContext.Provider value={{ cachedSignedIn, isReady }}>
      {children}
    </OfflineAuthContext.Provider>
  );
}

export function useOfflineAuth() {
  return useContext(OfflineAuthContext);
}
