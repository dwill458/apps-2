# 🚀 Quick Implementation Guide

## Integration Steps

### Step 1: Add Shop to Navigation

```typescript
// app/(tabs)/shop.tsx
import { ShopScreen } from '../../src/components/shop';

export default function ShopTab() {
  return <ShopScreen />;
}
```

### Step 2: Add Inventory to Navigation

```typescript
// app/(tabs)/wardrobe.tsx
import { InventoryScreen } from '../../src/components/shop';

export default function WardrobeTab() {
  return <InventoryScreen />;
}
```

### Step 3: Integrate Avatar Controller in Home Screen

```typescript
// app/(tabs)/index.tsx
import { useEffect } from 'react';
import { avatarController } from '../../src/managers/AvatarController';
import { SproutAvatar } from '../../src/components/avatar/SproutAvatar';
import { useStore } from '../../src/store/useStore';

export default function HomeScreen() {
  const avatar = useStore(state => state.avatar);
  const dailyProgress = useStore(state => state.dailyProgress);
  const streakData = useStore(state => state.streakData);
  const setAvatarOutfit = useStore(state => state.setAvatarOutfit);

  // Calculate watering can level
  const wateringCanVariant = avatarController.getWateringCanVariant(dailyProgress);

  // Check for mood triggers on progress change
  useEffect(() => {
    const context = {
      userEnergy: avatarController.calculateUserEnergy(dailyProgress),
      tasksCompleted: dailyProgress.tasksCompleted,
      currentStreak: streakData.currentStreak,
      timeOfDay: avatarController.getTimeOfDay(),
      weatherMood: useStore.getState().weatherMood,
    };

    const trigger = avatarController.checkMoodTriggers(context);
    if (trigger && trigger.outfit) {
      // Optional: Show a gentle notification
      // "You seem tired! Would you like to wear your raincoat?"
      console.log('Outfit suggestion:', trigger.reason);
      // Auto-apply or ask user
      // setAvatarOutfit(trigger.outfit);
    }
  }, [dailyProgress.minutesCompleted, streakData.currentStreak]);

  return (
    <View style={styles.container}>
      {/* Your garden scene */}
      <SproutAvatar
        outfit={avatar.outfit}
        accessory={avatar.accessory}
        mood={avatar.mood}
        size={200}
        wateringCanLevel={wateringCanVariant.level}
      />

      {/* Show watering can upgrade notification */}
      {wateringCanVariant.level > 1 && (
        <Text>🎉 Your watering can upgraded to {wateringCanVariant.name}!</Text>
      )}
    </View>
  );
}
```

### Step 4: Add Unlock Notifications

```typescript
// In your main layout or app component
import { shopManager } from '../src/managers/ShopManager';

useEffect(() => {
  const newlyUnlocked = shopManager.checkUnlockRequirements(
    streakData,
    totalTasksCompleted
  );

  if (newlyUnlocked.length > 0) {
    newlyUnlocked.forEach(itemId => {
      const item = shopManager.getItemConfig(itemId);
      if (item) {
        // Show toast/notification
        Alert.alert(
          '🎉 New Item Unlocked!',
          `${item.name} is now available in the shop!`,
          [{ text: 'View Shop', onPress: () => router.push('/shop') }]
        );
      }
    });
  }
}, [streakData.currentStreak, totalTasksCompleted]);
```

### Step 5: Persist Shop State

```typescript
// src/utils/storage.ts
import AsyncStorage from '@react-native-async-storage/async-storage';
import { shopManager } from '../managers/ShopManager';

export const shopStorage = {
  async saveState() {
    const state = shopManager.exportState();
    await AsyncStorage.setItem('@cozy_growth:shop_state', JSON.stringify(state));
  },

  async loadState() {
    const saved = await AsyncStorage.getItem('@cozy_growth:shop_state');
    if (saved) {
      shopManager.importState(JSON.parse(saved));
    }
  }
};

// In your app initialization (App.tsx or _layout.tsx)
useEffect(() => {
  shopStorage.loadState();
}, []);

// Save on every purchase
// (Already handled in ShopManager, but you can also save periodically)
```

## Example: Complete Purchase Flow

