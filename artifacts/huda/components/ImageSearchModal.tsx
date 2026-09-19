import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  Keyboard,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import * as FileSystem from 'expo-file-system';
import { Ionicons } from '@/components/IoniconsSVG';
import { useColors } from '@/hooks/useColors';

interface ImageResult {
  id: string;
  thumbUrl: string;
  fullUrl: string;
  author: string;
}

interface Props {
  visible: boolean;
  tileLabel: string;
  onSelect: (localUri: string) => void;
  onCancel: () => void;
  pixabayKey?: string; // optional — set in Caregiver > Settings
}

// Uses Pixabay if a key is provided; falls back to Wikimedia Commons (open, no key).
async function searchPixabay(query: string, key: string): Promise<ImageResult[]> {
  const url = `https://pixabay.com/api/?key=${key}&q=${encodeURIComponent(query)}&image_type=photo&safesearch=true&per_page=20`;
  const res = await fetch(url);
  const json = await res.json();
  return (json.hits ?? []).map((h: any) => ({
    id: String(h.id),
    thumbUrl: h.webformatURL,
    fullUrl:  h.webformatURL,
    author:   h.user,
  }));
}

async function searchWikimedia(query: string): Promise<ImageResult[]> {
  // Use URLSearchParams so | and other special chars are properly encoded
  const params = new URLSearchParams({
    action:       'query',
    generator:    'search',
    gsrnamespace: '6',         // File: namespace
    gsrsearch:    query,
    gsrlimit:     '20',
    prop:         'imageinfo',
    iiprop:       'url|thumburl',
    iiurlwidth:   '300',
    format:       'json',
    origin:       '*',
  });
  const url = `https://commons.wikimedia.org/w/api.php?${params.toString()}`;
  const res  = await fetch(url, {
    headers: { 'User-Agent': 'HudaAAC/1.0 (https://huda.app)' },
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const json = await res.json();
  const pages = Object.values(json?.query?.pages ?? {}) as any[];
  return pages
    .filter((p: any) => p?.imageinfo?.[0]?.url)
    .slice(0, 20)
    .map((p: any, i: number) => ({
      id:       String(p.pageid ?? i),
      thumbUrl: p.imageinfo[0].thumburl ?? p.imageinfo[0].url,
      fullUrl:  p.imageinfo[0].url,
      author:   'Wikimedia Commons',
    }));
}

export function ImageSearchModal({ visible, tileLabel, onSelect, onCancel, pixabayKey }: Props) {
  const colors = useColors();
  const [query, setQuery]   = useState(tileLabel);
  const [results, setResults] = useState<ImageResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [downloading, setDownloading] = useState<string | null>(null);
  const inputRef = useRef<TextInput>(null);

  useEffect(() => {
    if (visible) { setQuery(tileLabel); setResults([]); }
  }, [visible, tileLabel]);

  const doSearch = useCallback(async () => {
    if (!query.trim()) return;
    Keyboard.dismiss();
    setLoading(true);
    setResults([]);
    try {
      const items = pixabayKey
        ? await searchPixabay(query.trim(), pixabayKey)
        : await searchWikimedia(query.trim());
      setResults(items);
    } catch {
      Alert.alert('Search failed', 'Check your internet connection and try again.');
    } finally {
      setLoading(false);
    }
  }, [query, pixabayKey]);

  const handlePick = async (item: ImageResult) => {
    setDownloading(item.id);
    try {
      const ext  = item.fullUrl.split('.').pop()?.split('?')[0] ?? 'jpg';
      const dest = `${FileSystem.documentDirectory}tile_${Date.now()}.${ext}`;
      const dl   = await FileSystem.downloadAsync(item.fullUrl, dest);
      onSelect(dl.uri);
    } catch {
      Alert.alert('Download failed', 'Could not download the image. Try another one.');
    } finally {
      setDownloading(null);
    }
  };

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onCancel}>
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        {/* Header */}
        <View style={[styles.header, { backgroundColor: colors.card, borderBottomColor: colors.border }]}>
          <Pressable onPress={onCancel} style={({ pressed }) => [styles.closeBtn, { opacity: pressed ? 0.6 : 1 }]}>
            <Ionicons name="close" size={24} color={colors.foreground} />
          </Pressable>
          <Text style={[styles.title, { color: colors.foreground }]}>Search Pictures</Text>
          <View style={{ width: 40 }} />
        </View>

        {/* Search bar */}
        <View style={[styles.searchBar, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Ionicons name="search" size={18} color={colors.mutedForeground} />
          <TextInput
            ref={inputRef}
            style={[styles.searchInput, { color: colors.foreground }]}
            value={query}
            onChangeText={setQuery}
            placeholder={`Search for "${tileLabel}"…`}
            placeholderTextColor={colors.mutedForeground}
            returnKeyType="search"
            onSubmitEditing={doSearch}
            autoCorrect={false}
          />
          {query.length > 0 && (
            <Pressable onPress={() => setQuery('')}>
              <Ionicons name="close-circle" size={18} color={colors.mutedForeground} />
            </Pressable>
          )}
        </View>

        <Pressable onPress={doSearch} style={[styles.searchBtn, { backgroundColor: colors.primary }]}>
          <Ionicons name="search" size={18} color="#fff" />
          <Text style={styles.searchBtnText}>Search</Text>
        </Pressable>

        {!pixabayKey && (
          <View style={[styles.notice, { backgroundColor: colors.secondary, borderColor: colors.border }]}>
            <Ionicons name="information-circle-outline" size={16} color={colors.mutedForeground} />
            <Text style={[styles.noticeText, { color: colors.mutedForeground }]}>
              Using Wikimedia Commons (open). Add a free Pixabay API key in Settings for better results.
            </Text>
          </View>
        )}

        {loading && (
          <View style={styles.center}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={[styles.loadingText, { color: colors.mutedForeground }]}>Searching…</Text>
          </View>
        )}

        {!loading && results.length === 0 && (
          <View style={styles.center}>
            <Ionicons name="images-outline" size={48} color={colors.border} />
            <Text style={[styles.emptyText, { color: colors.mutedForeground }]}>
              {query !== tileLabel ? 'No results. Try a different search.' : 'Search for a picture to add to this tile.'}
            </Text>
          </View>
        )}

        {!loading && results.length > 0 && (
          <FlatList
            data={results}
            numColumns={3}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.grid}
            renderItem={({ item }) => (
              <Pressable
                onPress={() => handlePick(item)}
                style={({ pressed }) => [styles.gridItem, { opacity: pressed ? 0.7 : 1 }]}
                disabled={downloading !== null}
              >
                <Image source={{ uri: item.thumbUrl }} style={styles.gridImg} resizeMode="cover" />
                {downloading === item.id && (
                  <View style={styles.gridOverlay}>
                    <ActivityIndicator color="#fff" />
                  </View>
                )}
              </Pressable>
            )}
          />
        )}
      </View>
    </Modal>
  );
}

const ITEM_SIZE = (Platform.OS === 'web' ? 380 : 340) / 3 - 8;

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 16, paddingTop: Platform.OS === 'web' ? 72 : 52, paddingBottom: 12, borderBottomWidth: 1,
  },
  closeBtn: { padding: 4, width: 40 },
  title: { fontSize: 18, fontWeight: '700', fontFamily: 'Inter_700Bold' },
  searchBar: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    margin: 12, paddingHorizontal: 14, paddingVertical: 10,
    borderRadius: 14, borderWidth: 1,
  },
  searchInput: { flex: 1, fontSize: 15, fontFamily: 'Inter_400Regular' },
  searchBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    marginHorizontal: 12, paddingVertical: 12, borderRadius: 14, justifyContent: 'center',
  },
  searchBtnText: { color: '#fff', fontSize: 15, fontWeight: '700', fontFamily: 'Inter_700Bold' },
  notice: {
    flexDirection: 'row', gap: 8, alignItems: 'flex-start',
    marginHorizontal: 12, marginTop: 4, padding: 10, borderRadius: 10, borderWidth: 1,
  },
  noticeText: { flex: 1, fontSize: 12, fontFamily: 'Inter_400Regular', lineHeight: 17 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12 },
  loadingText: { fontSize: 14, fontFamily: 'Inter_400Regular' },
  emptyText: { fontSize: 14, fontFamily: 'Inter_400Regular', textAlign: 'center', paddingHorizontal: 32 },
  grid: { padding: 8, gap: 4 },
  gridItem: { width: ITEM_SIZE, height: ITEM_SIZE, margin: 3, borderRadius: 10, overflow: 'hidden' },
  gridImg: { width: '100%', height: '100%' },
  gridOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.45)',
    alignItems: 'center', justifyContent: 'center',
  },
});
