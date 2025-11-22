/**
 * Sprout Avatar Component
 * Detailed kawaii plant character with SVG-based outfits and accessories
 */

import React, { useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withRepeat,
  withTiming,
  withSequence,
  Easing,
} from 'react-native-reanimated';
import Svg, { Circle, Ellipse, Path, G } from 'react-native-svg';
import { OutfitType, AccessoryType, MoodType, AvatarColors } from '../../constants/avatar-config';
import { FarmerOutfit, ApronOutfit, RaincoatOutfit, ExplorerOutfit } from './outfits';
import { TrowelAccessory, WateringCanAccessory, RakeAccessory, MagnifyingGlassAccessory } from './accessories';
import * as Haptics from 'expo-haptics';

interface SproutAvatarProps {
  outfit?: OutfitType;
  accessory?: AccessoryType;
  mood?: MoodType;
  size?: number;
  wateringCanLevel?: 1 | 2 | 3; // For dynamic watering can progression
  onPress?: () => void;
  onLongPress?: () => void;
}

export const SproutAvatar: React.FC<SproutAvatarProps> = ({
  outfit = 'farmer',
  accessory = 'trowel',
  mood = 'idle',
  size = 120,
  wateringCanLevel = 1,
  onPress,
  onLongPress,
}) => {
  // Animation values
  const scaleY = useSharedValue(1);
  const scaleX = useSharedValue(1);
  const translateY = useSharedValue(0);
  const rotation = useSharedValue(0);
  const eyeScaleY = useSharedValue(1);

  // Idle animation (breathing)
  useEffect(() => {
    if (mood === 'idle') {
      scaleY.value = withRepeat(
        withSequence(
          withTiming(1.02, { duration: 1000, easing: Easing.inOut(Easing.ease) }),
          withTiming(1.0, { duration: 1000, easing: Easing.inOut(Easing.ease) })
        ),
        -1,
        false
      );
      scaleX.value = withRepeat(
        withSequence(
          withTiming(0.98, { duration: 1000, easing: Easing.inOut(Easing.ease) }),
          withTiming(1.0, { duration: 1000, easing: Easing.inOut(Easing.ease) })
        ),
        -1,
        false
      );

      // Blinking
      const blinkInterval = setInterval(() => {
        eyeScaleY.value = withSequence(
          withTiming(0.1, { duration: 100 }),
          withTiming(1.0, { duration: 100 })
        );
      }, 3000);

      return () => clearInterval(blinkInterval);
    }
  }, [mood]);

  // Happy animation
  useEffect(() => {
    if (mood === 'happy') {
      translateY.value = withSequence(
        withSpring(-20, { damping: 8, stiffness: 100 }),
        withSpring(0, { damping: 8, stiffness: 100 })
      );
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
  }, [mood]);

  // Working animation
  useEffect(() => {
    if (mood === 'working') {
      translateY.value = withRepeat(
        withSequence(
          withTiming(-5, { duration: 500 }),
          withTiming(0, { duration: 500 }),
          withTiming(-3, { duration: 500 }),
          withTiming(0, { duration: 500 })
        ),
        -1,
        false
      );
    }
  }, [mood]);

  // Celebrating animation
  useEffect(() => {
    if (mood === 'celebrating') {
      rotation.value = withRepeat(
        withSequence(
          withTiming(-10, { duration: 150 }),
          withTiming(10, { duration: 150 }),
          withTiming(-5, { duration: 150 }),
          withTiming(5, { duration: 150 }),
          withTiming(0, { duration: 150 })
        ),
        3,
        false
      );
    }
  }, [mood]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { scaleY: scaleY.value },
      { scaleX: scaleX.value },
      { translateY: translateY.value },
      { rotate: `${rotation.value}deg` },
    ],
  }));

  const eyeAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scaleY: eyeScaleY.value }],
  }));

  const handlePress = () => {
    if (onPress) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      onPress();
    }
  };

  const handleLongPress = () => {
    if (onLongPress) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      onLongPress();
    }
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      onLongPress={handleLongPress}
      activeOpacity={0.9}
      disabled={!onPress && !onLongPress}
    >
      <Animated.View style={[styles.container, { width: size, height: size * 1.5 }, animatedStyle]}>
        {/* Shadow */}
        <View style={[styles.shadow, { width: size * 0.7, bottom: -size * 0.1 }]} />

        {/* Main Body (Turnip/Radish shaped) */}
        <Svg width={size} height={size} viewBox="0 0 100 100" style={styles.bodyContainer}>
          <G>
            {/* Body shape - egg shaped, wider at bottom */}
            <Ellipse
              cx="50"
              cy="50"
              rx="42.5"
              ry="50"
              fill={AvatarColors.bodyGreen}
              stroke={AvatarColors.outline}
              strokeWidth="3"
            />
            {/* Gradient highlight effect */}
            <Ellipse
              cx="50"
              cy="45"
              rx="40"
              ry="45"
              fill={AvatarColors.highlightGreen}
              opacity="0.3"
            />
            {/* White highlight dots for glossy effect */}
            <Circle cx="35" cy="25" r="4" fill="#FFFFFF" opacity="0.7" />
            <Circle cx="42" cy="22" r="3" fill="#FFFFFF" opacity="0.6" />
            <Circle cx="38" cy="32" r="2.5" fill="#FFFFFF" opacity="0.5" />

            {/* Two symmetrical leaves on top */}
            <G transform="translate(50, 5)">
              {/* Left leaf */}
              <G transform="rotate(-45)">
                <Ellipse
                  cx="0"
                  cy="-15"
                  rx="10"
                  ry="15"
                  fill={AvatarColors.leafGreen}
                  stroke={AvatarColors.outline}
                  strokeWidth="2.5"
                />
                {/* Leaf vein */}
                <Path
                  d="M 0,-25 L 0,-5"
                  stroke={AvatarColors.leafVein}
                  strokeWidth="2"
                />
              </G>
              {/* Right leaf */}
              <G transform="rotate(45)">
                <Ellipse
                  cx="0"
                  cy="-15"
                  rx="10"
                  ry="15"
                  fill={AvatarColors.leafGreen}
                  stroke={AvatarColors.outline}
                  strokeWidth="2.5"
                />
                {/* Leaf vein */}
                <Path
                  d="M 0,-25 L 0,-5"
                  stroke={AvatarColors.leafVein}
                  strokeWidth="2"
                />
              </G>
            </G>

            {/* Face - Kawaii style */}
            <G>
              {/* Eyes - solid black circles */}
              <Animated.View style={eyeAnimatedStyle}>
                <Svg width={size} height={size} viewBox="0 0 100 100" style={{ position: 'absolute' }}>
                  <Circle cx="37.5" cy="35" r="4" fill={AvatarColors.outline} />
                  <Circle cx="62.5" cy="35" r="4" fill={AvatarColors.outline} />
                </Svg>
              </Animated.View>

              {/* Pink cheeks */}
              <Circle cx="32" cy="42" r="6" fill={AvatarColors.cheekPink} opacity="0.6" />
              <Circle cx="68" cy="42" r="6" fill={AvatarColors.cheekPink} opacity="0.6" />

              {/* Smile - simple curved line */}
              <Path
                d={getMouthPath(mood)}
                stroke={AvatarColors.outline}
                strokeWidth="2.5"
                fill="none"
                strokeLinecap="round"
              />
            </G>
          </G>
        </Svg>

        {/* Outfit Layer */}
        {renderOutfit(outfit, size)}

        {/* Accessory Layer */}
        {renderAccessory(accessory, size, wateringCanLevel)}
      </Animated.View>
    </TouchableOpacity>
  );
};

