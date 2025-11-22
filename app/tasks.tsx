/**
 * Tasks Screen
 * View and manage all tasks including AI-generated subtasks
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
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as Haptics from 'expo-haptics';
import { Button, Card } from '../src/components/ui';
import { useStore } from '../src/store/useStore';
import { Colors, Typography, Spacing, BorderRadius, Shadow } from '../src/constants';
import { Task } from '../src/types';

export default function TasksScreen() {
  const router = useRouter();
  const { tasks, goals, completeTask, updateTask } = useStore();

  // Group tasks by parent
  const parentTasks = tasks.filter(t => !t.parentTaskId);
  const subtasksByParent = tasks.reduce((acc, task) => {
    if (task.parentTaskId) {
      if (!acc[task.parentTaskId]) {
        acc[task.parentTaskId] = [];
      }
      acc[task.parentTaskId].push(task);
    }
    return acc;
  }, {} as Record<string, Task[]>);

  const [expandedTasks, setExpandedTasks] = useState<Set<string>>(new Set());

  const toggleTaskExpansion = (taskId: string) => {
    Haptics.selectionAsync();
    const newExpanded = new Set(expandedTasks);
    if (newExpanded.has(taskId)) {
      newExpanded.delete(taskId);
    } else {
      newExpanded.add(taskId);
    }
    setExpandedTasks(newExpanded);
  };

  const handleTaskComplete = (taskId: string) => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    completeTask(taskId);
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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return '✅';
      case 'in_progress':
        return '🌱';
      case 'pending':
        return '🌰';
      default:
        return '⏸️';
    }
  };

  const renderTask = (task: Task, isSubtask = false) => {
    const taskSubtasks = subtasksByParent[task.id] || [];
    const hasSubtasks = taskSubtasks.length > 0;
    const isExpanded = expandedTasks.has(task.id);
    const goal = goals.find(g => g.id === task.goalId);

    return (
      <View key={task.id} style={[styles.taskCard, isSubtask && styles.subtaskCard]}>
        <TouchableOpacity
          onPress={() => hasSubtasks && toggleTaskExpansion(task.id)}
          disabled={!hasSubtasks}
          style={styles.taskHeader}
        >
          <View style={styles.taskMain}>
            <Text style={styles.statusIcon}>{getStatusIcon(task.status)}</Text>
            <View style={styles.taskInfo}>
              <Text
                style={[
                  styles.taskTitle,
                  task.status === 'completed' && styles.taskTitleCompleted,
                  isSubtask && styles.subtaskTitle,
                ]}
              >
                {task.title}
                {task.isAIGenerated && ' ✨'}
              </Text>
              {task.description && (
                <Text style={styles.taskDescription}>{task.description}</Text>
              )}
              <View style={styles.taskMeta}>
                <Text style={styles.metaText}>{task.durationMinutes} min</Text>
                <View
                  style={[
                    styles.difficultyBadge,
                    { backgroundColor: getDifficultyColor(task.difficulty) },
                  ]}
                >
                  <Text style={styles.difficultyText}>{task.difficulty}</Text>
                </View>
                {goal && (
                  <Text style={styles.metaText}>📍 {goal.title}</Text>
                )}
              </View>
            </View>
          </View>

          {hasSubtasks && (
            <Text style={styles.expandIcon}>{isExpanded ? '▼' : '▶'}</Text>
          )}
        </TouchableOpacity>

        {task.status !== 'completed' && (
          <TouchableOpacity
            style={styles.completeButton}
            onPress={() => handleTaskComplete(task.id)}
          >
            <Text style={styles.completeButtonText}>Complete</Text>
          </TouchableOpacity>
        )}

        {/* Render subtasks if expanded */}
        {hasSubtasks && isExpanded && (
          <View style={styles.subtaskContainer}>
            <Text style={styles.subtaskHeader}>
              AI Breakdown ({taskSubtasks.length} steps)
            </Text>
            {taskSubtasks
              .sort((a, b) => a.order - b.order)
              .map(subtask => renderTask(subtask, true))}
          </View>
        )}
      </View>
    );
  };

  const pendingTasks = parentTasks.filter(t => t.status === 'pending');
  const inProgressTasks = parentTasks.filter(t => t.status === 'in_progress');
  const completedTasks = parentTasks.filter(t => t.status === 'completed');

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Your Tasks</Text>
        <TouchableOpacity
          onPress={() => router.push('/create-task')}
          style={styles.addButton}
        >
          <Text style={styles.addIcon}>+</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Stats */}
        <Card variant="parchment" style={styles.statsCard}>
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{pendingTasks.length}</Text>
              <Text style={styles.statLabel}>Pending</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{inProgressTasks.length}</Text>
              <Text style={styles.statLabel}>In Progress</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{completedTasks.length}</Text>
              <Text style={styles.statLabel}>Completed</Text>
            </View>
          </View>
        </Card>

        {/* Pending Tasks */}
        {pendingTasks.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>🌰 Ready to Grow</Text>
            {pendingTasks.map(task => renderTask(task))}
          </View>
        )}

        {/* In Progress Tasks */}
        {inProgressTasks.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>🌱 Growing</Text>
            {inProgressTasks.map(task => renderTask(task))}
          </View>
        )}

        {/* Completed Tasks */}
        {completedTasks.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>✅ Bloomed</Text>
            {completedTasks.map(task => renderTask(task))}
          </View>
        )}

        {/* Empty State */}
        {tasks.length === 0 && (
          <Card variant="parchment" style={styles.emptyCard}>
            <Text style={styles.emptyIcon}>🌱</Text>
            <Text style={styles.emptyTitle}>No Tasks Yet</Text>
            <Text style={styles.emptyText}>
              Plant your first task and watch it grow!
            </Text>
            <Button
              title="Create First Task"
              variant="wood"
              size="md"
              onPress={() => router.push('/create-task')}
            />
          </Card>
        )}

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
  addButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primary.sage,
    borderRadius: BorderRadius.round,
  },
  addIcon: {
    fontSize: 24,
    color: Colors.background.card,
    fontWeight: 'bold',
  },

  // ScrollView
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: Spacing.xl,
  },

  // Stats
  statsCard: {
    marginHorizontal: Spacing.screenPadding,
    marginTop: Spacing.base,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    ...Typography.styles.h2,
    color: Colors.primary.sage,
    marginBottom: Spacing.xs,
  },
  statLabel: {
    ...Typography.styles.caption,
    color: Colors.text.secondary,
  },

  // Section
  section: {
    marginTop: Spacing.lg,
    paddingHorizontal: Spacing.screenPadding,
  },
  sectionTitle: {
    ...Typography.styles.h3,
    color: Colors.text.primary,
    marginBottom: Spacing.md,
  },

  // Task Card
  taskCard: {
    backgroundColor: Colors.background.card,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.background.secondary,
    ...Shadow.sm,
  },
  subtaskCard: {
    backgroundColor: Colors.background.secondary,
    marginBottom: Spacing.sm,
    borderLeftWidth: 3,
    borderLeftColor: Colors.primary.sage,
  },
  taskHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  taskMain: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  statusIcon: {
    fontSize: 24,
    marginRight: Spacing.sm,
  },
  taskInfo: {
    flex: 1,
  },
  taskTitle: {
    ...Typography.styles.button,
    color: Colors.text.primary,
    marginBottom: Spacing.xs,
  },
  taskTitleCompleted: {
    textDecorationLine: 'line-through',
    color: Colors.text.tertiary,
  },
  subtaskTitle: {
    ...Typography.styles.body,
  },
  taskDescription: {
    ...Typography.styles.caption,
    color: Colors.text.secondary,
    marginBottom: Spacing.sm,
  },
  taskMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    flexWrap: 'wrap',
  },
  metaText: {
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
  expandIcon: {
    fontSize: 16,
    color: Colors.text.tertiary,
    marginLeft: Spacing.sm,
  },

  // Complete Button
  completeButton: {
    marginTop: Spacing.md,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.base,
    backgroundColor: Colors.primary.sage,
    borderRadius: BorderRadius.md,
    alignSelf: 'flex-start',
  },
  completeButtonText: {
    ...Typography.styles.button,
    color: Colors.background.card,
    fontSize: 12,
  },

  // Subtasks
  subtaskContainer: {
    marginTop: Spacing.md,
    paddingTop: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.background.secondary,
  },
  subtaskHeader: {
    ...Typography.styles.button,
    color: Colors.text.secondary,
    marginBottom: Spacing.sm,
    fontSize: 12,
  },

  // Empty State
  emptyCard: {
    marginHorizontal: Spacing.screenPadding,
    marginTop: Spacing.xl,
    alignItems: 'center',
    paddingVertical: Spacing.xl,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: Spacing.base,
  },
  emptyTitle: {
    ...Typography.styles.h3,
    color: Colors.text.primary,
    marginBottom: Spacing.sm,
  },
  emptyText: {
    ...Typography.styles.body,
    color: Colors.text.secondary,
    textAlign: 'center',
    marginBottom: Spacing.lg,
  },
});
