# 🌱 Sprout Avatar & Shop System - Technical Documentation

## Overview

A comprehensive, modular character customization and shop system for the Cozy Growth app. Features dynamic props, mood-based outfit recommendations, JSON-driven configuration, and gamified progression.

## Architecture

### 1. Data Models (`src/types/shop.ts`)

**Core Types:**
```typescript
- ShopItemConfig: Configuration for shop items (outfits, accessories, bundles, specials)
- ShopItemState: Runtime state (unlocked, purchased, variant level)
- InventoryItem: User-owned items with metadata
- UnlockRequirement: Streak/task/day-based unlock conditions
- MoodTrigger: Automatic outfit changes based on user state
```

### 2. Configuration (`src/constants/shop-config.json`)

**JSON-Driven Shop Items:**
- ✅ **Modular Design**: Add new items without code changes
- ✅ **Rich Metadata**: Name, description, icon, rarity, tags
- ✅ **Unlock Logic**: Streak-based, task-based, or day-based unlocks
- ✅ **Dynamic Items**: Watering can with 3 progression levels
- ✅ **Bundles**: Grouped items with discounts

**Example Item:**
```json
{
  "id": "outfit_bee_costume",
  "type": "outfit",
  "name": "Bee Costume",
  "description": "Buzz buzz! A sweet bee outfit...",
  "avatarType": "bee",
  "cost": 200,
  "currencyType": "sunlight",
  "icon": "🐝",
  "rarity": "epic",
  "unlockRequirement": {
    "type": "streak",
    "value": 7,
    "description": "Maintain a 7-day streak"
  },
  "tags": ["special", "cute", "streak-reward"]
}
```

### 3. Business Logic (`src/managers/ShopManager.ts`)

**Responsibilities:**
- Item state management (unlocked, purchased, variants)
- Purchase flow with currency validation
- Unlock requirement checks
- Bundle processing
- Dynamic item progression
- State persistence

**Key Methods:**
```typescript
shopManager.purchaseItem(itemId, currency, spendFn) → PurchaseResult
shopManager.checkUnlockRequirements(streakData, totalTasks) → string[]
shopManager.updateDynamicItemVariant(itemId, progress) → void
shopManager.getInventory() → InventoryItem[]
```

### 4. Avatar Intelligence (`src/managers/AvatarController.ts`)

**Mood-Based Outfit System:**
```typescript
// Automatic Triggers
- Low energy (< 30%) → Raincoat outfit
- User can override automatic changes

// Recommendations (non-automatic)
- Rainy mood → Raincoat
- Evening time → Cozy Sweater
- 7+ day streak → Bee Costume
```

**Dynamic Prop Progression:**
```typescript
Watering Can Levels:
- Level 1 (Gray): 0-49% daily progress
- Level 2 (Silver): 50-99% daily progress
- Level 3 (Gold): 100% daily progress
```

**Key Methods:**
```typescript
avatarController.checkMoodTriggers(context) → AvatarRecommendation | null
avatarController.getOutfitSuggestion(context) → AvatarRecommendation | null
avatarController.getWateringCanVariant(dailyProgress) → {level, name}
avatarController.determineMood(context) → MoodType
```

### 5. UI Components

#### ShopScreen (`src/components/shop/ShopScreen.tsx`)
- Category tabs (Outfits, Accessories, Bundles, Special)
- Grid layout with locked/unlocked states
- Currency display (Sunlight, Seeds, Bloom Points)
- Purchase modal with preview

#### InventoryScreen (`src/components/shop/InventoryScreen.tsx`)
- Avatar preview with current outfit
- Equip/unequip functionality
- Watering can level display
- Owned items grid

#### ShopItem (`src/components/shop/ShopItem.tsx`)
- Rarity-based styling
- Locked/unlocked states
- Purchase/owned badges
- Unlock requirement display

### 6. Avatar Component (`src/components/avatar/`)

**Enhanced SproutAvatar:**
```typescript
<SproutAvatar
  outfit="farmer"
  accessory="watering-can"
  mood="happy"
  size={120}
  wateringCanLevel={3} // NEW: Dynamic progression
/>
```