// Helper function to get mouth path based on mood
const getMouthPath = (mood: MoodType): string => {
  switch (mood) {
    case 'happy':
    case 'celebrating':
      return 'M 40,48 Q 50,54 60,48'; // Big smile
    case 'sad':
      return 'M 40,52 Q 50,46 60,52'; // Frown
    case 'working':
      return 'M 42,50 Q 50,52 58,50'; // Slight smile
    default:
      return 'M 42,50 L 58,50'; // Neutral line
  }
};

// Render outfit based on type
const renderOutfit = (outfit: OutfitType, size: number) => {
  switch (outfit) {
    case 'farmer':
      return <FarmerOutfit size={size} />;
    case 'apron':
      return <ApronOutfit size={size} />;
    case 'raincoat':
      return <RaincoatOutfit size={size} />;
    case 'explorer':
      return <ExplorerOutfit size={size} />;
    default:
      return <FarmerOutfit size={size} />;
  }
};

// Render accessory based on type
const renderAccessory = (accessory: AccessoryType, size: number, wateringCanLevel: 1 | 2 | 3 = 1) => {
  switch (accessory) {
    case 'trowel':
      return <TrowelAccessory size={size} position="right" />;
    case 'watering-can':
      return <WateringCanAccessory size={size} position="left" level={wateringCanLevel} />;
    case 'rake':
      return <RakeAccessory size={size} position="left" />;
    case 'magnifying-glass':
      return <MagnifyingGlassAccessory size={size} position="left" />;
    case 'none':
      return null;
    default:
      return null;
  }
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'flex-start',
    position: 'relative',
  },
  bodyContainer: {
    zIndex: 1,
  },
  shadow: {
    position: 'absolute',
    height: 15,
    backgroundColor: AvatarColors.farmer.strawBand,
    opacity: 0.3,
    borderRadius: 999,
    zIndex: 0,
  },
});

export default SproutAvatar;
