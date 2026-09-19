import React, { useRef } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { Ionicons } from '@/components/IoniconsSVG';
import * as Haptics from 'expo-haptics';
import { useColors } from '@/hooks/useColors';
import { useApp } from '@/context/AppContext';
import type { Tile } from '@/data/defaultBoards';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

function SentenceTileChip({ tile, onPress }: { tile: Tile; onPress: () => void }) {
  const scale = useSharedValue(1);
  const animStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));
  return (
    <AnimatedPressable
      onPress={() => {
        scale.value = withSpring(0.9, {}, () => { scale.value = withSpring(1); });
        onPress();
      }}
      style={[animStyle]}
    >
      <View style={[styles.chip, { backgroundColor: tile.color }]}>
        <Ionicons name={tile.icon as any} size={16} color="#fff" />
        <Text style={styles.chipText} numberOfLines={1}>{tile.label}</Text>
      </View>
    </AnimatedPressable>
  );
}

export function SentenceBar() {
  const colors = useColors();
  const { sentence, clearSentence, removeLastTile, speakSentence, isSpeaking } = useApp();
  const scrollRef = useRef<ScrollView>(null);

  const speakScale = useSharedValue(1);
  const speakStyle = useAnimatedStyle(() => ({ transform: [{ scale: speakScale.value }] }));

  const handleSpeak = () => {
    if (!sentence.length) return;
    speakScale.value = withSpring(0.92, {}, () => { speakScale.value = withSpring(1); });
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
    speakSentence();
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.sentenceBar, borderBottomColor: colors.border }]}>
      <View style={styles.leftActions}>
        <Pressable
          onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {}); removeLastTile(); }}
          style={({ pressed }) => [styles.iconBtn, { opacity: pressed ? 0.6 : 1 }]}
          accessibilityLabel="Undo last word"
        >
          <Ionicons name="arrow-undo" size={22} color={sentence.length ? colors.foreground : colors.border} />
        </Pressable>
        <Pressable
          onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy).catch(() => {}); clearSentence(); }}
          style={({ pressed }) => [styles.iconBtn, { opacity: pressed ? 0.6 : 1 }]}
          accessibilityLabel="Clear sentence"
        >
          <Ionicons name="trash-outline" size={22} color={sentence.length ? colors.destructive : colors.border} />
        </Pressable>
      </View>

      <ScrollView
        ref={scrollRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        style={styles.scroll}
        onContentSizeChange={() => scrollRef.current?.scrollToEnd({ animated: true })}
      >
        {sentence.length === 0 ? (
          <Text style={[styles.placeholder, { color: colors.mutedForeground }]}>
            Tap tiles to build a sentence…
          </Text>
        ) : (
          sentence.map((tile, i) => (
            <SentenceTileChip
              key={`${tile.id}-${i}`}
              tile={tile}
              onPress={removeLastTile}
            />
          ))
        )}
      </ScrollView>

      <AnimatedPressable
        onPress={handleSpeak}
        style={[speakStyle, styles.speakBtn, {
          backgroundColor: sentence.length ? colors.speakButton : colors.muted,
        }]}
        accessibilityLabel="Speak sentence"
        accessibilityRole="button"
      >
        <Ionicons
          name={isSpeaking ? 'volume-high' : 'megaphone'}
          size={22}
          color={sentence.length ? '#fff' : colors.mutedForeground}
        />
        <Text style={[styles.speakText, { color: sentence.length ? '#fff' : colors.mutedForeground }]}>
          Speak
        </Text>
      </AnimatedPressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 8,
    minHeight: 68,
    borderBottomWidth: 1,
    gap: 6,
  },
  leftActions: {
    flexDirection: 'row',
    gap: 2,
  },
  iconBtn: {
    padding: 8,
    borderRadius: 10,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 4,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 1 },
    elevation: 2,
  },
  chipText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '700',
    fontFamily: 'Inter_700Bold',
    maxWidth: 80,
  },
  placeholder: {
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
    paddingHorizontal: 4,
  },
  speakBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 14,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 4,
  },
  speakText: {
    fontSize: 14,
    fontWeight: '700',
    fontFamily: 'Inter_700Bold',
  },
});
