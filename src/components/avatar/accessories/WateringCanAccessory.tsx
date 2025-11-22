/**
 * Watering Can Accessory Component
 * Metal watering can with spout - upgrades as daily progress increases!
 * Level 1: Basic (Gray/Silver) - 0-49% progress
 * Level 2: Silver (Bright Silver) - 50-99% progress
 * Level 3: Golden (Gold) - 100% progress
 */

import React from 'react';
import Svg, { Path, Rect, Circle, Ellipse, G, Defs, RadialGradient, Stop } from 'react-native-svg';
import { AvatarColors } from '../../../constants/avatar-config';

interface WateringCanAccessoryProps {
  size: number;
  position?: 'left' | 'right';
  level?: 1 | 2 | 3; // Progress-based variant
}

const LEVEL_COLORS = {
  1: {
    // Basic - Gray metal
    primary: '#C0C0C0',
    secondary: '#A8A8A8',
    highlight: '#E0E0E0',
    glow: false,
  },
  2: {
    // Silver - Bright silver
    primary: '#E8E8E8',
    secondary: '#D0D0D0',
    highlight: '#FFFFFF',
    glow: true,
    glowColor: '#FFFFFF',
  },
  3: {
    // Golden - Gold
    primary: '#FFD700',
    secondary: '#FFC700',
    highlight: '#FFED4E',
    glow: true,
    glowColor: '#FFD700',
  },
};

export const WateringCanAccessory: React.FC<WateringCanAccessoryProps> = ({
  size,
  position = 'left',
  level = 1,
}) => {
  const scale = size / 100;
  const colors = LEVEL_COLORS[level];

  return (
    <Svg
      width={size * 0.5}
      height={size * 0.5}
      viewBox="0 0 50 50"
      style={{ position: 'absolute', bottom: size * 0.35, [position]: -size * 0.05 }}
    >
      <Defs>
        {/* Gradient for metallic/golden effect */}
        <RadialGradient id={`canGradient${level}`} cx="50%" cy="50%">
          <Stop offset="0%" stopColor={colors.highlight} stopOpacity="1" />
          <Stop offset="50%" stopColor={colors.primary} stopOpacity="1" />
          <Stop offset="100%" stopColor={colors.secondary} stopOpacity="1" />
        </RadialGradient>
      </Defs>

      <G transform={`translate(25, 25) ${position === 'right' ? 'scale(-1, 1)' : ''}`}>
        {/* Glow effect for upgraded cans */}
        {colors.glow && (
          <G opacity="0.4">
            <Ellipse
              cx="0"
              cy="5"
              rx="14"
              ry="12"
              fill={colors.glowColor}
              opacity="0.3"
            />
          </G>
        )}

        {/* Can body */}
        <Ellipse
          cx="0"
          cy="5"
          rx="12"
          ry="10"
          fill={`url(#canGradient${level})`}
          stroke={AvatarColors.outline}
          strokeWidth="2"
        />
        {/* Can top opening */}
        <Ellipse
          cx="0"
          cy="-5"
          rx="6"
          ry="3"
          fill={colors.primary}
          stroke={AvatarColors.outline}
          strokeWidth="2"
        />
        {/* Side cylinder */}
        <Rect
          x="-6"
          y="-5"
          width="12"
          height="10"
          fill={`url(#canGradient${level})`}
          stroke={AvatarColors.outline}
          strokeWidth="2"
        />
        {/* Handle */}
        <Path
          d="M -6,-2 Q -12,-5 -12,2 Q -12,9 -6,6"
          fill="none"
          stroke={AvatarColors.outline}
          strokeWidth="2"
        />
        {/* Spout */}
        <Path
          d="M 12,0 L 18,-3 L 20,-3 L 20,-1 L 18,-1 L 12,2 Z"
          fill={colors.primary}
          stroke={AvatarColors.outline}
          strokeWidth="2"
        />
        {/* Spout holes */}
        <Circle cx="19" cy="-2" r="0.8" fill={AvatarColors.outline} />
        <Circle cx="19.5" cy="-0.5" r="0.8" fill={AvatarColors.outline} />
        <Circle cx="19" cy="1" r="0.8" fill={AvatarColors.outline} />

        {/* Enhanced shine effect */}
        <Ellipse
          cx="-3"
          cy="2"
          rx="3"
          ry="4"
          fill="#FFFFFF"
          opacity={level === 3 ? 0.6 : 0.3}
        />

        {/* Sparkles for golden can */}
        {level === 3 && (
          <>
            <Circle cx="-8" cy="8" r="1.5" fill="#FFED4E" opacity="0.8" />
            <Circle cx="8" cy="-3" r="1.2" fill="#FFED4E" opacity="0.8" />
            <Circle cx="2" cy="12" r="1" fill="#FFED4E" opacity="0.8" />
          </>
        )}
      </G>
    </Svg>
  );
};
