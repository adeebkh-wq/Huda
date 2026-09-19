import React, { useState, useCallback } from 'react';
import {
  Platform,
  Pressable,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@/components/IoniconsSVG';
import * as Haptics from 'expo-haptics';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { useColors } from '@/hooks/useColors';
import { useApp } from '@/context/AppContext';
import { useCaregiver } from '@/context/CaregiverContext';
import { SentenceBar } from '@/components/SentenceBar';
import { BoardTabs } from '@/components/BoardTabs';
import { TileGrid } from '@/components/TileGrid';
import { PinModal } from '@/components/PinModal';
import { CustomTileModal } from '@/components/CustomTileModal';
import type { Tile } from '@/data/defaultBoards';

// Stylish app logo with coloured letters + a tiny speech bubble badge
function HudaLogo() {
  const letters = [
    { char: 'H', color: '#2A9D8F' },
    { char: 'u', color: '#C98A1A' },
    { char: 'd', color: '#2B78BE' },
    { char: 'a', color: '#D0457E' },
  ];
  return (
    <View style={logo.row}>
      <View style={logo.bubble}>
        <Ionicons name="chatbubble-ellipses" size={13} color="#fff" />
      </View>
      <View style={logo.letters}>
        {letters.map(({ char, color }) => (
          <Text key={char} style={[logo.char, { color }]}>{char}</Text>
        ))}
      </View>
    </View>
  );
}

const logo = StyleSheet.create({
  row:     { flexDirection: 'row', alignItems: 'center', gap: 6 },
  bubble:  { backgroundColor: '#2A9D8F', borderRadius: 8, padding: 4, marginBottom: 2 },
  letters: { flexDirection: 'row' },
  char:    { fontSize: 26, fontWeight: '800', fontFamily: 'Inter_700Bold', letterSpacing: -0.5 },
});

export default function HomeScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { addToSentence, speakTile, quietMode, setQuietMode, setTileCustomization } = useApp();
  const { validatePin, caregiverPin } = useCaregiver();
  const [showPinModal, setShowPinModal] = useState(false);
  const [editingTile, setEditingTile] = useState<Tile | null>(null);
  const [showTileEdit, setShowTileEdit] = useState(false);

  const quietOpacity = useSharedValue(0);
  const quietStyle = useAnimatedStyle(() => ({
    opacity: quietOpacity.value,
    pointerEvents: quietOpacity.value > 0.1 ? ('auto' as any) : ('none' as any),
  }));

  const handleTilePress = useCallback((tile: Tile) => {
    addToSentence(tile);
    speakTile(tile);
  }, [addToSentence, speakTile]);

  const handleTileLongPress = useCallback((tile: Tile) => {
    setEditingTile(tile);
    setShowTileEdit(true);
  }, []);

  const handleTileEditSave = useCallback(async (updates: Partial<Tile>) => {
    if (editingTile) {
      await setTileCustomization(editingTile.id, {
        imageUri: updates.imageUri,
        audioUri: updates.audioUri,
        customLabel: updates.label !== editingTile.label ? updates.label : undefined,
      });
    }
    setShowTileEdit(false);
  }, [editingTile, setTileCustomization]);

  const handleCaregiverPress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
    if (!caregiverPin) {
      router.push('/(tabs)/caregiver/');
    } else {
      setShowPinModal(true);
    }
  };

  const handlePinSuccess = () => {
    setShowPinModal(false);
    router.push('/(tabs)/caregiver/');
  };

  const toggleQuietMode = () => {
    const next = !quietMode;
    setQuietMode(next);
    quietOpacity.value = withTiming(next ? 1 : 0, { duration: 400 });
    if (next) Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
  };

  // insets.top can return 0 on the first render on some Android devices even with a
  // translucent status bar. StatusBar.currentHeight is synchronous and always correct.
  const topPad = Platform.OS === 'web'
    ? Math.max(insets.top, 67)
    : Math.max(insets.top, StatusBar.currentHeight ?? 0);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

      {/* ── Header ── */}
      <View style={[styles.header, { paddingTop: topPad + 6, backgroundColor: colors.card, borderBottomColor: colors.border }]}>
        <View style={styles.headerLeft}>
          <Pressable
            onPress={handleCaregiverPress}
            style={({ pressed }) => [styles.headerBtn, { opacity: pressed ? 0.6 : 1, backgroundColor: colors.secondary }]}
            accessibilityLabel="Open caregiver mode"
          >
            <Ionicons name="menu-outline" size={14} color={colors.mutedForeground} />
          </Pressable>
        </View>

        {/* Logo centred between left and right columns */}
        <View style={styles.headerLogoWrap} pointerEvents="none">
          <HudaLogo />
        </View>

        <View style={styles.headerRight}>
          <Pressable
            onPress={toggleQuietMode}
            style={({ pressed }) => [
              styles.iconBtn,
              { opacity: pressed ? 0.6 : 1, backgroundColor: quietMode ? colors.primary : colors.secondary },
            ]}
            accessibilityLabel="Toggle quiet mode"
          >
            <Ionicons name={quietMode ? 'moon' : 'moon-outline'} size={18} color={quietMode ? '#fff' : colors.mutedForeground} />
          </Pressable>
          <Pressable
            onPress={() => router.push('/(tabs)/feelings')}
            style={({ pressed }) => [
              styles.iconBtn,
              { opacity: pressed ? 0.6 : 1, backgroundColor: '#EC489915' },
            ]}
            accessibilityLabel="How I'm feeling"
          >
            <Ionicons name="happy-outline" size={18} color="#D0457E" />
          </Pressable>
          <Pressable
            onPress={() => router.push('/(tabs)/sounds')}
            style={({ pressed }) => [
              styles.iconBtn,
              { opacity: pressed ? 0.6 : 1, backgroundColor: '#4fc3f715' },
            ]}
            accessibilityLabel="Sensory Music"
          >
            <Ionicons name="musical-notes-outline" size={18} color="#4fc3f7" />
          </Pressable>
          <Pressable
            onPress={() => router.push('/(tabs)/games')}
            style={({ pressed }) => [
              styles.iconBtn,
              { opacity: pressed ? 0.6 : 1, backgroundColor: '#ba68c815' },
            ]}
            accessibilityLabel="Sensory Games"
          >
            <Ionicons name="game-controller-outline" size={18} color="#ba68c8" />
          </Pressable>
        </View>
      </View>

      <SentenceBar />
      <BoardTabs />
      <TileGrid onTilePress={handleTilePress} onTileLongPress={handleTileLongPress} />

      {/* Quiet Mode Overlay */}
      <Animated.View
        style={[StyleSheet.absoluteFillObject, styles.quietOverlay, quietStyle]}
        pointerEvents={quietMode ? 'auto' : 'none'}
      >
        <View style={styles.quietContent}>
          <View style={styles.quietMoon}>
            <Ionicons name="moon" size={48} color="rgba(200,220,230,0.9)" />
          </View>
          <Text style={styles.quietTitle}>Quiet Corner</Text>
          <Text style={styles.quietSub}>Take a peaceful moment 🌙</Text>
          <Pressable onPress={toggleQuietMode} style={styles.quietBtn}>
            <Text style={styles.quietBtnText}>Exit Quiet Mode</Text>
          </Pressable>
        </View>
      </Animated.View>

      <PinModal
        visible={showPinModal}
        title="Caregiver PIN"
        validatePin={validatePin}
        onSuccess={handlePinSuccess}
        onCancel={() => setShowPinModal(false)}
      />

      {/* Long-press tile editor — no PIN required, only changes picture/sound */}
      <CustomTileModal
        visible={showTileEdit}
        tile={editingTile}
        boardId={editingTile?.boardId ?? 'core'}
        pixabayKey={process.env.EXPO_PUBLIC_PIXABAY_API_KEY}
        onSave={handleTileEditSave}
        onCancel={() => setShowTileEdit(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingBottom: 10,
    borderBottomWidth: 1,
  },
  headerBtn: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
    borderRadius: 12,
  },
  headerBtnText: {
    fontSize: 13,
    fontWeight: '600',
    fontFamily: 'Inter_600SemiBold',
  },
  iconBtn: {
    padding: 8,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerLogoWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  headerLeft: { width: 44 },
  headerRight: { flexShrink: 0, flexDirection: 'row', gap: 5, justifyContent: 'flex-end', alignItems: 'center' },
  quietOverlay: {
    backgroundColor: '#0D1B2A',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 100,
  },
  quietContent: { alignItems: 'center', gap: 16, paddingHorizontal: 32 },
  quietMoon: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(42,157,143,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  quietTitle: {
    color: 'rgba(200,220,230,0.95)',
    fontSize: 32,
    fontWeight: '700',
    fontFamily: 'Inter_700Bold',
  },
  quietSub: {
    color: 'rgba(170,190,210,0.7)',
    fontSize: 17,
    fontFamily: 'Inter_400Regular',
  },
  quietBtn: {
    marginTop: 16,
    paddingHorizontal: 28,
    paddingVertical: 14,
    borderRadius: 30,
    borderWidth: 1.5,
    borderColor: 'rgba(200,220,230,0.4)',
  },
  quietBtnText: {
    color: 'rgba(200,220,230,0.9)',
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'Inter_600SemiBold',
  },
});
