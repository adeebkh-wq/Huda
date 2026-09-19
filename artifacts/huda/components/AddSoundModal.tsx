/**
 * AddSoundModal — lets caregivers (or children with help) add a custom
 * sound to the Sensory Music library.
 *
 * Two sources:
 *  - Direct URL — paste any publicly accessible MP3 / M4A / audio link.
 *  - Device file — pick an audio file from local storage via
 *    expo-document-picker.
 */

import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import { Audio } from 'expo-av';
import { Ionicons } from '@/components/IoniconsSVG';
import type { CalmingSound } from '@/data/calmingSounds';

interface Props {
  visible: boolean;
  onAdd: (sound: Omit<CalmingSound, 'icon' | 'color'> & { icon?: string; color?: string }) => void;
  onClose: () => void;
}

const ICON_OPTIONS = [
  { icon: 'musical-notes-outline', color: '#E91E63' },
  { icon: 'headset-outline',       color: '#3F51B5' },
  { icon: 'mic-outline',           color: '#009688' },
  { icon: 'star-outline',          color: '#FF9800' },
  { icon: 'heart-outline',         color: '#F44336' },
  { icon: 'moon-outline',          color: '#7B1FA2' },
];

export function AddSoundModal({ visible, onAdd, onClose }: Props) {
  const [name, setName]       = useState('');
  const [url, setUrl]         = useState('');
  const [iconIdx, setIconIdx] = useState(0);
  const [loading, setLoading] = useState(false);

  const reset = () => { setName(''); setUrl(''); setIconIdx(0); setLoading(false); };
  const cancel = () => { reset(); onClose(); };

  /* ── Pick file from device ──────────────────────────────────────────── */
  const pickFile = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['audio/*', 'audio/mpeg', 'audio/mp4', 'audio/x-m4a',
               'audio/wav', 'audio/ogg', 'audio/aac'],
        copyToCacheDirectory: true,
      });
      if (result.canceled) return;
      const asset = result.assets[0];
      setUrl(asset.uri);
      if (!name.trim()) setName(asset.name.replace(/\.[^.]+$/, ''));
    } catch {
      Alert.alert('Could not open file picker', 'Please enter a URL instead.');
    }
  };

  /* ── Validate & save ────────────────────────────────────────────────── */
  const handleSave = async () => {
    const trimName = name.trim();
    const trimUrl  = url.trim();

    if (!trimName) { Alert.alert('Please enter a name for this sound.'); return; }
    if (!trimUrl)  { Alert.alert('Please enter a URL or pick a file.'); return; }

    setLoading(true);
    // Quick sound-load probe to validate the URL / URI
    let probe: Audio.Sound | null = null;
    try {
      await Audio.setAudioModeAsync({ playsInSilentModeIOS: true, allowsRecordingIOS: false });
      const { sound } = await Audio.Sound.createAsync({ uri: trimUrl }, { shouldPlay: false });
      probe = sound;
    } catch {
      setLoading(false);
      Alert.alert(
        'Cannot load audio',
        'The URL or file could not be loaded. Make sure it points to a valid MP3 or M4A audio file.',
      );
      return;
    } finally {
      probe?.unloadAsync().catch(() => {});
    }

    setLoading(false);
    onAdd({
      id:          `custom_${Date.now()}`,
      name:        trimName,
      description: 'Custom sound',
      icon:        ICON_OPTIONS[iconIdx].icon,
      color:       ICON_OPTIONS[iconIdx].color,
      uri:         trimUrl,
      loop:        true,
      custom:      true,
    });
    reset();
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={cancel}>
      <TouchableWithoutFeedback onPress={cancel}>
        <View style={styles.overlay} />
      </TouchableWithoutFeedback>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.sheet}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Add Custom Sound</Text>
          <Pressable onPress={cancel} hitSlop={12}>
            <Ionicons name="close" size={24} color="#90A4AE" />
          </Pressable>
        </View>

        {/* Sound name */}
        <Text style={styles.label}>Sound Name</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g. My Playlist"
          placeholderTextColor="#546E7A"
          value={name}
          onChangeText={setName}
          maxLength={50}
        />

        {/* URL */}
        <Text style={styles.label}>Audio URL  <Text style={styles.labelSub}>(MP3, M4A, WAV…)</Text></Text>
        <TextInput
          style={[styles.input, styles.urlInput]}
          placeholder="https://example.com/sound.mp3"
          placeholderTextColor="#546E7A"
          value={url}
          onChangeText={setUrl}
          autoCapitalize="none"
          autoCorrect={false}
          keyboardType="url"
        />

        {/* Pick from device */}
        <Pressable
          onPress={pickFile}
          style={({ pressed }) => [styles.pickBtn, { opacity: pressed ? 0.7 : 1 }]}
        >
          <Ionicons name="folder-open-outline" size={18} color="#2A9D8F" />
          <Text style={styles.pickBtnText}>Or pick a file from this device</Text>
        </Pressable>

        {/* Icon chooser */}
        <Text style={styles.label}>Icon</Text>
        <View style={styles.iconRow}>
          {ICON_OPTIONS.map((opt, i) => (
            <Pressable
              key={opt.icon}
              onPress={() => setIconIdx(i)}
              style={[
                styles.iconOption,
                { backgroundColor: opt.color + (iconIdx === i ? 'CC' : '33') },
                iconIdx === i && styles.iconOptionSelected,
              ]}
            >
              <Ionicons name={opt.icon as any} size={22} color={iconIdx === i ? '#fff' : opt.color} />
            </Pressable>
          ))}
        </View>

        {/* Save / Cancel */}
        <View style={styles.actions}>
          <Pressable
            onPress={cancel}
            style={({ pressed }) => [styles.cancelBtn, { opacity: pressed ? 0.7 : 1 }]}
          >
            <Text style={styles.cancelText}>Cancel</Text>
          </Pressable>

          <Pressable
            onPress={handleSave}
            disabled={loading}
            style={({ pressed }) => [styles.saveBtn, { opacity: pressed || loading ? 0.7 : 1 }]}
          >
            {loading
              ? <ActivityIndicator color="#fff" size="small" />
              : <Text style={styles.saveText}>Save Sound</Text>}
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.55)',
  },
  sheet: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#152232',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    paddingBottom: 40,
    gap: 8,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  title: {
    color: '#E0F0FF',
    fontSize: 18,
    fontWeight: '700',
    fontFamily: 'Inter_700Bold',
  },
  label: {
    color: '#90A4AE',
    fontSize: 12,
    fontWeight: '600',
    fontFamily: 'Inter_600SemiBold',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginTop: 8,
  },
  labelSub: {
    color: '#546E7A',
    fontWeight: '400',
    textTransform: 'none',
    letterSpacing: 0,
  },
  input: {
    backgroundColor: '#1C2E40',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    color: '#E0F0FF',
    fontSize: 15,
    fontFamily: 'Inter_400Regular',
    borderWidth: 1,
    borderColor: '#263B50',
  },
  urlInput: {
    fontSize: 13,
  },
  pickBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 4,
  },
  pickBtnText: {
    color: '#2A9D8F',
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
  },
  iconRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 4,
  },
  iconOption: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconOptionSelected: {
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 4,
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 16,
  },
  cancelBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
    backgroundColor: '#1C2E40',
    borderWidth: 1,
    borderColor: '#263B50',
  },
  cancelText: {
    color: '#90A4AE',
    fontWeight: '600',
    fontFamily: 'Inter_600SemiBold',
    fontSize: 15,
  },
  saveBtn: {
    flex: 2,
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
    backgroundColor: '#2A9D8F',
  },
  saveText: {
    color: '#fff',
    fontWeight: '700',
    fontFamily: 'Inter_700Bold',
    fontSize: 15,
  },
});