**WateringCanAccessory:**
- 3 visual variants (Basic, Silver, Gold)
- Gradient effects and sparkles
- Automatic level detection

## Usage Guide

### Adding a New Outfit

1. **Add to `shop-config.json`:**
```json
{
  "id": "outfit_space_suit",
  "type": "outfit",
  "name": "Space Suit",
  "description": "Reach for the stars!",
  "avatarType": "space",
  "cost": 250,
  "currencyType": "sunlight",
  "icon": "🚀",
  "rarity": "epic",
  "unlockRequirement": {
    "type": "totalTasks",
    "value": 100,
    "description": "Complete 100 tasks"
  },
  "tags": ["special", "achievement"]
}
```

2. **Create Outfit Component:**
```typescript
// src/components/avatar/outfits/SpaceOutfit.tsx
export const SpaceOutfit: React.FC<{size: number}> = ({size}) => {
  // SVG implementation
};
```

3. **Update Avatar Config:**
```typescript
// src/constants/avatar-config.ts
export type OutfitType = 'farmer' | 'apron' | 'raincoat' | 'explorer' | 'space';
```

4. **Update SproutAvatar Renderer:**
```typescript
// src/components/avatar/SproutAvatar.tsx
case 'space':
  return <SpaceOutfit size={size} />;
```

**That's it!** The shop system automatically picks up the new item.

### Implementing Mood Triggers

**Scenario:** Auto-equip "Focused Mode" outfit during work sessions

```json
{
  "id": "outfit_focused",
  "moodTrigger": {
    "condition": "highEnergy",
    "threshold": 80
  }
}
```

The `AvatarController` will automatically suggest this outfit when `userEnergy > 80`.

### Creating Dynamic Items

**Scenario:** Sunglasses that upgrade based on streak

```json
{
  "id": "accessory_sunglasses",
  "dynamic": {
    "scalesWithProgress": true,
    "variants": [
      {"level": 1, "name": "Basic Shades", "progressThreshold": 0},
      {"level": 2, "name": "Cool Shades", "progressThreshold": 50},
      {"level": 3, "name": "Ultra Shades", "progressThreshold": 100}
    ]
  }
}
```

Update variants in component:
```typescript
// In SunglassesAccessory.tsx
const LEVEL_STYLES = {
  1: { color: '#888888' },
  2: { color: '#333333' },
  3: { color: '#000000', glow: true }
};
```

## Integration with Zustand Store

### Purchase Flow
```typescript
// In your component
const currency = useStore(state => state.currency);
const spendCurrency = useStore(state => state.spendCurrency);

const result = shopManager.purchaseItem(
  'outfit_bee_costume',
  currency,
  spendCurrency
);

if (result.success) {
  // Update avatar outfit
  useStore.setState({ avatar: { ...avatar, outfit: 'bee' }});
}
```

### Unlock Checks (Run on Progress Update)
```typescript
useEffect(() => {
  const newlyUnlocked = shopManager.checkUnlockRequirements(
    streakData,
    totalTasksCompleted
  );

  // Show unlock notification
  newlyUnlocked.forEach(itemId => {
    showNotification(`New item unlocked: ${itemId}`);
  });
}, [streakData.currentStreak, totalTasksCompleted]);
```

### Dynamic Watering Can
```typescript
// Update on daily progress change
const wateringCanVariant = avatarController.getWateringCanVariant(dailyProgress);

// Render with level
<SproutAvatar
  accessory="watering-can"
  wateringCanLevel={wateringCanVariant.level}
/>
```

### Mood-Based Outfit
```typescript
// Check for automatic triggers
const context: AvatarMoodContext = {
  userEnergy: avatarController.calculateUserEnergy(dailyProgress),
  tasksCompleted: dailyProgress.tasksCompleted,
  currentStreak: streakData.currentStreak,
  timeOfDay: avatarController.getTimeOfDay(),
  weatherMood: 'rainy'
};

const trigger = avatarController.checkMoodTriggers(context);
if (trigger && trigger.outfit) {
  // Ask user or auto-apply
  setAvatarOutfit(trigger.outfit as OutfitType);
}
```

