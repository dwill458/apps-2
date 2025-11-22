/**
 * Create Task Screen
 * Create new tasks with optional AI breakdown
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as Haptics from 'expo-haptics';
import { Button, Card } from '../src/components/ui';
import { useStore } from '../src/store/useStore';
import { Colors, Typography, Spacing, BorderRadius, Shadow } from '../src/constants';
import { breakdownTask, estimateDifficulty } from '../src/utils/aiBreakdown';

export default function CreateTaskScreen() {
  const router = useRouter();
  const { addTask, goals, currentGoal } = useStore();

  // Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [duration, setDuration] = useState('15');
  const [selectedGoalId, setSelectedGoalId] = useState<string>(
    currentGoal?.id || goals[0]?.id || ''
  );
  const [showAIBreakdown, setShowAIBreakdown] = useState(false);
  const [aiSubtasks, setAiSubtasks] = useState<any[]>([]);
  const [selectedSubtasks, setSelectedSubtasks] = useState<Set<number>>(new Set());

  const handleGenerateBreakdown = () => {
    if (!title.trim()) {
      Alert.alert('Missing Title', 'Please enter a task title first');
      return;
    }

    const durationNum = parseInt(duration) || 15;
    if (durationNum < 10) {
      Alert.alert(
        'Task Too Small',
        'Tasks under 10 minutes are already small enough! No breakdown needed.'
      );
      return;
    }

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    const subtasks = breakdownTask(
      title,
      description,
      durationNum,
      selectedGoalId
    );

    setAiSubtasks(subtasks);
    setShowAIBreakdown(true);
    // Select all by default
    setSelectedSubtasks(new Set(subtasks.map((_, i) => i)));
  };

  const toggleSubtask = (index: number) => {
    Haptics.selectionAsync();
    const newSelected = new Set(selectedSubtasks);
    if (newSelected.has(index)) {
      newSelected.delete(index);
    } else {
      newSelected.add(index);
    }
    setSelectedSubtasks(newSelected);
  };

  const handleCreateTask = () => {
    if (!title.trim()) {
      Alert.alert('Missing Title', 'Please enter a task title');
      return;
    }

    if (!selectedGoalId) {
      Alert.alert('Missing Goal', 'Please select a goal for this task');
      return;
    }

    const durationNum = parseInt(duration) || 15;

    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

    if (showAIBreakdown && selectedSubtasks.size > 0) {
      // Create parent task with subtasks
      const parentTaskId = `task_${Date.now()}`;
      const selectedSubtaskList = aiSubtasks
        .filter((_, i) => selectedSubtasks.has(i))
        .map((subtask, index) => ({
          title: subtask.title,
          description: subtask.description,
          durationMinutes: subtask.durationMinutes,
          goalId: selectedGoalId,
          status: 'pending' as const,
          difficulty: subtask.difficulty,
          order: index,
          parentTaskId: parentTaskId,
          isAIGenerated: true,
        }));

      // Add parent task
      addTask({
        title,
        description,
        durationMinutes: durationNum,
        goalId: selectedGoalId,
        status: 'pending',
        difficulty: estimateDifficulty(durationNum, description),
        order: 0,
      });

      // Add subtasks
      selectedSubtaskList.forEach(subtask => {
        addTask(subtask);
      });

      Alert.alert(
        'Tasks Created! 🌱',
        `Created 1 main task with ${selectedSubtaskList.length} subtasks`,
        [{ text: 'Great!', onPress: () => router.back() }]
      );
    } else {
      // Create single task
      addTask({
        title,
        description,
        durationMinutes: durationNum,
        goalId: selectedGoalId,
        status: 'pending',
        difficulty: estimateDifficulty(durationNum, description),
        order: 0,
      });

      Alert.alert('Task Created! 🌱', 'Your new task is ready to nurture', [
        { text: 'Great!', onPress: () => router.back() },
      ]);
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy':
        return Colors.primary.sage;
      case 'medium':
        return Colors.accent.gold;
      case 'hard':
        return Colors.accent.coral;
      default:
        return Colors.text.secondary;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Plant a New Task</Text>
        <View style={{ width: 40 }} />
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Main Form */}
          <Card variant="parchment" style={styles.formCard}>
            {/* Task Title */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>What will you nurture? 🌱</Text>
              <TextInput
                style={styles.input}
                value={title}
                onChangeText={setTitle}
                placeholder="e.g., Learn React Native basics"
                placeholderTextColor={Colors.text.tertiary}
              />
            </View>

            {/* Description */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Details (optional)</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={description}
                onChangeText={setDescription}
                placeholder="Add more context..."
                placeholderTextColor={Colors.text.tertiary}
                multiline
                numberOfLines={3}
              />
            </View>

            {/* Duration */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Time to Grow (minutes) 🌰</Text>
              <TextInput
                style={styles.input}
                value={duration}
                onChangeText={setDuration}
                placeholder="15"
                keyboardType="number-pad"
                placeholderTextColor={Colors.text.tertiary}
              />
            </View>

            {/* Goal Selection */}
            {goals.length > 0 && (
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Garden Plot (Goal)</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  <View style={styles.goalSelector}>
                    {goals.map((goal) => (
                      <TouchableOpacity
                        key={goal.id}
                        style={[
                          styles.goalChip,
                          selectedGoalId === goal.id && styles.goalChipActive,
                        ]}
                        onPress={() => {
                          Haptics.selectionAsync();
                          setSelectedGoalId(goal.id);
                        }}
                      >
                        <Text
                          style={[
                            styles.goalChipText,
                            selectedGoalId === goal.id && styles.goalChipTextActive,
                          ]}
                        >
                          {goal.title}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </ScrollView>
              </View>
            )}

            {/* AI Breakdown Button */}
            <Button
              title="✨ Break Down with AI"
              variant="secondary"
              size="md"
              onPress={handleGenerateBreakdown}
              fullWidth
            />
          </Card>

          {/* AI Breakdown Results */}
          {showAIBreakdown && aiSubtasks.length > 0 && (
            <Card variant="parchment" style={styles.breakdownCard}>
              <Text style={styles.breakdownTitle}>
                🤖 AI Suggested Steps
              </Text>
              <Text style={styles.breakdownSubtitle}>
                Select the steps you'd like to include
              </Text>

              <View style={styles.subtaskList}>
                {aiSubtasks.map((subtask, index) => (
                  <TouchableOpacity
                    key={index}
                    style={[
                      styles.subtaskItem,
                      selectedSubtasks.has(index) && styles.subtaskItemSelected,
                    ]}
                    onPress={() => toggleSubtask(index)}
                  >
                    <View style={styles.subtaskCheckbox}>
                      {selectedSubtasks.has(index) && (
                        <Text style={styles.checkmark}>✓</Text>
                      )}
                    </View>
                    <View style={styles.subtaskContent}>
                      <Text style={styles.subtaskTitle}>{subtask.title}</Text>
                      {subtask.description && (
                        <Text style={styles.subtaskDescription}>
                          {subtask.description}
                        </Text>
                      )}
                      <View style={styles.subtaskMeta}>
                        <Text style={styles.subtaskDuration}>
                          {subtask.durationMinutes} min
                        </Text>
                        <View
                          style={[
                            styles.difficultyBadge,
                            { backgroundColor: getDifficultyColor(subtask.difficulty) },
                          ]}
                        >
                          <Text style={styles.difficultyText}>
                            {subtask.difficulty}
                          </Text>
                        </View>
                      </View>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>

              <Button
                title="🎯 Use Selected Steps"
                variant="wood"
                size="md"
                onPress={handleCreateTask}
                fullWidth
              />
            </Card>
          )}

          {/* Create Button (if no AI breakdown) */}
          {!showAIBreakdown && (
            <View style={styles.createButtonContainer}>
              <Button
                title="🌱 Plant This Task"
                variant="wood"
                size="lg"
                onPress={handleCreateTask}
                fullWidth
              />
            </View>
          )}

          <View style={{ height: 40 }} />
        </ScrollView>
      </KeyboardAvoidingView>
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
    borderBottomWidth: 1,
    borderBottomColor: Colors.background.secondary,
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backIcon: {
    fontSize: 24,
    color: Colors.text.primary,
  },
  headerTitle: {
    ...Typography.styles.h3,
    color: Colors.text.primary,
  },

  // ScrollView
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: Spacing.xl,
  },

  // Form
  formCard: {
    marginHorizontal: Spacing.screenPadding,
    marginTop: Spacing.base,
  },
  inputGroup: {
    marginBottom: Spacing.lg,
  },
  label: {
    ...Typography.styles.button,
    color: Colors.text.primary,
    marginBottom: Spacing.sm,
  },
  input: {
    ...Typography.styles.body,
    backgroundColor: Colors.background.card,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.md,
    borderWidth: 2,
    borderColor: Colors.background.secondary,
    color: Colors.text.primary,
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: 'top',
  },

  // Goal Selector
  goalSelector: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  goalChip: {
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.sm,
    backgroundColor: Colors.background.card,
    borderRadius: BorderRadius.round,
    borderWidth: 2,
    borderColor: Colors.background.secondary,
  },
  goalChipActive: {
    backgroundColor: Colors.primary.sage,
    borderColor: Colors.primary.sage,
  },
  goalChipText: {
    ...Typography.styles.caption,
    color: Colors.text.secondary,
  },
  goalChipTextActive: {
    ...Typography.styles.button,
    color: Colors.background.card,
  },

  // AI Breakdown
  breakdownCard: {
    marginHorizontal: Spacing.screenPadding,
    marginTop: Spacing.lg,
  },
  breakdownTitle: {
    ...Typography.styles.h3,
    color: Colors.text.primary,
    marginBottom: Spacing.xs,
  },
  breakdownSubtitle: {
    ...Typography.styles.caption,
    color: Colors.text.secondary,
    marginBottom: Spacing.base,
  },

  // Subtasks
  subtaskList: {
    marginBottom: Spacing.lg,
  },
  subtaskItem: {
    flexDirection: 'row',
    padding: Spacing.md,
    backgroundColor: Colors.background.card,
    borderRadius: BorderRadius.md,
    marginBottom: Spacing.sm,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  subtaskItemSelected: {
    borderColor: Colors.primary.sage,
    backgroundColor: `${Colors.primary.sage}15`,
  },
  subtaskCheckbox: {
    width: 24,
    height: 24,
    borderRadius: BorderRadius.sm,
    borderWidth: 2,
    borderColor: Colors.primary.sage,
    marginRight: Spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkmark: {
    color: Colors.primary.sage,
    fontSize: 16,
    fontWeight: 'bold',
  },
  subtaskContent: {
    flex: 1,
  },
  subtaskTitle: {
    ...Typography.styles.button,
    color: Colors.text.primary,
    marginBottom: Spacing.xs,
  },
  subtaskDescription: {
    ...Typography.styles.caption,
    color: Colors.text.secondary,
    marginBottom: Spacing.sm,
  },
  subtaskMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  subtaskDuration: {
    ...Typography.styles.caption,
    color: Colors.text.tertiary,
  },
  difficultyBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: BorderRadius.sm,
  },
  difficultyText: {
    ...Typography.styles.caption,
    fontSize: 10,
    color: Colors.background.card,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },

  // Create Button
  createButtonContainer: {
    marginHorizontal: Spacing.screenPadding,
    marginTop: Spacing.lg,
  },
});
