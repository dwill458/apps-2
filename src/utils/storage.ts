/**
 * Storage Utilities
 * AsyncStorage wrapper for persisting app state
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import type { OnboardingState } from '../types';

const STORAGE_KEYS = {
  ONBOARDING: '@cozy_growth:onboarding_state',
  USER: '@cozy_growth:user',
  CURRENCY: '@cozy_growth:currency',
  TASKS: '@cozy_growth:tasks',
  GOALS: '@cozy_growth:goals',
  STREAKS: '@cozy_growth:streaks',
  IS_ONBOARDED: '@cozy_growth:is_onboarded',
};

// Generic storage functions
export const storage = {
  async get<T>(key: string): Promise<T | null> {
    try {
      const value = await AsyncStorage.getItem(key);
      return value ? JSON.parse(value) : null;
    } catch (error) {
      console.error(`Error reading ${key}:`, error);
      return null;
    }
  },

  async set(key: string, value: any): Promise<void> {
    try {
      await AsyncStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`Error saving ${key}:`, error);
    }
  },

  async remove(key: string): Promise<void> {
    try {
      await AsyncStorage.removeItem(key);
    } catch (error) {
      console.error(`Error removing ${key}:`, error);
    }
  },

  async clear(): Promise<void> {
    try {
      await AsyncStorage.clear();
    } catch (error) {
      console.error('Error clearing storage:', error);
    }
  },
};

// Onboarding-specific functions
export const onboardingStorage = {
  async getState(): Promise<OnboardingState | null> {
    return storage.get<OnboardingState>(STORAGE_KEYS.ONBOARDING);
  },

  async saveState(state: OnboardingState): Promise<void> {
    return storage.set(STORAGE_KEYS.ONBOARDING, state);
  },

  async clearState(): Promise<void> {
    return storage.remove(STORAGE_KEYS.ONBOARDING);
  },

  async isOnboarded(): Promise<boolean> {
    const value = await storage.get<boolean>(STORAGE_KEYS.IS_ONBOARDED);
    return value === true;
  },

  async setOnboarded(value: boolean): Promise<void> {
    return storage.set(STORAGE_KEYS.IS_ONBOARDED, value);
  },
};

export default storage;
