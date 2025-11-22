/**
 * Enhanced Shop System Types
 */

import { OutfitType, AccessoryType } from '../constants/avatar-config';

export type ShopItemType = 'outfit' | 'accessory' | 'bundle' | 'special';
export type CurrencyType = 'sunlight' | 'seeds' | 'bloomPoints';
export type RarityLevel = 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';

export interface UnlockRequirement {
  type: 'streak' | 'totalTasks' | 'totalDays';
  value: number;
  description: string;
}

export interface MoodTrigger {
  condition: 'lowEnergy' | 'highEnergy' | 'stressed' | 'calm';
  threshold: number;
}

export interface DynamicVariant {
  level: number;
  name: string;
  progressThreshold: number;
}

export interface ShopItemConfig {
  id: string;
  type: ShopItemType;
  name: string;
  description: string;
  avatarType?: OutfitType | AccessoryType | string;
  cost: number;
  currencyType: CurrencyType;
  icon: string;
  rarity: RarityLevel;
  unlockRequirement?: UnlockRequirement;
  tags: string[];
  moodTrigger?: MoodTrigger;
  dynamic?: {
    scalesWithProgress: boolean;
    variants: DynamicVariant[];
  };
  effect?: string;
  effectValue?: number;
  maxPurchases?: number;
  items?: string[]; // For bundles
  discount?: number; // For bundles
}

export interface ShopItemState {
  id: string;
  isUnlocked: boolean;
  isPurchased: boolean;
  purchaseCount?: number; // For items with maxPurchases
  currentVariant?: number; // For dynamic items
}

export interface InventoryItem {
  id: string;
  config: ShopItemConfig;
  purchasedAt: Date;
  timesUsed?: number;
}

export interface ShopConfig {
  outfits: ShopItemConfig[];
  accessories: ShopItemConfig[];
  bundles: ShopItemConfig[];
  special: ShopItemConfig[];
  rarity: Record<RarityLevel, {
    color: string;
    label: string;
    borderStyle: string;
  }>;
}

export interface PurchaseResult {
  success: boolean;
  message: string;
  itemsUnlocked?: string[];
}
