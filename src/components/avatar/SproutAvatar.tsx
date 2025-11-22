/**
 * Sprout Avatar Component
 * Layered character with animations, outfits, and moods
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
import { OutfitType, AccessoryType, MoodType } from '../../constants/avatar-config';
import * as Haptics from 'expo-haptics';

interface SproutAvatarProps {
  outfit?: OutfitType;
  accessory?: AccessoryType;
  mood?: MoodType;
  size?: number;
  onPress?: () => void;
  onLongPress?: () => void;
}

export const SproutAvatar: React.FC<SproutAvatarProps> = ({
  outfit = 'gardener',
  accessory = 'watering-can',
  mood = 'idle',
  size = 120,
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
      <Animated.View style={[styles.container, { width: size, height: size }, animatedStyle]}>
        {/* Layer 1: Body */}
        <View style={[styles.body, { width: size * 0.8, height: size * 0.8 }]}>
          <View style={styles.bodyGreen} />

          {/* Leaves on top */}
          <View style={styles.leavesContainer}>
            <View style={[styles.leaf, styles.leafLeft]} />
            <View style={[styles.leaf, styles.leafRight]} />
          </View>
        </View>

        {/* Layer 2: Face */}
        <View style={styles.faceContainer}>
          <Animated.View style={[styles.eye, styles.eyeLeft, eyeAnimatedStyle]} />
          <Animated.View style={[styles.eye, styles.eyeRight, eyeAnimatedStyle]} />

          {/* Cheeks */}
          <View style={[styles.cheek, styles.cheekLeft]} />
          <View style={[styles.cheek, styles.cheekRight]} />

          {/* Mouth */}
          <View style={[styles.mouth, getMouthStyle(mood)]} />
        </View>

        {/* Layer 3: Outfit */}
        <View style={styles.outfitContainer}>
          {renderOutfit(outfit, size)}
        </View>

        {/* Layer 4: Accessory */}
        <View style={styles.accessoryContainer}>
          {renderAccessory(accessory, size)}
        </View>
      </Animated.View>
    </TouchableOpacity>
  );
};

// Helper function to get mouth style based on mood
const getMouthStyle = (mood: MoodType) => {
  switch (mood) {
    case 'happy':
    case 'celebrating':
      return styles.mouthHappy;
    case 'sad':
      return styles.mouthSad;
    default:
      return styles.mouthNeutral;
  }
};

// Render outfit (placeholder - will be replaced with actual images/SVGs)
const renderOutfit = (outfit: OutfitType, size: number) => {
  const colors = {
    gardener: '#8B7355',
    raincoat: '#FFD166',
    apron: '#EF8354',
    explorer: '#8BA888',
    bee: '#FFD166',
    sweater: '#F4A259',
  };

  return (
    <View
      style={[
        styles.outfitPlaceholder,
        {
          backgroundColor: colors[outfit],
          width: size * 0.6,
          height: size * 0.4,
        },
      ]}
    />
  );
};

// Render accessory (placeholder - will be replaced with actual images/SVGs)
const renderAccessory = (accessory: AccessoryType, size: number) => {
  const colors = {
    'watering-can': '#87CEEB',
    'spade': '#8B7355',
    'book': '#D4C4A8',
    'glasses': '#4A4036',
    'flower-crown': '#EF8354',
    'treasure-chest': '#FFD166',
  };

  return (
    <View
      style={[
        styles.accessoryPlaceholder,
        {
          backgroundColor: colors[accessory],
          width: size * 0.3,
          height: size * 0.3,
        },
      ]}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },

  // Body
  body: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bodyGreen: {
    width: '100%',
    height: '100%',
    backgroundColor: '#B5D4B3',
    borderRadius: 999,
    borderWidth: 3,
    borderColor: '#8BA888',
  },

  // Leaves
  leavesContainer: {
    position: 'absolute',
    top: -15,
    flexDirection: 'row',
    gap: 5,
  },
  leaf: {
    width: 30,
    height: 40,
    backgroundColor: '#5C7A58',
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#3D5A3A',
  },
  leafLeft: {
    transform: [{ rotate: '-15deg' }],
  },
  leafRight: {
    transform: [{ rotate: '15deg' }],
  },

  // Face
  faceContainer: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  eye: {
    width: 8,
    height: 8,
    backgroundColor: '#4A4036',
    borderRadius: 999,
    position: 'absolute',
  },
  eyeLeft: {
    left: -12,
    top: -5,
  },
  eyeRight: {
    right: -12,
    top: -5,
  },

  // Cheeks
  cheek: {
    width: 12,
    height: 8,
    backgroundColor: '#FFB88C',
    borderRadius: 999,
    position: 'absolute',
    opacity: 0.6,
  },
  cheekLeft: {
    left: -20,
    top: 5,
  },
  cheekRight: {
    right: -20,
    top: 5,
  },

  // Mouth
  mouth: {
    width: 20,
    height: 10,
    backgroundColor: '#4A4036',
    position: 'absolute',
    top: 15,
  },
  mouthNeutral: {
    borderRadius: 5,
  },
  mouthHappy: {
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
  },
  mouthSad: {
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  },

  // Outfit (placeholder)
  outfitContainer: {
    position: 'absolute',
    bottom: -10,
  },
  outfitPlaceholder: {
    borderRadius: 10,
    opacity: 0.8,
  },

  // Accessory (placeholder)
  accessoryContainer: {
    position: 'absolute',
    bottom: -15,
    right: -20,
  },
  accessoryPlaceholder: {
    borderRadius: 8,
    opacity: 0.9,
  },
});

export default SproutAvatar;
