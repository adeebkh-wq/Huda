import React, { useEffect, useState } from 'react';
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@/components/IoniconsSVG';
import { useColors } from '@/hooks/useColors';
import { AudioRecorderModal } from '@/components/AudioRecorderModal';
import { ImageSearchModal } from '@/components/ImageSearchModal';
import type { Tile } from '@/data/defaultBoards';
import { TILE_COLORS } from '@/data/defaultBoards';
import { persistTileImage } from '@/lib/tileImageStorage';

interface Props {
  visible: boolean;
  tile: Tile | null;          // null = new tile (add mode)
  boardId: string;
  pixabayKey?: string;
  onSave: (updates: Partial<Tile>) => void;
  onDelete?: () => void;
  onCancel: () => void;
}

const CATEGORY_COLORS = Object.values(TILE_COLORS);

export function CustomTileModal({ visible, tile, boardId, pixabayKey, onSave, onDelete, onCancel }: Props) {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const [label,      setLabel]      = useState('');
  const [imageUri,   setImageUri]   = useState<string | undefined>();
  const [audioUri,   setAudioUri]   = useState<string | undefined>();
  const [tileColor,  setTileColor]  = useState<string>(TILE_COLORS.core);
  const [showAudio,  setShowAudio]  = useState(false);
  const [showSearch, setShowSearch] = useState(false);

  // Sync when tile prop changes
  useEffect(() => {
    if (visible) {
      setLabel(tile?.label ?? '');
      setImageUri(tile?.imageUri);
      setAudioUri(tile?.audioUri);
      setTileColor(tile?.color ?? TILE_COLORS.core);
    }
  }, [visible, tile]);

  const pickFromGallery = async () => {
    const { granted } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!granted) { Alert.alert('Permission needed', 'Allow photo library access in Settings.'); return; }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.85,
    });
    if (!result.canceled && result.assets[0]) {
      try {
        setImageUri(await persistTileImage(result.assets[0].uri, result.assets[0].mimeType));
      } catch {
        Alert.alert('Picture not saved', 'Huda could not save that picture. Please choose another one.');
      }
    }
  };

  const pickFromCamera = async () => {
    const { granted } = await ImagePicker.requestCameraPermissionsAsync();
    if (!granted) { Alert.alert('Permission needed', 'Allow camera access in Settings.'); return; }
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.85,
    });
    if (!result.canceled && result.assets[0]) {
      try {
        setImageUri(await persistTileImage(result.assets[0].uri, result.assets[0].mimeType));
      } catch {
        Alert.alert('Picture not saved', 'Huda could not save that picture. Please take another photo.');
      }
    }
  };

  const handleSave = () => {
    if (!label.trim()) { Alert.alert('Label required', 'Please enter a word for this tile.'); return; }
    onSave({
      label:    label.trim(),
      imageUri: imageUri,
      audioUri: audioUri,
      color:    tileColor,
      boardId,
      isCustom: true,
    });
  };

  const handleDelete = () => {
    Alert.alert('Remove tile?', 'This tile will be removed from the board.', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Remove', style: 'destructive', onPress: onDelete },
    ]);
  };

  return (
    <>
      <Modal
        visible={visible}
        transparent
        animationType="slide"
        onRequestClose={onCancel}
        statusBarTranslucent
      >
        <KeyboardAvoidingView
          style={styles.kvFlex}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <View style={styles.backdrop}>
            <View style={[
              styles.sheet,
              {
                backgroundColor: colors.card,
                borderColor: colors.border,
                paddingBottom: Platform.OS === 'web' ? 36 : Math.max(32, insets.bottom + 20),
              },
            ]}>
            {/* Handle */}
            <View style={[styles.handle, { backgroundColor: colors.border }]} />

            <Text style={[styles.title, { color: colors.foreground }]}>
              {tile?.isCustom ? 'Edit Tile' : tile ? 'Customise Tile' : 'New Tile'}
            </Text>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ gap: 16 }}>
              {/* Preview + image picker */}
              <View style={styles.previewRow}>
                <View style={[styles.preview, { backgroundColor: tileColor }]}>
                  {imageUri ? (
                    <Image source={{ uri: imageUri }} style={styles.previewImg} resizeMode="cover" />
                  ) : (
                    <Ionicons name="image-outline" size={36} color="rgba(255,255,255,0.7)" />
                  )}
                  <Text style={styles.previewLabel} numberOfLines={2}>{label || 'Label'}</Text>
                </View>

                <View style={styles.imageBtns}>
                  <ImgBtn icon="camera" label="Camera" onPress={pickFromCamera} colors={colors} />
                  <ImgBtn icon="images" label="Gallery" onPress={pickFromGallery} colors={colors} />
                  <ImgBtn icon="search" label="Internet" onPress={() => setShowSearch(true)} colors={colors} />
                  {imageUri && (
                    <ImgBtn icon="trash-outline" label="Remove" onPress={() => setImageUri(undefined)} colors={colors} danger />
                  )}
                </View>
              </View>

              {/* Label */}
              <View style={styles.field}>
                <Text style={[styles.fieldLabel, { color: colors.mutedForeground }]}>WORD / LABEL</Text>
                <TextInput
                  style={[styles.textInput, { color: colors.foreground, backgroundColor: colors.secondary, borderColor: colors.border }]}
                  value={label}
                  onChangeText={setLabel}
                  placeholder="e.g. Grandma"
                  placeholderTextColor={colors.mutedForeground}
                  maxLength={20}
                  autoCorrect={false}
                />
              </View>

              {/* Color picker */}
              <View style={styles.field}>
                <Text style={[styles.fieldLabel, { color: colors.mutedForeground }]}>TILE COLOUR</Text>
                <View style={styles.colorRow}>
                  {CATEGORY_COLORS.map((c) => (
                    <Pressable
                      key={c}
                      onPress={() => setTileColor(c)}
                      style={[styles.colorDot, { backgroundColor: c, borderWidth: tileColor === c ? 3 : 0, borderColor: colors.foreground }]}
                    />
                  ))}
                </View>
              </View>

              {/* Audio */}
              <View style={styles.field}>
                <Text style={[styles.fieldLabel, { color: colors.mutedForeground }]}>SOUND</Text>
                <Pressable
                  onPress={() => setShowAudio(true)}
                  style={[styles.audioBtn, { backgroundColor: audioUri ? '#2A9D8F22' : colors.secondary, borderColor: audioUri ? '#2A9D8F' : colors.border }]}
                >
                  <Ionicons name={audioUri ? 'mic' : 'mic-outline'} size={20} color={audioUri ? '#2A9D8F' : colors.mutedForeground} />
                  <Text style={[styles.audioBtnText, { color: audioUri ? '#2A9D8F' : colors.mutedForeground }]}>
                    {audioUri ? 'Custom audio recorded ✓  Tap to re-record' : 'Record custom sound from mic'}
                  </Text>
                  {audioUri && (
                    <Pressable onPress={() => setAudioUri(undefined)}>
                      <Ionicons name="close-circle" size={18} color={colors.mutedForeground} />
                    </Pressable>
                  )}
                </Pressable>
                <Text style={[styles.audioNote, { color: colors.mutedForeground }]}>
                  If no audio is recorded, the app will speak the label aloud.
                </Text>
              </View>
            </ScrollView>

            {/* Footer */}
            <View style={styles.footer}>
              {onDelete && (
                <Pressable onPress={handleDelete} style={[styles.footerBtn, { backgroundColor: '#E6394620', borderWidth: 1, borderColor: '#E6394640' }]}>
                  <Ionicons name="trash-outline" size={18} color="#E63946" />
                </Pressable>
              )}
              <Pressable onPress={onCancel} style={[styles.footerBtn, { flex: 1, backgroundColor: colors.secondary }]}>
                <Text style={[styles.footerBtnText, { color: colors.mutedForeground }]}>Cancel</Text>
              </Pressable>
              <Pressable onPress={handleSave} style={[styles.footerBtn, { flex: 2, backgroundColor: colors.primary }]}>
                <Ionicons name="checkmark" size={18} color="#fff" />
                <Text style={[styles.footerBtnText, { color: '#fff' }]}>Save Tile</Text>
              </Pressable>
            </View>
          </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      <AudioRecorderModal
        visible={showAudio}
        tileLabel={label || tile?.label || 'tile'}
        onSave={(uri) => { setAudioUri(uri); setShowAudio(false); }}
        onCancel={() => setShowAudio(false)}
      />

      <ImageSearchModal
        visible={showSearch}
        tileLabel={label || tile?.label || ''}
        pixabayKey={pixabayKey}
        onSelect={(uri) => { setImageUri(uri); setShowSearch(false); }}
        onCancel={() => setShowSearch(false)}
      />
    </>
  );
}

