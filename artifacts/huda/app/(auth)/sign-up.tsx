import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useSignUp, useAuth } from '@clerk/expo';
import { Ionicons } from '@/components/IoniconsSVG';
import { markAuthCached } from '@/context/OfflineAuthContext';

const TEAL = '#2A9D8F';
const CREAM = '#F7F3EF';

export default function SignUpScreen() {
  const { signUp, errors, fetchStatus } = useSignUp();
  const { isSignedIn } = useAuth();
  const insets = useSafeAreaInsets();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [code, setCode] = useState('');

  // Hard fallback: if isSignedIn flips true for any reason, navigate immediately
  useEffect(() => {
    if (isSignedIn) router.replace('/(tabs)');
  }, [isSignedIn]);

  const [finalising, setFinalising] = useState(false);

  const isLoading = fetchStatus === 'fetching';

  const handleSignUp = async () => {
    if (!signUp) return;
    const { error } = await signUp.password({ emailAddress: email, password });
    if (error) return;
    await signUp.verifications.sendEmailCode();
  };

  const handleVerify = async () => {
    if (!signUp) return;
    await signUp.verifications.verifyEmailCode({ code });
    if (signUp.status === 'complete') {
      setFinalising(true);
      try {
        // finalize writes the session to token-cache.
        // Do NOT navigate here — (auth)/_layout.tsx's <Redirect href="/(tabs)" />
        // fires automatically once isSignedIn becomes true, avoiding double-navigate.
        await signUp.finalize({ navigate: () => {} });
        markAuthCached().catch(() => {});
      } catch (_) {}
      // isSignedIn useEffect above is the sole navigation trigger.
    }
  };

  const isVerifyStep =
    signUp?.status === 'missing_requirements' &&
    (signUp?.unverifiedFields ?? []).includes('email_address') &&
    (signUp?.missingFields ?? []).length === 0;

  // Show spinner while session is being finalised
  if (finalising) {
    return (
      <View style={styles.centred}>
        <ActivityIndicator size="large" color={TEAL} />
      </View>
    );
  }

  // ── Verify step ──
  if (isVerifyStep) {
    return (
      <View style={[styles.safeRoot, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
        {/* Fixed header */}
        <View style={styles.header}>
          <Pressable onPress={() => signUp?.reset?.() } style={styles.backBtn}>
            <Ionicons name="arrow-back" size={24} color="#1A1A2E" />
          </Pressable>
          <Text style={styles.headerTitle}>Verify email</Text>
          <View style={styles.headerSpacer} />
        </View>

        <ScrollView
          contentContainerStyle={styles.body}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.verifyIconWrap}>
            <Ionicons name="mail" size={48} color={TEAL} />
          </View>
          <Text style={styles.verifyHeading}>Check your inbox</Text>
          <Text style={styles.subtitle}>We sent a 6-digit code to {email}.</Text>

          <Text style={styles.label}>Verification Code</Text>
          <TextInput
            style={styles.input}
            value={code}
            onChangeText={setCode}
            placeholder="Enter 6-digit code"
            placeholderTextColor="#9CA3AF"
            keyboardType="number-pad"
            autoFocus
          />
          {errors?.fields?.code && (
            <Text style={styles.error}>{errors.fields.code.message}</Text>
          )}

          <Pressable
            style={[styles.btnPrimary, (isLoading || !code) && styles.btnDisabled]}
            onPress={handleVerify}
            disabled={isLoading || !code}
          >
            {isLoading
              ? <ActivityIndicator color="#fff" />
              : <Text style={styles.btnText}>Verify & Continue</Text>}
          </Pressable>

          <Pressable onPress={() => signUp?.verifications.sendEmailCode()} style={styles.linkBtn}>
            <Text style={styles.linkText}>Resend code</Text>
          </Pressable>
        </ScrollView>
      </View>
    );
  }

  // ── Sign-up step ──
  return (
    <KeyboardAvoidingView
      style={styles.flex1}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={[styles.safeRoot, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
        {/* Fixed header — stays visible even when keyboard is open */}
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={24} color="#1A1A2E" />
          </Pressable>
          <Text style={styles.headerTitle}>Create account</Text>
          <View style={styles.headerSpacer} />
        </View>

        <ScrollView
          contentContainerStyle={styles.body}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Brand mark */}
          <View style={styles.logoRow}>
            <Image
              source={require('@/assets/images/logo.png')}
              style={styles.logoImg}
              resizeMode="contain"
            />
            <View>
              <Text style={styles.brandName}>Huda</Text>
              <Text style={styles.brandSub}>Caregiver Account</Text>
            </View>
          </View>

          <Text style={styles.intro}>
            Your account keeps your child's boards and settings safe on your device.
          </Text>

          <Text style={styles.label}>Email address</Text>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            placeholder="you@example.com"
            placeholderTextColor="#9CA3AF"
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
          />
          {errors?.fields?.emailAddress && (
            <Text style={styles.error}>{errors.fields.emailAddress.message}</Text>
          )}

          <Text style={styles.label}>Password</Text>
          <View style={styles.passwordRow}>
            <TextInput
              style={[styles.input, styles.passwordInput]}
              value={password}
              onChangeText={setPassword}
              placeholder="At least 8 characters"
              placeholderTextColor="#9CA3AF"
              secureTextEntry={!showPassword}
              autoComplete="new-password"
            />
            <Pressable style={styles.eyeBtn} onPress={() => setShowPassword(v => !v)}>
              <Ionicons name={showPassword ? 'eye-off' : 'eye'} size={20} color="#6B7280" />
            </Pressable>
          </View>
          {errors?.fields?.password && (
            <Text style={styles.error}>{errors.fields.password.message}</Text>
          )}

          {/* Required by Clerk bot-protection */}
          <View nativeID="clerk-captcha" />

          <Pressable
            style={[styles.btnPrimary, (isLoading || !email || !password) && styles.btnDisabled]}
            onPress={handleSignUp}
            disabled={isLoading || !email || !password}
          >
            {isLoading
              ? <ActivityIndicator color="#fff" />
              : <Text style={styles.btnText}>Create account</Text>}
          </Pressable>

          <View style={styles.switchRow}>
            <Text style={styles.switchText}>Already have an account? </Text>
            <Pressable onPress={() => router.replace('/(auth)/sign-in')}>
              <Text style={styles.switchLink}>Sign in</Text>
            </Pressable>
          </View>
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex1:        { flex: 1 },
  safeRoot:     { flex: 1, backgroundColor: CREAM },

  // Fixed header row
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: CREAM,
  },
  backBtn:       { padding: 8, width: 40 },
  headerTitle:   { fontSize: 20, fontWeight: '700', fontFamily: 'Inter_700Bold', color: '#1A1A2E' },
  headerSpacer:  { width: 40 },

  // Scrollable body
  body: { paddingHorizontal: 24, paddingBottom: 32, gap: 8 },

  logoRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 4 },
  logoImg: { width: 56, height: 56 },
  brandName: { fontSize: 24, fontWeight: '800', fontFamily: 'Inter_700Bold', color: '#1A1A2E' },
  brandSub:  { fontSize: 13, fontFamily: 'Inter_400Regular', color: '#6B7280' },
  intro:     { fontSize: 14, fontFamily: 'Inter_400Regular', color: '#6B7280', lineHeight: 20, marginBottom: 4 },

  label: { fontSize: 14, fontWeight: '600', fontFamily: 'Inter_600SemiBold', color: '#374151', marginTop: 4 },
  input: {
    backgroundColor: '#fff', borderRadius: 14, borderWidth: 1.5, borderColor: '#E5E7EB',
    paddingHorizontal: 14, paddingVertical: 14,
    fontSize: 16, fontFamily: 'Inter_400Regular', color: '#1A1A2E',
  },
  passwordRow:  { position: 'relative' },
  passwordInput: { paddingRight: 48 },
  eyeBtn:       { position: 'absolute', right: 14, top: 14 },

  btnPrimary: {
    backgroundColor: TEAL, borderRadius: 16, paddingVertical: 16,
    alignItems: 'center', marginTop: 16,
    elevation: 4,
  },
  btnDisabled: { opacity: 0.5 },
  btnText:     { color: '#fff', fontSize: 17, fontWeight: '700', fontFamily: 'Inter_700Bold' },

  centred:         { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: CREAM },
  verifyIconWrap:  { alignItems: 'center', paddingVertical: 16 },
  verifyHeading:   { fontSize: 22, fontWeight: '700', fontFamily: 'Inter_700Bold', color: '#1A1A2E', textAlign: 'center' },
  subtitle:        { fontSize: 15, fontFamily: 'Inter_400Regular', color: '#374151', textAlign: 'center', marginBottom: 8 },
  linkBtn:         { alignItems: 'center', paddingVertical: 12 },
  linkText:        { color: TEAL, fontSize: 15, fontFamily: 'Inter_600SemiBold', fontWeight: '600' },

  switchRow:   { flexDirection: 'row', justifyContent: 'center', marginTop: 16 },
  switchText:  { fontSize: 14, fontFamily: 'Inter_400Regular', color: '#6B7280' },
  switchLink:  { fontSize: 14, fontFamily: 'Inter_600SemiBold', fontWeight: '600', color: TEAL },
  error:       { fontSize: 13, color: '#E63946', fontFamily: 'Inter_400Regular', marginTop: 2 },
});
