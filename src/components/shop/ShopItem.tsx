/**
 * ShopItem Component
 * Individual shop item card with purchase/locked states
 */

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { ShopItemConfig } from '../../types/shop';
import { colors, spacing, typography } from '../../constants';

interface ShopItemProps {
  item: ShopItemConfig;
  isUnlocked: boolean;
  isPurchased: boolean;
  canAfford: boolean;
  onPress: () => void;
}

export const ShopItem: React.FC<ShopItemProps> = ({
  item,
  isUnlocked,
  isPurchased,
  canAfford,
  onPress,
}) => {
  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress();
  };

  const getRarityColors = () => {
    switch (item.rarity) {
      case 'common':
        return ['#8BA888', '#A8D8A5'];
      case 'uncommon':
        return ['#6B9B3D', '#8BC34A'];
      case 'rare':
        return ['#5C7A58', '#7BA05B'];
      case 'epic':
        return ['#FFD166', '#FFE082'];
      case 'legendary':
        return ['#EF8354', '#FF9E80'];
      default:
        return ['#8BA888', '#A8D8A5'];
    }
  };

  const getContainerStyle = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      ...styles.card,
      borderColor: getRarityColors()[0],
    };

    if (!isUnlocked) {
      return {
        ...baseStyle,
        opacity: 0.5,
        backgroundColor: '#F0F0F0',
      };
    }

    if (isPurchased) {
      return {
        ...baseStyle,
        borderWidth: 3,
        borderColor: colors.primary.moss,
      };
    }

    if (!canAfford) {
      return {
        ...baseStyle,
        opacity: 0.7,
      };
    }

    return baseStyle;
  };

  return (
    <TouchableOpacity
      style={getContainerStyle()}
      onPress={handlePress}
      disabled={!isUnlocked || isPurchased}
      activeOpacity={0.8}
    >
      {/* Rarity Indicator */}
      <LinearGradient
        colors={getRarityColors()}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.rarityStripe}
      />

      {/* Icon */}
      <View style={styles.iconContainer}>
        <Text style={styles.icon}>{item.icon}</Text>
        {isPurchased && (
          <View style={styles.ownedBadge}>
            <Text style={styles.ownedText}>✓</Text>
          </View>
        )}
        {!isUnlocked && (
          <View style={styles.lockedOverlay}>
            <Text style={styles.lockIcon}>🔒</Text>
          </View>
        )}
      </View>

      {/* Name */}
      <Text style={styles.name} numberOfLines={2}>
        {item.name}
      </Text>

      {/* Price / Status */}
      <View style={styles.footer}>
        {isPurchased ? (
          <View style={styles.ownedTag}>
            <Text style={styles.ownedTagText}>Owned</Text>
          </View>
        ) : !isUnlocked && item.unlockRequirement ? (
          <View style={styles.lockRequirement}>
            <Text style={styles.lockRequirementText} numberOfLines={2}>
              🔒 {item.unlockRequirement.description}
            </Text>
          </View>
        ) : (
          <View style={styles.priceContainer}>
            <Text style={[styles.price, !canAfford && styles.priceUnaffordable]}>
              {item.cost}
            </Text>
            <Text style={styles.currency}>
              {item.currencyType === 'sunlight' ? '☀️' : item.currencyType === 'seeds' ? '🌰' : '💎'}
            </Text>
          </View>
        )}
      </View>

      {/* Special Tags */}
      {item.tags.includes('new') && (
        <View style={styles.newBadge}>
          <Text style={styles.newBadgeText}>NEW</Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.background.cream,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: colors.primary.sage,
    padding: spacing.md,
    aspectRatio: 0.85,
    alignItems: 'center',
    justifyContent: 'space-between',
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  rarityStripe: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 4,
    borderTopLeftRadius: 14,
    borderTopRightRadius: 14,
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#F5F5F5',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.sm,
    position: 'relative',
  },
  icon: {
    fontSize: 36,
  },
  ownedBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.primary.moss,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.background.cream,
  },
  ownedText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  lockedOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.4)',
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  lockIcon: {
    fontSize: 28,
  },
  name: {
    fontSize: typography.sizes.sm,
    fontWeight: '600',
    color: colors.text.primary,
    textAlign: 'center',
    marginTop: spacing.xs,
    minHeight: 36,
  },
  footer: {
    width: '100%',
    marginTop: spacing.xs,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
  },
  price: {
    fontSize: typography.sizes.md,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginRight: 4,
  },
  priceUnaffordable: {
    color: colors.semantic.coral,
  },
  currency: {
    fontSize: typography.sizes.md,
  },
  ownedTag: {
    backgroundColor: colors.primary.moss,
    borderRadius: 12,
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
    alignItems: 'center',
  },
  ownedTagText: {
    color: '#FFFFFF',
    fontSize: typography.sizes.sm,
    fontWeight: 'bold',
  },
  lockRequirement: {
    backgroundColor: '#FFE0B2',
    borderRadius: 12,
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
    alignItems: 'center',
  },
  lockRequirementText: {
    color: '#E65100',
    fontSize: typography.sizes.xs,
    fontWeight: '600',
    textAlign: 'center',
  },
  newBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: colors.accent.warmGold,
    borderRadius: 8,
    paddingVertical: 2,
    paddingHorizontal: 6,
  },
  newBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: 'bold',
  },
});
