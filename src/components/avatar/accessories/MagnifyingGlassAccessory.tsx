/**
 * Magnifying Glass Accessory Component
 * Magnifying glass with brown handle and circular lens
 */

import React from 'react';
import Svg, { Path, Rect, Circle, G } from 'react-native-svg';
import { AvatarColors } from '../../../constants/avatar-config';

interface MagnifyingGlassAccessoryProps {
  size: number;
  position?: 'left' | 'right';
}

export const MagnifyingGlassAccessory: React.FC<MagnifyingGlassAccessoryProps> = ({
  size,
  position = 'left',
}) => {
  const scale = size / 100;

  return (
    <Svg
      width={size * 0.45}
      height={size * 0.45}
      viewBox="0 0 45 45"
      style={{ position: 'absolute', bottom: size * 0.38, [position]: -size * 0.02 }}
    >
      <G transform={`translate(22.5, 22.5) rotate(-30) ${position === 'right' ? 'scale(-1, 1)' : ''}`}>
        {/* Wooden handle */}
        <Rect
          x="-2"
          y="8"
          width="4"
          height="15"
          fill={AvatarColors.wood}
          stroke={AvatarColors.outline}
          strokeWidth="1.5"
          rx="2"
        />
        {/* Handle grip texture */}
        <Path
          d="M -2,12 L 2,12 M -2,16 L 2,16 M -2,20 L 2,20"
          stroke={AvatarColors.outline}
          strokeWidth="0.5"
          opacity="0.3"
        />
        {/* Metal rim of lens */}
        <Circle
          cx="0"
          cy="0"
          r="10"
          fill="none"
          stroke={AvatarColors.outline}
          strokeWidth="2"
        />
        {/* Glass lens */}
        <Circle
          cx="0"
          cy="0"
          r="8"
          fill="#E6F3FF"
          stroke={AvatarColors.metal}
          strokeWidth="1"
          opacity="0.4"
        />
        {/* Lens shine/reflection */}
        <Circle
          cx="-3"
          cy="-3"
          r="3"
          fill="#FFFFFF"
          opacity="0.6"
        />
        {/* Secondary reflection */}
        <Circle
          cx="2"
          cy="2"
          r="1.5"
          fill="#FFFFFF"
          opacity="0.4"
        />
      </G>
    </Svg>
  );
};
