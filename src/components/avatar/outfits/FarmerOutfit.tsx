/**
 * Farmer Outfit Component
 * Straw hat, plaid shirt, denim overalls, and boots
 */

import React from 'react';
import Svg, { Path, Rect, Circle, Ellipse, G } from 'react-native-svg';
import { AvatarColors } from '../../../constants/avatar-config';

interface FarmerOutfitProps {
  size: number;
}

export const FarmerOutfit: React.FC<FarmerOutfitProps> = ({ size }) => {
  const scale = size / 100;

  return (
    <Svg width={size} height={size * 1.2} viewBox="0 0 100 120" style={{ position: 'absolute', bottom: -size * 0.35 }}>
      <G>
        {/* Straw Hat */}
        <G transform="translate(50, 8)">
          {/* Hat brim */}
          <Ellipse
            cx="0"
            cy="0"
            rx="28"
            ry="8"
            fill={AvatarColors.farmer.straw}
            stroke={AvatarColors.outline}
            strokeWidth="2"
          />
          {/* Hat crown */}
          <Ellipse
            cx="0"
            cy="-8"
            rx="18"
            ry="12"
            fill={AvatarColors.farmer.straw}
            stroke={AvatarColors.outline}
            strokeWidth="2"
          />
          {/* Hat band */}
          <Rect
            x="-18"
            y="-4"
            width="36"
            height="4"
            fill={AvatarColors.farmer.strawBand}
            stroke={AvatarColors.outline}
            strokeWidth="1"
          />
          {/* Woven texture lines */}
          <Path
            d="M -15,-12 L -10,-8 M -8,-14 L -3,-10 M -1,-15 L 4,-11 M 6,-14 L 11,-10 M 13,-12 L 18,-8"
            stroke={AvatarColors.farmer.strawBand}
            strokeWidth="0.5"
            opacity="0.3"
          />
        </G>

        {/* Plaid Shirt (upper body) */}
        <G transform="translate(50, 50)">
          {/* Shirt body */}
          <Rect
            x="-20"
            y="-5"
            width="40"
            height="25"
            fill={AvatarColors.farmer.plaid}
            stroke={AvatarColors.outline}
            strokeWidth="2"
            rx="3"
          />
          {/* Plaid pattern - vertical lines */}
          <Path
            d="M -10,-5 L -10,20 M 0,-5 L 0,20 M 10,-5 L 10,20"
            stroke={AvatarColors.farmer.plaidDark}
            strokeWidth="1.5"
            opacity="0.5"
          />
          {/* Plaid pattern - horizontal lines */}
          <Path
            d="M -20,5 L 20,5 M -20,15 L 20,15"
            stroke={AvatarColors.farmer.plaidDark}
            strokeWidth="1.5"
            opacity="0.5"
          />
          {/* Sleeves */}
          <Ellipse
            cx="-25"
            cy="5"
            rx="8"
            ry="12"
            fill={AvatarColors.farmer.plaid}
            stroke={AvatarColors.outline}
            strokeWidth="2"
          />
          <Ellipse
            cx="25"
            cy="5"
            rx="8"
            ry="12"
            fill={AvatarColors.farmer.plaid}
            stroke={AvatarColors.outline}
            strokeWidth="2"
          />
        </G>

        {/* Denim Overalls */}
        <G transform="translate(50, 75)">
          {/* Overalls body */}
          <Path
            d="M -18,0 L -18,30 L -12,35 L 12,35 L 18,30 L 18,0 Z"
            fill={AvatarColors.farmer.denim}
            stroke={AvatarColors.outline}
            strokeWidth="2"
          />
          {/* Front pocket */}
          <Rect
            x="-8"
            y="8"
            width="16"
            height="12"
            fill={AvatarColors.farmer.denim}
            stroke={AvatarColors.outline}
            strokeWidth="1.5"
            rx="2"
          />
          {/* Pocket stitching */}
          <Path
            d="M -7,9 L 7,9 M -7,19 L -7,20 M 7,19 L 7,20"
            stroke={AvatarColors.outline}
            strokeWidth="0.5"
            opacity="0.5"
          />
          {/* Shoulder straps */}
          <Rect
            x="-15"
            y="-25"
            width="5"
            height="30"
            fill={AvatarColors.farmer.denim}
            stroke={AvatarColors.outline}
            strokeWidth="2"
            rx="2"
          />
          <Rect
            x="10"
            y="-25"
            width="5"
            height="30"
            fill={AvatarColors.farmer.denim}
            stroke={AvatarColors.outline}
            strokeWidth="2"
            rx="2"
          />
          {/* Metal buttons on straps */}
          <Circle
            cx="-12.5"
            cy="-5"
            r="2.5"
            fill={AvatarColors.metal}
            stroke={AvatarColors.outline}
            strokeWidth="1"
          />
          <Circle
            cx="12.5"
            cy="-5"
            r="2.5"
            fill={AvatarColors.metal}
            stroke={AvatarColors.outline}
            strokeWidth="1"
          />
        </G>

        {/* Arms with plaid sleeves */}
        <G transform="translate(50, 60)">
          {/* Left arm */}
          <Ellipse
            cx="-28"
            cy="0"
            rx="6"
            ry="18"
            fill={AvatarColors.bodyGreen}
            stroke={AvatarColors.outline}
            strokeWidth="2"
          />
          {/* Right arm */}
          <Ellipse
            cx="28"
            cy="0"
            rx="6"
            ry="18"
            fill={AvatarColors.bodyGreen}
            stroke={AvatarColors.outline}
            strokeWidth="2"
          />
        </G>

        {/* Legs */}
        <G transform="translate(50, 105)">
          {/* Left leg */}
          <Rect
            x="-12"
            y="0"
            width="8"
            height="15"
            fill={AvatarColors.farmer.denim}
            stroke={AvatarColors.outline}
            strokeWidth="2"
            rx="3"
          />
          {/* Right leg */}
          <Rect
            x="4"
            y="0"
            width="8"
            height="15"
            fill={AvatarColors.farmer.denim}
            stroke={AvatarColors.outline}
            strokeWidth="2"
            rx="3"
          />
        </G>

        {/* Brown work boots */}
        <G transform="translate(50, 118)">
          {/* Left boot */}
          <Ellipse
            cx="-8"
            cy="0"
            rx="6"
            ry="4"
            fill={AvatarColors.farmer.boots}
            stroke={AvatarColors.outline}
            strokeWidth="2"
          />
          {/* Boot laces */}
          <Path
            d="M -10,-2 L -6,-2 M -10,0 L -6,0"
            stroke={AvatarColors.outline}
            strokeWidth="0.5"
          />
          {/* Right boot */}
          <Ellipse
            cx="8"
            cy="0"
            rx="6"
            ry="4"
            fill={AvatarColors.farmer.boots}
            stroke={AvatarColors.outline}
            strokeWidth="2"
          />
          {/* Boot laces */}
          <Path
            d="M 6,-2 L 10,-2 M 6,0 L 10,0"
            stroke={AvatarColors.outline}
            strokeWidth="0.5"
          />
        </G>
      </G>
    </Svg>
  );
};
