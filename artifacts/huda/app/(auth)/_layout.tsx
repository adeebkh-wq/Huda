import { useAuth } from '@clerk/expo';
import { Redirect, Stack } from 'expo-router';
import { useLocalAdmin } from '@/context/LocalAdminContext';

export default function AuthLayout() {
  const { isSignedIn, isLoaded } = useAuth();
  const { isReady, isLocalAdminSignedIn } = useLocalAdmin();

  if (!isReady) return null;
  if (isLocalAdminSignedIn) return <Redirect href="/(tabs)" />;
  if (!isLoaded) return null;
  if (isSignedIn) return <Redirect href="/(tabs)" />;

  return (
    <Stack screenOptions={{ headerShown: false, animation: 'slide_from_bottom' }} />
  );
}
