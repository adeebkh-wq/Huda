import React, { useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@/components/IoniconsSVG';
import { useLocalAdmin } from '@/context/LocalAdminContext';

export default function LocalAdminScreen() {
  const insets = useSafeAreaInsets();
  const {
    isConfigured,
    createLocalAdmin,
    signInLocalAdmin,
  } = useLocalAdmin();
  const [name, setName] = useState('');
  const [pin, setPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [error, setError] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const submit = async () => {
    setError('');
    if (!isConfigured && name.trim().length < 2) {
      setError('Enter the caregiver or administrator name.');
      return;
    }
    if (!/^\d{4,8}$/.test(pin)) {
      setError('Use a PIN containing 4 to 8 digits.');
      return;
    }
    if (!isConfigured && pin !== confirmPin) {
      setError('The PINs do not match.');
      return;
    }

    setIsSaving(true);
    try {
      if (isConfigured) {
        const valid = await signInLocalAdmin(pin);
        if (!valid) {
          setError('Incorrect PIN.');
          return;
        }
      } else {
        await createLocalAdmin(name, pin);
      }
      // Route guards react to the local session; no manual replace is needed.
    } catch {
      setError('The local account could not be saved. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <View style={[styles.root, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} style={styles.backButton} accessibilityLabel="Go back">
            <Ionicons name="arrow-back" size={24} color="#1A1A2E" />
          </Pressable>
          <Text style={styles.headerTitle}>{isConfigured ? 'Local sign in' : 'Local caregiver setup'}</Text>
          <View style={styles.headerSpacer} />
        </View>

        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <View style={styles.iconCircle}>
            <Ionicons name="shield-checkmark" size={38} color="#2A9D8F" />
          </View>
          <Text style={styles.title}>
            {isConfigured ? 'Welcome back' : 'Use Huda without email'}
          </Text>
          <Text style={styles.subtitle}>
            {isConfigured
              ? 'Enter your device PIN. This account works only on this device.'
              : 'Create a device-only caregiver account. Your name and secured PIN stay on this device and no email is required.'}
          </Text>

          {!isConfigured && (
            <>
              <Text style={styles.label}>Caregiver name</Text>
              <TextInput
                value={name}
                onChangeText={setName}
                style={styles.input}
                placeholder="e.g. Parent or Therapist"
                placeholderTextColor="#9CA3AF"
                autoCapitalize="words"
                maxLength={40}
              />
            </>
          )}

          <Text style={styles.label}>{isConfigured ? 'PIN' : 'Create PIN'}</Text>
          <TextInput
            value={pin}
            onChangeText={(value) => setPin(value.replace(/\D/g, '').slice(0, 8))}
            style={styles.input}
            placeholder="4–8 digits"
            placeholderTextColor="#9CA3AF"
            keyboardType="number-pad"
            secureTextEntry
            maxLength={8}
          />

          {!isConfigured && (
            <>
              <Text style={styles.label}>Confirm PIN</Text>
              <TextInput
                value={confirmPin}
                onChangeText={(value) => setConfirmPin(value.replace(/\D/g, '').slice(0, 8))}
                style={styles.input}
                placeholder="Enter the PIN again"
                placeholderTextColor="#9CA3AF"
                keyboardType="number-pad"
                secureTextEntry
                maxLength={8}
              />
            </>
          )}

          {error ? <Text style={styles.error}>{error}</Text> : null}

          <Pressable
            onPress={submit}
            disabled={isSaving}
            style={({ pressed }) => [styles.primaryButton, (pressed || isSaving) && styles.pressed]}
          >
            {isSaving
              ? <ActivityIndicator color="#FFFFFF" />
              : <Text style={styles.primaryText}>{isConfigured ? 'Sign in locally' : 'Create local account'}</Text>}
          </Pressable>

          <View style={styles.note}>
            <Ionicons name="information-circle-outline" size={18} color="#526475" />
            <Text style={styles.noteText}>
              Local accounts do not sync across devices and cannot be recovered by email. Keep your PIN somewhere safe.
            </Text>
          </View>
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  root: { flex: 1, backgroundColor: '#F7F3EF' },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12 },
  backButton: { width: 40, padding: 8 },
  headerSpacer: { width: 40 },
  headerTitle: { flex: 1, textAlign: 'center', fontSize: 19, color: '#1A1A2E', fontFamily: 'Inter_700Bold' },
  content: { padding: 24, paddingBottom: 40 },
  iconCircle: { alignSelf: 'center', width: 76, height: 76, borderRadius: 38, alignItems: 'center', justifyContent: 'center', backgroundColor: '#DDF3EF', marginTop: 12 },
  title: { marginTop: 18, textAlign: 'center', fontSize: 27, color: '#1A1A2E', fontFamily: 'Inter_700Bold' },
  subtitle: { marginTop: 10, marginBottom: 24, textAlign: 'center', fontSize: 15, lineHeight: 22, color: '#526475', fontFamily: 'Inter_400Regular' },
  label: { marginTop: 12, marginBottom: 7, fontSize: 13, color: '#374151', fontFamily: 'Inter_600SemiBold' },
  input: { borderWidth: 1, borderColor: '#D6DADF', borderRadius: 14, backgroundColor: '#FFFFFF', paddingHorizontal: 16, paddingVertical: 14, fontSize: 16, color: '#1A1A2E', fontFamily: 'Inter_400Regular' },
  error: { marginTop: 12, color: '#C93642', fontSize: 13, fontFamily: 'Inter_500Medium' },
  primaryButton: { marginTop: 22, minHeight: 54, borderRadius: 16, alignItems: 'center', justifyContent: 'center', backgroundColor: '#2A9D8F' },
  primaryText: { color: '#FFFFFF', fontSize: 16, fontFamily: 'Inter_700Bold' },
  pressed: { opacity: 0.75 },
  note: { flexDirection: 'row', gap: 8, marginTop: 20, padding: 14, borderRadius: 14, backgroundColor: '#E9ECEF' },
  noteText: { flex: 1, color: '#526475', fontSize: 12, lineHeight: 18, fontFamily: 'Inter_400Regular' },
});