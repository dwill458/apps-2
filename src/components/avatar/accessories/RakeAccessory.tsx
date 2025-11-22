/**
 * Rake Accessory Component
 * Garden rake with wooden handle and metal prongs
 */

import React from 'react';
import Svg, { Path, Rect, Line, G } from 'react-native-svg';
import { AvatarColors } from '../../../constants/avatar-config';

interface RakeAccessoryProps {
  size: number;
  position?: 'left' | 'right';
}

export const RakeAccessory: React.FC<RakeAccessoryProps> = ({ size, position = 'left' }) => {
  const scale = size / 100;

  return (
    <Svg
      width={size * 0.35}
      height={size * 0.6}
      viewBox="0 0 35 60"
      style={{ position: 'absolute', bottom: size * 0.2, [position]: size * 0.05 }}
    >
      <G transform={`translate(17.5, 10) ${position === 'right' ? 'scale(-1, 1)' : ''}`}>
        {/* Long wooden handle */}
        <Rect
          x="-2"
          y="0"
          width="4"
          height="40"
          fill={AvatarColors.wood}
          stroke={AvatarColors.outline}
          strokeWidth="1.5"
          rx="2"
        />
        {/* Handle grip texture */}
        <Path
          d="M -2,15 L 2,15 M -2,20 L 2,20 M -2,25 L 2,25"
          stroke={AvatarColors.outline}
          strokeWidth="0.5"
          opacity="0.3"
        />
        {/* Rake head horizontal bar */}
        <Rect
          x="-12"
          y="38"
          width="24"
          height="3"
          fill={AvatarColors.metal}
          stroke={AvatarColors.outline}
          strokeWidth="1.5"
          rx="1"
        />
        {/* Metal prongs */}
        <G>
          <Rect x="-11" y="41" width="2" height="8" fill={AvatarColors.metal} stroke={AvatarColors.outline} strokeWidth="1" />
          <Rect x="-6" y="41" width="2" height="8" fill={AvatarColors.metal} stroke={AvatarColors.outline} strokeWidth="1" />
          <Rect x="-1" y="41" width="2" height="8" fill={AvatarColors.metal} stroke={AvatarColors.outline} strokeWidth="1" />
          <Rect x="4" y="41" width="2" height="8" fill={AvatarColors.metal} stroke={AvatarColors.outline} strokeWidth="1" />
          <Rect x="9" y="41" width="2" height="8" fill={AvatarColors.metal} stroke={AvatarColors.outline} strokeWidth="1" />
        </G>
      </G>
    </Svg>
  );
};
