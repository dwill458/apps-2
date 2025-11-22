/**
 * Cozy Growth - Zero-Friction Onboarding
 * "Egg Hatch" Model for Immediate Emotional Attachment
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  Animated,
  Dimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SproutAvatar } from '../src/components/avatar';
import { Button } from '../src/components/ui';
import { ParticleSystem, Confetti } from '../src/components/effects';
import { Colors, Typography, Spacing, BorderRadius } from '../src/constants';
import { useStore } from '../src/store/useStore';
import { onboardingStorage } from '../src/utils/storage';
import * as Haptics from 'expo-haptics';
import type { ThemeOption } from '../src/types';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

export default function OnboardingNew() {
  const router = useRouter();
  const {
    onboarding,
    setOnboardingScene,
    setSproutName,
    setSelectedTheme,
    completeOnboardingStep,
    completeOnboarding,
    addCurrency,
  } = useStore();

  const [currentScene, setCurrentScene] = useState<1 | 2 | 3 | 4>(1);
  const [isLoading, setIsLoading] = useState(true);

  // Scene 1 state
  const [isHolding, setIsHolding] = useState(false);
  const [holdProgress, setHoldProgress] = useState(0);
  const seedPulse = useRef(new Animated.Value(1)).current;
  const seedGlow = useRef(new Animated.Value(0.5)).current;

  // Scene 2 state
  const [sproutName, setSproutNameLocal] = useState('');
  const [dialogueStep, setDialogueStep] = useState(0);
  const sproutScale = useRef(new Animated.Value(0)).current;

  // Scene 3 state
  const [selectedTheme, setSelectedThemeLocal] = useState<ThemeOption | null>(null);

  // Scene 4 state
  const [hasWatered, setHasWatered] = useState(false);
  const [showReward, setShowReward] = useState(false);

  // Particle effects state
  const [showSeedParticles, setShowSeedParticles] = useState(false);
  const [showSproutConfetti, setShowSproutConfetti] = useState(false);
  const [showWaterParticles, setShowWaterParticles] = useState(false);

  // Load saved onboarding state on mount
  useEffect(() => {
    loadOnboardingState();
  }, []);

  const loadOnboardingState = async () => {
    try {
      const savedState = await onboardingStorage.getState();

      if (savedState && !savedState.completed) {
        // Resume from saved scene
        setCurrentScene(savedState.current_scene);

        // Restore sprout name if available
        if (savedState.user_data.sprout_name) {
          setSproutNameLocal(savedState.user_data.sprout_name);
        }

        // Restore theme if available
        if (savedState.user_data.selected_theme) {
          setSelectedThemeLocal(savedState.user_data.selected_theme);
        }

        // Set dialogue step for Scene 2 if sprout is named
        if (savedState.progress.sprout_named && savedState.current_scene === 2) {
          setDialogueStep(3); // Go straight to name input or skip if already named
        }
      }
    } catch (error) {
      console.error('Error loading onboarding state:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Scene 1: Seed pulse animation
  useEffect(() => {
    if (currentScene === 1 && !isHolding) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(seedPulse, {
            toValue: 1.05,
            duration: 2000,
            useNativeDriver: true,
          }),
          Animated.timing(seedPulse, {
            toValue: 1,
            duration: 2000,
            useNativeDriver: true,
          }),
        ])
      ).start();
    }
  }, [currentScene, isHolding]);

  // Scene 1: Hold to plant
  const handleSeedPressIn = () => {
    setIsHolding(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    // Brighten glow
    Animated.timing(seedGlow, {
      toValue: 1,
      duration: 300,
      useNativeDriver: false,
    }).start();

    // Progress bar
    const interval = setInterval(() => {
      setHoldProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          handleSeedPlanted();
          return 100;
        }
        return prev + 5;
      });
    }, 100);
  };

  const handleSeedPressOut = () => {
    setIsHolding(false);
    setHoldProgress(0);

    Animated.timing(seedGlow, {
      toValue: 0.5,
      duration: 300,
      useNativeDriver: false,
    }).start();
  };

  const handleSeedPlanted = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    completeOnboardingStep('seed_planted');
    setShowSeedParticles(true);

    // Transition to Scene 2
    setTimeout(() => {
      setCurrentScene(2);
      setOnboardingScene(2);
      animateSproutEmergence();
    }, 800);
  };

  // Scene 2: Sprout emergence animation
  const animateSproutEmergence = () => {
    setShowSproutConfetti(true);

    Animated.spring(sproutScale, {
      toValue: 1,
      friction: 8,
      tension: 40,
      useNativeDriver: true,
    }).start(() => {
      // Show first dialogue after emergence
      setTimeout(() => setDialogueStep(1), 500);
    });

    // Success haptic pattern
    setTimeout(() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium), 100);
    setTimeout(() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium), 200);
    setTimeout(() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light), 300);
  };

  // Scene 2: Dialogue progression
  useEffect(() => {
    if (currentScene === 2 && dialogueStep > 0 && dialogueStep < 3) {
      const timer = setTimeout(() => {
        setDialogueStep(dialogueStep + 1);
      }, dialogueStep === 1 ? 1500 : 2000);
      return () => clearTimeout(timer);
    }
  }, [currentScene, dialogueStep]);

  // Scene 2: Submit name
  const handleNameSubmit = () => {
    if (!sproutName.trim()) return;

    const capitalizedName = sproutName.trim().charAt(0).toUpperCase() + sproutName.trim().slice(1);

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSproutName(capitalizedName);
    setDialogueStep(4);

    // Show confirmation dialogue then move to Scene 3
    setTimeout(() => {
      setCurrentScene(3);
      setOnboardingScene(3);
    }, 2000);
  };

  // Scene 3: Theme selection
  const handleThemeSelect = (theme: ThemeOption) => {
    setSelectedThemeLocal(theme);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const handleThemeSubmit = () => {
    if (!selectedTheme) return;

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setSelectedTheme(selectedTheme);

    setTimeout(() => {
      setCurrentScene(4);
      setOnboardingScene(4);
    }, 600);
  };

  // Scene 4: Watering
  const handleWater = () => {
    if (hasWatered) return;

    setHasWatered(true);
    setShowWaterParticles(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    // Show reward animation
    setTimeout(() => {
      setShowReward(true);
      completeOnboardingStep('first_task_completed');
      addCurrency('sunlight', 5);

      // Success haptic
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }, 1000);

    // Complete onboarding
    setTimeout(() => {
      completeOnboarding();
      router.replace('/(tabs)');
    }, 4000);
  };

  if (isLoading) {
    return (
      <View style={[styles.container, { backgroundColor: Colors.background.primary }]}>
        <Text style={Typography.styles.body}>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Scene 1: The Seed */}
      {currentScene === 1 && (
        <View style={styles.scene1}>
          <Animated.View style={[styles.instructionTop, { opacity: 1 }]}>
            <Text style={styles.instructionText}>
              Every big journey starts with a single seed.
            </Text>
          </Animated.View>

          <Pressable
            onPressIn={handleSeedPressIn}
            onPressOut={handleSeedPressOut}
            style={styles.seedContainer}
          >
            <Animated.View
              style={[
                styles.seedGlow,
                {
                  opacity: seedGlow,
                  transform: [{ scale: seedPulse }],
                },
              ]}
            />
            <Animated.View
              style={[
                styles.seed,
                {
                  transform: [{ scale: seedPulse }],
                },
              ]}
            >
              <Text style={styles.seedEmoji}>🌰</Text>
            </Animated.View>

            {isHolding && (
              <View style={styles.progressRing}>
                <View style={[styles.progressFill, { width: `${holdProgress}%` }]} />
              </View>
            )}
          </Pressable>

          {showSeedParticles && (
            <ParticleSystem type="sparkle" count={30} duration={1200} spread={150} />
          )}

          <View style={styles.instructionBottom}>
            <Text style={styles.holdText}>Hold to plant</Text>
            <Text style={styles.fingerEmoji}>👆</Text>
          </View>
        </View>
      )}

      {/* Scene 2: The Sprout */}
      {currentScene === 2 && (
        <View style={styles.scene2}>
          {dialogueStep >= 1 && (
            <View style={styles.speechBubble}>
              <Text style={styles.bubbleText}>
                {dialogueStep === 1 && "Oh! Hi there! 👋"}
                {dialogueStep === 2 && "I'm a little nervous... I just sprouted!"}
                {dialogueStep === 3 && "I don't have a name yet..."}
                {dialogueStep === 4 && `${sproutName}! I love it! 💚`}
              </Text>
            </View>
          )}

          <Animated.View
            style={[
              styles.sproutContainer,
              {
                transform: [{ scale: sproutScale }],
              },
            ]}
          >
            <SproutAvatar
              size={180}
              mood={dialogueStep === 4 ? 'happy' : 'idle'}
              outfit="farmer"
            />
          </Animated.View>

          {dialogueStep === 3 && (
            <View style={styles.nameInputContainer}>
              <TextInput
                style={styles.nameInput}
                placeholder="What should we call you?"
                placeholderTextColor={Colors.text.tertiary}
                value={sproutName}
                onChangeText={setSproutNameLocal}
                autoFocus
                maxLength={15}
              />
              {sproutName.trim() && (
                <Button
                  title="That's perfect!"
                  variant="primary"
                  onPress={handleNameSubmit}
                  fullWidth
                />
              )}
            </View>
          )}

          {showSproutConfetti && (
            <Confetti emojis={['🌱', '✨', '💚', '🍃']} count={40} duration={2000} />
          )}
        </View>
      )}

      {/* Scene 3: The Vibe Check */}
      {currentScene === 3 && (
        <View style={styles.scene3}>
          <View style={styles.scene3Header}>
            <SproutAvatar size={100} mood="happy" outfit="farmer" />
            <View style={styles.scene3Dialogue}>
              <Text style={styles.scene3Title}>
                Now... what kind of garden should we grow together?
              </Text>
              <Text style={styles.scene3Subtitle}>
                This will be our cozy space. Choose what feels right.
              </Text>
            </View>
          </View>

          <View style={styles.themeCards}>
            <ThemeCard
              title="Peaceful Garden"
              icon="🧘"
              description="Calm, minimal, breathing room"
              isSelected={selectedTheme === 'peaceful-garden'}
              onPress={() => handleThemeSelect('peaceful-garden')}
            />
            <ThemeCard
              title="Wild Bloom"
              icon="🌺"
              description="Vibrant, energetic, full of life"
              isSelected={selectedTheme === 'wild-bloom'}
              onPress={() => handleThemeSelect('wild-bloom')}
            />
            <ThemeCard
              title="Cozy Cottage"
              icon="🏡"
              description="Structured, warm, like home"
              isSelected={selectedTheme === 'cozy-cottage'}
              onPress={() => handleThemeSelect('cozy-cottage')}
            />
          </View>

          {selectedTheme && (
            <Button
              title="Let's grow! 🌱"
              variant="primary"
              size="lg"
              onPress={handleThemeSubmit}
              fullWidth
            />
          )}
        </View>
      )}

      {/* Scene 4: The First Win */}
      {currentScene === 4 && (
        <View style={styles.scene4}>
          <View style={styles.currencyBar}>
            <Text style={styles.currencyText}>
              Sunlight: {showReward ? 5 : 0} ☀️
            </Text>
          </View>

          {!hasWatered && (
            <View style={styles.speechBubble}>
              <Text style={styles.bubbleText}>
                {sproutName || 'Friend'}, I'm feeling a little thirsty... 💧
              </Text>
            </View>
          )}

          {hasWatered && (
            <View style={styles.speechBubble}>
              <Text style={styles.bubbleText}>
                Ahh! Thank you! I feel so much better! ✨
              </Text>
            </View>
          )}

          <View style={styles.gardenScene}>
            <SproutAvatar
              size={200}
              mood={hasWatered ? 'happy' : 'idle'}
              outfit="farmer"
            />
            {showWaterParticles && (
              <ParticleSystem type="water" count={20} duration={1000} spread={80} />
            )}
          </View>

          {showReward && (
            <Animated.View style={styles.rewardPopup}>
              <Text style={styles.rewardText}>+5 Sunlight</Text>
            </Animated.View>
          )}

          <Pressable
            style={[
              styles.waterButton,
              hasWatered && styles.waterButtonDisabled,
            ]}
            onPress={handleWater}
            disabled={hasWatered}
          >
            <Text style={styles.waterButtonIcon}>💧</Text>
            <Text style={styles.waterButtonText}>Water</Text>
          </Pressable>

          {showReward && (
            <View style={styles.finalMessage}>
              <Text style={styles.finalMessageText}>
                When you take care of yourself, you take care of me too! 🌱
              </Text>
            </View>
          )}
        </View>
      )}
    </View>
  );
}