```typescript
import { useState } from 'react';
import { shopManager } from '../../src/managers/ShopManager';
import { useStore } from '../../src/store/useStore';

function PurchaseExample() {
  const [result, setResult] = useState(null);
  const currency = useStore(state => state.currency);
  const spendCurrency = useStore(state => state.spendCurrency);
  const setAvatarOutfit = useStore(state => state.setAvatarOutfit);

  const handlePurchase = () => {
    const purchaseResult = shopManager.purchaseItem(
      'outfit_bee_costume',
      currency,
      spendCurrency
    );

    if (purchaseResult.success) {
      // Success!
      setResult('Purchased! 🎉');

      // Auto-equip the outfit
      const item = shopManager.getItemConfig('outfit_bee_costume');
      if (item && item.avatarType) {
        setAvatarOutfit(item.avatarType);
      }

      // Save state
      shopStorage.saveState();
    } else {
      // Failed
      setResult(purchaseResult.message);
    }
  };

  return (
    <View>
      <Text>Sunlight: {currency.sunlight}</Text>
      <Button title="Buy Bee Costume (200 Sunlight)" onPress={handlePurchase} />
      {result && <Text>{result}</Text>}
    </View>
  );
}
```

## Example: Mood-Based Recommendations

```typescript
import { avatarController } from '../../src/managers/AvatarController';

function MoodRecommendationExample() {
  const [recommendation, setRecommendation] = useState(null);
  const dailyProgress = useStore(state => state.dailyProgress);
  const streakData = useStore(state => state.streakData);

  const checkRecommendation = () => {
    const context = {
      userEnergy: avatarController.calculateUserEnergy(dailyProgress),
      tasksCompleted: dailyProgress.tasksCompleted,
      currentStreak: streakData.currentStreak,
      timeOfDay: avatarController.getTimeOfDay(),
      weatherMood: 'rainy',
    };

    const rec = avatarController.getFullRecommendation(
      context,
      dailyProgress,
      'working' // current activity
    );

    setRecommendation(rec);
  };

  return (
    <View>
      <Button title="Get Outfit Suggestion" onPress={checkRecommendation} />

      {recommendation?.outfit && (
        <View>
          <Text>Suggested Outfit: {recommendation.outfit.outfit}</Text>
          <Text>Reason: {recommendation.outfit.reason}</Text>
        </View>
      )}

      {recommendation?.accessory && (
        <View>
          <Text>Suggested Accessory: {recommendation.accessory.accessory}</Text>
          <Text>Reason: {recommendation.accessory.reason}</Text>
        </View>
      )}

      <Text>Recommended Mood: {recommendation?.mood}</Text>
      <Text>Watering Can: Level {recommendation?.wateringCan.level}</Text>
    </View>
  );
}
```

## Testing the System

### 1. Test Purchase Flow
```typescript
// Give yourself test currency
useStore.setState({
  currency: { sunlight: 1000, seeds: 100, bloomPoints: 50 }
});

// Try purchasing items
// Check that currency is deducted
// Check that item appears in inventory
```

### 2. Test Unlocks
```typescript
// Set high streak to unlock items
useStore.setState({
  streakData: { ...streakData, currentStreak: 10 }
});

// Check what unlocked
const unlocked = shopManager.checkUnlockRequirements(
  useStore.getState().streakData,
  50 // total tasks
);
console.log('Unlocked items:', unlocked);
```

### 3. Test Watering Can Progression
```typescript
// Set progress to 0%
useStore.setState({
  dailyProgress: { ...dailyProgress, minutesCompleted: 0 }
});
// Should show Level 1 (Gray)

// Set progress to 60%
useStore.setState({
  dailyProgress: { ...dailyProgress, minutesCompleted: 18, goalMinutes: 30 }
});
// Should show Level 2 (Silver)

// Set progress to 100%
useStore.setState({
  dailyProgress: { ...dailyProgress, minutesCompleted: 30, goalMinutes: 30 }
});
// Should show Level 3 (Gold) ✨
```

### 4. Test Mood Triggers
```typescript
// Set low energy
useStore.setState({
  dailyProgress: { ...dailyProgress, minutesCompleted: 2, goalMinutes: 30 }
});

const context = {
  userEnergy: 25, // Low energy!
  tasksCompleted: 0,
  currentStreak: 1,
  timeOfDay: 'morning',
  weatherMood: 'sunny',
};

const trigger = avatarController.checkMoodTriggers(context);
// Should suggest raincoat outfit
```

## Next Steps

1. ✅ Add shop and wardrobe tabs to navigation
2. ✅ Integrate avatar controller in home screen
3. ✅ Set up state persistence
4. ✅ Add unlock notifications
5. ✅ Test purchase flow
6. 🎨 Create missing outfit/accessory SVG components
7. 🔊 Add sound effects for purchases
8. ✨ Add celebration animations for unlocks
9. 📊 Add analytics tracking
10. 🧪 Write unit tests for ShopManager

---

**Happy coding! 🌱**
