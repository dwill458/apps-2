/**
 * ShopScreen Component
 * Main shop interface with categories, grid layout, and purchase flow
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  Pressable,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import { ShopItem } from './ShopItem';
import { shopManager } from '../../managers/ShopManager';
import { useStore } from '../../store/useStore';
import { ShopItemConfig, ShopItemType } from '../../types/shop';
import { colors, spacing, typography } from '../../constants';
import { SproutAvatar } from '../avatar/SproutAvatar';

type CategoryTab = 'outfits' | 'accessories' | 'bundles' | 'special';

const CATEGORY_LABELS: Record<CategoryTab, string> = {
  outfits: '👕 Outfits',
  accessories: '🎒 Accessories',
  bundles: '🎁 Bundles',
  special: '✨ Special',
};

export const ShopScreen: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<CategoryTab>('outfits');
  const [selectedItem, setSelectedItem] = useState<ShopItemConfig | null>(null);
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);

  const currency = useStore((state) => state.currency);
  const spendCurrency = useStore((state) => state.spendCurrency);
  const streakData = useStore((state) => state.streakData);
  const tasks = useStore((state) => state.tasks);

  // Calculate total tasks completed
  const totalTasksCompleted = tasks.filter((t) => t.status === 'completed').length;

  // Check for newly unlocked items on mount and when progress changes
  useEffect(() => {
    const newlyUnlocked = shopManager.checkUnlockRequirements(
      streakData,
      totalTasksCompleted
    );

    if (newlyUnlocked.length > 0) {
      // Could show a notification here
      console.log('Items unlocked:', newlyUnlocked);
    }
  }, [streakData.currentStreak, totalTasksCompleted]);

  const handleCategoryChange = (category: CategoryTab) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelectedCategory(category);
  };

  const handleItemPress = (item: ShopItemConfig) => {
    const isUnlocked = shopManager.isItemUnlocked(item.id);
    const isPurchased = shopManager.isItemPurchased(item.id);

    if (!isUnlocked || isPurchased) return;

    setSelectedItem(item);
    setShowPurchaseModal(true);
  };

  const handlePurchase = () => {
    if (!selectedItem) return;

    const result = shopManager.purchaseItem(
      selectedItem.id,
      currency,
      spendCurrency
    );

    if (result.success) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      setShowPurchaseModal(false);
      setSelectedItem(null);

      // Could show success animation or notification
    } else {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      // Show error message
      alert(result.message);
    }
  };

  const renderItems = () => {
    const items = shopManager.getItemsByType(selectedCategory);

    return (
      <View style={styles.grid}>
        {items.map((item) => {
          const isUnlocked = shopManager.isItemUnlocked(item.id);
          const isPurchased = shopManager.isItemPurchased(item.id);
          const canAfford = currency[item.currencyType] >= item.cost;

          return (
            <View key={item.id} style={styles.gridItem}>
              <ShopItem
                item={item}
                isUnlocked={isUnlocked}
                isPurchased={isPurchased}
                canAfford={canAfford}
                onPress={() => handleItemPress(item)}
              />
            </View>
          );
        })}
      </View>
    );
  };

  const renderPurchaseModal = () => {
    if (!selectedItem) return null;

    const canAfford = currency[selectedItem.currencyType] >= selectedItem.cost;

    return (
      <Modal
        visible={showPurchaseModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowPurchaseModal(false)}
      >
        <Pressable style={styles.modalOverlay} onPress={() => setShowPurchaseModal(false)}>
          <Pressable style={styles.modalContent} onPress={(e) => e.stopPropagation()}>
            {/* Header */}
            <View style={styles.modalHeader}>
              <Text style={styles.modalIcon}>{selectedItem.icon}</Text>
              <Text style={styles.modalTitle}>{selectedItem.name}</Text>
            </View>

            {/* Description */}
            <Text style={styles.modalDescription}>{selectedItem.description}</Text>

            {/* Preview Avatar (if outfit/accessory) */}
            {(selectedItem.type === 'outfit' || selectedItem.type === 'accessory') && (
              <View style={styles.previewContainer}>
                <Text style={styles.previewLabel}>Preview:</Text>
                {/* Could render SproutAvatar with the item equipped */}
              </View>
            )}

            {/* Tags */}
            {selectedItem.tags.length > 0 && (
              <View style={styles.tagsContainer}>
                {selectedItem.tags.slice(0, 3).map((tag) => (
                  <View key={tag} style={styles.tag}>
                    <Text style={styles.tagText}>{tag}</Text>
                  </View>
                ))}
              </View>
            )}

            {/* Price */}
            <View style={styles.modalPrice}>
              <Text style={styles.modalPriceLabel}>Price:</Text>
              <View style={styles.modalPriceValue}>
                <Text style={[styles.modalPriceAmount, !canAfford && styles.priceUnaffordable]}>
                  {selectedItem.cost}
                </Text>
                <Text style={styles.modalPriceCurrency}>
                  {selectedItem.currencyType === 'sunlight'
                    ? '☀️ Sunlight'
                    : selectedItem.currencyType === 'seeds'
                    ? '🌰 Seeds'
                    : '💎 Bloom Points'}
                </Text>
              </View>
            </View>

            {/* Current Balance */}
            <View style={styles.balanceContainer}>
              <Text style={styles.balanceLabel}>Your Balance:</Text>
              <Text style={[styles.balanceAmount, !canAfford && styles.balanceInsufficient]}>
                {currency[selectedItem.currencyType]}
              </Text>
            </View>

            {/* Actions */}
            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setShowPurchaseModal(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.purchaseButton, !canAfford && styles.purchaseButtonDisabled]}
                onPress={handlePurchase}
                disabled={!canAfford}
              >
                <Text style={styles.purchaseButtonText}>
                  {canAfford ? 'Purchase' : 'Not Enough'}
                </Text>
              </TouchableOpacity>
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    );
  };

  return (
    <View style={styles.container}>
      {/* Header with Currency */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Garden Shop</Text>
        <View style={styles.currencyBar}>
          <View style={styles.currencyItem}>
            <Text style={styles.currencyIcon}>☀️</Text>
            <Text style={styles.currencyAmount}>{currency.sunlight}</Text>
          </View>
          <View style={styles.currencyItem}>
            <Text style={styles.currencyIcon}>🌰</Text>
            <Text style={styles.currencyAmount}>{currency.seeds}</Text>
          </View>
          <View style={styles.currencyItem}>
            <Text style={styles.currencyIcon}>💎</Text>
            <Text style={styles.currencyAmount}>{currency.bloomPoints}</Text>
          </View>
        </View>
      </View>

      {/* Category Tabs */}
      <View style={styles.tabs}>
        {(Object.keys(CATEGORY_LABELS) as CategoryTab[]).map((category) => (
          <TouchableOpacity
            key={category}
            style={[styles.tab, selectedCategory === category && styles.tabActive]}
            onPress={() => handleCategoryChange(category)}
          >
            <Text
              style={[styles.tabText, selectedCategory === category && styles.tabTextActive]}
            >
              {CATEGORY_LABELS[category]}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Items Grid */}
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {renderItems()}
      </ScrollView>

      {/* Purchase Modal */}
      {renderPurchaseModal()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.cream,
  },
  header: {
    padding: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.primary.sage,
  },
  headerTitle: {
    fontSize: typography.sizes.xl,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginBottom: spacing.md,
  },
  currencyBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  currencyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  currencyIcon: {
    fontSize: 20,
    marginRight: spacing.xs,
  },
  currencyAmount: {
    fontSize: typography.sizes.md,
    fontWeight: 'bold',
    color: colors.text.primary,
  },
  tabs: {
    flexDirection: 'row',
    backgroundColor: '#F5F5F5',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
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
    fontSize: typography.sizes.sm,
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
  gridItem: {
    width: '50%',
    padding: spacing.xs,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: colors.background.cream,
    borderRadius: 24,
    padding: spacing.lg,
    width: '85%',
    maxWidth: 400,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  modalHeader: {
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  modalIcon: {
    fontSize: 60,
    marginBottom: spacing.sm,
  },
  modalTitle: {
    fontSize: typography.sizes.lg,
    fontWeight: 'bold',
    color: colors.text.primary,
    textAlign: 'center',
  },
  modalDescription: {
    fontSize: typography.sizes.md,
    color: colors.text.secondary,
    textAlign: 'center',
    marginBottom: spacing.lg,
    lineHeight: 22,
  },
  previewContainer: {
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  previewLabel: {
    fontSize: typography.sizes.sm,
    color: colors.text.secondary,
    marginBottom: spacing.sm,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  tag: {
    backgroundColor: '#E8F5E9',
    borderRadius: 12,
    paddingVertical: 4,
    paddingHorizontal: 8,
    margin: 4,
  },
  tagText: {
    fontSize: typography.sizes.xs,
    color: colors.primary.moss,
    fontWeight: '600',
  },
  modalPrice: {
    backgroundColor: '#F5F5F5',
    borderRadius: 16,
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
  modalPriceLabel: {
    fontSize: typography.sizes.sm,
    color: colors.text.secondary,
    marginBottom: spacing.xs,
  },
  modalPriceValue: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  modalPriceAmount: {
    fontSize: typography.sizes.xl,
    fontWeight: 'bold',
    color: colors.text.primary,
  },
  priceUnaffordable: {
    color: colors.semantic.coral,
  },
  modalPriceCurrency: {
    fontSize: typography.sizes.md,
    color: colors.text.secondary,
  },
  balanceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.lg,
    paddingHorizontal: spacing.sm,
  },
  balanceLabel: {
    fontSize: typography.sizes.sm,
    color: colors.text.secondary,
  },
  balanceAmount: {
    fontSize: typography.sizes.lg,
    fontWeight: 'bold',
    color: colors.primary.moss,
  },
  balanceInsufficient: {
    color: colors.semantic.coral,
  },
  modalActions: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#E0E0E0',
    borderRadius: 16,
    paddingVertical: spacing.md,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: typography.sizes.md,
    fontWeight: 'bold',
    color: colors.text.secondary,
  },
  purchaseButton: {
    flex: 1,
    backgroundColor: colors.primary.sage,
    borderRadius: 16,
    paddingVertical: spacing.md,
    alignItems: 'center',
  },
  purchaseButtonDisabled: {
    backgroundColor: '#CCCCCC',
  },
  purchaseButtonText: {
    fontSize: typography.sizes.md,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
});
