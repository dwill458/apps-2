/**
 * Cozy Growth Card Component
 * Soft, rounded cards with diffuse shadows
 */

import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { Colors, Spacing, BorderRadius, Shadow } from '../../constants';

export type CardVariant = 'default' | 'parchment' | 'elevated' | 'flat';

type SpacingKey = 'xs' | 'sm' | 'md' | 'base' | 'lg' | 'xl' | 'xxl' | 'xxxl' | 'huge' | 'massive' | 'screenPadding' | 'cardPadding' | 'buttonPadding';

interface CardProps {
  children: React.ReactNode;
  variant?: CardVariant;
  padding?: SpacingKey;
  style?: ViewStyle;
}

export const Card: React.FC<CardProps> = ({
  children,
  variant = 'default',
  padding = 'base',
  style,
}) => {
  const cardStyle = [
    styles.base,
    styles[variant],
    { padding: Spacing[padding] },
    style,
  ];

  return <View style={cardStyle}>{children}</View>;
};

const styles = StyleSheet.create({
  base: {
    borderRadius: BorderRadius.xl,
    overflow: 'hidden',
  },

  default: {
    backgroundColor: Colors.background.card,
    ...Shadow.md,
  },

  parchment: {
    backgroundColor: Colors.background.secondary,
    ...Shadow.sm,
  },

  elevated: {
    backgroundColor: Colors.background.card,
    ...Shadow.lg,
  },

  flat: {
    backgroundColor: Colors.background.card,
  },
});

export default Card;
