/**
 * Garden Scene Component
 * The immersive game window showing avatar, daily plant, and weather
 */

import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  useAnimatedStyle,
  interpolate,
  Extrapolate,
} from 'react-native-reanimated';
import { SproutAvatar } from '../avatar';
import { Colors } from '../../constants';
import { WeatherMood } from '../../types';
import { MoodType } from '../../constants/avatar-config';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface GardenSceneProps {
  weatherMood: WeatherMood;
  dailyProgress: number; // 0-100
  avatarMood: MoodType;
  avatarOutfit: string;
  avatarAccessory: string;
  onAvatarPress?: () => void;
  onWeatherPress?: () => void;
}

export const GardenScene: React.FC<GardenSceneProps> = ({
  weatherMood,
  dailyProgress,
  avatarMood,
  avatarOutfit,
  avatarAccessory,
  onAvatarPress,
  onWeatherPress,
}) => {
  // Get gradient colors based on weather
  const getSkyGradient = (): [string, string] => {
    switch (weatherMood) {
      case 'sunny':
        return Colors.gradients.skyDay as [string, string];
      case 'rainy':
        return ['#8BA8B0', '#B4C5CC'];
      case 'cloudy':
        return ['#A0B2B8', '#C8D4D9'];
      default:
        return Colors.gradients.skyDay as [string, string];
    }
  };

  return (
    <View style={styles.container}>
      {/* Sky Background */}
      <LinearGradient
        colors={getSkyGradient()}
        style={styles.sky}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
      >
        {/* Weather Icon (Top Left) */}
        <View style={styles.weatherIconContainer}>
          <WeatherIcon mood={weatherMood} onPress={onWeatherPress} />
        </View>
      </LinearGradient>

      {/* Ground/Garden */}
      <View style={styles.ground}>
        {/* Soil */}
        <View style={styles.soil} />

        {/* Center: Avatar and Daily Plant */}
        <View style={styles.centerStage}>
          {/* Daily Hero Plant */}
          <DailyPlant progress={dailyProgress} />

          {/* Sprout Avatar */}
          <View style={styles.avatarContainer}>
            <SproutAvatar
              mood={avatarMood}
              outfit={avatarOutfit as any}
              accessory={avatarAccessory as any}
              size={100}
              onPress={onAvatarPress}
            />
          </View>
        </View>

        {/* Weeds (based on progress) */}
        <WeedsDisplay progress={dailyProgress} />
      </View>
    </View>
  );
};

// Weather Icon Component
const WeatherIcon: React.FC<{ mood: WeatherMood; onPress?: () => void }> = ({
  mood,
  onPress,
}) => {
  const getEmoji = () => {
    switch (mood) {
      case 'sunny':
        return '☀️';
      case 'rainy':
        return '🌧️';
      case 'cloudy':
        return '☁️';
      default:
        return '☀️';
    }
  };

  return (
    <View style={styles.weatherIcon}>
      <Animated.Text style={styles.weatherEmoji} onPress={onPress}>
        {getEmoji()}
      </Animated.Text>
    </View>
  );
};

// Daily Plant Component
const DailyPlant: React.FC<{ progress: number }> = ({ progress }) => {
  const plantAnimatedStyle = useAnimatedStyle(() => {
    const scale = interpolate(progress, [0, 100], [0.5, 1.0], Extrapolate.CLAMP);
    const opacity = interpolate(progress, [0, 20, 100], [0.3, 1, 1], Extrapolate.CLAMP);

    return {
      transform: [{ scale }],
      opacity,
    };
  });

  // Get plant state based on progress
  const getPlantView = () => {
    if (progress < 33) {
      // Bud
      return <View style={[styles.plantBud, { backgroundColor: Colors.primary.moss }]} />;
    } else if (progress < 66) {
      // Opening
      return (
        <View style={styles.plantOpening}>
          <View style={[styles.petal, styles.petalLeft]} />
          <View style={[styles.petal, styles.petalRight]} />
        </View>
      );
    } else {
      // Full Bloom
      return (
        <View style={styles.plantBloom}>
          <View style={[styles.petalBig, styles.petalTop]} />
          <View style={[styles.petalBig, styles.petalBottom]} />
          <View style={[styles.petalBig, styles.petalLeftBig]} />
          <View style={[styles.petalBig, styles.petalRightBig]} />
          <View style={styles.center} />
        </View>
      );
    }
  };

  return (
    <Animated.View style={[styles.plantContainer, plantAnimatedStyle]}>
      {/* Stem */}
      <View style={styles.stem} />
      {/* Plant State */}
      {getPlantView()}
    </Animated.View>
  );
};

