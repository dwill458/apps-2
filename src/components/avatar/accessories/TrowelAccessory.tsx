/**
 * Trowel Accessory Component
 * Garden trowel with brown handle and silver blade
 */

import React from 'react';
import Svg, { Path, Rect, Ellipse, G } from 'react-native-svg';
import { AvatarColors } from '../../../constants/avatar-config';

interface TrowelAccessoryProps {
  size: number;
  position?: 'left' | 'right';
}

export const TrowelAccessory: React.FC<TrowelAccessoryProps> = ({ size, position = 'right' }) => {
  const scale = size / 100;
  const xOffset = position === 'left' ? -35 : 35;

  return (
    <Svg
      width={size * 0.4}
      height={size * 0.4}
      viewBox="0 0 40 40"
      style={{ position: 'absolute', bottom: size * 0.4, [position]: 0 }}
    >
      <G transform={`translate(20, 20) ${position === 'left' ? 'scale(-1, 1)' : ''}`}>
        {/* Wooden handle */}
        <Rect
          x="-2"
          y="-15"
          width="4"
          height="20"
          fill={AvatarColors.wood}
          stroke={AvatarColors.outline}
          strokeWidth="1.5"
          rx="2"
        />
        {/* Handle grip lines */}
        <Path
          d="M -2,-10 L 2,-10 M -2,-5 L 2,-5 M -2,0 L 2,0"
          stroke={AvatarColors.outline}
          strokeWidth="0.5"
          opacity="0.3"
        />
        {/* Metal blade */}
        <Path
          d="M -4,5 L -1,2 L 1,2 L 4,5 L 2,12 Q 0,14 -2,12 Z"
          fill={AvatarColors.metal}
          stroke={AvatarColors.outline}
          strokeWidth="1.5"
        />
        {/* Blade shine */}
        <Path
          d="M -1,4 L 0,10"
          stroke="#FFFFFF"
          strokeWidth="1"
          opacity="0.5"
        />
      </G>
    </Svg>
  );
};
