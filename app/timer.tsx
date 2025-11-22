/**
 * Timer Screen - Active Task Session
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { Timer } from '../src/components/timer';
import { GardenScene } from '../src/components/garden';
import { useStore } from '../src/store/useStore';
import { Colors, Typography, Spacing, BorderRadius, Shadow } from '../src/constants';

export default function TimerScreen() {
  const router = useRouter();
  const {
    timer,
    currentTask,
    avatar,
    weatherMood,
    updateTimerElapsed,
    pauseTimer,
    resumeTimer,
    completeTimer,
    stopTimer,
  } = useStore();

  // Redirect if no active timer
  React.useEffect(() => {
    if (!timer.isActive && !timer.completedAt) {
      router.back();
    }
  }, [timer.isActive, timer.completedAt]);

  const handleComplete = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    completeTimer();

    // Show success message and navigate back
    setTimeout(() => {
      router.push('/(tabs)');
    }, 2000);
  };

  const handleStop = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    Alert.alert(
      'Stop Timer?',
      'Are you sure you want to stop this session? Your progress will not be saved.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
          onPress: () => Haptics.selectionAsync(),
        },
        {
          text: 'Stop',
          style: 'destructive',
          onPress: () => {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
            stopTimer();
            router.back();
          },
        },
      ]
    );
  };

  if (!timer.isActive && !timer.completedAt) {
    return null;
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleStop}>
          <Text style={styles.backButtonText}>✕</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Focus Session</Text>
        <View style={styles.backButton} />
      </View>

      {/* Task Info */}
      <View style={styles.taskInfo}>
        <Text style={styles.taskTitle}>{currentTask?.title || 'Untitled Task'}</Text>
        {currentTask?.description && (
          <Text style={styles.taskDescription}>{currentTask.description}</Text>
        )}
      </View>

      {/* Mini Garden Scene */}
      <View style={styles.miniGarden}>
        <GardenScene
          weatherMood={weatherMood}
          dailyProgress={Math.round((timer.elapsed / timer.duration) * 100)}
          avatarMood={timer.isPaused ? 'idle' : 'working'}
          avatarOutfit={avatar.outfit}
          avatarAccessory={avatar.accessory}
        />
      </View>

      {/* Timer Component */}
      {timer.completedAt ? (
        <View style={styles.completionContainer}>
          <Text style={styles.completionEmoji}>🌱✨</Text>
          <Text style={styles.completionTitle}>Session Complete!</Text>
          <Text style={styles.completionMessage}>
            Great work! You've nurtured your growth garden.
          </Text>
          <TouchableOpacity
            style={styles.doneButton}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              router.push('/(tabs)');
            }}
          >
            <Text style={styles.doneButtonText}>🌸 Back to Garden</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <Timer
          duration={timer.duration}
          elapsed={timer.elapsed}
          isPaused={timer.isPaused}
          onTick={updateTimerElapsed}
          onComplete={handleComplete}
          onPause={pauseTimer}
          onResume={resumeTimer}
        />
      )}

      {/* Tips */}
      {!timer.completedAt && (
        <View style={styles.tips}>
          <Text style={styles.tipsTitle}>💡 Focus Tips</Text>
          <Text style={styles.tipsText}>
            {timer.isPaused
              ? 'Take a breath. When ready, resume your session.'
              : 'Stay present with your task. Your garden is growing!'}
          </Text>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.primary,
  },

  // Header
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.screenPadding,
    paddingVertical: Spacing.base,
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backButtonText: {
    fontSize: 28,
    color: Colors.text.secondary,
  },
  headerTitle: {
    ...Typography.styles.h3,
    color: Colors.text.primary,
  },

  // Task Info
  taskInfo: {
    paddingHorizontal: Spacing.screenPadding,
    paddingVertical: Spacing.base,
    alignItems: 'center',
  },
  taskTitle: {
    ...Typography.styles.h2,
    color: Colors.text.primary,
    textAlign: 'center',
    marginBottom: Spacing.xs,
  },
  taskDescription: {
    ...Typography.styles.body,
    color: Colors.text.secondary,
    textAlign: 'center',
  },

  // Mini Garden
  miniGarden: {
    height: 180,
    marginVertical: Spacing.md,
  },

  // Completion
  completionContainer: {
    alignItems: 'center',
    paddingVertical: Spacing.xl,
  },
  completionEmoji: {
    fontSize: 72,
    marginBottom: Spacing.base,
  },
  completionTitle: {
    ...Typography.styles.h1,
    color: Colors.text.primary,
    marginBottom: Spacing.sm,
  },
  completionMessage: {
    ...Typography.styles.body,
    color: Colors.text.secondary,
    textAlign: 'center',
    marginBottom: Spacing.xl,
    paddingHorizontal: Spacing.xl,
  },
  doneButton: {
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.xl,
    backgroundColor: Colors.primary.sage,
    borderRadius: BorderRadius.lg,
    ...Shadow.md,
  },
  doneButtonText: {
    ...Typography.styles.button,
    color: Colors.text.primary,
    fontSize: 18,
  },

  // Tips
  tips: {
    marginHorizontal: Spacing.screenPadding,
    marginTop: Spacing.lg,
    padding: Spacing.base,
    backgroundColor: Colors.background.card,
    borderRadius: BorderRadius.md,
    borderLeftWidth: 4,
    borderLeftColor: Colors.accent.gold,
  },
  tipsTitle: {
    ...Typography.styles.button,
    color: Colors.text.primary,
    marginBottom: Spacing.xs,
  },
  tipsText: {
    ...Typography.styles.caption,
    color: Colors.text.secondary,
    lineHeight: 18,
  },
});
