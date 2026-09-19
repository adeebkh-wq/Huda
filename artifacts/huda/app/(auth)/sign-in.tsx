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
import { useAuth, useSignIn } from '@clerk/expo';
import { Ionicons } from '@/components/IoniconsSVG';
import { markAuthCached } from '@/context/OfflineAuthContext';

const TEAL = '#2A9D8F';
const CREAM = '#F7F3EF';

type Step = 'password' | 'mfa' | 'forgot-email' | 'forgot-code';

export default function SignInScreen() {
  const { signIn, errors, fetchStatus } = useSignIn();
  const { isSignedIn } = useAuth();
  const insets = useSafeAreaInsets();

  const [step, setStep] = useState<Step>('password');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [localError, setLocalError] = useState('');
  const [finalising, setFinalising] = useState(false);

  // Let (auth)/_layout.tsx handle navigation — it redirects to /(tabs) once isSignedIn is true
  useEffect(() => {}, [isSignedIn]);

  const isLoading = fetchStatus === 'fetching';

  // ── Sign in with password ──
  const handleSignIn = async () => {
    if (!signIn) return;
    setLocalError('');
    const { error } = await signIn.password({ emailAddress: email, password });
    if (error) return;
    if (signIn.status === 'complete') {
      setFinalising(true);
      try {
        await signIn.finalize({ navigate: () => {} });
        markAuthCached().catch(() => {});
      } catch (_) {}
      // (auth)/_layout.tsx handles navigation when isSignedIn becomes true
    }
  };

  // ── MFA verification ──
  const handleVerifyMFA = async () => {
    if (!signIn) return;
    setLocalError('');
    await signIn.mfa.verifyEmailCode({ code });
    if (signIn.status === 'complete') {
      setFinalising(true);
      try {
        await signIn.finalize({ navigate: () => {} });
        markAuthCached().catch(() => {});
      } catch (_) {}
    }
  };

  // ── Forgot password: request reset code ──
  const handleRequestReset = async () => {
    if (!signIn || !email) return;
    setLocalError('');
    try {
      await signIn.create({
        strategy: 'reset_password_email_code',
        identifier: email,
      });
      setStep('forgot-code');
    } catch (err: any) {
      setLocalError(err?.errors?.[0]?.longMessage ?? err?.message ?? 'Could not send reset code. Check your email and try again.');
    }
  };

  // ── Forgot password: verify code + set new password ──
  // Clerk v3 Expo uses two separate calls:
  //   1. verifyResetPasswordEmailCode({ code })  → validates the OTP
  //   2. submitResetPassword({ password })        → sets the new password
  const handleResetPassword = async () => {
    if (!signIn || !code || !newPassword) return;
    setLocalError('');
    try {
      await (signIn as any).verifyResetPasswordEmailCode({ code });
      await (signIn as any).submitResetPassword({ password: newPassword });
      if (signIn.status === 'complete') {
        setFinalising(true);
        try {
          await signIn.finalize({ navigate: () => {} });
          markAuthCached().catch(() => {});
        } catch (_) {}
        // (auth)/_layout.tsx handles navigation when isSignedIn becomes true
      }
    } catch (err: any) {
      setLocalError(
        err?.errors?.[0]?.longMessage ??
        err?.message ??
        'Invalid code or password too weak. Please try again.',
      );
    }
  };

  // ── Spinner while finalising ──
  if (finalising) {
    return (
      <View style={styles.centred}>
        <ActivityIndicator size="large" color={TEAL} />
      </View>
    );
  }

  // ── MFA step ──
  if (step === 'mfa' || signIn?.status === 'needs_client_trust') {
    return (
      <View style={[styles.safeRoot, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
        <View style={styles.header}>
          <Pressable onPress={() => { signIn?.reset(); setStep('password'); }} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={24} color="#1A1A2E" />
          </Pressable>
          <Text style={styles.headerTitle}>Verify identity</Text>
          <View style={styles.headerSpacer} />
        </View>
        <ScrollView contentContainerStyle={styles.body} keyboardShouldPersistTaps="handled">
          <Text style={styles.subtitle}>Enter the code we sent to your email.</Text>
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
          {errors?.fields?.code && <Text style={styles.error}>{errors.fields.code.message}</Text>}
          <Pressable
            style={[styles.btnPrimary, (isLoading || !code) && styles.btnDisabled]}
            onPress={handleVerifyMFA}
            disabled={isLoading || !code}
          >
            {isLoading ? <ActivityIndicator color="#fff" /> : <Text style={styles.btnText}>Verify</Text>}
          </Pressable>
          <Pressable onPress={() => signIn?.mfa.sendEmailCode()} style={styles.linkBtn}>
            <Text style={styles.linkText}>Resend code</Text>
          </Pressable>
          <Pressable onPress={() => { signIn?.reset(); setStep('password'); }} style={styles.linkBtn}>
            <Text style={[styles.linkText, { color: '#9CA3AF' }]}>Start over</Text>
          </Pressable>
        </ScrollView>
      </View>
    );
  }

  // ── Forgot password: enter email ──
  if (step === 'forgot-email') {
    return (
      <KeyboardAvoidingView style={styles.flex1} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <View style={[styles.safeRoot, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
          <View style={styles.header}>
            <Pressable onPress={() => { setStep('password'); setLocalError(''); }} style={styles.backBtn}>
              <Ionicons name="arrow-back" size={24} color="#1A1A2E" />
            </Pressable>
            <Text style={styles.headerTitle}>Reset password</Text>
            <View style={styles.headerSpacer} />
          </View>
          <ScrollView contentContainerStyle={styles.body} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
            <View style={styles.verifyIconWrap}>
              <Ionicons name="lock-open-outline" size={48} color={TEAL} />
            </View>
            <Text style={styles.verifyHeading}>Forgot your password?</Text>
            <Text style={styles.subtitle}>
              No problem. Enter your email and we'll send you a reset code.
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
              autoFocus
            />
            {localError ? <Text style={styles.error}>{localError}</Text> : null}
            <Pressable
              style={[styles.btnPrimary, (isLoading || !email) && styles.btnDisabled]}
              onPress={handleRequestReset}
              disabled={isLoading || !email}
            >
              {isLoading
                ? <ActivityIndicator color="#fff" />
                : <Text style={styles.btnText}>Send reset code</Text>}
            </Pressable>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    );
  }

  // ── Forgot password: enter code + new password ──
  if (step === 'forgot-code') {
    return (
      <KeyboardAvoidingView style={styles.flex1} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <View style={[styles.safeRoot, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
          <View style={styles.header}>
            <Pressable onPress={() => { setStep('forgot-email'); setLocalError(''); setCode(''); }} style={styles.backBtn}>
              <Ionicons name="arrow-back" size={24} color="#1A1A2E" />
            </Pressable>
            <Text style={styles.headerTitle}>Reset password</Text>
            <View style={styles.headerSpacer} />
          </View>
          <ScrollView contentContainerStyle={styles.body} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
            <View style={styles.verifyIconWrap}>
              <Ionicons name="mail" size={48} color={TEAL} />
            </View>
            <Text style={styles.verifyHeading}>Check your inbox</Text>
            <Text style={styles.subtitle}>
              We sent a 6-digit code to {email}.{'\n'}Enter it below along with your new password.
            </Text>
            <Text style={styles.label}>Reset Code</Text>
            <TextInput
              style={styles.input}
              value={code}
              onChangeText={setCode}
              placeholder="Enter 6-digit code"
              placeholderTextColor="#9CA3AF"
              keyboardType="number-pad"
              autoFocus
            />
            <Text style={styles.label}>New Password</Text>
            <View style={styles.passwordRow}>
              <TextInput
                style={[styles.input, styles.passwordInput]}
                value={newPassword}
                onChangeText={setNewPassword}
                placeholder="At least 8 characters"
                placeholderTextColor="#9CA3AF"
                secureTextEntry={!showNewPassword}
                autoComplete="new-password"
              />
              <Pressable style={styles.eyeBtn} onPress={() => setShowNewPassword(v => !v)}>
                <Ionicons name={showNewPassword ? 'eye-off' : 'eye'} size={20} color="#6B7280" />
              </Pressable>
            </View>
            {localError ? <Text style={styles.error}>{localError}</Text> : null}
            <Pressable
              style={[styles.btnPrimary, (isLoading || !code || !newPassword) && styles.btnDisabled]}
              onPress={handleResetPassword}
              disabled={isLoading || !code || !newPassword}
            >
              {isLoading
                ? <ActivityIndicator color="#fff" />
                : <Text style={styles.btnText}>Set new password</Text>}
            </Pressable>
            <Pressable onPress={handleRequestReset} style={styles.linkBtn}>
              <Text style={styles.linkText}>Resend code</Text>
            </Pressable>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    );
  }

  // ── Password step (default) ──
  return (
    <KeyboardAvoidingView style={styles.flex1} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <View style={[styles.safeRoot, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
        <View style={styles.header}>
          <View style={styles.backBtn} />
          <Text style={styles.headerTitle}>Welcome back</Text>
          <View style={styles.headerSpacer} />
        </View>
        <ScrollView contentContainerStyle={styles.body} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
          <View style={styles.logoRow}>
            <Image source={require('@/assets/images/logo.png')} style={styles.logoImg} resizeMode="contain" />
            <View>
              <Text style={styles.brandName}>Huda</Text>
              <Text style={styles.brandSub}>Caregiver Account</Text>
            </View>
          </View>

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
          {errors?.fields?.identifier && <Text style={styles.error}>{errors.fields.identifier.message}</Text>}

          <View style={styles.labelRow}>
            <Text style={styles.label}>Password</Text>
            <Pressable onPress={() => { setStep('forgot-email'); setLocalError(''); }}>
              <Text style={styles.forgotLink}>Forgot password?</Text>
            </Pressable>
          </View>
          <View style={styles.passwordRow}>
            <TextInput
              style={[styles.input, styles.passwordInput]}
              value={password}
              onChangeText={setPassword}
              placeholder="Your password"
              placeholderTextColor="#9CA3AF"
              secureTextEntry={!showPassword}
              autoComplete="password"
            />
            <Pressable style={styles.eyeBtn} onPress={() => setShowPassword(v => !v)}>
              <Ionicons name={showPassword ? 'eye-off' : 'eye'} size={20} color="#6B7280" />
            </Pressable>
          </View>
          {errors?.fields?.password && <Text style={styles.error}>{errors.fields.password.message}</Text>}

          <Pressable
            style={[styles.btnPrimary, (isLoading || !email || !password) && styles.btnDisabled]}
            onPress={handleSignIn}
            disabled={isLoading || !email || !password}
          >
            {isLoading ? <ActivityIndicator color="#fff" /> : <Text style={styles.btnText}>Sign in</Text>}
          </Pressable>

          <View style={styles.switchRow}>
            <Text style={styles.switchText}>Don't have an account? </Text>
            <Pressable onPress={() => { /* (auth)/_layout.tsx + router handled at nav level */ require('expo-router').router.replace('/(auth)/sign-up'); }}>
              <Text style={styles.switchLink}>Sign up</Text>
            </Pressable>
          </View>
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex1:    { flex: 1 },
  safeRoot: { flex: 1, backgroundColor: CREAM },
  centred:  { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: CREAM },

  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 16, paddingVertical: 12, backgroundColor: CREAM,
  },
  backBtn:      { padding: 8, width: 40 },
  headerTitle:  { fontSize: 20, fontWeight: '700', fontFamily: 'Inter_700Bold', color: '#1A1A2E' },
  headerSpacer: { width: 40 },

  body: { paddingHorizontal: 24, paddingBottom: 32, gap: 8 },

  logoRow:   { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 8 },
  logoImg:   { width: 56, height: 56 },
  brandName: { fontSize: 24, fontWeight: '800', fontFamily: 'Inter_700Bold', color: '#1A1A2E' },
  brandSub:  { fontSize: 13, fontFamily: 'Inter_400Regular', color: '#6B7280' },

  labelRow: {
    flexDirection: 'row', alignItems: 'center',
    justifyContent: 'space-between', marginTop: 4,
  },
  label:      { fontSize: 14, fontWeight: '600', fontFamily: 'Inter_600SemiBold', color: '#374151' },
  forgotLink: { fontSize: 13, fontFamily: 'Inter_600SemiBold', fontWeight: '600', color: TEAL },

  input: {
    backgroundColor: '#fff', borderRadius: 14, borderWidth: 1.5, borderColor: '#E5E7EB',
    paddingHorizontal: 14, paddingVertical: 14,
    fontSize: 16, fontFamily: 'Inter_400Regular', color: '#1A1A2E',
  },
  passwordRow:   { position: 'relative' },
  passwordInput: { paddingRight: 48 },
  eyeBtn:        { position: 'absolute', right: 14, top: 14 },

  btnPrimary: {
    backgroundColor: TEAL, borderRadius: 16, paddingVertical: 16,
    alignItems: 'center', marginTop: 16, elevation: 4,
  },
  btnDisabled: { opacity: 0.5 },
  btnText:     { color: '#fff', fontSize: 17, fontWeight: '700', fontFamily: 'Inter_700Bold' },

  verifyIconWrap: { alignItems: 'center', paddingVertical: 16 },
  verifyHeading:  { fontSize: 22, fontWeight: '700', fontFamily: 'Inter_700Bold', color: '#1A1A2E', textAlign: 'center' },
  subtitle:  { fontSize: 15, fontFamily: 'Inter_400Regular', color: '#374151', textAlign: 'center', marginBottom: 8 },
  linkBtn:   { alignItems: 'center', paddingVertical: 8 },
  linkText:  { color: TEAL, fontSize: 15, fontFamily: 'Inter_600SemiBold', fontWeight: '600' },

  switchRow:  { flexDirection: 'row', justifyContent: 'center', marginTop: 16 },
  switchText: { fontSize: 14, fontFamily: 'Inter_400Regular', color: '#6B7280' },
  switchLink: { fontSize: 14, fontFamily: 'Inter_600SemiBold', fontWeight: '600', color: TEAL },
  error:      { fontSize: 13, color: '#E63946', fontFamily: 'Inter_400Regular', marginTop: 2 },
});
