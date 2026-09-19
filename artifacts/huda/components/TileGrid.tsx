import React, { useMemo } from 'react';
import { Platform, ScrollView, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { useColors } from '@/hooks/useColors';
import { useApp } from '@/context/AppContext';
import { useCaregiver } from '@/context/CaregiverContext';
import { Tile } from './Tile';
import type { Tile as TileType } from '@/data/defaultBoards';
import { QUICK_PHRASES } from '@/data/defaultBoards';

function computeLayout(width: number) {
  if (width >= 900) return { cols: 8, gap: 10 };
  if (width >= 700) return { cols: 7, gap: 8 };
  if (width >= 550) return { cols: 6, gap: 8 };
  if (width >= 430) return { cols: 5, gap: 6 };
  return { cols: 4, gap: 6 };
}

/** Maps the caregiver tile-size preference to a column offset.
 *  'small' → +1 col (more tiles per row → smaller tiles)
 *  'large' → -1 col (fewer tiles per row → bigger tiles) */
const TILE_SIZE_COL_OFFSET: Record<string, number> = {
  small:  1,
  medium: 0,
  large: -1,
};

interface TileGridProps {
  onTilePress: (tile: TileType) => void;
  onTileLongPress?: (tile: TileType) => void;
}

export function TileGrid({ onTilePress, onTileLongPress }: TileGridProps) {
  const colors = useColors();
  const { width } = useWindowDimensions();
  const { getCurrentBoard, currentBoardId, getQuickAccessTiles } = useApp();
  const { settings } = useCaregiver();

  const PADDING = Platform.OS === 'web' ? 16 : 10;
  const { cols: baseCols, gap } = computeLayout(width);
  const colOffset = TILE_SIZE_COL_OFFSET[settings.tileSize] ?? 0;
  const cols = Math.max(2, Math.min(baseCols + colOffset, 10));
  const tileSize = Math.floor((width - PADDING * 2 - gap * (cols - 1)) / cols);

  const tiles = useMemo<TileType[]>(() => {
    if (currentBoardId === 'quick') {
      const q = getQuickAccessTiles();
      // mark quick tiles with a tealish color overlay label
      return q.map((t) => ({ ...t }));
    }
    return getCurrentBoard()?.tiles ?? [];
  }, [currentBoardId, getCurrentBoard, getQuickAccessTiles]);

  if (tiles.length === 0) {
    return (
      <View style={styles.empty}>
        <Text style={[styles.emptyText, { color: colors.mutedForeground }]}>
          No tiles yet. Use Caregiver Mode to add some!
        </Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={[
        styles.grid,
        { padding: PADDING, gap },
      ]}
      showsVerticalScrollIndicator={false}
    >
      {tiles.map((tile) => (
        <Tile
          key={tile.id}
          tile={tile}
          size={tileSize}
          onPress={onTilePress}
          onLongPress={onTileLongPress}
        />
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignContent: 'flex-start',
  },
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
    fontFamily: 'Inter_400Regular',
  },
});
