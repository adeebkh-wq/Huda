import { useAuth } from '@clerk/expo';
import { Redirect, Stack } from 'expo-router';
import { useEffect } from 'react';
import { KioskGuard } from '@/components/KioskGuard';
import { useDeviceSession } from '@/hooks/useDeviceSession';
import { useOfflineAuth, clearAuthCache } from '@/context/OfflineAuthContext';
import { useLocalAdmin } from '@/context/LocalAdminContext';

// AAC apps don't use a tab bar — the communication board IS the app.
// All navigation happens via in-screen buttons (Feelings, Caregiver, Back).
export default function Layout() {
  const { isSignedIn, isLoaded } = useAuth();
  const { cachedSignedIn, isReady } = useOfflineAuth();
  const { isReady: isLocalReady, isLocalAdminSignedIn } = useLocalAdmin();
  useDeviceSession();

  useEffect(() => {
    if (isLoaded && !isSignedIn && !isLocalAdminSignedIn) {
      clearAuthCache().catch(() => {});
    }
  }, [isLoaded, isSignedIn, isLocalAdminSignedIn]);

  // Wait for the fast AsyncStorage read before making routing decisions
  if (!isReady || !isLocalReady) return null;

  // Clerk is online and loaded — authoritative result
  if (isLoaded && !isSignedIn && !isLocalAdminSignedIn) {
    return <Redirect href="/" />;
  }

  // Offline: Clerk hasn't loaded but we have a cached session — let the user in
  if (!isLoaded && !cachedSignedIn && !isLocalAdminSignedIn) return null;

  return (
    <KioskGuard>
      <Stack screenOptions={{ headerShown: false, animation: 'slide_from_right' }} />
    </KioskGuard>
  );
}
