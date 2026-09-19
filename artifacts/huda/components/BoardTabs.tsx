import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@/components/IoniconsSVG';
import { useColors } from '@/hooks/useColors';
import { useApp } from '@/context/AppContext';
import { translateLabel } from '@/data/translations';

export function BoardTabs() {
  const colors = useColors();
  const { boards, currentBoardId, setCurrentBoard, getQuickAccessTiles, appLanguage } = useApp();
  const quickTiles = getQuickAccessTiles();

  const tabs = [
    ...(quickTiles.length > 0 ? [{ id: 'quick', name: translateLabel('Quick', appLanguage), icon: 'flash' as const }] : []),
    ...boards.map((b) => ({ id: b.id, name: translateLabel(b.name, appLanguage), icon: b.icon as any })),
  ];

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={[styles.container, { backgroundColor: colors.background, borderBottomColor: colors.border }]}
      contentContainerStyle={styles.content}
    >
      {tabs.map((tab) => {
        const isActive = tab.id === currentBoardId;
        return (
          <Pressable
            key={tab.id}
            onPress={() => setCurrentBoard(tab.id)}
            style={[
              styles.tab,
              {
                backgroundColor: isActive ? colors.primary : colors.card,
                borderColor: isActive ? colors.primary : colors.border,
              },
            ]}
            accessibilityRole="tab"
            accessibilitySelected={isActive}
            accessibilityLabel={tab.name}
          >
            <Ionicons
              name={tab.icon}
              size={16}
              color={isActive ? '#fff' : colors.mutedForeground}
            />
            <Text
              style={[
                styles.tabText,
                { color: isActive ? '#fff' : colors.mutedForeground },
              ]}
            >
              {tab.name}
            </Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    borderBottomWidth: 1,
    maxHeight: 54,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 8,
    gap: 8,
  },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1.5,
  },
  tabText: {
    fontSize: 13,
    fontWeight: '600',
    fontFamily: 'Inter_600SemiBold',
  },
});
