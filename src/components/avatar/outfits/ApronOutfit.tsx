/**
 * Apron Outfit Component
 * Floral apron with striped sleeves and green pants
 */

import React from 'react';
import Svg, { Path, Rect, Circle, Ellipse, G } from 'react-native-svg';
import { AvatarColors } from '../../../constants/avatar-config';

interface ApronOutfitProps {
  size: number;
}

export const ApronOutfit: React.FC<ApronOutfitProps> = ({ size }) => {
  const scale = size / 100;

  return (
    <Svg width={size} height={size * 1.2} viewBox="0 0 100 120" style={{ position: 'absolute', bottom: -size * 0.35 }}>
      <G>
        {/* Striped Shirt (underneath) */}
        <G transform="translate(50, 50)">
          {/* Shirt body */}
          <Rect
            x="-20"
            y="-5"
            width="40"
            height="25"
            fill="#FFFFFF"
            stroke={AvatarColors.outline}
            strokeWidth="2"
            rx="3"
          />
          {/* Horizontal green stripes */}
          <Path
            d="M -20,0 L 20,0 M -20,5 L 20,5 M -20,10 L 20,10 M -20,15 L 20,15"
            stroke={AvatarColors.apron.stripes}
            strokeWidth="2"
          />
          {/* Sleeves */}
          <Ellipse
            cx="-25"
            cy="5"
            rx="8"
            ry="12"
            fill="#FFFFFF"
            stroke={AvatarColors.outline}
            strokeWidth="2"
          />
          <Ellipse
            cx="25"
            cy="5"
            rx="8"
            ry="12"
            fill="#FFFFFF"
            stroke={AvatarColors.outline}
            strokeWidth="2"
          />
          {/* Stripes on sleeves */}
          <Path
            d="M -25,-3 Q -21,0 -25,8 M -25,0 Q -21,3 -25,11"
            stroke={AvatarColors.apron.stripes}
            strokeWidth="2"
          />
          <Path
            d="M 25,-3 Q 21,0 25,8 M 25,0 Q 21,3 25,11"
            stroke={AvatarColors.apron.stripes}
            strokeWidth="2"
          />
        </G>

        {/* Floral Apron */}
        <G transform="translate(50, 62)">
          {/* Apron body */}
          <Path
            d="M -18,0 L -18,35 Q -18,38 -15,38 L 15,38 Q 18,38 18,35 L 18,0 Z"
            fill={AvatarColors.apron.base}
            stroke={AvatarColors.outline}
            strokeWidth="2"
          />
          {/* Coral trim on edges */}
          <Path
            d="M -18,0 L -18,35 Q -18,38 -15,38 L 15,38 Q 18,38 18,35 L 18,0"
            stroke={AvatarColors.apron.trim}
            strokeWidth="3"
            fill="none"
          />
          {/* Neck strap */}
          <Path
            d="M -5,-10 Q 0,-15 5,-10"
            stroke={AvatarColors.apron.trim}
            strokeWidth="3"
            fill="none"
          />
          {/* Waist ties */}
          <Path
            d="M -18,10 L -30,12 M 18,10 L 30,12"
            stroke={AvatarColors.apron.trim}
            strokeWidth="2.5"
          />
          {/* Front pocket */}
          <Rect
            x="-10"
            y="15"
            width="20"
            height="15"
            fill={AvatarColors.apron.base}
            stroke={AvatarColors.apron.trim}
            strokeWidth="2"
            rx="2"
          />
          {/* Floral pattern - small flowers */}
          <Circle cx="-8" cy="8" r="2" fill="#FFB6C1" opacity="0.7" />
          <Circle cx="-7" cy="9" r="1" fill="#FFD700" opacity="0.7" />
          <Circle cx="5" cy="6" r="2" fill="#98D8C8" opacity="0.7" />
          <Circle cx="6" cy="7" r="1" fill="#FFD700" opacity="0.7" />
          <Circle cx="10" cy="25" r="2" fill="#FFB6C1" opacity="0.7" />
          <Circle cx="11" cy="26" r="1" fill="#FFD700" opacity="0.7" />
          <Circle cx="-12" cy="28" r="2" fill="#98D8C8" opacity="0.7" />
          <Circle cx="-11" cy="29" r="1" fill="#FFD700" opacity="0.7" />
          {/* Tiny leaves */}
          <Path
            d="M -6,10 Q -5,11 -4,10 M 7,8 Q 8,9 9,8 M 12,27 Q 13,28 14,27 M -10,30 Q -9,31 -8,30"
            stroke={AvatarColors.apron.stripes}
            strokeWidth="1"
            fill="none"
          />
        </G>

        {/* Arms */}
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

        {/* Green Pants */}
        <G transform="translate(50, 95)">
          {/* Left leg */}
          <Rect
            x="-12"
            y="0"
            width="8"
            height="20"
            fill={AvatarColors.apron.pants}
            stroke={AvatarColors.outline}
            strokeWidth="2"
            rx="3"
          />
          {/* Right leg */}
          <Rect
            x="4"
            y="0"
            width="8"
            height="20"
            fill={AvatarColors.apron.pants}
            stroke={AvatarColors.outline}
            strokeWidth="2"
            rx="3"
          />
        </G>

        {/* Brown shoes */}
        <G transform="translate(50, 118)">
          {/* Left shoe */}
          <Ellipse
            cx="-8"
            cy="0"
            rx="6"
            ry="4"
            fill={AvatarColors.apron.boots}
            stroke={AvatarColors.outline}
            strokeWidth="2"
          />
          {/* Right shoe */}
          <Ellipse
            cx="8"
            cy="0"
            rx="6"
            ry="4"
            fill={AvatarColors.apron.boots}
            stroke={AvatarColors.outline}
            strokeWidth="2"
          />
        </G>
      </G>
    </Svg>
  );
};
