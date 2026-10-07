import { Stack } from 'expo-router';
import { KioskGuard } from '@/components/KioskGuard';

// AAC apps don't use a tab bar — the communication board IS the app.
// All navigation happens via in-screen buttons (Feelings, Caregiver, Back).
export default function Layout() {
  return (
    <KioskGuard>
      <Stack screenOptions={{ headerShown: false, animation: 'slide_from_right' }} />
    </KioskGuard>
  );
}
