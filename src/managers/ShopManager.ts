/**
 * ShopManager - Business Logic for Shop System
 * Handles purchases, unlocks, inventory, and dynamic item logic
 */

import shopConfigData from '../constants/shop-config.json';
import {
  ShopConfig,
  ShopItemConfig,
  ShopItemState,
  PurchaseResult,
  InventoryItem,
  CurrencyType,
} from '../types/shop';
import { Currency, StreakData } from '../types';

export class ShopManager {
  private config: ShopConfig;
  private itemStates: Map<string, ShopItemState>;
  private inventory: Map<string, InventoryItem>;

  constructor() {
    this.config = shopConfigData as ShopConfig;
    this.itemStates = new Map();
    this.inventory = new Map();
    this.initializeItemStates();
  }

  /**
   * Initialize all shop items with default states
   */
  private initializeItemStates(): void {
    const allItems = [
      ...this.config.outfits,
      ...this.config.accessories,
      ...this.config.bundles,
      ...this.config.special,
    ];

    allItems.forEach((item) => {
      // Starter items are auto-unlocked and purchased
      const isStarter = item.cost === 0 || item.tags.includes('starter');

      this.itemStates.set(item.id, {
        id: item.id,
        isUnlocked: isStarter || !item.unlockRequirement,
        isPurchased: isStarter,
        purchaseCount: isStarter ? 1 : 0,
        currentVariant: item.dynamic ? 1 : undefined,
      });

      // Add starter items to inventory
      if (isStarter) {
        this.inventory.set(item.id, {
          id: item.id,
          config: item,
          purchasedAt: new Date(),
          timesUsed: 0,
        });
      }
    });
  }

  /**
   * Get all items of a specific type
   */
  getItemsByType(type: ShopItemConfig['type']): ShopItemConfig[] {
    switch (type) {
      case 'outfit':
        return this.config.outfits;
      case 'accessory':
        return this.config.accessories;
      case 'bundle':
        return this.config.bundles;
      case 'special':
        return this.config.special;
      default:
        return [];
    }
  }

  /**
   * Get all unlocked items
   */
  getUnlockedItems(): ShopItemConfig[] {
    const allItems = [
      ...this.config.outfits,
      ...this.config.accessories,
      ...this.config.bundles,
      ...this.config.special,
    ];

    return allItems.filter((item) => {
      const state = this.itemStates.get(item.id);
      return state?.isUnlocked;
    });
  }

  /**
   * Get all purchased items (inventory)
   */
  getInventory(): InventoryItem[] {
    return Array.from(this.inventory.values());
  }

  /**
   * Get purchased items by type
   */
  getInventoryByType(type: ShopItemConfig['type']): InventoryItem[] {
    return this.getInventory().filter((item) => item.config.type === type);
  }

  /**
   * Check if an item is unlocked
   */
  isItemUnlocked(itemId: string): boolean {
    const state = this.itemStates.get(itemId);
    return state?.isUnlocked || false;
  }

  /**
   * Check if an item is purchased
   */
  isItemPurchased(itemId: string): boolean {
    const state = this.itemStates.get(itemId);
    return state?.isPurchased || false;
  }

  /**
   * Check unlock requirements based on user progress
   */
  checkUnlockRequirements(
    streakData: StreakData,
    totalTasksCompleted: number
  ): string[] {
    const newlyUnlocked: string[] = [];

    const allItems = [
      ...this.config.outfits,
      ...this.config.accessories,
      ...this.config.bundles,
      ...this.config.special,
    ];

    allItems.forEach((item) => {
      const state = this.itemStates.get(item.id);

      // Skip if already unlocked or no requirement
      if (state?.isUnlocked || !item.unlockRequirement) return;

      const req = item.unlockRequirement;
      let shouldUnlock = false;

      switch (req.type) {
        case 'streak':
          shouldUnlock = streakData.currentStreak >= req.value;
          break;
        case 'totalTasks':
          shouldUnlock = totalTasksCompleted >= req.value;
          break;
        case 'totalDays':
          shouldUnlock = streakData.totalDaysShowedUp >= req.value;
          break;
      }

      if (shouldUnlock) {
        this.unlockItem(item.id);
        newlyUnlocked.push(item.id);
      }
    });

    return newlyUnlocked;
  }

  /**
   * Unlock an item manually
   */
  unlockItem(itemId: string): void {
    const state = this.itemStates.get(itemId);
    if (state) {
      state.isUnlocked = true;
      this.itemStates.set(itemId, state);
    }
  }

  /**
   * Get the item configuration
   */
  getItemConfig(itemId: string): ShopItemConfig | undefined {
    const allItems = [
      ...this.config.outfits,
      ...this.config.accessories,
      ...this.config.bundles,
      ...this.config.special,
    ];

    return allItems.find((item) => item.id === itemId);
  }

  /**
   * Calculate bundle price with discount
   */
  private calculateBundlePrice(bundle: ShopItemConfig): number {
    if (!bundle.items) return bundle.cost;

    let totalCost = 0;
    bundle.items.forEach((itemId) => {
      const item = this.getItemConfig(itemId);
      if (item) totalCost += item.cost;
    });

    const discount = bundle.discount || 0;
    return Math.floor(totalCost * (1 - discount));
  }

