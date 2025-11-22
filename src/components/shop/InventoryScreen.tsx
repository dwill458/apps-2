/**
 * InventoryScreen Component
 * Display owned items with ability to equip/unequip
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import { shopManager } from '../../managers/ShopManager';
import { useStore } from '../../store/useStore';
import { InventoryItem } from '../../types/shop';
import { colors, spacing, typography } from '../../constants';
import { SproutAvatar } from '../avatar/SproutAvatar';
import { OutfitType, AccessoryType } from '../../constants/avatar-config';

type InventoryTab = 'outfits' | 'accessories';

export const InventoryScreen: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState<InventoryTab>('outfits');

  const avatar = useStore((state) => state.avatar);
  const setAvatarOutfit = useStore((state) => state.setAvatarOutfit);
  const setAvatarAccessory = useStore((state) => state.setAvatarAccessory);
  const dailyProgress = useStore((state) => state.dailyProgress);

  // Calculate watering can level
  const progressPercent = Math.min(
    100,
    (dailyProgress.minutesCompleted / dailyProgress.goalMinutes) * 100
  );
  const wateringCanLevel = progressPercent >= 100 ? 3 : progressPercent >= 50 ? 2 : 1;

  const handleTabChange = (tab: InventoryTab) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelectedTab(tab);
  };

  const handleEquipOutfit = (avatarType: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setAvatarOutfit(avatarType as OutfitType);
  };

  const handleEquipAccessory = (avatarType: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setAvatarAccessory(avatarType as AccessoryType);
  };

  const renderOutfits = () => {
    const inventory = shopManager.getInventoryByType('outfit');

    if (inventory.length === 0) {
      return (
        <View style={styles.emptyState}>
          <Text style={styles.emptyIcon}>👕</Text>
          <Text style={styles.emptyText}>No outfits yet!</Text>
          <Text style={styles.emptySubtext}>Visit the shop to get started</Text>
        </View>
      );
    }

    return (
      <View style={styles.grid}>
        {inventory.map((item: InventoryItem) => {
          const isEquipped = avatar.outfit === item.config.avatarType;

          return (
            <TouchableOpacity
              key={item.id}
              style={[styles.inventoryCard, isEquipped && styles.inventoryCardEquipped]}
              onPress={() => handleEquipOutfit(item.config.avatarType!)}
            >
              <Text style={styles.inventoryIcon}>{item.config.icon}</Text>
              <Text style={styles.inventoryName} numberOfLines={2}>
                {item.config.name}
              </Text>
              {isEquipped ? (
                <View style={styles.equippedBadge}>
                  <Text style={styles.equippedText}>✓ Equipped</Text>
                </View>
              ) : (
                <TouchableOpacity style={styles.equipButton}>
                  <Text style={styles.equipButtonText}>Equip</Text>
                </TouchableOpacity>
              )}
            </TouchableOpacity>
          );
        })}
      </View>
    );
  };

  const renderAccessories = () => {
    const inventory = shopManager.getInventoryByType('accessory');

    if (inventory.length === 0) {
      return (
        <View style={styles.emptyState}>
          <Text style={styles.emptyIcon}>🎒</Text>
          <Text style={styles.emptyText}>No accessories yet!</Text>
          <Text style={styles.emptySubtext}>Visit the shop to get started</Text>
        </View>
      );
    }

    return (
      <View style={styles.grid}>
        {inventory.map((item: InventoryItem) => {
          const isEquipped = avatar.accessory === item.config.avatarType;
          const isWateringCan = item.config.avatarType === 'watering-can';

          return (
            <TouchableOpacity
              key={item.id}
              style={[styles.inventoryCard, isEquipped && styles.inventoryCardEquipped]}
              onPress={() => handleEquipAccessory(item.config.avatarType!)}
            >
              <Text style={styles.inventoryIcon}>{item.config.icon}</Text>
              <Text style={styles.inventoryName} numberOfLines={2}>
                {item.config.name}
              </Text>

              {/* Show watering can level if applicable */}
              {isWateringCan && isEquipped && (
                <View style={styles.levelBadge}>
                  <Text style={styles.levelText}>
                    Level {wateringCanLevel}
                  </Text>
                </View>
              )}

              {isEquipped ? (
                <View style={styles.equippedBadge}>
                  <Text style={styles.equippedText}>✓ Equipped</Text>
                </View>
              ) : (
                <TouchableOpacity style={styles.equipButton}>
                  <Text style={styles.equipButtonText}>Equip</Text>
                </TouchableOpacity>
              )}
            </TouchableOpacity>
          );
        })}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header with Avatar Preview */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Wardrobe</Text>
        <View style={styles.avatarPreview}>
          <SproutAvatar
            outfit={avatar.outfit}
            accessory={avatar.accessory}
            mood={avatar.mood}
            size={180}
            wateringCanLevel={wateringCanLevel as 1 | 2 | 3}
          />
        </View>
        <Text style={styles.currentOutfitLabel}>
          {avatar.outfit.charAt(0).toUpperCase() + avatar.outfit.slice(1)} Outfit
        </Text>
        {avatar.accessory !== 'none' && (
          <Text style={styles.currentAccessoryLabel}>
            with {avatar.accessory.replace('-', ' ')}
          </Text>
        )}
      </View>

      {/* Tabs */}
      <View style={styles.tabs}>
        <TouchableOpacity
          style={[styles.tab, selectedTab === 'outfits' && styles.tabActive]}
          onPress={() => handleTabChange('outfits')}
        >
          <Text style={[styles.tabText, selectedTab === 'outfits' && styles.tabTextActive]}>
            👕 Outfits
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, selectedTab === 'accessories' && styles.tabActive]}
          onPress={() => handleTabChange('accessories')}
        >
          <Text style={[styles.tabText, selectedTab === 'accessories' && styles.tabTextActive]}>
            🎒 Accessories
          </Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {selectedTab === 'outfits' ? renderOutfits() : renderAccessories()}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.cream,
  },
  header: {
    alignItems: 'center',
    paddingVertical: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.primary.sage,
  },
  headerTitle: {
    fontSize: typography.sizes.xl,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginBottom: spacing.md,
  },
  avatarPreview: {
    marginBottom: spacing.md,
  },
  currentOutfitLabel: {
    fontSize: typography.sizes.md,
    fontWeight: '600',
    color: colors.text.primary,
  },
  currentAccessoryLabel: {
    fontSize: typography.sizes.sm,
    color: colors.text.secondary,
    marginTop: spacing.xs,
  },
  tabs: {
    flexDirection: 'row',
    backgroundColor: '#F5F5F5',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  tab: {
    flex: 1,
    paddingVertical: spacing.sm,
    alignItems: 'center',
    borderRadius: 12,
    marginHorizontal: 4,
  },
  tabActive: {
    backgroundColor: colors.primary.sage,
  },
  tabText: {
    fontSize: typography.sizes.md,
    color: colors.text.secondary,
    fontWeight: '600',
  },
  tabTextActive: {
    color: '#FFFFFF',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: spacing.md,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -spacing.xs,
  },
  inventoryCard: {
    width: '50%',
    padding: spacing.xs,
  },
  inventoryCardEquipped: {
    transform: [{ scale: 1.02 }],
  },
  inventoryIcon: {
    fontSize: 48,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  inventoryName: {
    fontSize: typography.sizes.sm,
    fontWeight: '600',
    color: colors.text.primary,
    textAlign: 'center',
    marginBottom: spacing.sm,
    minHeight: 36,
  },
  equippedBadge: {
    backgroundColor: colors.primary.moss,
    borderRadius: 12,
    paddingVertical: spacing.xs,
    alignItems: 'center',
  },
  equippedText: {
    color: '#FFFFFF',
    fontSize: typography.sizes.sm,
    fontWeight: 'bold',
  },
  equipButton: {
    backgroundColor: colors.primary.sage,
    borderRadius: 12,
    paddingVertical: spacing.xs,
    alignItems: 'center',
  },
  equipButtonText: {
    color: '#FFFFFF',
    fontSize: typography.sizes.sm,
    fontWeight: '600',
  },
  levelBadge: {
    backgroundColor: colors.accent.warmGold,
    borderRadius: 8,
    paddingVertical: 4,
    paddingHorizontal: 8,
    alignSelf: 'center',
    marginBottom: spacing.xs,
  },
  levelText: {
    color: '#FFFFFF',
    fontSize: typography.sizes.xs,
    fontWeight: 'bold',
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.xl * 2,
  },
  emptyIcon: {
    fontSize: 72,
    marginBottom: spacing.md,
  },
  emptyText: {
    fontSize: typography.sizes.lg,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  emptySubtext: {
    fontSize: typography.sizes.md,
    color: colors.text.secondary,
  },
});
