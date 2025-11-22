/**
 * Raincoat Outfit Component
 * Bright yellow raincoat with hood and rain boots
 */

import React from 'react';
import Svg, { Path, Rect, Circle, Ellipse, G } from 'react-native-svg';
import { AvatarColors } from '../../../constants/avatar-config';

interface RaincoatOutfitProps {
  size: number;
}

export const RaincoatOutfit: React.FC<RaincoatOutfitProps> = ({ size }) => {
  const scale = size / 100;

  return (
    <Svg width={size} height={size * 1.2} viewBox="0 0 100 120" style={{ position: 'absolute', bottom: -size * 0.35 }}>
      <G>
        {/* Yellow Raincoat Hood */}
        <G transform="translate(50, 15)">
          {/* Hood shape */}
          <Path
            d="M -22,-5 Q -25,0 -25,8 L -25,15 L 25,15 L 25,8 Q 25,0 22,-5 L 15,-8 Q 0,-12 -15,-8 Z"
            fill={AvatarColors.raincoat.yellow}
            stroke={AvatarColors.outline}
            strokeWidth="2"
          />
          {/* Hood drawstrings */}
          <Circle
            cx="-18"
            cy="10"
            r="2"
            fill={AvatarColors.outline}
            stroke={AvatarColors.outline}
            strokeWidth="1"
          />
          <Circle
            cx="18"
            cy="10"
            r="2"
            fill={AvatarColors.outline}
            stroke={AvatarColors.outline}
            strokeWidth="1"
          />
          {/* Drawstring cords */}
          <Path
            d="M -18,10 L -20,14 M 18,10 L 20,14"
            stroke={AvatarColors.outline}
            strokeWidth="1.5"
          />
        </G>

        {/* Raincoat Body */}
        <G transform="translate(50, 60)">
          {/* Main coat body */}
          <Path
            d="M -22,-10 L -22,25 Q -22,30 -18,32 L -10,35 L 10,35 L 18,32 Q 22,30 22,25 L 22,-10 Z"
            fill={AvatarColors.raincoat.yellow}
            stroke={AvatarColors.outline}
            strokeWidth="2"
          />
          {/* Button placket */}
          <Path
            d="M 0,-10 L 0,35"
            stroke={AvatarColors.outline}
            strokeWidth="1.5"
            opacity="0.5"
          />
          {/* Buttons */}
          <Circle cx="0" cy="0" r="2.5" fill={AvatarColors.outline} />
          <Circle cx="0" cy="8" r="2.5" fill={AvatarColors.outline} />
          <Circle cx="0" cy="16" r="2.5" fill={AvatarColors.outline} />
          <Circle cx="0" cy="24" r="2.5" fill={AvatarColors.outline} />
          {/* Side pockets with flaps */}
          <G>
            {/* Left pocket */}
            <Rect
              x="-18"
              y="8"
              width="10"
              height="8"
              fill={AvatarColors.raincoat.yellow}
              stroke={AvatarColors.outline}
              strokeWidth="1.5"
              rx="1"
            />
            <Path
              d="M -18,8 L -8,8"
              stroke={AvatarColors.outline}
              strokeWidth="2"
            />
            {/* Right pocket */}
            <Rect
              x="8"
              y="8"
              width="10"
              height="8"
              fill={AvatarColors.raincoat.yellow}
              stroke={AvatarColors.outline}
              strokeWidth="1.5"
              rx="1"
            />
            <Path
              d="M 8,8 L 18,8"
              stroke={AvatarColors.outline}
              strokeWidth="2"
            />
          </G>
          {/* Sleeves */}
          <Ellipse
            cx="-26"
            cy="5"
            rx="7"
            ry="15"
            fill={AvatarColors.raincoat.yellow}
            stroke={AvatarColors.outline}
            strokeWidth="2"
          />
          <Ellipse
            cx="26"
            cy="5"
            rx="7"
            ry="15"
            fill={AvatarColors.raincoat.yellow}
            stroke={AvatarColors.outline}
            strokeWidth="2"
          />
        </G>

        {/* Arms */}
        <G transform="translate(50, 65)">
          {/* Left arm */}
          <Ellipse
            cx="-30"
            cy="0"
            rx="5"
            ry="16"
            fill={AvatarColors.bodyGreen}
            stroke={AvatarColors.outline}
            strokeWidth="2"
          />
          {/* Right arm */}
          <Ellipse
            cx="30"
            cy="0"
            rx="5"
            ry="16"
            fill={AvatarColors.bodyGreen}
            stroke={AvatarColors.outline}
            strokeWidth="2"
          />
        </G>

        {/* Green Pants (visible at bottom) */}
        <G transform="translate(50, 93)">
          {/* Left leg */}
          <Rect
            x="-12"
            y="0"
            width="8"
            height="12"
            fill={AvatarColors.raincoat.pants}
            stroke={AvatarColors.outline}
            strokeWidth="2"
            rx="2"
          />
          {/* Right leg */}
          <Rect
            x="4"
            y="0"
            width="8"
            height="12"
            fill={AvatarColors.raincoat.pants}
            stroke={AvatarColors.outline}
            strokeWidth="2"
            rx="2"
          />
        </G>

        {/* Yellow Rain Boots */}
        <G transform="translate(50, 105)">
          {/* Left boot */}
          <G>
            {/* Boot shaft */}
            <Rect
              x="-12"
              y="0"
              width="8"
              height="10"
              fill={AvatarColors.raincoat.yellow}
              stroke={AvatarColors.outline}
              strokeWidth="2"
              rx="2"
            />
            {/* Boot sole */}
            <Ellipse
              cx="-8"
              cy="13"
              rx="7"
              ry="4"
              fill={AvatarColors.raincoat.yellow}
              stroke={AvatarColors.outline}
              strokeWidth="2"
            />
          </G>
          {/* Right boot */}
          <G>
            {/* Boot shaft */}
            <Rect
              x="4"
              y="0"
              width="8"
              height="10"
              fill={AvatarColors.raincoat.yellow}
              stroke={AvatarColors.outline}
              strokeWidth="2"
              rx="2"
            />
            {/* Boot sole */}
            <Ellipse
              cx="8"
              cy="13"
              rx="7"
              ry="4"
              fill={AvatarColors.raincoat.yellow}
              stroke={AvatarColors.outline}
              strokeWidth="2"
            />
          </G>
        </G>
      </G>
    </Svg>
  );
};
