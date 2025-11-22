/**
 * React Native Implementation - Cozy Growth Home Screen
 * Using React Native Reanimated 3 for 60fps animations
 * Pixel-perfect replication with advanced micro-interactions
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  withRepeat,
  Easing,
  interpolate,
  withSequence,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, {
  Circle,
  Path,
  Rect,
  Ellipse,
  G,
  Defs,
  RadialGradient,
  Stop,
} from 'react-native-svg';
import * as Haptics from 'expo-haptics';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// MARK: - Types
type DurationType = 5 | 10 | 15;

interface HomeProps {
  sunlight: number;
  seeds: number;
  minutesCompleted: number;
  goalMinutes: number;
  growthProgress: number; // 0-1
  onStartSession: (duration: number) => void;
}

// MARK: - Main Component
export const CozyGrowthHome: React.FC<HomeProps> = ({
  sunlight = 50,
  seeds = 120,
  minutesCompleted = 15,
  goalMinutes = 30,
  growthProgress = 0.5,
  onStartSession,
}) => {
  const [selectedDuration, setSelectedDuration] = useState<DurationType>(10);

  const handleCultivate = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    onStartSession(selectedDuration);
  };

  return (
    <LinearGradient
      colors={['#FFF9F0', '#F5F8F2']}
      style={styles.container}
    >
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Garden Scene */}
        <GardenScene
          sunlight={sunlight}
          growthProgress={growthProgress}
        />

        {/* Progress Indicator */}
        <ProgressIndicator
          current={minutesCompleted}
          goal={goalMinutes}
        />

        {/* Currency Bar */}
        <CurrencyBar sunlight={sunlight} seeds={seeds} />

        {/* Nurturing Card */}
        <NurturingCard
          selectedDuration={selectedDuration}
          onDurationSelect={setSelectedDuration}
          onCultivate={handleCultivate}
        />

        <View style={{ height: 40 }} />
      </ScrollView>
    </LinearGradient>
  );
};

