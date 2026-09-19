/**
 * KioskGuard — mounts at the root, wraps every screen.
 *
 * When kiosk mode is active on Android:
 *  - The system navigation bar (Back / Home / Recents) is hidden using
 *    expo-navigation-bar. If the user swipes to reveal it briefly, AppState
 *    re-hides it the moment the app returns to the foreground.
 *  - The hardware back button is also intercepted via BackHandler as a
 *    belt-and-braces measure.
 *  - A padlock FAB lets caregivers authenticate and reach the dashboard.
 *
 * On iOS the padlock FAB is still shown; use Guided Access (Settings →
 * Accessibility) for true boot-lock on that platform.
 */

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { AppState, AppStateStatus, BackHandler, Platform, Pressable, StyleSheet, View } from 'react-native';
import { router, useSegments } from 'expo-router';
// expo-navigation-bar is Android-only — require lazily so web doesn't crash.
// v5 API uses setVisibilityAsync('hidden'|'visible'), not the old setHidden().
const NavigationBar: { setVisibilityAsync: (v: 'hidden' | 'visible') => Promise<void> } | null =
  Platform.OS === 'android' ? require('expo-navigation-bar') : null;
import { Ionicons } from '@/components/IoniconsSVG';
import { useCaregiver } from '@/context/CaregiverContext';
import { PinModal } from '@/components/PinModal';

export function KioskGuard({ children }: { children: React.ReactNode }) {
  const { kioskMode, validatePin } = useCaregiver();
  const [showPin, setShowPin] = useState(false);
  const segments = useSegments();

  const inCaregiverSection = segments.some((s) => s === 'caregiver');

  // Reset suspension when caregiver leaves their section.
  const kioskSuspended = useRef(false);
  useEffect(() => {
    if (!inCaregiverSection) kioskSuspended.current = false;
  }, [inCaregiverSection]);

  // Re-engage fully whenever kiosk mode turns on.
  useEffect(() => {
    kioskSuspended.current = false;
  }, [kioskMode]);

  // ─── Nav bar hide / restore (Android only) ───────────────────────────────

  const hideNavBar = useCallback(() => {
    if (Platform.OS !== 'android') return;
    try { NavigationBar?.setVisibilityAsync('hidden'); } catch (_) {}
  }, []);

  const showNavBar = useCallback(() => {
    if (Platform.OS !== 'android') return;
    try { NavigationBar?.setVisibilityAsync('visible'); } catch (_) {}
  }, []);

  // Apply/restore whenever kioskMode toggles.
  useEffect(() => {
    if (kioskMode) {
      hideNavBar();
    } else {
      showNavBar();
    }
  }, [kioskMode, hideNavBar, showNavBar]);

  // Re-hide when app comes back to foreground (Android resets visibility on resume).
  useEffect(() => {
    if (Platform.OS !== 'android') return;
    const sub = AppState.addEventListener('change', (next: AppStateStatus) => {
      if (next === 'active' && kioskMode) hideNavBar();
    });
    return () => sub.remove();
  }, [kioskMode, hideNavBar]);

  // ─── Hardware back button (belt-and-braces) ───────────────────────────────
  useEffect(() => {
    if (Platform.OS !== 'android') return;
    const sub = BackHandler.addEventListener('hardwareBackPress', () => {
      if (!kioskMode) return false;
      if (kioskSuspended.current && inCaregiverSection) return false;
      setShowPin(true);
      return true;
    });
    return () => sub.remove();
  }, [kioskMode, inCaregiverSection]);

  // ─── PIN unlock ───────────────────────────────────────────────────────────
  const handlePinSuccess = () => {
    setShowPin(false);
    kioskSuspended.current = true;
    showNavBar(); // give the caregiver their nav bar back temporarily
    router.push('/(tabs)/caregiver');
  };

  // Re-hide nav bar when caregiver navigates back out of caregiver section.
  useEffect(() => {
    if (kioskMode && !inCaregiverSection && !kioskSuspended.current) {
      hideNavBar();
    }
  }, [inCaregiverSection, kioskMode, hideNavBar]);

  return (
    <View style={styles.root}>
      {children}

      {kioskMode && (
        <Pressable
          onPress={() => setShowPin(true)}
          style={({ pressed }) => [styles.fab, { opacity: pressed ? 0.75 : 0.92 }]}
          accessibilityLabel="Caregiver unlock"
          accessibilityRole="button"
        >
          <Ionicons name="lock-closed" size={22} color="#fff" />
        </Pressable>
      )}

      <PinModal
        visible={showPin}
        title="Caregiver Unlock"
        validatePin={validatePin}
        onSuccess={handlePinSuccess}
        onCancel={() => setShowPin(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  fab: {
    position: 'absolute',
    bottom: 32,
    right: 20,
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(42,157,143,0.9)',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 8,
    zIndex: 9999,
  },
});
