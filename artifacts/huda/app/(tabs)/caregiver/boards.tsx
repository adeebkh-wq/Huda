import React, { useState } from 'react';
import {
  Image,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@/components/IoniconsSVG';
import * as Haptics from 'expo-haptics';
import { useColors } from '@/hooks/useColors';
import { useApp } from '@/context/AppContext';
import { useCaregiver } from '@/context/CaregiverContext';
import { translateLabel } from '@/data/translations';
import { CustomTileModal } from '@/components/CustomTileModal';
import { TILE_COLORS, type Tile } from '@/data/defaultBoards';
import TILE_IMAGES from '@/assets/tileImages';

export default function BoardsScreen() {
  const colors  = useColors();
  const insets  = useSafeAreaInsets();
  const { boards, setTileCustomization, clearTileCustomization, addCustomTile, removeCustomTile, appLanguage } = useApp();
  const t = (key: string) => translateLabel(key, appLanguage);
  const { settings } = useCaregiver();
  const topPad    = Platform.OS === 'web' ? Math.max(insets.top, 67) : insets.top;
  const bottomPad = Platform.OS === 'web' ? 34 : Math.max(insets.bottom, 80);

  const [selectedBoardId, setSelectedBoardId] = useState(boards[0]?.id ?? 'core');
  const [editingTile, setEditingTile]         = useState<Tile | null>(null);
  const [modalMode, setModalMode]             = useState<'edit' | 'new'>('edit');
  const [showModal, setShowModal]             = useState(false);

  const selectedBoard = boards.find((b) => b.id === selectedBoardId) ?? boards[0];

  const openEdit = (tile: Tile) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
    setEditingTile(tile);
    setModalMode('edit');
    setShowModal(true);
  };

  const openNew = () => {
    setEditingTile(null);
    setModalMode('new');
    setShowModal(true);
  };

  const handleSave = async (updates: Partial<Tile>) => {
    if (modalMode === 'new') {
      const newId = `custom-${selectedBoardId}-${Date.now()}`;
      await addCustomTile({
        id: newId,
        label:    updates.label ?? 'Custom',
        icon:     'apps-outline',
        iconLib:  'Ionicons',
        color:    updates.color ?? TILE_COLORS.core,
        boardId:  selectedBoardId,
        imageUri: updates.imageUri,
        audioUri: updates.audioUri,
        isCustom: true,
      });
    } else if (editingTile) {
      await setTileCustomization(editingTile.id, {
        imageUri:    updates.imageUri,
        audioUri:    updates.audioUri,
        customLabel: updates.label !== editingTile.label ? updates.label : undefined,
      });
    }
    setShowModal(false);
  };

  const handleDelete = async () => {
    if (!editingTile) return;
    if (editingTile.isCustom) {
      await removeCustomTile(editingTile.id);
    } else {
      await clearTileCustomization(editingTile.id);
    }
    setShowModal(false);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: topPad + 8, backgroundColor: colors.card, borderBottomColor: colors.border }]}>
        <Pressable onPress={() => router.back()} style={({ pressed }) => [styles.backBtn, { opacity: pressed ? 0.6 : 1 }]}>
          <Ionicons name="arrow-back" size={24} color={colors.foreground} />
        </Pressable>
        <Text style={[styles.title, { color: colors.foreground }]}>{t('Manage Boards')}</Text>
        <Pressable onPress={openNew} style={({ pressed }) => [styles.addBtn, { backgroundColor: colors.primary, opacity: pressed ? 0.7 : 1 }]}>
          <Ionicons name="add" size={20} color="#fff" />
        </Pressable>
      </View>

      {/* Board tabs */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={[styles.tabBar, { backgroundColor: colors.card, borderBottomColor: colors.border }]} contentContainerStyle={styles.tabBarContent}>
        {boards.map((board) => (
          <Pressable
            key={board.id}
            onPress={() => setSelectedBoardId(board.id)}
            style={[
              styles.tab,
              {
                backgroundColor: selectedBoardId === board.id ? colors.primary : 'transparent',
                borderColor:     selectedBoardId === board.id ? colors.primary : colors.border,
              },
            ]}
          >
            <Ionicons name={board.icon as any} size={15} color={selectedBoardId === board.id ? '#fff' : colors.mutedForeground} />
            <Text style={[styles.tabText, { color: selectedBoardId === board.id ? '#fff' : colors.mutedForeground }]}>{translateLabel(board.name, appLanguage)}</Text>
          </Pressable>
        ))}
      </ScrollView>

      <ScrollView contentContainerStyle={[styles.content, { paddingBottom: bottomPad + 20 }]}>
        {/* Info banner */}
        <View style={[styles.infoBanner, { backgroundColor: colors.secondary, borderColor: colors.border }]}>
          <Ionicons name="information-circle-outline" size={16} color={colors.mutedForeground} />
          <Text style={[styles.infoText, { color: colors.mutedForeground }]}>
            Tap any tile to add a custom picture or sound. Long-press on the communication board also opens tile edit.
          </Text>
        </View>

        {/* Tile grid */}
        <View style={styles.tileGrid}>
          {selectedBoard?.tiles.map((tile) => {
            const hasCustom = !!(tile.imageUri || tile.audioUri);
            return (
              <Pressable
                key={tile.id}
                onPress={() => openEdit(tile)}
                style={({ pressed }) => [styles.tileCard, { backgroundColor: colors.card, borderColor: hasCustom ? colors.primary : colors.border, opacity: pressed ? 0.8 : 1 }]}
              >
                {/* Mini tile preview */}
                <View style={[styles.tileMini, { backgroundColor: tile.color }]}>
                  <BoardTilePicture tile={tile} />
                </View>

                <Text style={[styles.tileCardLabel, { color: colors.foreground }]} numberOfLines={1}>{tile.label}</Text>

                {/* Badges */}
                <View style={styles.badges}>
                  {tile.imageUri && <Badge icon="image" color="#2B78BE" />}
                  {tile.audioUri && <Badge icon="mic"   color="#2D9A57" />}
                  {tile.isCustom && <Badge icon="person" color="#7C4DBC" />}
                </View>

                <Pressable onPress={() => openEdit(tile)} style={[styles.editChip, { backgroundColor: colors.secondary }]}>
                  <Ionicons name="pencil" size={11} color={colors.mutedForeground} />
                  <Text style={[styles.editChipText, { color: colors.mutedForeground }]}>{t('Edit')}</Text>
                </Pressable>
              </Pressable>
            );
          })}

          {/* Add new tile card */}
          <Pressable
            onPress={openNew}
            style={({ pressed }) => [styles.tileCard, styles.addCard, { backgroundColor: colors.secondary, borderColor: colors.primary + '60', borderStyle: 'dashed', opacity: pressed ? 0.7 : 1 }]}
          >
            <View style={[styles.tileMini, { backgroundColor: colors.primary + '30' }]}>
              <Ionicons name="add" size={24} color={colors.primary} />
            </View>
            <Text style={[styles.tileCardLabel, { color: colors.primary }]}>{t('Add Tile')}</Text>
          </Pressable>
        </View>
      </ScrollView>

      <CustomTileModal
        visible={showModal}
        tile={editingTile}
        boardId={selectedBoardId}
        pixabayKey={process.env.EXPO_PUBLIC_PIXABAY_API_KEY}
        onSave={handleSave}
        onDelete={editingTile ? handleDelete : undefined}
        onCancel={() => setShowModal(false)}
      />
    </View>
  );
}

