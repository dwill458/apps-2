/**
 * Currency Bar Component
 * Displays Sunlight and Seeds currency
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, Typography, Spacing, BorderRadius } from '../../constants';

interface CurrencyBarProps {
  sunlight: number;
  seeds: number;
}

export const CurrencyBar: React.FC<CurrencyBarProps> = ({ sunlight, seeds }) => {
  return (
    <View style={styles.container}>
      <View style={styles.currencyItem}>
        <Text style={styles.icon}>☀️</Text>
        <Text style={styles.value}>{sunlight}</Text>
      </View>

      <View style={styles.divider} />

      <View style={styles.currencyItem}>
        <Text style={styles.icon}>🌰</Text>
        <Text style={styles.value}>{seeds}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background.secondary,
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.round,
    gap: Spacing.md,
  },
  currencyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  icon: {
    fontSize: 20,
  },
  value: {
    ...Typography.styles.button,
    color: Colors.text.primary,
  },
  divider: {
    width: 1,
    height: 20,
    backgroundColor: Colors.text.secondary,
    opacity: 0.3,
  },
});

export default CurrencyBar;
