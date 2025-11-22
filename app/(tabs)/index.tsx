/**
 * Home Screen - Main Garden Dashboard
 * The heart of the Cozy Growth app
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import { GardenScene, CurrencyBar } from '../../src/components/garden';
import { Button, Card } from '../../src/components/ui';
import { useStore } from '../../src/store/useStore';
import { Colors, Typography, Spacing, BorderRadius, Shadow } from '../../src/constants';
import * as Haptics from 'expo-haptics';

export default function HomeScreen() {
  const router = useRouter();
  const {
    user,
    avatar,
    currency,
    dailyProgress,
    weatherMood,
    tasks,
    addTask,
    startTimer,
    setWeatherMood,
    setAvatarMood,
  } = useStore();

  const [selectedDuration, setSelectedDuration] = useState<number>(10);
  const pendingTasks = tasks.filter(t => t.status === 'pending');

  const handleWeatherToggle = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setWeatherMood(weatherMood === 'sunny' ? 'rainy' : 'sunny');
  };

  const handleAvatarPress = () => {
    setAvatarMood('happy');
    setTimeout(() => setAvatarMood('idle'), 1000);
  };

  const handleDurationSelect = (duration: number) => {
    Haptics.selectionAsync();
    setSelectedDuration(duration);
  };

  const handleCultivate = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

    // If there are pending tasks, use the first one; otherwise create a quick focus task
    if (pendingTasks.length > 0) {
      // Start timer with the first pending task
      const task = pendingTasks[0];
      startTimer(task.id, task.durationMinutes);
      router.push('/timer');
    } else {
      // Create a quick focus task with a generated ID
      const taskId = `task_${Date.now()}`;
      const quickTask = {
        id: taskId,
        title: 'Focus Session',
        description: 'A focused work session to nurture your growth',
        durationMinutes: selectedDuration,
        goalId: 'default_goal',
        status: 'pending' as const,
        difficulty: 'easy' as const,
        order: 0,
        createdAt: new Date(),
      };

      // Create the task by calling addTask without id and createdAt (as per store interface)
      const taskData = {
        title: quickTask.title,
        description: quickTask.description,
        durationMinutes: quickTask.durationMinutes,
        goalId: quickTask.goalId,
        status: quickTask.status,
        difficulty: quickTask.difficulty,
        order: quickTask.order,
      };

      addTask(taskData);

      // Start timer - need to get the actual task that was created
      setTimeout(() => {
        const createdTask = tasks.find(t => t.title === 'Focus Session' && t.status === 'pending');
        if (createdTask) {
          startTimer(createdTask.id, selectedDuration);
          router.push('/timer');
        }
      }, 100);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.greeting}>Hi, {user?.name || 'Gardener'}!</Text>
          <View style={styles.headerButtons}>
            <TouchableOpacity
              style={styles.tasksButton}
              onPress={() => router.push('/tasks')}
            >
              <Text style={styles.tasksIcon}>📝</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.settingsButton}>
              <Text style={styles.settingsIcon}>⚙️</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Garden Scene (The Game Window) */}
        <GardenScene
          weatherMood={weatherMood}
          dailyProgress={dailyProgress.plantGrowth}
          avatarMood={avatar.mood}
          avatarOutfit={avatar.outfit}
          avatarAccessory={avatar.accessory}
          onWeatherPress={handleWeatherToggle}
          onAvatarPress={handleAvatarPress}
        />

        {/* Progress Info */}
        <View style={styles.progressInfo}>
          <Text style={styles.progressText}>
            {dailyProgress.minutesCompleted}/{dailyProgress.goalMinutes} Minutes of Growth
          </Text>
          <View style={styles.progressBar}>
            <View
              style={[
                styles.progressFill,
                { width: `${dailyProgress.plantGrowth}%` },
              ]}
            />
          </View>
        </View>

        {/* Currency Bar */}
        <View style={styles.currencyContainer}>
          <CurrencyBar sunlight={currency.sunlight} seeds={currency.seeds} />
        </View>

        {/* Action Card */}
        <Card variant="parchment" style={styles.actionCard}>
          <Text style={styles.actionTitle}>Time to Nurture</Text>

          {/* Duration Selector */}
          <View style={styles.durationSelector}>
            {[5, 10, 15].map((duration) => (
              <TouchableOpacity
                key={duration}
                style={[
                  styles.durationButton,
                  selectedDuration === duration && styles.durationButtonActive,
                ]}
                onPress={() => handleDurationSelect(duration)}
              >
                <Text style={styles.seedIcon}>🌰</Text>
                <Text
                  style={[
                    styles.durationText,
                    selectedDuration === duration && styles.durationTextActive,
                  ]}
                >
                  {duration} min
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Main CTA */}
          <Button
            title={
              pendingTasks.length > 0
                ? `🌱 Start: ${pendingTasks[0].title.substring(0, 25)}${pendingTasks[0].title.length > 25 ? '...' : ''}`
                : '🌱 Start Focus Session'
            }
            variant="wood"
            size="lg"
            onPress={handleCultivate}
            fullWidth
          />
        </Card>

        {/* Bottom spacing */}
        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.primary,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: Spacing.xl,
  },

  // Header
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.screenPadding,
    paddingVertical: Spacing.base,
  },
  greeting: {
    ...Typography.styles.h2,
    color: Colors.text.primary,
  },
  headerButtons: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  tasksButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tasksIcon: {
    fontSize: 24,
  },
  settingsButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  settingsIcon: {
    fontSize: 24,
  },

  // Progress Info
  progressInfo: {
    paddingHorizontal: Spacing.screenPadding,
    paddingVertical: Spacing.base,
  },
  progressText: {
    ...Typography.styles.body,
    color: Colors.text.secondary,
    marginBottom: Spacing.sm,
    textAlign: 'center',
  },
  progressBar: {
    height: 8,
    backgroundColor: Colors.background.secondary,
    borderRadius: BorderRadius.round,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: Colors.primary.sage,
    borderRadius: BorderRadius.round,
  },

  // Currency
  currencyContainer: {
    paddingHorizontal: Spacing.screenPadding,
    paddingVertical: Spacing.sm,
    alignItems: 'center',
  },

  // Action Card
  actionCard: {
    marginHorizontal: Spacing.screenPadding,
    marginTop: Spacing.lg,
  },
  actionTitle: {
    ...Typography.styles.h3,
    color: Colors.text.primary,
    marginBottom: Spacing.base,
    textAlign: 'center',
  },

  // Duration Selector
  durationSelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: Spacing.md,
    marginBottom: Spacing.lg,
  },
  durationButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.md,
    backgroundColor: Colors.background.card,
    borderRadius: BorderRadius.md,
    borderWidth: 2,
    borderColor: 'transparent',
    ...Shadow.sm,
  },
  durationButtonActive: {
    borderColor: Colors.accent.gold,
    backgroundColor: Colors.accent.gold,
    ...Shadow.md,
  },
  seedIcon: {
    fontSize: 28,
    marginBottom: Spacing.xs,
  },
  durationText: {
    ...Typography.styles.caption,
    color: Colors.text.secondary,
  },
  durationTextActive: {
    ...Typography.styles.button,
    color: Colors.text.primary,
  },
});
