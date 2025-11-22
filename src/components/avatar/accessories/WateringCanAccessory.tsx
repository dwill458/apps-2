/**
 * Watering Can Accessory Component
 * Metal watering can with spout
 */

import React from 'react';
import Svg, { Path, Rect, Circle, Ellipse, G } from 'react-native-svg';
import { AvatarColors } from '../../../constants/avatar-config';

interface WateringCanAccessoryProps {
  size: number;
  position?: 'left' | 'right';
}

export const WateringCanAccessory: React.FC<WateringCanAccessoryProps> = ({
  size,
  position = 'left',
}) => {
  const scale = size / 100;

  return (
    <Svg
      width={size * 0.5}
      height={size * 0.5}
      viewBox="0 0 50 50"
      style={{ position: 'absolute', bottom: size * 0.35, [position]: -size * 0.05 }}
    >
      <G transform={`translate(25, 25) ${position === 'right' ? 'scale(-1, 1)' : ''}`}>
        {/* Can body */}
        <Ellipse
          cx="0"
          cy="5"
          rx="12"
          ry="10"
          fill={AvatarColors.metal}
          stroke={AvatarColors.outline}
          strokeWidth="2"
        />
        {/* Can top opening */}
        <Ellipse
          cx="0"
          cy="-5"
          rx="6"
          ry="3"
          fill={AvatarColors.metal}
          stroke={AvatarColors.outline}
          strokeWidth="2"
        />
        {/* Side cylinder */}
        <Rect
          x="-6"
          y="-5"
          width="12"
          height="10"
          fill={AvatarColors.metal}
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
          fill={AvatarColors.metal}
          stroke={AvatarColors.outline}
          strokeWidth="2"
        />
        {/* Spout holes */}
        <Circle cx="19" cy="-2" r="0.8" fill={AvatarColors.outline} />
        <Circle cx="19.5" cy="-0.5" r="0.8" fill={AvatarColors.outline} />
        <Circle cx="19" cy="1" r="0.8" fill={AvatarColors.outline} />
        {/* Shine effect */}
        <Ellipse
          cx="-3"
          cy="2"
          rx="3"
          ry="4"
          fill="#FFFFFF"
          opacity="0.3"
        />
      </G>
    </Svg>
  );
};
