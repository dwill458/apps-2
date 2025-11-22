/**
 * Cozy Growth Button Component
 * Features wood texture effect and spring animations
 */

import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
  ActivityIndicator,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { Colors, Typography, Spacing, BorderRadius, Shadow } from '../../constants';
import * as Haptics from 'expo-haptics';

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'wood';
export type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: React.ReactNode;
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  style?: ViewStyle;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  icon,
  disabled = false,
  loading = false,
  fullWidth = false,
  style,
}) => {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.95, { damping: 15 });
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 15 });
  };

  const handlePress = () => {
    if (!disabled && !loading) {
      onPress();
    }
  };

  const buttonStyle = [
    styles.base,
    styles[variant],
    styles[size],
    fullWidth && styles.fullWidth,
    disabled && styles.disabled,
    style,
  ];

  const textStyle = [
    styles.text,
    styles[`${variant}Text`],
    styles[`${size}Text`],
    disabled && styles.disabledText,
  ];

  return (
    <AnimatedTouchable
      style={[buttonStyle, animatedStyle]}
      onPress={handlePress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={disabled || loading}
      activeOpacity={0.9}
    >
      {loading ? (
        <ActivityIndicator
          color={variant === 'primary' || variant === 'wood' ? Colors.text.inverse : Colors.primary.sage}
        />
      ) : (
        <>
          {icon}
          <Text style={textStyle}>{title}</Text>
        </>
      )}
    </AnimatedTouchable>
  );
};

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: BorderRadius.lg,
    gap: Spacing.sm,
  },

  // Variants
  primary: {
    backgroundColor: Colors.primary.sage,
    ...Shadow.md,
  },
  secondary: {
    backgroundColor: Colors.background.secondary,
    borderWidth: 2,
    borderColor: Colors.primary.sage,
  },
  ghost: {
    backgroundColor: 'transparent',
  },
  wood: {
    backgroundColor: Colors.secondary.wood,
    ...Shadow.lg,
  },

  // Sizes
  sm: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    minHeight: 36,
  },
  md: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    minHeight: 48,
  },
  lg: {
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.base,
    minHeight: 56,
  },

  // Text styles
  text: {
    ...Typography.styles.button,
    textAlign: 'center',
  },
  primaryText: {
    color: Colors.text.inverse,
  },
  secondaryText: {
    color: Colors.primary.sage,
  },
  ghostText: {
    color: Colors.primary.sage,
  },
  woodText: {
    color: Colors.text.inverse,
  },

  smText: {
    fontSize: Typography.fontSize.sm,
  },
  mdText: {
    fontSize: Typography.fontSize.base,
  },
  lgText: {
    fontSize: Typography.fontSize.lg,
  },

  // States
  disabled: {
    backgroundColor: Colors.state.disabled,
    opacity: 0.6,
  },
  disabledText: {
    color: Colors.text.secondary,
  },
  fullWidth: {
    width: '100%',
  },
});

export default Button;