  /**
   * Purchase an item
   */
  purchaseItem(
    itemId: string,
    currency: Currency,
    spendCurrencyFn: (type: CurrencyType, amount: number) => boolean
  ): PurchaseResult {
    const item = this.getItemConfig(itemId);
    const state = this.itemStates.get(itemId);

    if (!item) {
      return { success: false, message: 'Item not found' };
    }

    if (!state?.isUnlocked) {
      return { success: false, message: 'Item is locked' };
    }

    if (state.isPurchased && !item.maxPurchases) {
      return { success: false, message: 'Item already purchased' };
    }

    // Check max purchases for special items
    if (item.maxPurchases) {
      const currentCount = state.purchaseCount || 0;
      if (currentCount >= item.maxPurchases) {
        return {
          success: false,
          message: `Maximum purchases reached (${item.maxPurchases})`,
        };
      }
    }

    // Calculate cost (bundles may have dynamic pricing)
    const cost = item.type === 'bundle'
      ? this.calculateBundlePrice(item)
      : item.cost;

    // Check if user has enough currency
    if (currency[item.currencyType] < cost) {
      return {
        success: false,
        message: `Not enough ${item.currencyType}. Need ${cost}, have ${currency[item.currencyType]}`,
      };
    }

    // Attempt to spend currency
    const success = spendCurrencyFn(item.currencyType, cost);
    if (!success) {
      return { success: false, message: 'Failed to process payment' };
    }

    // Mark as purchased
    state.isPurchased = true;
    state.purchaseCount = (state.purchaseCount || 0) + 1;
    this.itemStates.set(itemId, state);

    // Add to inventory
    this.inventory.set(itemId, {
      id: itemId,
      config: item,
      purchasedAt: new Date(),
      timesUsed: 0,
    });

    const itemsUnlocked: string[] = [itemId];

    // If it's a bundle, unlock all items in the bundle
    if (item.type === 'bundle' && item.items) {
      item.items.forEach((bundleItemId) => {
        const bundleItemState = this.itemStates.get(bundleItemId);
        if (bundleItemState) {
          bundleItemState.isPurchased = true;
          this.itemStates.set(bundleItemId, bundleItemState);

          const bundleItem = this.getItemConfig(bundleItemId);
          if (bundleItem) {
            this.inventory.set(bundleItemId, {
              id: bundleItemId,
              config: bundleItem,
              purchasedAt: new Date(),
              timesUsed: 0,
            });
            itemsUnlocked.push(bundleItemId);
          }
        }
      });
    }

    return {
      success: true,
      message: `Successfully purchased ${item.name}!`,
      itemsUnlocked,
    };
  }

  /**
   * Get mood-triggered outfit
   * Returns outfit ID if user's energy triggers an outfit change
   */
  getMoodTriggeredOutfit(userEnergy: number): string | null {
    const outfits = this.config.outfits.filter((outfit) => outfit.moodTrigger);

    for (const outfit of outfits) {
      const state = this.itemStates.get(outfit.id);
      if (!state?.isPurchased) continue;

      const trigger = outfit.moodTrigger!;

      switch (trigger.condition) {
        case 'lowEnergy':
          if (userEnergy < trigger.threshold) {
            return outfit.id;
          }
          break;
        case 'highEnergy':
          if (userEnergy > trigger.threshold) {
            return outfit.id;
          }
          break;
      }
    }

    return null;
  }

  /**
   * Update dynamic item variant based on daily progress
   */
  updateDynamicItemVariant(itemId: string, dailyProgress: number): void {
    const item = this.getItemConfig(itemId);
    const state = this.itemStates.get(itemId);

    if (!item?.dynamic || !state) return;

    // Find the highest variant the user has unlocked
    const variants = item.dynamic.variants;
    let currentVariant = 1;

    for (let i = variants.length - 1; i >= 0; i--) {
      if (dailyProgress >= variants[i].progressThreshold) {
        currentVariant = variants[i].level;
        break;
      }
    }

    if (state.currentVariant !== currentVariant) {
      state.currentVariant = currentVariant;
      this.itemStates.set(itemId, state);
    }
  }

  /**
   * Get current variant for a dynamic item
   */
  getCurrentVariant(itemId: string): number {
    const state = this.itemStates.get(itemId);
    return state?.currentVariant || 1;
  }

  /**
   * Get all item states (for persistence)
   */
  getItemStates(): Map<string, ShopItemState> {
    return this.itemStates;
  }

  /**
   * Load item states (from persistence)
   */
  loadItemStates(states: Map<string, ShopItemState>): void {
    this.itemStates = states;

    // Rebuild inventory from states
    this.inventory.clear();
    states.forEach((state, itemId) => {
      if (state.isPurchased) {
        const config = this.getItemConfig(itemId);
        if (config) {
          this.inventory.set(itemId, {
            id: itemId,
            config,
            purchasedAt: new Date(), // Can be enhanced with real timestamp
            timesUsed: 0,
          });
        }
      }
    });
  }

  /**
   * Export state for persistence
   */
  exportState(): {
    itemStates: Record<string, ShopItemState>;
    inventory: Record<string, InventoryItem>;
  } {
    return {
      itemStates: Object.fromEntries(this.itemStates),
      inventory: Object.fromEntries(this.inventory),
    };
  }

  /**
   * Import state from persistence
   */
  importState(data: {
    itemStates: Record<string, ShopItemState>;
    inventory: Record<string, InventoryItem>;
  }): void {
    this.itemStates = new Map(Object.entries(data.itemStates));
    this.inventory = new Map(Object.entries(data.inventory));
  }
}

// Singleton instance
export const shopManager = new ShopManager();
