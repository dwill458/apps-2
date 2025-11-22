/**
 * Avatar Configuration
 * Defines available outfits, accessories, and moods for the Sprout character
 */

export type OutfitType = 'farmer' | 'apron' | 'raincoat' | 'explorer';
export type AccessoryType = 'trowel' | 'watering-can' | 'rake' | 'magnifying-glass' | 'none';
export type MoodType = 'happy' | 'working' | 'idle' | 'sad' | 'celebrating';

// Color palette from specification
export const AvatarColors = {
  bodyGreen: '#A8D672',
  highlightGreen: '#C5E89B',
  leafGreen: '#6B9B3D',
  leafVein: '#4A7C2C',
  outline: '#3D2817',
  cheekPink: '#FFB6C1',

  // Outfit colors
  farmer: {
    denim: '#6B9AC4',
    plaid: '#C19A6B',
    plaidDark: '#8B6F47',
    straw: '#D4A574',
    strawBand: '#8B7355',
    boots: '#8B5A3C',
  },
  apron: {
    base: '#F5E6D3',
    trim: '#FF9B85',
    stripes: '#7BA05B',
    pants: '#7BA05B',
    boots: '#8B5A3C',
  },
  raincoat: {
    yellow: '#FFD700',
    pants: '#7BA05B',
  },
  explorer: {
    khaki: '#C4A574',
    cargo: '#B5A179',
    boots: '#8B5A3C',
    brown: '#8B5A3C',
  },

  // Accessory colors
  metal: '#C0C0C0',
  wood: '#8B5A3C',
  bucket: '#D4A574',
};

export const Outfits: Record<OutfitType, { name: string; unlockCost: number; unlockStreak?: number }> = {
  farmer: {
    name: 'Farmer with Straw Hat',
    unlockCost: 0, // Default outfit
  },
  apron: {
    name: 'Gardener with Floral Apron',
    unlockCost: 50,
  },
  raincoat: {
    name: 'Yellow Rain Gear',
    unlockCost: 100,
  },
  explorer: {
    name: 'Explorer/Botanist',
    unlockCost: 150,
  },
};

export const Accessories: Record<AccessoryType, { name: string; unlockCost: number }> = {
  none: {
    name: 'No Accessory',
    unlockCost: 0,
  },
  trowel: {
    name: 'Garden Trowel',
    unlockCost: 0, // Default for farmer
  },
  'watering-can': {
    name: 'Watering Can',
    unlockCost: 0, // Default for apron
  },
  rake: {
    name: 'Garden Rake',
    unlockCost: 30,
  },
  'magnifying-glass': {
    name: 'Magnifying Glass',
    unlockCost: 50,
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
