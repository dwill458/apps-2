/**
 * Explorer Outfit Component
 * Safari vest with utility pockets, cargo pants, and hiking boots
 */

import React from 'react';
import Svg, { Path, Rect, Circle, Ellipse, G } from 'react-native-svg';
import { AvatarColors } from '../../../constants/avatar-config';

interface ExplorerOutfitProps {
  size: number;
}

export const ExplorerOutfit: React.FC<ExplorerOutfitProps> = ({ size }) => {
  const scale = size / 100;

  return (
    <Svg width={size} height={size * 1.2} viewBox="0 0 100 120" style={{ position: 'absolute', bottom: -size * 0.35 }}>
      <G>
        {/* Safari/Utility Vest */}
        <G transform="translate(50, 55)">
          {/* Vest body */}
          <Path
            d="M -20,-8 L -20,20 L -15,22 L 15,22 L 20,20 L 20,-8 L 15,-10 L 5,-10 L 5,-5 L -5,-5 L -5,-10 L -15,-10 Z"
            fill={AvatarColors.explorer.khaki}
            stroke={AvatarColors.outline}
            strokeWidth="2"
          />
          {/* Multiple utility pockets */}
          {/* Upper left pocket */}
          <Rect
            x="-17"
            y="-2"
            width="10"
            height="8"
            fill={AvatarColors.explorer.khaki}
            stroke={AvatarColors.outline}
            strokeWidth="1.5"
            rx="1"
          />
          <Path d="M -17,-2 L -7,-2" stroke={AvatarColors.outline} strokeWidth="1" />
          {/* Upper right pocket */}
          <Rect
            x="7"
            y="-2"
            width="10"
            height="8"
            fill={AvatarColors.explorer.khaki}
            stroke={AvatarColors.outline}
            strokeWidth="1.5"
            rx="1"
          />
          <Path d="M 7,-2 L 17,-2" stroke={AvatarColors.outline} strokeWidth="1" />
          {/* Lower left pocket */}
          <Rect
            x="-17"
            y="8"
            width="10"
            height="9"
            fill={AvatarColors.explorer.khaki}
            stroke={AvatarColors.outline}
            strokeWidth="1.5"
            rx="1"
          />
          <Path d="M -17,8 L -7,8" stroke={AvatarColors.outline} strokeWidth="1" />
          {/* Lower right pocket */}
          <Rect
            x="7"
            y="8"
            width="10"
            height="9"
            fill={AvatarColors.explorer.khaki}
            stroke={AvatarColors.outline}
            strokeWidth="1.5"
            rx="1"
          />
          <Path d="M 7,8 L 17,8" stroke={AvatarColors.outline} strokeWidth="1" />
          {/* Small items in pockets */}
          <Circle cx="-14" cy="12" r="1.5" fill={AvatarColors.leafGreen} opacity="0.8" />
          <Circle cx="-10" cy="13" r="1" fill={AvatarColors.leafGreen} opacity="0.8" />
          <Rect x="9" y="10" width="2" height="5" fill={AvatarColors.explorer.brown} rx="0.5" />
          {/* Belt with buckle */}
          <Rect
            x="-20"
            y="20"
            width="40"
            height="4"
            fill={AvatarColors.explorer.brown}
            stroke={AvatarColors.outline}
            strokeWidth="1.5"
            rx="1"
          />
          <Rect
            x="-5"
            y="19"
            width="10"
            height="6"
            fill={AvatarColors.metal}
            stroke={AvatarColors.outline}
            strokeWidth="1.5"
            rx="1"
          />
        </G>

        {/* Beige undershirt (visible at collar) */}
        <G transform="translate(50, 47)">
          <Rect
            x="-5"
            y="-2"
            width="10"
            height="5"
            fill="#E8D5C4"
            stroke={AvatarColors.outline}
            strokeWidth="1"
            rx="2"
          />
        </G>

        {/* Satchel strap across body */}
        <G transform="translate(50, 50)">
          <Path
            d="M 15,-8 L -20,20"
            stroke={AvatarColors.explorer.brown}
            strokeWidth="4"
            opacity="0.8"
          />
        </G>

        {/* Arms */}
        <G transform="translate(50, 60)">
          {/* Left arm */}
          <Ellipse
            cx="-26"
            cy="2"
            rx="6"
            ry="16"
            fill={AvatarColors.bodyGreen}
            stroke={AvatarColors.outline}
            strokeWidth="2"
          />
          {/* Right arm */}
          <Ellipse
            cx="26"
            cy="2"
            rx="6"
            ry="16"
            fill={AvatarColors.bodyGreen}
            stroke={AvatarColors.outline}
            strokeWidth="2"
          />
        </G>

        {/* Cargo Pants */}
        <G transform="translate(50, 75)">
          {/* Left leg */}
          <Rect
            x="-12"
            y="0"
            width="8"
            height="28"
            fill={AvatarColors.explorer.cargo}
            stroke={AvatarColors.outline}
            strokeWidth="2"
            rx="3"
          />
          {/* Left side pocket */}
          <Rect
            x="-13"
            y="10"
            width="7"
            height="8"
            fill={AvatarColors.explorer.cargo}
            stroke={AvatarColors.outline}
            strokeWidth="1.5"
            rx="1"
          />
          <Path d="M -13,10 L -6,10" stroke={AvatarColors.outline} strokeWidth="1" />
          {/* Right leg */}
          <Rect
            x="4"
            y="0"
            width="8"
            height="28"
            fill={AvatarColors.explorer.cargo}
            stroke={AvatarColors.outline}
            strokeWidth="2"
            rx="3"
          />
          {/* Right side pocket */}
          <Rect
            x="12"
            y="10"
            width="7"
            height="8"
            fill={AvatarColors.explorer.cargo}
            stroke={AvatarColors.outline}
            strokeWidth="1.5"
            rx="1"
          />
          <Path d="M 12,10 L 19,10" stroke={AvatarColors.outline} strokeWidth="1" />
        </G>

        {/* Brown hiking boots with laces */}
        <G transform="translate(50, 118)">
          {/* Left boot */}
          <G>
            <Ellipse
              cx="-8"
              cy="0"
              rx="7"
              ry="5"
              fill={AvatarColors.explorer.boots}
              stroke={AvatarColors.outline}
              strokeWidth="2"
            />
            {/* Boot laces */}
            <Path
              d="M -11,-2 L -5,-2 M -11,0 L -5,0 M -11,2 L -5,2"
              stroke={AvatarColors.outline}
              strokeWidth="0.8"
            />
          </G>
          {/* Right boot */}
          <G>
            <Ellipse
              cx="8"
              cy="0"
              rx="7"
              ry="5"
              fill={AvatarColors.explorer.boots}
              stroke={AvatarColors.outline}
              strokeWidth="2"
            />
            {/* Boot laces */}
            <Path
              d="M 5,-2 L 11,-2 M 5,0 L 11,0 M 5,2 L 11,2"
              stroke={AvatarColors.outline}
              strokeWidth="0.8"
            />
          </G>
        </G>
      </G>
    </Svg>
  );
};