// MARK: - Garden Scene
const GardenScene: React.FC<{
  sunlight: number;
  growthProgress: number;
}> = ({ sunlight, growthProgress }) => {
  // Animation values
  const cloudOffset = useSharedValue(0);
  const flowerSway = useSharedValue(0);
  const characterBreath = useSharedValue(1);
  const sunRotation = useSharedValue(0);

  useEffect(() => {
    // Cloud floating - easeInOut for smooth, natural drift
    cloudOffset.value = withRepeat(
      withTiming(40, {
        duration: 8000,
        easing: Easing.inOut(Easing.ease),
      }),
      -1,
      true
    );

    // Flower swaying - gentle oscillation
    flowerSway.value = withRepeat(
      withTiming(5, {
        duration: 3000,
        easing: Easing.inOut(Easing.ease),
      }),
      -1,
      true
    );

    // Character breathing - subtle scale for alive feeling
    characterBreath.value = withRepeat(
      withTiming(1.03, {
        duration: 2000,
        easing: Easing.inOut(Easing.ease),
      }),
      -1,
      true
    );

    // Sun rotation - very slow, continuous
    sunRotation.value = withRepeat(
      withTiming(360, {
        duration: 60000,
        easing: Easing.linear,
      }),
      -1,
      false
    );
  }, []);

  const cloudStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: cloudOffset.value }],
  }));

  const flowerStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${flowerSway.value}deg` }],
    transformOrigin: 'bottom center',
  }));

  const characterStyle = useAnimatedStyle(() => ({
    transform: [{ scaleY: characterBreath.value }],
  }));

  const sunStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${sunRotation.value}deg` }],
  }));

  return (
    <View style={styles.gardenContainer}>
      <View style={styles.gardenScene}>
        <Svg width="100%" height="100%" viewBox="0 0 400 280">
          <Defs>
            {/* Sky gradient */}
            <LinearGradient id="skyGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <Stop offset="0%" stopColor="#A8D5E2" />
              <Stop offset="100%" stopColor="#C8E6F5" />
            </LinearGradient>

            {/* Sun glow */}
            <RadialGradient id="sunGlow" cx="50%" cy="50%">
              <Stop offset="0%" stopColor="rgba(255, 255, 0, 0.4)" />
              <Stop offset="100%" stopColor="rgba(255, 255, 0, 0)" />
            </RadialGradient>
          </Defs>

          {/* Sky background */}
          <Rect width="400" height="280" fill="url(#skyGradient)" rx="20" />

          {/* Background hills (layered for depth) */}
          <Circle cx="100" cy="210" r="80" fill="#9BC49D" opacity="0.3" />
          <Circle cx="200" cy="220" r="80" fill="#9BC49D" opacity="0.5" />
          <Circle cx="300" cy="230" r="80" fill="#9BC49D" opacity="0.7" />

          {/* Sun with glow */}
          <Circle cx="60" cy="50" r="40" fill="url(#sunGlow)" />
          <Animated.View style={[{ position: 'absolute' }, sunStyle]}>
            <Circle cx="60" cy="50" r="20" fill="#FFD93D" />
            <Circle cx="60" cy="50" r="20" stroke="#FFA500" strokeWidth="2" fill="none" />
          </Animated.View>

          {/* Tree (top right) */}
          <G transform="translate(340, 60)">
            <Rect x="-7.5" y="20" width="15" height="40" rx="5" fill="#8B5A3C" />
            <Circle cx="-10" cy="-5" r="30" fill="#6B9B3D" />
            <Circle cx="10" cy="0" r="27.5" fill="#7BA05B" />
            <Circle cx="0" cy="-10" r="25" fill="#6B9B3D" />
          </G>

          {/* Plant character (animated breathing) */}
          <Animated.View style={[{ position: 'absolute', left: 140, top: 196 }, characterStyle]}>
            <PlantCharacter />
          </Animated.View>

          {/* Growing flower (animated sway) */}
          <Animated.View style={[{ position: 'absolute', left: 260, top: 182 }, flowerStyle]}>
            <FlowerSVG progress={growthProgress} />
          </Animated.View>

          {/* Watering can */}
          <G transform="translate(100, 238)">
            <Rect x="-12.5" y="-10" width="25" height="20" rx="5" fill="#C0C0C0" />
            <Rect x="13" y="-15" width="3" height="12" fill="#C0C0C0" />
            <Circle cx="-15" cy="-5" r="7.5" stroke="#C0C0C0" strokeWidth="3" fill="none" />
          </G>
        </Svg>

        {/* Cloud (animated) - positioned absolutely for smooth animation */}
        <Animated.View style={[styles.cloudAbsolute, cloudStyle]}>
          <Svg width="70" height="30" viewBox="0 0 70 30">
            <Circle cx="15" cy="15" r="12.5" fill="white" />
            <Circle cx="35" cy="10" r="17.5" fill="white" />
            <Circle cx="55" cy="15" r="12.5" fill="white" />
          </Svg>
        </Animated.View>
      </View>
    </View>
  );
};

// MARK: - Plant Character SVG
const PlantCharacter: React.FC = () => (
  <Svg width="100" height="120" viewBox="0 0 100 120">
    <Defs>
      <LinearGradient id="bodyGradient" x1="0%" y1="0%" x2="0%" y2="100%">
        <Stop offset="0%" stopColor="#A8D672" />
        <Stop offset="100%" stopColor="#C5E89B" />
      </LinearGradient>
    </Defs>

    {/* Body (pear shape) */}
    <Ellipse cx="50" cy="60" rx="32.5" ry="37.5" fill="url(#bodyGradient)" />

    {/* Leaves on head */}
    <Path
      d="M35,22 Q25,12 30,2 Q35,12 35,22"
      fill="#6B9B3D"
    />
    <Path
      d="M65,22 Q75,12 70,2 Q65,12 65,22"
      fill="#6B9B3D"
    />

    {/* Eyes (kawaii dots) */}
    <Circle cx="41" cy="55" r="4" fill="#3D2817" />
    <Circle cx="59" cy="55" r="4" fill="#3D2817" />

    {/* Smile (curved) */}
    <Path
      d="M40,65 Q50,70 60,65"
      stroke="#3D2817"
      strokeWidth="2"
      fill="none"
    />

    {/* Rosy cheeks */}
    <Circle cx="30" cy="65" r="6" fill="#FFB6C1" opacity="0.6" />
    <Circle cx="70" cy="65" r="6" fill="#FFB6C1" opacity="0.6" />

    {/* Farmer outfit stripes */}
    <Rect x="25" y="70" width="50" height="3" fill="#8B6F47" />
    <Rect x="25" y="76" width="50" height="3" fill="#8B6F47" />

    {/* Feet (little boots) */}
    <Rect x="31" y="105" width="18" height="10" rx="5" fill="#8B5A3C" />
    <Rect x="51" y="105" width="18" height="10" rx="5" fill="#8B5A3C" />
  </Svg>
);