// Theme Card Component
interface ThemeCardProps {
  title: string;
  icon: string;
  description: string;
  isSelected: boolean;
  onPress: () => void;
}

function ThemeCard({ title, icon, description, isSelected, onPress }: ThemeCardProps) {
  return (
    <Pressable
      style={[styles.themeCard, isSelected && styles.themeCardSelected]}
      onPress={onPress}
    >
      <Text style={styles.themeIcon}>{icon}</Text>
      <Text style={styles.themeTitle}>{title}</Text>
      <Text style={styles.themeDescription}>{description}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  // Scene 1: The Seed
  scene1: {
    flex: 1,
    backgroundColor: '#3D2817',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.xl * 2,
  },
  instructionTop: {
    paddingHorizontal: Spacing.xl,
  },
  instructionText: {
    ...Typography.styles.h3,
    color: Colors.accent.gold,
    textAlign: 'center',
  },
  seedContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  seedGlow: {
    position: 'absolute',
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: Colors.accent.gold,
  },
  seed: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
  },
  seedEmoji: {
    fontSize: 60,
  },
  progressRing: {
    marginTop: Spacing.xl,
    width: 100,
    height: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: Colors.accent.gold,
  },
  instructionBottom: {
    alignItems: 'center',
  },
  holdText: {
    ...Typography.styles.body,
    color: '#F5E6D3',
    marginBottom: Spacing.sm,
  },
  fingerEmoji: {
    fontSize: 32,
  },

  // Scene 2: The Sprout
  scene2: {
    flex: 1,
    backgroundColor: Colors.background.primary,
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: Spacing.xl * 2,
    paddingHorizontal: Spacing.xl,
  },
  speechBubble: {
    backgroundColor: 'white',
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
    maxWidth: '85%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  bubbleText: {
    ...Typography.styles.bodyLarge,
    color: Colors.text.primary,
    textAlign: 'center',
  },
  sproutContainer: {
    alignItems: 'center',
  },
  nameInputContainer: {
    width: '100%',
    gap: Spacing.md,
  },
  nameInput: {
    ...Typography.styles.bodyLarge,
    backgroundColor: 'white',
    borderWidth: 2,
    borderColor: Colors.primary.sage,
    borderRadius: BorderRadius.lg,
    padding: Spacing.base,
    color: Colors.text.primary,
    textAlign: 'center',
  },

  // Scene 3: The Vibe Check
  scene3: {
    flex: 1,
    backgroundColor: Colors.background.primary,
    paddingVertical: Spacing.xl * 2,
    paddingHorizontal: Spacing.xl,
  },
  scene3Header: {
    flexDirection: 'row',
    gap: Spacing.base,
    marginBottom: Spacing.xl,
  },
  scene3Dialogue: {
    flex: 1,
  },
  scene3Title: {
    ...Typography.styles.h3,
    color: Colors.text.primary,
    marginBottom: Spacing.sm,
  },
  scene3Subtitle: {
    ...Typography.styles.body,
    color: Colors.text.secondary,
  },
  themeCards: {
    flex: 1,
    gap: Spacing.md,
    marginBottom: Spacing.xl,
  },
  themeCard: {
    backgroundColor: 'white',
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    borderWidth: 2,
    borderColor: 'transparent',
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.base,
  },
  themeCardSelected: {
    borderColor: Colors.primary.sage,
    backgroundColor: '#F0F7F0',
  },
  themeIcon: {
    fontSize: 40,
  },
  themeTitle: {
    ...Typography.styles.h4,
    color: Colors.text.primary,
    flex: 1,
  },
  themeDescription: {
    ...Typography.styles.caption,
    color: Colors.text.secondary,
    flex: 2,
  },

  // Scene 4: The First Win
  scene4: {
    flex: 1,
    backgroundColor: Colors.background.primary,
    paddingVertical: Spacing.xl,
    paddingHorizontal: Spacing.xl,
  },
  currencyBar: {
    backgroundColor: Colors.primary.sage,
    borderRadius: BorderRadius.lg,
    padding: Spacing.base,
    marginBottom: Spacing.xl,
  },
  currencyText: {
    ...Typography.styles.h4,
    color: 'white',
    textAlign: 'center',
  },
  gardenScene: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  waterButton: {
    backgroundColor: Colors.accent.gold,
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: Spacing.sm,
    marginVertical: Spacing.lg,
  },
  waterButtonDisabled: {
    opacity: 0.5,
  },
  waterButtonIcon: {
    fontSize: 32,
  },
  waterButtonText: {
    ...Typography.styles.h3,
    color: 'white',
  },
  rewardPopup: {
    position: 'absolute',
    top: '40%',
    alignSelf: 'center',
    backgroundColor: Colors.accent.gold,
    borderRadius: BorderRadius.lg,
    padding: Spacing.base,
  },
  rewardText: {
    ...Typography.styles.h3,
    color: 'white',
  },
  finalMessage: {
    backgroundColor: 'white',
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
  },
  finalMessageText: {
    ...Typography.styles.body,
    color: Colors.text.primary,
    textAlign: 'center',
  },
});
