import React, { useCallback, useState } from 'react';
import {
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { Ionicons } from '@/components/IoniconsSVG';
import type { Tile as TileType } from '@/data/defaultBoards';
import TILE_IMAGES from '@/assets/tileImages';

interface TileProps {
  tile: TileType;
  size: number;
  onPress: (tile: TileType) => void;
  onLongPress?: (tile: TileType) => void;
  disabled?: boolean;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function Tile({ tile, size, onPress, onLongPress, disabled = false }: TileProps) {
  const scale = useSharedValue(1);
  const [failedCustomUri, setFailedCustomUri] = useState<string | null>(null);
  const [failedImageKey, setFailedImageKey] = useState<string | null>(null);

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePress = useCallback(() => {
    scale.value = withSpring(0.91, { damping: 10, stiffness: 300 }, () => {
      scale.value = withSpring(1, { damping: 12, stiffness: 300 });
    });
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    onPress(tile);
  }, [tile, onPress, scale]);

  const handleLongPress = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
    onLongPress?.(tile);
  }, [tile, onLongPress]);

  // A stale custom URI must not hide a valid bundled picture or pictogram.
  const useCustomImage = !!tile.imageUri && failedCustomUri !== tile.imageUri;
  const useBundledImage =
    !useCustomImage &&
    !!tile.imageKey &&
    failedImageKey !== tile.imageKey &&
    !!TILE_IMAGES[tile.imageKey];
  const imageSource: any =
    useCustomImage
      ? { uri: tile.imageUri }
      : useBundledImage && tile.imageKey
        ? TILE_IMAGES[tile.imageKey]
        : null;

  const hasAudio = !!tile.audioUri;
  const iconSize = Math.round(size * 0.34);
  const fontSize = size < 80 ? 10 : size < 100 ? 11 : 12;

  // Alphabet tiles: show only a big centred letter, no icon, no bottom label
  const isAlphabetTile = tile.boardId === 'alphabet';
  const isNumberTile = tile.boardId === 'numbers';
  const bigLetterSize = Math.round(size * 0.58);

  return (
    <AnimatedPressable
      onPress={disabled ? undefined : handlePress}
      onLongPress={onLongPress ? handleLongPress : undefined}
      style={[animStyle, styles.wrapper, { width: size, height: size }]}
      accessibilityRole="button"
      accessibilityLabel={tile.label}
      delayLongPress={500}
    >
      <View style={[styles.tile, { backgroundColor: tile.color, borderRadius: 16 }]}>
        {isAlphabetTile ? (
          <Text style={[styles.bigLetter, { fontSize: bigLetterSize }]}>
            {tile.label}
          </Text>
        ) : (
          <>
            {imageSource ? (
              <View style={styles.imageContainer}>
                <Image
                  source={imageSource}
                  style={[styles.image, { borderRadius: 10 }]}
                  resizeMode="cover"
                  onError={() => {
                    if (useCustomImage && tile.imageUri) {
                      setFailedCustomUri(tile.imageUri);
                    } else if (useBundledImage && tile.imageKey) {
                      setFailedImageKey(tile.imageKey);
                    }
                  }}
                />
              </View>
            ) : isNumberTile ? (
              <View style={styles.pictogramContainer}>
                <Text style={[styles.numberPictogram, { color: tile.color, fontSize: Math.round(size * 0.34) }]}>
                  {tile.label}
                </Text>
              </View>
            ) : (
              <View style={styles.pictogramContainer}>
                <Ionicons name={tile.icon as any} size={iconSize} color={tile.color} />
              </View>
            )}

            <Text style={[styles.label, { fontSize }]} numberOfLines={2} adjustsFontSizeToFit>
              {tile.label}
            </Text>
          </>
        )}

        {hasAudio && (
          <View style={styles.audioBadge}>
            <Ionicons name="mic" size={8} color="#fff" />
          </View>
        )}
      </View>
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    padding: 4,
  },
  tile: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
    paddingVertical: 4,
    gap: 3,
    shadowColor: '#000',
    shadowOpacity: 0.18,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 4,
    overflow: 'hidden',
  },
  imageContainer: {
    width: '78%',
    aspectRatio: 1,
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: 'rgba(255,255,255,0.15)',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  pictogramContainer: {
    width: '78%',
    aspectRatio: 1,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
  numberPictogram: {
    fontFamily: 'Inter_700Bold',
    textAlign: 'center',
  },
  label: {
    color: '#FFFFFF',
    fontWeight: '700',
    textAlign: 'center',
    lineHeight: 14,
    fontFamily: 'Inter_700Bold',
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  audioBadge: {
    position: 'absolute',
    top: 5,
    right: 5,
    backgroundColor: 'rgba(0,0,0,0.35)',
    borderRadius: 6,
    padding: 2,
  },
  bigLetter: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontFamily: 'Inter_700Bold',
    textShadowColor: 'rgba(0,0,0,0.25)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
});
