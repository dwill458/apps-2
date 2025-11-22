/**
 * AvatarController - Manages Avatar State, Mood Triggers, and Dynamic Props
 */

import { OutfitType, AccessoryType, MoodType } from '../constants/avatar-config';
import { shopManager } from './ShopManager';
import { DailyProgress } from '../types';

export interface AvatarMoodContext {
  userEnergy: number; // 0-100
  tasksCompleted: number;
  currentStreak: number;
  timeOfDay: 'morning' | 'afternoon' | 'evening' | 'night';
  weatherMood: 'sunny' | 'rainy' | 'cloudy';
}

export interface AvatarRecommendation {
  outfit?: OutfitType | string;
  accessory?: AccessoryType | string;
  mood?: MoodType;
  reason: string;
  isAutomatic: boolean;
}

export class AvatarController {
  /**
   * Calculate user energy based on daily progress
   */
  calculateUserEnergy(dailyProgress: DailyProgress): number {
    const { minutesCompleted, goalMinutes } = dailyProgress;
    const progressPercent = Math.min(100, (minutesCompleted / goalMinutes) * 100);

    // Energy starts at 50 and increases with progress
    // Completing goal gives 100% energy
    return Math.min(100, 50 + progressPercent / 2);
  }

  /**
   * Get current time of day
   */
  getTimeOfDay(): 'morning' | 'afternoon' | 'evening' | 'night' {
    const hour = new Date().getHours();

    if (hour >= 6 && hour < 12) return 'morning';
    if (hour >= 12 && hour < 18) return 'afternoon';
    if (hour >= 18 && hour < 22) return 'evening';
    return 'night';
  }

  /**
   * Check for mood-triggered outfit changes
   * Returns outfit recommendation if user's state triggers an automatic change
   */
  checkMoodTriggers(context: AvatarMoodContext): AvatarRecommendation | null {
    const { userEnergy } = context;

    // Check if low energy should trigger raincoat
    const triggeredOutfit = shopManager.getMoodTriggeredOutfit(userEnergy);

    if (triggeredOutfit) {
      const item = shopManager.getItemConfig(triggeredOutfit);

      if (item && item.avatarType) {
        return {
          outfit: item.avatarType as OutfitType,
          reason: `Your energy is ${userEnergy}%. ${item.description}`,
          isAutomatic: true,
        };
      }
    }

    return null;
  }

  /**
   * Get outfit recommendation based on context (non-automatic suggestions)
   */
  getOutfitSuggestion(context: AvatarMoodContext): AvatarRecommendation | null {
    const { weatherMood, timeOfDay, currentStreak } = context;

    // Rainy weather suggests raincoat
    if (weatherMood === 'rainy') {
      const raincoat = shopManager.getItemConfig('outfit_raincoat');
      if (raincoat && shopManager.isItemPurchased('outfit_raincoat')) {
        return {
          outfit: raincoat.avatarType as OutfitType,
          reason: "It's a rainy mood day. Your raincoat might feel cozy!",
          isAutomatic: false,
        };
      }
    }

    // Evening suggests cozy sweater
    if (timeOfDay === 'evening' || timeOfDay === 'night') {
      const sweater = shopManager.getItemConfig('outfit_cozy_sweater');
      if (sweater && shopManager.isItemPurchased('outfit_cozy_sweater')) {
        return {
          outfit: sweater.avatarType as OutfitType,
          reason: "Evening vibes! Your cozy sweater would be perfect.",
          isAutomatic: false,
        };
      }
    }

    // Celebrate streak milestones with bee costume
    if (currentStreak >= 7) {
      const beeCostume = shopManager.getItemConfig('outfit_bee_costume');
      if (beeCostume && shopManager.isItemPurchased('outfit_bee_costume')) {
        return {
          outfit: beeCostume.avatarType as OutfitType,
          reason: `${currentStreak} day streak! You're a busy bee! 🐝`,
          isAutomatic: false,
        };
      }
    }

    return null;
  }