function BoardTilePicture({ tile }: { tile: Tile }) {
  const [failedCustomUri, setFailedCustomUri] = useState<string | null>(null);
  const [failedImageKey, setFailedImageKey] = useState<string | null>(null);
  const useCustomImage = !!tile.imageUri && failedCustomUri !== tile.imageUri;
  const useBundledImage =
    !useCustomImage &&
    !!tile.imageKey &&
    failedImageKey !== tile.imageKey &&
    !!TILE_IMAGES[tile.imageKey];
  const source: any = useCustomImage
    ? { uri: tile.imageUri }
    : useBundledImage && tile.imageKey
      ? TILE_IMAGES[tile.imageKey]
      : null;

  if (!source) return <Ionicons name={tile.icon as any} size={20} color="#fff" />;

  return (
    <Image
      source={source}
      style={styles.tileMiniImg}
      resizeMode="cover"
      onError={() => {
        if (useCustomImage && tile.imageUri) setFailedCustomUri(tile.imageUri);
        else if (useBundledImage && tile.imageKey) setFailedImageKey(tile.imageKey);
      }}
    />
  );
}

function Badge({ icon, color }: { icon: string; color: string }) {
  return (
    <View style={[styles.badge, { backgroundColor: color + '22' }]}>
      <Ionicons name={icon as any} size={9} color={color} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 16, paddingBottom: 12, borderBottomWidth: 1,
  },
  backBtn: { padding: 4, width: 40 },
  title:   { fontSize: 20, fontWeight: '700', fontFamily: 'Inter_700Bold' },
  addBtn:  { width: 36, height: 36, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  tabBar:        { height: 56, borderBottomWidth: 1, flexShrink: 0 },
  tabBarContent: { paddingHorizontal: 16, paddingVertical: 9, gap: 8, flexDirection: 'row', alignItems: 'center' },
  tab: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    paddingHorizontal: 12, paddingVertical: 7, borderRadius: 10, borderWidth: 1,
  },
  tabText: { fontSize: 13, fontWeight: '600', fontFamily: 'Inter_600SemiBold' },
  content:    { padding: 14, gap: 14 },
  infoBanner: { flexDirection: 'row', gap: 8, alignItems: 'flex-start', padding: 12, borderRadius: 12, borderWidth: 1 },
  infoText:   { flex: 1, fontSize: 12, fontFamily: 'Inter_400Regular', lineHeight: 17 },
  tileGrid:   { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  tileCard: {
    width: '30%', minWidth: 100, alignItems: 'center', padding: 10, gap: 6,
    borderRadius: 16, borderWidth: 1.5,
    shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 4, shadowOffset: { width: 0, height: 2 }, elevation: 2,
  },
  addCard:      { borderWidth: 1.5 },
  tileMini:     { width: 56, height: 56, borderRadius: 14, alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
  tileMiniImg:  { width: '100%', height: '100%' },
  tileCardLabel:{ fontSize: 12, fontWeight: '600', fontFamily: 'Inter_600SemiBold', textAlign: 'center' },
  badges:       { flexDirection: 'row', gap: 4 },
  badge:        { width: 16, height: 16, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  editChip:     { flexDirection: 'row', alignItems: 'center', gap: 3, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  editChipText: { fontSize: 10, fontFamily: 'Inter_500Medium' },
});
