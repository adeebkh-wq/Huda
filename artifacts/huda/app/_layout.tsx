import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { KeyboardProvider } from 'react-native-keyboard-controller';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ClerkProvider, useAuth } from '@clerk/expo';
import { ActivityIndicator } from 'react-native';
import { OfflineAuthProvider } from '@/context/OfflineAuthContext';
import { tokenCache } from '@clerk/expo/token-cache';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
  useFonts,
} from '@expo-google-fonts/inter';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { AppProvider } from '@/context/AppContext';
import { CaregiverProvider } from '@/context/CaregiverContext';
import { LocalAdminProvider } from '@/context/LocalAdminContext';

SplashScreen.preventAutoHideAsync();

/**
 * Renders children as soon as Clerk has loaded its cached auth state.
 * If Clerk hasn't resolved after 5 seconds (e.g. no network on first
 * load ever), it proceeds anyway so offline users with a cached session
 * aren't stuck on a blank screen.
 */
function ClerkLoadedOrOffline({ children }: { children: React.ReactNode }) {
  const { isLoaded } = useAuth();
  const [timedOut, setTimedOut] = React.useState(false);

  React.useEffect(() => {
    const t = setTimeout(() => setTimedOut(true), 5000);
    return () => clearTimeout(t);
  }, []);

  if (isLoaded || timedOut) return <>{children}</>;

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#F7F3EF' }}>
      <ActivityIndicator size="large" color="#2B4D7E" />
    </View>
  );
}

const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY;
const proxyUrl = process.env.EXPO_PUBLIC_CLERK_PROXY_URL || undefined;

function RootLayoutNav() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="(auth)" options={{ headerShown: false }} />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
    </Stack>
  );
}

function MissingConfigScreen() {
  return (
    <View style={missingStyles.container}>
      <Text style={missingStyles.title}>Configuration Error</Text>
      <Text style={missingStyles.body}>
        Authentication is not configured for this build.{'\n'}
        Please contact support.
      </Text>
    </View>
  );
}

const missingStyles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32, backgroundColor: '#F7F3EF' },
  title:     { fontSize: 20, fontWeight: '700', color: '#1A1A2E', marginBottom: 12 },
  body:      { fontSize: 15, color: '#6B7280', textAlign: 'center', lineHeight: 22 },
});

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
  });

  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync().catch(() => {});
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) return null;

  // Guard: if Clerk key is missing (build-time env not injected) show a
  // clear error instead of crashing inside ClerkProvider before any
  // ErrorBoundary can catch it.
  // SafeAreaProvider lives outside ErrorBoundary so ErrorFallback can safely
  // call useSafeAreaInsets() even when it renders to catch a provider failure.
  if (!publishableKey) {
    return (
      <SafeAreaProvider>
        <ErrorBoundary>
          <MissingConfigScreen />
        </ErrorBoundary>
      </SafeAreaProvider>
    );
  }

  return (
    <SafeAreaProvider>
      {/* ErrorBoundary wraps ClerkProvider so it can catch init failures */}
      <ErrorBoundary>
        {/* OfflineAuthProvider reads AsyncStorage before Clerk resolves */}
        <LocalAdminProvider>
          <OfflineAuthProvider>
            <ClerkProvider publishableKey={publishableKey} tokenCache={tokenCache} proxyUrl={proxyUrl}>
              <ClerkLoadedOrOffline>
                <CaregiverProvider>
                  <AppProvider>
                    <GestureHandlerRootView style={{ flex: 1 }}>
                      <KeyboardProvider>
                        <RootLayoutNav />
                      </KeyboardProvider>
                    </GestureHandlerRootView>
                  </AppProvider>
                </CaregiverProvider>
              </ClerkLoadedOrOffline>
            </ClerkProvider>
          </OfflineAuthProvider>
        </LocalAdminProvider>
      </ErrorBoundary>
    </SafeAreaProvider>
  );
}