// Weeds Display
const WeedsDisplay: React.FC<{ progress: number }> = ({ progress }) => {
  const weedCount = progress < 33 ? 3 : progress < 66 ? 2 : progress < 100 ? 1 : 0;

  return (
    <View style={styles.weedsContainer}>
      {Array.from({ length: weedCount }).map((_, index) => (
        <View key={index} style={styles.weed}>
          <View style={styles.weedLeaf} />
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 300,
    overflow: 'hidden',
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },

  // Sky
  sky: {
    flex: 1,
    position: 'relative',
  },
  weatherIconContainer: {
    position: 'absolute',
    top: 16,
    left: 16,
  },
  weatherIcon: {
    width: 50,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 25,
  },
  weatherEmoji: {
    fontSize: 28,
  },

  // Ground
  ground: {
    height: 120,
    backgroundColor: Colors.secondary.sand,
    position: 'relative',
  },
  soil: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height: 40,
    backgroundColor: Colors.secondary.soil,
  },

  // Center Stage
  centerStage: {
    position: 'absolute',
    bottom: 20,
    left: '50%',
    marginLeft: -50,
    alignItems: 'center',
    width: 100,
  },
  avatarContainer: {
    marginTop: 10,
  },

  // Plant
  plantContainer: {
    alignItems: 'center',
    width: 60,
    height: 80,
  },
  stem: {
    width: 4,
    height: 40,
    backgroundColor: Colors.primary.moss,
    borderRadius: 2,
  },
  plantBud: {
    width: 20,
    height: 20,
    borderRadius: 10,
    marginTop: -10,
  },
  plantOpening: {
    marginTop: -15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  petal: {
    width: 15,
    height: 25,
    backgroundColor: Colors.accent.coral,
    borderRadius: 12,
    position: 'absolute',
  },
  petalLeft: {
    left: -10,
    transform: [{ rotate: '-30deg' }],
  },
  petalRight: {
    right: -10,
    transform: [{ rotate: '30deg' }],
  },
  plantBloom: {
    width: 50,
    height: 50,
    marginTop: -25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  petalBig: {
    width: 20,
    height: 30,
    backgroundColor: Colors.accent.coral,
    borderRadius: 15,
    position: 'absolute',
  },
  petalTop: {
    top: -5,
  },
  petalBottom: {
    bottom: -5,
  },
  petalLeftBig: {
    left: -5,
    transform: [{ rotate: '90deg' }],
  },
  petalRightBig: {
    right: -5,
    transform: [{ rotate: '90deg' }],
  },
  center: {
    width: 15,
    height: 15,
    backgroundColor: Colors.accent.gold,
    borderRadius: 999,
  },

  // Weeds
  weedsContainer: {
    position: 'absolute',
    bottom: 10,
    left: 20,
    flexDirection: 'row',
    gap: 30,
  },
  weed: {
    width: 20,
    height: 30,
    alignItems: 'center',
  },
  weedLeaf: {
    width: 15,
    height: 20,
    backgroundColor: Colors.primary.dark,
    borderRadius: 8,
    opacity: 0.7,
  },
});

export default GardenScene;
