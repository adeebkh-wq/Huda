import React from 'react';
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useAuth } from '@clerk/expo';
import { Redirect } from 'expo-router';
import { useOfflineAuth } from '@/context/OfflineAuthContext';
import { Ionicons } from '@/components/IoniconsSVG';
import { useLocalAdmin } from '@/context/LocalAdminContext';

export default function WelcomeScreen() {
  const { isSignedIn, isLoaded } = useAuth();
  const { cachedSignedIn, isReady } = useOfflineAuth();
  const { isReady: isLocalReady, isLocalAdminSignedIn } = useLocalAdmin();
  const insets = useSafeAreaInsets();

  if (!isReady || !isLocalReady) return null; // brief local storage reads
  if (isLocalAdminSignedIn) return <Redirect href="/(tabs)" />;
  // Offline + cached session → go straight to the board
  if (!isLoaded && cachedSignedIn) return <Redirect href="/(tabs)" />;
  if (!isLoaded) return null;
  if (isSignedIn) return <Redirect href="/(tabs)" />;

  return (
    <View style={[styles.root, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
        {/* Header mark */}
        <View style={styles.logoWrap}>
          <Image
            source={require('@/assets/images/logo.png')}
            style={styles.logoImg}
            resizeMode="contain"
          />
          <Text style={styles.appName}>Huda</Text>
          <Text style={styles.appTagline}>AAC Communication App</Text>
        </View>

        {/* Introduction card */}
        <View style={styles.card}>
          <Text style={styles.cardHeading}>Huda — Guiding Every Voice Home</Text>

          <Text style={styles.bodyText}>
            Huda means guidance — the light that helps someone find their way. For many autistic
            children, the challenge isn't a lack of thoughts or feelings to share, but a lack of a
            clear path to express them. Huda exists to be that path.
          </Text>

          <Text style={styles.bodyText}>
            Built entirely to work offline, Huda gives children a reliable, always-available way
            to communicate — whether they're at home, at school, in the car, or anywhere without a
            connection. Through simple picture-based tiles, a gentle voice, and tools that help
            name big emotions and navigate daily routines, Huda doesn't speak for a child — it
            helps guide their own voice into words the world can understand.
          </Text>

          <Text style={styles.bodyText}>
            For caregivers and therapists, Huda offers the same guidance in return: quiet insight
            into a child's growing vocabulary, emotional patterns, and progress over time — never
            intrusive, never judgmental, always in service of the child's next step forward.
          </Text>

          <View style={styles.signatureRow}>
            <Ionicons name="heart" size={14} color="#D0457E" />
            <Text style={styles.signature}>
              Just as its name promises, Huda is here to guide — one word, one tap, one moment of
              being understood at a time.
            </Text>
          </View>
        </View>

        {/* Auth buttons */}
        <View style={styles.authWrap}>
          <Pressable
            style={({ pressed }) => [styles.btnPrimary, { opacity: pressed ? 0.85 : 1 }]}
            onPress={() => router.push('/(auth)/sign-up')}
          >
            <Text style={styles.btnPrimaryText}>Get Started</Text>
          </Pressable>

          <Pressable
            style={({ pressed }) => [styles.btnSecondary, { opacity: pressed ? 0.85 : 1 }]}
            onPress={() => router.push('/(auth)/sign-in')}
          >
            <Text style={styles.btnSecondaryText}>I already have an account</Text>
          </Pressable>

          <Pressable
            style={({ pressed }) => [styles.btnLocal, { opacity: pressed ? 0.85 : 1 }]}
            onPress={() => router.push('/(auth)/local-admin')}
          >
            <Ionicons name="phone-portrait-outline" size={18} color={TEAL} />
            <Text style={styles.btnLocalText}>Use without email</Text>
          </Pressable>
        </View>

        <Text style={styles.legalNote}>
          By continuing, you agree to our Terms of Service and Privacy Policy.
          Your caregiver account keeps child data safe on your device.
        </Text>
      </ScrollView>
    </View>
  );
}

const TEAL = '#2A9D8F';
const PINK = '#D0457E';
const CREAM = '#F7F3EF';
const CARD_BG = '#FFFFFF';

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: CREAM },
  scroll: { padding: 24, gap: 24, flexGrow: 1 },

  logoWrap: { alignItems: 'center', paddingVertical: 12, gap: 8 },
  logoImg: { width: 120, height: 120 },
  appName: {
    fontSize: 36, fontWeight: '800', fontFamily: 'Inter_700Bold',
    color: '#1A1A2E', letterSpacing: -0.5,
  },
  appTagline: {
    fontSize: 14, fontFamily: 'Inter_400Regular',
    color: '#6B7280', letterSpacing: 0.5, textTransform: 'uppercase',
  },

  card: {
    backgroundColor: CARD_BG,
    borderRadius: 20, padding: 22, gap: 14,
    shadowColor: '#000', shadowOpacity: 0.06,
    shadowRadius: 12, shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  cardHeading: {
    fontSize: 20, fontWeight: '700', fontFamily: 'Inter_700Bold',
    color: '#1A1A2E', marginBottom: 2,
  },
  bodyText: {
    fontSize: 15, fontFamily: 'Inter_400Regular',
    color: '#374151', lineHeight: 24,
  },
  signatureRow: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    paddingTop: 8, borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: '#E5E7EB',
  },
  signature: {
    fontSize: 13, fontFamily: 'Inter_500Medium',
    color: '#6B7280', fontStyle: 'italic', flex: 1,
  },

  authWrap: { gap: 12 },
  btnPrimary: {
    backgroundColor: TEAL, borderRadius: 16,
    paddingVertical: 16, alignItems: 'center',
    shadowColor: TEAL, shadowOpacity: 0.3,
    shadowRadius: 12, shadowOffset: { width: 0, height: 4 },
    elevation: 5,
  },
  btnPrimaryText: {
    color: '#fff', fontSize: 17, fontWeight: '700', fontFamily: 'Inter_700Bold',
  },
  btnSecondary: {
    borderWidth: 1.5, borderColor: TEAL, borderRadius: 16,
    paddingVertical: 15, alignItems: 'center',
    backgroundColor: 'transparent',
  },
  btnSecondaryText: {
    color: TEAL, fontSize: 16, fontWeight: '600', fontFamily: 'Inter_600SemiBold',
  },
  btnLocal: {
    flexDirection: 'row', gap: 8, justifyContent: 'center', alignItems: 'center',
    paddingVertical: 12,
  },
  btnLocalText: {
    color: TEAL, fontSize: 15, fontFamily: 'Inter_600SemiBold',
  },

  legalNote: {
    fontSize: 11, fontFamily: 'Inter_400Regular',
    color: '#9CA3AF', textAlign: 'center', lineHeight: 16,
    paddingBottom: 8,
  },
});
