/**
 * Avatar Configuration
 * Defines available outfits, accessories, and moods for the Sprout character
 */

export type OutfitType = 'gardener' | 'raincoat' | 'apron' | 'explorer' | 'bee' | 'sweater';
export type AccessoryType = 'watering-can' | 'spade' | 'book' | 'glasses' | 'flower-crown' | 'treasure-chest';
export type MoodType = 'happy' | 'working' | 'idle' | 'sad' | 'celebrating';

export const Outfits: Record<OutfitType, { name: string; unlockCost: number; unlockStreak?: number }> = {
  gardener: {
    name: 'Gardener Hat & Overalls',
    unlockCost: 0, // Default outfit
  },
  apron: {
    name: 'Floral Apron',
    unlockCost: 50,
  },
  raincoat: {
    name: 'Yellow Raincoat',
    unlockCost: 100,
  },
  explorer: {
    name: 'Explorer Vest',
    unlockCost: 150,
  },
  bee: {
    name: 'Bee Costume',
    unlockCost: 200,
    unlockStreak: 7,
  },
  sweater: {
    name: 'Cozy Sweater',
    unlockCost: 100,
  },
};

export const Accessories: Record<AccessoryType, { name: string; unlockCost: number }> = {
  'watering-can': {
    name: 'Watering Can',
    unlockCost: 0, // Default
  },
  spade: {
    name: 'Garden Spade',
    unlockCost: 30,
  },
  book: {
    name: 'Seed Catalog',
    unlockCost: 50,
  },
  glasses: {
    name: 'Reading Glasses',
    unlockCost: 40,
  },
  'flower-crown': {
    name: 'Flower Crown',
    unlockCost: 80,
  },
  'treasure-chest': {
    name: 'Treasure Chest',
    unlockCost: 120,
  },
};

export const AvatarAnimationStates = {
  idle: {
    breathing: {
      scaleY: [1.0, 1.02, 1.0],
      scaleX: [1.0, 0.98, 1.0],
      duration: 2000,
    },
    blinking: {
      interval: 3000,
      duration: 100,
    },
  },
  working: {
    bounce: {
      translateY: [0, -5, 0, -3, 0],
      duration: 1000,
    },
  },
  happy: {
    jump: {
      translateY: [0, -20, 0],
      duration: 500,
    },
  },
  celebrating: {
    dance: {
      rotation: [0, -10, 10, -5, 5, 0],
      duration: 1500,
    },
  },
};
