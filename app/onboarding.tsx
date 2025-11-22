/**
 * Onboarding Screen
 * Welcome new users and create their profile
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Button, Card } from '../src/components/ui';
import { SproutAvatar } from '../src/components/avatar';
import { Colors, Typography, Spacing, BorderRadius } from '../src/constants';
import { useStore } from '../src/store/useStore';
import * as Haptics from 'expo-haptics';

export default function OnboardingScreen() {
  const router = useRouter();
  const { setUser, setIsOnboarded, setAvatarMood } = useStore();

  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [selectedOutfit, setSelectedOutfit] = useState<any>('gardener');
  const [dailyGoal, setDailyGoal] = useState(30);

  const handleNext = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    if (step === 1 && name.trim()) {
      setStep(2);
    } else if (step === 2) {
      setStep(3);
    } else if (step === 3) {
      // Complete onboarding
      setUser({
        id: `user_${Date.now()}`,
        name: name.trim(),
        createdAt: new Date(),
        dailyGoalMinutes: dailyGoal,
      });
      setIsOnboarded(true);
      setAvatarMood('happy');
      router.replace('/(tabs)');
    }
  };

  const handleSkip = () => {
    setStep(step + 1);
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={styles.content}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Welcome to Cozy Growth</Text>
            <Text style={styles.subtitle}>
              Your ADHD-friendly garden of tiny wins
            </Text>
          </View>

          {/* Steps */}
          {step === 1 && (
            <Card style={styles.card}>
              <Text style={styles.stepTitle}>What should we call you?</Text>
              <TextInput
                style={styles.input}
                placeholder="Your name..."
                placeholderTextColor={Colors.text.tertiary}
                value={name}
                onChangeText={setName}
                autoFocus
              />
            </Card>
          )}

          {step === 2 && (
            <Card style={styles.card}>
              <Text style={styles.stepTitle}>Meet your Sprout!</Text>
              <View style={styles.avatarPreview}>
                <SproutAvatar outfit={selectedOutfit} size={150} mood="happy" />
              </View>
              <Text style={styles.description}>
                This friendly sprout will be your companion on your growth journey.
                You can customize them later in the shop!
              </Text>
            </Card>
          )}

          {step === 3 && (
            <Card style={styles.card}>
              <Text style={styles.stepTitle}>Daily Growth Goal</Text>
              <Text style={styles.description}>
                How many minutes would you like to grow each day?
              </Text>
              <View style={styles.goalOptions}>
                {[15, 30, 45].map((goal) => (
                  <Button
                    key={goal}
                    title={`${goal} min`}
                    variant={dailyGoal === goal ? 'primary' : 'secondary'}
                    onPress={() => setDailyGoal(goal)}
                  />
                ))}
              </View>
            </Card>
          )}

          {/* Navigation */}
          <View style={styles.navigation}>
            <Button
              title={step === 3 ? "Start Growing!" : "Next"}
              variant="primary"
              size="lg"
              onPress={handleNext}
              disabled={step === 1 && !name.trim()}
              fullWidth
            />
          </View>

          {/* Progress Dots */}
          <View style={styles.dots}>
            {[1, 2, 3].map((dot) => (
              <View
                key={dot}
                style={[styles.dot, dot === step && styles.dotActive]}
              />
            ))}
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.primary,
  },
  keyboardView: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: Spacing.screenPadding,
    justifyContent: 'space-between',
  },

  // Header
  header: {
    alignItems: 'center',
    paddingTop: Spacing.xl,
  },
  title: {
    ...Typography.styles.h1,
    color: Colors.text.primary,
    textAlign: 'center',
    marginBottom: Spacing.sm,
  },
  subtitle: {
    ...Typography.styles.body,
    color: Colors.text.secondary,
    textAlign: 'center',
  },

  // Card
  card: {
    flex: 1,
    justifyContent: 'center',
    maxHeight: 400,
    marginVertical: Spacing.xl,
  },
  stepTitle: {
    ...Typography.styles.h2,
    color: Colors.text.primary,
    textAlign: 'center',
    marginBottom: Spacing.lg,
  },
  description: {
    ...Typography.styles.body,
    color: Colors.text.secondary,
    textAlign: 'center',
    marginTop: Spacing.base,
  },

  // Input
  input: {
    ...Typography.styles.bodyLarge,
    backgroundColor: Colors.background.card,
    borderWidth: 2,
    borderColor: Colors.primary.sage,
    borderRadius: BorderRadius.lg,
    padding: Spacing.base,
    color: Colors.text.primary,
    textAlign: 'center',
  },

  // Avatar Preview
  avatarPreview: {
    alignItems: 'center',
    paddingVertical: Spacing.xl,
  },

  // Goal Options
  goalOptions: {
    flexDirection: 'row',
    gap: Spacing.md,
    marginTop: Spacing.lg,
    justifyContent: 'center',
  },

  // Navigation
  navigation: {
    paddingVertical: Spacing.lg,
  },

  // Progress Dots
  dots: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: Spacing.sm,
    paddingBottom: Spacing.lg,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.state.disabled,
  },
  dotActive: {
    backgroundColor: Colors.primary.sage,
    width: 24,
  },
});