// MARK: - Flower SVG
const FlowerSVG: React.FC<{ progress: number }> = ({ progress }) => {
  const stemHeight = 40 * progress;
  const flowerScale = Math.min(1, Math.max(0, (progress - 0.3) / 0.7));

  return (
    <Svg width="60" height="80" viewBox="0 0 60 80">
      <Defs>
        <RadialGradient id="petalGradient">
          <Stop offset="0%" stopColor="#FFB6C1" />
          <Stop offset="100%" stopColor="#FF69B4" />
        </RadialGradient>
      </Defs>

      {/* Stem */}
      <Rect x="28" y="40" width="4" height={stemHeight} fill="#6B9B3D" />

      {/* Flower head (appears when progress > 30%) */}
      {progress > 0.3 && (
        <G transform={`scale(${flowerScale})`} origin="30, 20">
          {/* 5 Petals arranged in circle */}
          {[0, 72, 144, 216, 288].map((angle, index) => {
            const x = 30 + Math.cos((angle * Math.PI) / 180) * 12;
            const y = 20 + Math.sin((angle * Math.PI) / 180) * 12;
            return (
              <Ellipse
                key={index}
                cx={x}
                cy={y}
                rx="10"
                ry="15"
                fill="url(#petalGradient)"
              />
            );
          })}

          {/* Center */}
          <Circle cx="30" cy="20" r="7.5" fill="#FFD93D" />
        </G>
      )}
    </Svg>
  );
};

// MARK: - Progress Indicator
const ProgressIndicator: React.FC<{
  current: number;
  goal: number;
}> = ({ current, goal }) => {
  const progress = current / goal;
  const progressWidth = useSharedValue(0);

  useEffect(() => {
    // Using spring for satisfying, bouncy progress fill
    progressWidth.value = withSpring(progress, {
      damping: 15,
      stiffness: 100,
    });
  }, [progress]);

  const progressStyle = useAnimatedStyle(() => ({
    width: `${progressWidth.value * 100}%`,
  }));

  return (
    <View style={styles.progressContainer}>
      <Text style={styles.progressText}>
        {current}/{goal} Minutes of Growth
      </Text>
      <View style={styles.progressBar}>
        <Animated.View style={[styles.progressFill, progressStyle]} />
      </View>
    </View>
  );
};

// MARK: - Currency Bar
const CurrencyBar: React.FC<{
  sunlight: number;
  seeds: number;
}> = ({ sunlight, seeds }) => (
  <View style={styles.currencyBar}>
    <View style={styles.currencyItem}>
      <View style={styles.sunIcon}>
        <Text style={styles.emoji}>☀️</Text>
      </View>
      <Text style={styles.currencyText}>Sunlight: {sunlight}</Text>
    </View>

    <View style={styles.currencySeparator} />

    <View style={styles.currencyItem}>
      <Text style={styles.emoji}>🌰</Text>
      <Text style={styles.currencyText}>Seeds: {seeds}</Text>
    </View>
  </View>
);

// MARK: - Nurturing Card
const NurturingCard: React.FC<{
  selectedDuration: DurationType;
  onDurationSelect: (duration: DurationType) => void;
  onCultivate: () => void;
}> = ({ selectedDuration, onDurationSelect, onCultivate }) => {
  const buttonScale = useSharedValue(1);

  const handleCultivatePress = () => {
    // Bouncy press animation - easeOutBack for playful feel
    buttonScale.value = withSequence(
      withSpring(0.95, { damping: 10, stiffness: 200 }),
      withSpring(1, { damping: 8, stiffness: 150 })
    );

    setTimeout(onCultivate, 100);
  };

  const buttonStyle = useAnimatedStyle(() => ({
    transform: [{ scale: buttonScale.value }],
  }));

  return (
    <View style={styles.nurturingCard}>
      <Text style={styles.cardTitle}>Nurturing Duration</Text>

      {/* Duration selector */}
      <View style={styles.durationSelector}>
        {([5, 10, 15] as DurationType[]).map((duration) => (
          <SeedPacket
            key={duration}
            duration={duration}
            isSelected={selectedDuration === duration}
            onSelect={() => {
              Haptics.selectionAsync();
              onDurationSelect(duration);
            }}
          />
        ))}
      </View>

      {/* Cultivate button */}
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={handleCultivatePress}
      >
        <Animated.View style={[styles.cultivateButton, buttonStyle]}>
          <LinearGradient
            colors={['#8B5A3C', '#A0826D', '#8B5A3C']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.buttonGradient}
          >
            <Text style={styles.buttonEmoji}>🌱</Text>
            <Text style={styles.buttonText}>Cultivate One Tiny Step</Text>
          </LinearGradient>
        </Animated.View>
      </TouchableOpacity>
    </View>
  );
};

