/**
 * Timer Component - Countdown timer with haptic feedback
 */

import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import * as Haptics from 'expo-haptics';
import { Colors, Typography, Spacing, BorderRadius, Shadow } from '../../constants';

interface TimerProps {
  duration: number; // Total duration in seconds
  elapsed: number; // Elapsed time in seconds
  isPaused: boolean;
  onTick: (elapsed: number) => void;
  onComplete: () => void;
  onPause: () => void;
  onResume: () => void;
}

export function Timer({
  duration,
  elapsed,
  isPaused,
  onTick,
  onComplete,
  onPause,
  onResume,
}: TimerProps) {
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const lastMinuteRef = useRef<number>(-1);
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const [hasWarned, setHasWarned] = useState(false);

  // Format time as MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const remaining = Math.max(0, duration - elapsed);
  const progress = duration > 0 ? (elapsed / duration) * 100 : 0;

  // Timer tick logic
  useEffect(() => {
    if (!isPaused && elapsed < duration) {
      intervalRef.current = setInterval(() => {
        const newElapsed = elapsed + 1;
        onTick(newElapsed);

        // Haptic feedback every minute
        const currentMinute = Math.floor(newElapsed / 60);
        if (currentMinute > lastMinuteRef.current) {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          lastMinuteRef.current = currentMinute;
        }

        // Warning haptic at 1 minute remaining (only once)
        if (remaining <= 60 && remaining > 59 && !hasWarned) {
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
          setHasWarned(true);
        }

        // Complete haptic
        if (newElapsed >= duration) {
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          onComplete();
        }
      }, 1000);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [elapsed, duration, isPaused, remaining, hasWarned]);

  // Pulse animation when time is running low
  useEffect(() => {
    if (remaining <= 60 && remaining > 0 && !isPaused) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.1,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      pulseAnim.setValue(1);
    }
  }, [remaining, isPaused]);

  const handlePauseResume = () => {
    if (isPaused) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      onResume();
    } else {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      onPause();
    }
  };

  return (
    <View style={styles.container}>
      {/* Circular Progress */}
      <View style={styles.circleContainer}>
        <View style={styles.progressCircle}>
          {/* Background circle */}
          <View style={styles.circleBackground} />

          {/* Progress indicator (simplified, can be enhanced with SVG) */}
          <View
            style={[
              styles.circleProgress,
              {
                backgroundColor:
                  remaining <= 60
                    ? Colors.accent.coral
                    : progress > 50
                    ? Colors.primary.sage
                    : Colors.accent.gold,
              },
            ]}
          />

          {/* Time Display */}
          <Animated.View
            style={[
              styles.timeContainer,
              { transform: [{ scale: pulseAnim }] },
            ]}
          >
            <Text
              style={[
                styles.timeText,
                remaining <= 60 && styles.timeTextWarning,
              ]}
            >
              {formatTime(remaining)}
            </Text>
            <Text style={styles.timeLabel}>
              {isPaused ? 'Paused' : 'Remaining'}
            </Text>
          </Animated.View>
        </View>
      </View>

      {/* Progress Bar */}
      <View style={styles.progressBarContainer}>
        <View style={styles.progressBar}>
          <View
            style={[
              styles.progressBarFill,
              {
                width: `${progress}%`,
                backgroundColor:
                  remaining <= 60
                    ? Colors.accent.coral
                    : Colors.primary.sage,
              },
            ]}
          />
        </View>
        <Text style={styles.progressText}>
          {Math.round(progress)}% Complete
        </Text>
      </View>

      {/* Pause/Resume Button */}
      <TouchableOpacity
        style={[
          styles.pauseButton,
          isPaused && styles.pauseButtonActive,
        ]}
        onPress={handlePauseResume}
      >
        <Text style={styles.pauseButtonText}>
          {isPaused ? '▶️ Resume' : '⏸️ Pause'}
        </Text>
      </TouchableOpacity>

      {/* Stats */}
      <View style={styles.stats}>
        <View style={styles.stat}>
          <Text style={styles.statValue}>{formatTime(elapsed)}</Text>
          <Text style={styles.statLabel}>Elapsed</Text>
        </View>
        <View style={styles.stat}>
          <Text style={styles.statValue}>{formatTime(duration)}</Text>
          <Text style={styles.statLabel}>Total</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: Spacing.xl,
  },

  // Circle
  circleContainer: {
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },
  progressCircle: {
    width: 240,
    height: 240,
    borderRadius: 120,
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  circleBackground: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    borderRadius: 120,
    backgroundColor: Colors.background.secondary,
    borderWidth: 8,
    borderColor: Colors.background.card,
  },
  circleProgress: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    borderRadius: 120,
    opacity: 0.2,
  },
  timeContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  timeText: {
    ...Typography.styles.h1,
    fontSize: 56,
    color: Colors.text.primary,
    fontWeight: 'bold',
  },
  timeTextWarning: {
    color: Colors.accent.coral,
  },
  timeLabel: {
    ...Typography.styles.caption,
    color: Colors.text.secondary,
    marginTop: Spacing.xs,
  },

  // Progress Bar
  progressBarContainer: {
    width: '100%',
    paddingHorizontal: Spacing.xl,
    marginBottom: Spacing.lg,
  },
  progressBar: {
    height: 12,
    backgroundColor: Colors.background.secondary,
    borderRadius: BorderRadius.round,
    overflow: 'hidden',
    marginBottom: Spacing.sm,
  },
  progressBarFill: {
    height: '100%',
    borderRadius: BorderRadius.round,
    transition: 'width 0.3s ease',
  },
  progressText: {
    ...Typography.styles.caption,
    color: Colors.text.secondary,
    textAlign: 'center',
  },

  // Pause Button
  pauseButton: {
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.xl,
    backgroundColor: Colors.background.card,
    borderRadius: BorderRadius.lg,
    borderWidth: 2,
    borderColor: Colors.primary.sage,
    ...Shadow.sm,
    marginBottom: Spacing.lg,
  },
  pauseButtonActive: {
    backgroundColor: Colors.primary.sage,
    borderColor: Colors.primary.sage,
  },
  pauseButtonText: {
    ...Typography.styles.button,
    color: Colors.text.primary,
    fontSize: 18,
  },

  // Stats
  stats: {
    flexDirection: 'row',
    gap: Spacing.xl,
  },
  stat: {
    alignItems: 'center',
  },
  statValue: {
    ...Typography.styles.h3,
    color: Colors.text.primary,
    marginBottom: Spacing.xs,
  },
  statLabel: {
    ...Typography.styles.caption,
    color: Colors.text.secondary,
  },
});