  /**
   * Get accessory recommendation based on current activity
   */
  getAccessoryForActivity(
    activity: 'working' | 'planning' | 'reflecting' | 'celebrating'
  ): AvatarRecommendation | null {
    let accessoryId: string | null = null;
    let reason = '';

    switch (activity) {
      case 'working':
        if (shopManager.isItemPurchased('accessory_trowel')) {
          accessoryId = 'accessory_trowel';
          reason = 'Time to dig into some tasks!';
        } else if (shopManager.isItemPurchased('accessory_rake')) {
          accessoryId = 'accessory_rake';
          reason = 'Let\'s clear away those mental weeds!';
        }
        break;

      case 'planning':
        if (shopManager.isItemPurchased('accessory_book')) {
          accessoryId = 'accessory_book';
          reason = 'Perfect time for reflection and planning!';
        } else if (shopManager.isItemPurchased('accessory_magnifying_glass')) {
          accessoryId = 'accessory_magnifying_glass';
          reason = 'Let\'s examine the details!';
        }
        break;

      case 'reflecting':
        if (shopManager.isItemPurchased('accessory_book')) {
          accessoryId = 'accessory_book';
          reason = 'Time to journal your growth!';
        }
        break;

      case 'celebrating':
        if (shopManager.isItemPurchased('accessory_flower_crown')) {
          accessoryId = 'accessory_flower_crown';
          reason = 'You deserve to celebrate!';
        }
        break;
    }

    if (accessoryId) {
      const item = shopManager.getItemConfig(accessoryId);
      if (item && item.avatarType) {
        return {
          accessory: item.avatarType as AccessoryType,
          reason,
          isAutomatic: false,
        };
      }
    }

    return null;
  }

  /**
   * Determine mood based on recent activity
   */
  determineMood(context: AvatarMoodContext): MoodType {
    const { userEnergy, tasksCompleted } = context;

    // Just completed a task - celebrating!
    if (tasksCompleted > 0 && userEnergy > 70) {
      return 'celebrating';
    }

    // High energy and working
    if (userEnergy > 50) {
      return 'happy';
    }

    // Low energy
    if (userEnergy < 30) {
      return 'sad';
    }

    // Default to idle
    return 'idle';
  }

  /**
   * Get dynamic watering can variant based on progress
   */
  getWateringCanVariant(dailyProgress: DailyProgress): {
    level: number;
    name: string;
  } {
    const progressPercent = Math.min(
      100,
      (dailyProgress.minutesCompleted / dailyProgress.goalMinutes) * 100
    );

    // Update the dynamic item in shop manager
    shopManager.updateDynamicItemVariant('accessory_watering_can', progressPercent);

    const currentLevel = shopManager.getCurrentVariant('accessory_watering_can');
    const item = shopManager.getItemConfig('accessory_watering_can');

    if (item?.dynamic) {
      const variant = item.dynamic.variants.find((v) => v.level === currentLevel);
      return {
        level: currentLevel,
        name: variant?.name || 'Basic Can',
      };
    }

    return { level: 1, name: 'Basic Can' };
  }

  /**
   * Auto-apply mood triggers and return changes made
   */
  autoApplyMoodTriggers(
    context: AvatarMoodContext,
    currentOutfit: OutfitType,
    allowOverride: boolean = false
  ): {
    outfitChanged: boolean;
    newOutfit?: OutfitType | string;
    recommendation?: AvatarRecommendation;
  } {
    const trigger = this.checkMoodTriggers(context);

    if (!trigger) {
      return { outfitChanged: false };
    }

    // If user has explicitly chosen an outfit recently, ask before changing
    // (This can be tracked via a timestamp in the future)
    if (!allowOverride && currentOutfit !== trigger.outfit) {
      return {
        outfitChanged: false,
        recommendation: trigger,
      };
    }

    return {
      outfitChanged: true,
      newOutfit: trigger.outfit,
      recommendation: trigger,
    };
  }

  /**
   * Get comprehensive avatar state recommendation
   */
  getFullRecommendation(
    context: AvatarMoodContext,
    dailyProgress: DailyProgress,
    currentActivity?: 'working' | 'planning' | 'reflecting' | 'celebrating'
  ): {
    outfit?: AvatarRecommendation;
    accessory?: AvatarRecommendation;
    mood: MoodType;
    wateringCan: { level: number; name: string };
  } {
    // Check for mood-triggered outfit
    let outfitRec = this.checkMoodTriggers(context);

    // If no trigger, get suggestion
    if (!outfitRec) {
      outfitRec = this.getOutfitSuggestion(context);
    }

    // Get accessory based on activity
    const accessoryRec = currentActivity
      ? this.getAccessoryForActivity(currentActivity)
      : null;

    // Determine mood
    const mood = this.determineMood(context);

    // Get watering can variant
    const wateringCan = this.getWateringCanVariant(dailyProgress);

    return {
      outfit: outfitRec || undefined,
      accessory: accessoryRec || undefined,
      mood,
      wateringCan,
    };
  }
}

// Singleton instance
export const avatarController = new AvatarController();
