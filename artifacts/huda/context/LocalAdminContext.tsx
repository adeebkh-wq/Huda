import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Crypto from 'expo-crypto';
import * as SecureStore from 'expo-secure-store';

const ACCOUNT_KEY = 'huda_local_admin_account_v1';
const SESSION_KEY = 'huda_local_admin_session_v1';

interface StoredLocalAdmin {
  name: string;
  salt: string;
  pinHash: string;
}

interface LocalAdminContextValue {
  isReady: boolean;
  isConfigured: boolean;
  isLocalAdminSignedIn: boolean;
  localAdminName: string | null;
  createLocalAdmin: (name: string, pin: string) => Promise<void>;
  signInLocalAdmin: (pin: string) => Promise<boolean>;
  signOutLocalAdmin: () => Promise<void>;
}

const LocalAdminContext = createContext<LocalAdminContextValue | null>(null);

async function hashPin(pin: string, salt: string) {
  return Crypto.digestStringAsync(
    Crypto.CryptoDigestAlgorithm.SHA256,
    `${salt}:${pin}`,
  );
}

export function LocalAdminProvider({ children }: { children: React.ReactNode }) {
  const [account, setAccount] = useState<StoredLocalAdmin | null>(null);
  const [isLocalAdminSignedIn, setIsLocalAdminSignedIn] = useState(false);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const [storedAccount, storedSession] = await Promise.all([
          SecureStore.getItemAsync(ACCOUNT_KEY),
          AsyncStorage.getItem(SESSION_KEY),
        ]);
        if (storedAccount) setAccount(JSON.parse(storedAccount));
        setIsLocalAdminSignedIn(storedSession === 'true' && !!storedAccount);
      } catch {
        setAccount(null);
        setIsLocalAdminSignedIn(false);
      } finally {
        setIsReady(true);
      }
    })();
  }, []);

  const createLocalAdmin = useCallback(async (name: string, pin: string) => {
    const salt = Crypto.randomUUID();
    const next: StoredLocalAdmin = {
      name: name.trim(),
      salt,
      pinHash: await hashPin(pin, salt),
    };
    await SecureStore.setItemAsync(ACCOUNT_KEY, JSON.stringify(next));
    await AsyncStorage.setItem(SESSION_KEY, 'true');
    setAccount(next);
    setIsLocalAdminSignedIn(true);
  }, []);

  const signInLocalAdmin = useCallback(async (pin: string) => {
    if (!account) return false;
    const candidate = await hashPin(pin, account.salt);
    const valid = candidate === account.pinHash;
    if (valid) {
      await AsyncStorage.setItem(SESSION_KEY, 'true');
      setIsLocalAdminSignedIn(true);
    }
    return valid;
  }, [account]);

  const signOutLocalAdmin = useCallback(async () => {
    await AsyncStorage.removeItem(SESSION_KEY);
    setIsLocalAdminSignedIn(false);
  }, []);

  const value = useMemo<LocalAdminContextValue>(() => ({
    isReady,
    isConfigured: !!account,
    isLocalAdminSignedIn,
    localAdminName: account?.name ?? null,
    createLocalAdmin,
    signInLocalAdmin,
    signOutLocalAdmin,
  }), [account, createLocalAdmin, isLocalAdminSignedIn, isReady, signInLocalAdmin, signOutLocalAdmin]);

  return <LocalAdminContext.Provider value={value}>{children}</LocalAdminContext.Provider>;
}

export function useLocalAdmin() {
  const context = useContext(LocalAdminContext);
  if (!context) throw new Error('useLocalAdmin must be used within LocalAdminProvider');
  return context;
}