## Data Flow

```
User Progress (Tasks, Streaks, Daily Progress)
    ↓
ShopManager.checkUnlockRequirements()
    ↓
New Items Unlocked
    ↓
ShopScreen displays unlocked items
    ↓
User purchases item
    ↓
ShopManager.purchaseItem() → Deduct currency
    ↓
Add to Inventory
    ↓
InventoryScreen shows owned items
    ↓
User equips item
    ↓
SproutAvatar renders with new outfit/accessory
    ↓
AvatarController checks for mood triggers
    ↓
(Optional) Auto-suggest outfit based on state
```

## State Persistence

**ShopManager State:**
```typescript
// Export for AsyncStorage
const state = shopManager.exportState();
await AsyncStorage.setItem('@shop_state', JSON.stringify(state));

// Import on app load
const saved = await AsyncStorage.getItem('@shop_state');
if (saved) {
  shopManager.importState(JSON.parse(saved));
}
```

## Testing Checklist

- [ ] Purchase item with sufficient currency
- [ ] Attempt purchase with insufficient currency
- [ ] Unlock item via streak milestone
- [ ] Unlock item via task completion
- [ ] Equip outfit from inventory
- [ ] Equip accessory from inventory
- [ ] Watering can level 1 → 2 → 3 progression
- [ ] Low energy triggers raincoat suggestion
- [ ] Bundle purchase unlocks all items
- [ ] Locked item displays unlock requirement
- [ ] Owned item shows "Owned" badge

## File Structure

```
src/
├── types/
│   └── shop.ts                     # TypeScript interfaces
├── constants/
│   ├── shop-config.json            # Shop items configuration
│   └── avatar-config.ts            # Avatar types and colors
├── managers/
│   ├── ShopManager.ts              # Shop business logic
│   └── AvatarController.ts         # Mood triggers & dynamic props
├── components/
│   ├── shop/
│   │   ├── ShopScreen.tsx          # Main shop UI
│   │   ├── ShopItem.tsx            # Individual item card
│   │   ├── InventoryScreen.tsx     # User's wardrobe
│   │   └── index.ts
│   └── avatar/
│       ├── SproutAvatar.tsx        # Main avatar component
│       ├── outfits/
│       │   ├── FarmerOutfit.tsx
│       │   ├── ApronOutfit.tsx
│       │   └── ... (add new ones here)
│       └── accessories/
│           ├── WateringCanAccessory.tsx  # ✨ Enhanced with levels
│           └── ... (add new ones here)
└── store/
    └── useStore.ts                 # Zustand store integration
```

## Performance Considerations

- **Lazy Loading**: Shop items are loaded from JSON once on initialization
- **Memoization**: Use React.memo for ShopItem components
- **State Batching**: Zustand handles batched updates efficiently
- **Asset Optimization**: SVG components are lightweight
- **Virtualization**: Consider FlatList for large inventories

## Extensibility Examples

### Adding a Pet System
```json
{
  "id": "pet_butterfly",
  "type": "pet",
  "name": "Garden Butterfly",
  "cost": 300,
  "currencyType": "seeds",
  "unlockRequirement": {
    "type": "totalDays",
    "value": 30
  }
}
```

### Seasonal Items
```json
{
  "id": "outfit_winter_coat",
  "tags": ["seasonal", "winter"],
  "availableFrom": "2025-12-01",
  "availableTo": "2026-02-28"
}
```

### Achievement-Based Unlocks
```json
{
  "unlockRequirement": {
    "type": "achievement",
    "value": "complete_first_goal",
    "description": "Complete your first goal"
  }
}
```

## Credits

Built with ❤️ for the ADHD community. Every tiny customization is growth worth celebrating! 🌱

---

**Version:** 1.0
**Last Updated:** 2025-11-22
**Author:** Claude (Senior Game Systems Architect)