function ImgBtn({ icon, label, onPress, colors, danger }: { icon: string; label: string; onPress: () => void; colors: any; danger?: boolean }) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.imgBtn, { backgroundColor: danger ? '#E6394620' : colors.secondary, borderColor: danger ? '#E6394650' : colors.border, opacity: pressed ? 0.7 : 1 }]}
    >
      <Ionicons name={icon as any} size={18} color={danger ? '#E63946' : colors.mutedForeground} />
      <Text style={[styles.imgBtnText, { color: danger ? '#E63946' : colors.mutedForeground }]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  kvFlex: { flex: 1 },
  backdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  sheet: {
    borderTopLeftRadius: 28, borderTopRightRadius: 28, borderWidth: 1,
    padding: 20, gap: 16, maxHeight: '92%',
  },
  handle: { width: 40, height: 4, borderRadius: 2, alignSelf: 'center', marginBottom: 4 },
  title: { fontSize: 20, fontWeight: '700', fontFamily: 'Inter_700Bold', textAlign: 'center' },
  previewRow: { flexDirection: 'row', gap: 16, alignItems: 'flex-start' },
  preview: {
    width: 110, height: 110, borderRadius: 18, alignItems: 'center', justifyContent: 'center',
    gap: 4, padding: 6, overflow: 'hidden',
    shadowColor: '#000', shadowOpacity: 0.15, shadowRadius: 6, shadowOffset: { width: 0, height: 3 }, elevation: 4,
  },
  previewImg: { ...StyleSheet.absoluteFillObject, width: '100%', height: '80%' },
  previewLabel: { color: '#fff', fontSize: 12, fontWeight: '700', textAlign: 'center', fontFamily: 'Inter_700Bold', textShadowColor: 'rgba(0,0,0,0.4)', textShadowOffset: { width: 0, height: 1 }, textShadowRadius: 3 },
  imageBtns: { flex: 1, gap: 8 },
  imgBtn: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingVertical: 9, paddingHorizontal: 12, borderRadius: 12, borderWidth: 1 },
  imgBtnText: { fontSize: 13, fontFamily: 'Inter_500Medium' },
  field: { gap: 6 },
  fieldLabel: { fontSize: 11, fontWeight: '700', fontFamily: 'Inter_700Bold', letterSpacing: 0.8 },
  textInput: { borderRadius: 12, borderWidth: 1, paddingHorizontal: 14, paddingVertical: 12, fontSize: 16, fontFamily: 'Inter_400Regular' },
  colorRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, paddingVertical: 4 },
  colorDot: { width: 32, height: 32, borderRadius: 16 },
  audioBtn: { flexDirection: 'row', alignItems: 'center', gap: 10, padding: 14, borderRadius: 14, borderWidth: 1 },
  audioBtnText: { flex: 1, fontSize: 14, fontFamily: 'Inter_400Regular' },
  audioNote: { fontSize: 12, fontFamily: 'Inter_400Regular' },
  footer: { flexDirection: 'row', gap: 8, marginTop: 4 },
  footerBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, paddingVertical: 14, borderRadius: 14 },
  footerBtnText: { fontSize: 15, fontWeight: '700', fontFamily: 'Inter_700Bold' },
});