// MARK: - Seed Packet
const SeedPacket: React.FC<{
  duration: DurationType;
  isSelected: boolean;
  onSelect: () => void;
}> = ({ duration, isSelected, onSelect }) => {
  const scale = useSharedValue(1);

  const handlePress = () => {
    // Bouncy animation on press - easeOutBack for playful overshoot
    scale.value = withSequence(
      withSpring(1.15, { damping: 8, stiffness: 200 }),
      withSpring(1, { damping: 10, stiffness: 150 })
    );
    onSelect();
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const colors = {
    5: ['#F5DEB3', '#D2B48C'],
    10: ['#C8E6A0', '#A8D672'],
    15: ['#FFB6A0', '#FF9B85'],
  };

  const borderColors = {
    5: '#8B7355',
    10: '#6B9B3D',
    15: '#C19A6B',
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      activeOpacity={0.8}
      style={styles.seedPacketContainer}
    >
      <Animated.View style={[styles.seedPacket, animatedStyle]}>
        <LinearGradient
          colors={colors[duration]}
          style={[
            styles.packetGradient,
            {
              borderWidth: isSelected ? 3 : 1.5,
              borderColor: borderColors[duration],
            },
          ]}
        >
          {/* Seeds illustration */}
          <View style={styles.seedsIllustration}>
            <View style={styles.seedRow}>
              <View style={styles.seed} />
              <View style={styles.seed} />
            </View>
            <View style={styles.seed} />
          </View>
        </LinearGradient>

        <Text style={[
          styles.durationText,
          isSelected && styles.durationTextSelected,
        ]}>
          {duration} min
        </Text>
      </Animated.View>
    </TouchableOpacity>
  );
};

// MARK: - Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },

  // Garden Scene
  gardenContainer: {
    paddingHorizontal: 20,
    paddingTop: 8,
  },
  gardenScene: {
    width: '100%',
    height: 280,
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: '#A8D5E2',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  cloudAbsolute: {
    position: 'absolute',
    left: 140,
    top: 45,
  },

  // Progress
  progressContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  progressText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B5D4F',
    textAlign: 'center',
    marginBottom: 8,
  },
  progressBar: {
    height: 8,
    backgroundColor: '#E8E4DC',
    borderRadius: 10,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#7BA05B',
    borderRadius: 10,
  },

  // Currency Bar
  currencyBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 20,
    marginVertical: 8,
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  currencyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  sunIcon: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'rgba(255, 255, 0, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  emoji: {
    fontSize: 18,
  },
  currencyText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#3D2817',
  },
  currencySeparator: {
    width: 1,
    height: 20,
    backgroundColor: '#D4CFC7',
    marginHorizontal: 24,
  },

  // Nurturing Card
  nurturingCard: {
    marginHorizontal: 20,
    marginTop: 24,
    padding: 20,
    backgroundColor: '#F5E6D3',
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 4,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#3D2817',
    textAlign: 'center',
    marginBottom: 20,
  },

  // Duration Selector
  durationSelector: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  seedPacketContainer: {
    flex: 1,
  },
  seedPacket: {
    alignItems: 'center',
    gap: 8,
  },
  packetGradient: {
    width: 60,
    height: 70,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  seedsIllustration: {
    alignItems: 'center',
    gap: 4,
  },
  seedRow: {
    flexDirection: 'row',
    gap: 3,
  },
  seed: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#5C4033',
  },
  durationText: {
    fontSize: 13,
    color: '#8B7355',
  },
  durationTextSelected: {
    fontWeight: 'bold',
    color: '#3D2817',
  },

  // Cultivate Button
  cultivateButton: {
    borderRadius: 25,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  buttonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    gap: 8,
    borderWidth: 2,
    borderColor: '#6B4423',
    borderRadius: 25,
  },
  buttonEmoji: {
    fontSize: 20,
  },
  buttonText: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
});

export default CozyGrowthHome;
