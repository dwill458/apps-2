// ===================================
// TASK SUGGESTION ENGINE
// ===================================
// Smart local task suggestion logic that learns user preferences

import type {
  MicroTask,
  EnergyLevel,
  TaskDuration,
  TaskDifficulty,
  Goal,
} from '../types';
import { shuffle } from './helpers';

// ===================================
// TASK FILTERING
// ===================================

/**
 * Filter tasks by energy level
 */
const filterByEnergy = (
  tasks: MicroTask[],
  energy: EnergyLevel
): MicroTask[] => {
  const difficultyMap: Record<EnergyLevel, TaskDifficulty[]> = {
    low: ['easy'],
    medium: ['easy', 'medium'],
    high: ['easy', 'medium', 'hard'],
  };

  const allowedDifficulties = difficultyMap[energy];
  return tasks.filter((task) =>
    allowedDifficulties.includes(task.difficulty)
  );
};

/**
 * Filter tasks by duration
 */
const filterByDuration = (
  tasks: MicroTask[],
  duration: TaskDuration
): MicroTask[] => {
  // Allow tasks at or below the requested duration
  return tasks.filter((task) => task.durationMinutes <= duration);
};

/**
 * Filter out excluded tasks
 */
const filterExcluded = (
  tasks: MicroTask[],
  excludeIds: string[] = []
): MicroTask[] => {
  return tasks.filter((task) => !excludeIds.includes(task.id));
};

/**
 * Filter only pending tasks
 */
const filterPending = (tasks: MicroTask[]): MicroTask[] => {
  return tasks.filter((task) => task.status === 'pending');
};

// ===================================
// SCORING & PRIORITIZATION
// ===================================

interface TaskScore {
  task: MicroTask;
  score: number;
  reasons: string[];
}

/**
 * Score a task based on various factors
 */
const scoreTask = (
  task: MicroTask,
  criteria: {
    energy: EnergyLevel;
    duration: TaskDuration;
    timeOfDay?: 'morning' | 'afternoon' | 'evening' | 'night';
    recentGoalIds?: string[];
    preferSpicy?: boolean;
  }
): TaskScore => {
  let score = 0;
  const reasons: string[] = [];

  // Base score - all tasks start equal
  score += 10;

  // Prioritize by order index (earlier tasks in goal)
  score += (100 - task.orderIndex) / 10;
  if (task.orderIndex <= 3) {
    reasons.push('Early in goal');
  }

  // Perfect duration match
  if (task.durationMinutes === criteria.duration) {
    score += 15;
    reasons.push('Perfect time match');
  }

  // Perfect difficulty match for energy
  const difficultyEnergyMap: Record<TaskDifficulty, EnergyLevel> = {
    easy: 'low',
    medium: 'medium',
    hard: 'high',
  };

  if (difficultyEnergyMap[task.difficulty] === criteria.energy) {
    score += 10;
    reasons.push('Matches your energy');
  }

  // Spicy tasks for adventurous moments
  if (task.spicyFlag) {
    if (criteria.preferSpicy) {
      score += 20;
      reasons.push('Spicy challenge!');
    } else if (criteria.energy === 'high') {
      score += 5;
      reasons.push('A little spicy');
    } else {
      score -= 5; // Avoid spicy when not requested
    }
  }

  // Continuity bonus - tasks from recently worked goals
  if (criteria.recentGoalIds?.includes(task.goalId)) {
    score += 12;
    reasons.push('Continue momentum');
  }

  // Time of day bonuses
  if (criteria.timeOfDay) {
    // Easy tasks in the evening/night
    if (
      ['evening', 'night'].includes(criteria.timeOfDay) &&
      task.difficulty === 'easy'
    ) {
      score += 5;
      reasons.push('Gentle for evening');
    }

    // Hard tasks in the morning (when energy is usually higher)
    if (criteria.timeOfDay === 'morning' && task.difficulty === 'hard') {
      score += 5;
      reasons.push('Tackle while fresh');
    }
  }

  // Shorter tasks get slight bonus (easier to start)
  if (task.durationMinutes <= 5) {
    score += 3;
    reasons.push('Quick win');
  }

  return { task, score, reasons };
};

/**
 * Prioritize tasks based on criteria
 */
export const prioritizeTasks = (
  tasks: MicroTask[],
  criteria: {
    energy: EnergyLevel;
    duration: TaskDuration;
    timeOfDay?: 'morning' | 'afternoon' | 'evening' | 'night';
    recentGoalIds?: string[];
    preferSpicy?: boolean;
    randomness?: number; // 0-1, how much randomness to add
  }
): TaskScore[] => {
  const scoredTasks = tasks.map((task) => scoreTask(task, criteria));

  // Add randomness if requested (surprise mode)
  const randomness = criteria.randomness || 0;
  if (randomness > 0) {
    scoredTasks.forEach((st) => {
      const randomBonus = (Math.random() - 0.5) * randomness * 20;
      st.score += randomBonus;
      if (randomBonus > 5) {
        st.reasons.push('Random surprise!');
      }
    });
  }

  // Sort by score descending
  return scoredTasks.sort((a, b) => b.score - a.score);
};

// ===================================
// MAIN SUGGESTION FUNCTION
// ===================================

export interface SuggestionOptions {
  energy: EnergyLevel;
  duration: TaskDuration;
  excludeTaskIds?: string[];
  timeOfDay?: 'morning' | 'afternoon' | 'evening' | 'night';
  recentGoalIds?: string[];
  mode?: 'surprise' | 'predictable' | 'easy';
  preferSpicy?: boolean;
}

export interface TaskSuggestion {
  task: MicroTask;
  score: number;
  reasons: string[];
  alternates: MicroTask[];
}

/**
 * Suggest the best task based on user's current context
 */
export const suggestTask = (
  availableTasks: MicroTask[],
  options: SuggestionOptions
): TaskSuggestion | null => {
  let tasks = [...availableTasks];

  // Step 1: Filter to pending tasks only
  tasks = filterPending(tasks);

  // Step 2: Exclude specified tasks
  tasks = filterExcluded(tasks, options.excludeTaskIds);

  // Step 3: Filter by energy level
  tasks = filterByEnergy(tasks, options.energy);

  // Step 4: Filter by duration
  tasks = filterByDuration(tasks, options.duration);

  if (tasks.length === 0) {
    return null;
  }

  // Step 5: Apply mode-specific adjustments
  let randomness = 0.3; // default
  let preferSpicy = options.preferSpicy || false;

  if (options.mode === 'surprise') {
    randomness = 0.6; // More random
  } else if (options.mode === 'predictable') {
    randomness = 0.1; // More deterministic
  } else if (options.mode === 'easy') {
    randomness = 0.2;
    tasks = tasks.filter((t) => t.difficulty === 'easy');
    if (tasks.length === 0) {
      // Fallback to medium if no easy tasks
      tasks = filterByEnergy(availableTasks, options.energy);
      tasks = tasks.filter((t) => t.difficulty === 'medium');
    }
  }

  // Step 6: Score and prioritize
  const prioritized = prioritizeTasks(tasks, {
    ...options,
    randomness,
    preferSpicy,
  });

  if (prioritized.length === 0) {
    return null;
  }

  // Return top suggestion with alternates
  const top = prioritized[0];
  const alternates = prioritized.slice(1, 4).map((st) => st.task);

  return {
    task: top.task,
    score: top.score,
    reasons: top.reasons,
    alternates,
  };
};

// ===================================
// CHAIN SUGGESTIONS
// ===================================

/**
 * Get the next logical task after completing current task
 */
export const getNextLogicalTask = (
  currentTask: MicroTask,
  allTasks: MicroTask[],
  options?: {
    sameGoalOnly?: boolean;
    energy?: EnergyLevel;
  }
): MicroTask | null => {
  let candidates = allTasks.filter(
    (task) => task.status === 'pending' && task.id !== currentTask.id
  );

  // Prefer tasks from same goal
  const sameGoalTasks = candidates.filter(
    (task) => task.goalId === currentTask.goalId
  );

  if (options?.sameGoalOnly || sameGoalTasks.length > 0) {
    candidates = sameGoalTasks;
  }

  if (candidates.length === 0) {
    return null;
  }

  // Prioritize by order index (next step in sequence)
  candidates.sort((a, b) => a.orderIndex - b.orderIndex);

  // Filter by energy if provided
  if (options?.energy) {
    const filteredByEnergy = filterByEnergy(candidates, options.energy);
    if (filteredByEnergy.length > 0) {
      return filteredByEnergy[0];
    }
  }

  return candidates[0];
};

/**
 * Suggest a chain of tasks (for flow state mode)
 */
export const suggestTaskChain = (
  availableTasks: MicroTask[],
  options: {
    energy: EnergyLevel;
    totalDuration: number; // Total time available
    maxTasks?: number;
  }
): MicroTask[] => {
  const chain: MicroTask[] = [];
  let remainingTime = options.totalDuration;
  const maxTasks = options.maxTasks || 5;

  let candidates = filterPending(availableTasks);

  while (chain.length < maxTasks && remainingTime > 0 && candidates.length > 0) {
    // Find tasks that fit remaining time
    const fitting = candidates.filter(
      (task) => task.durationMinutes <= remainingTime
    );

    if (fitting.length === 0) break;

    // Prioritize next task
    const nextTask = chain.length > 0
      ? getNextLogicalTask(chain[chain.length - 1], fitting, {
          energy: options.energy,
        })
      : suggestTask(fitting, {
          energy: options.energy,
          duration: Math.min(remainingTime, 15) as TaskDuration,
        })?.task;

    if (!nextTask) break;

    chain.push(nextTask);
    remainingTime -= nextTask.durationMinutes;

    // Remove selected task from candidates
    candidates = candidates.filter((task) => task.id !== nextTask.id);
  }

  return chain;
};

// ===================================
// PATTERN DETECTION
// ===================================

export interface TaskPattern {
  type: 'time_preference' | 'difficulty_preference' | 'goal_preference';
  pattern: string;
  confidence: number;
}

/**
 * Detect patterns in completed tasks (for learning)
 */
export const detectTaskPatterns = (
  completedTasks: Array<{
    task: MicroTask;
    completedAt: string;
  }>
): TaskPattern[] => {
  if (completedTasks.length < 5) {
    return []; // Need more data
  }

  const patterns: TaskPattern[] = [];

  // Time of day preferences
  const timeDistribution: Record<string, number> = {
    morning: 0,
    afternoon: 0,
    evening: 0,
    night: 0,
  };

  completedTasks.forEach(({ completedAt }) => {
    const hour = new Date(completedAt).getHours();
    if (hour >= 5 && hour < 12) timeDistribution.morning++;
    else if (hour >= 12 && hour < 17) timeDistribution.afternoon++;
    else if (hour >= 17 && hour < 21) timeDistribution.evening++;
    else timeDistribution.night++;
  });

  const maxTime = Math.max(...Object.values(timeDistribution));
  const totalTasks = completedTasks.length;

  if (maxTime / totalTasks > 0.5) {
    const preferredTime = Object.keys(timeDistribution).find(
      (key) => timeDistribution[key] === maxTime
    );
    if (preferredTime) {
      patterns.push({
        type: 'time_preference',
        pattern: `Prefers ${preferredTime} tasks`,
        confidence: maxTime / totalTasks,
      });
    }
  }

  // Difficulty preferences
  const diffDistribution: Record<TaskDifficulty, number> = {
    easy: 0,
    medium: 0,
    hard: 0,
  };

  completedTasks.forEach(({ task }) => {
    diffDistribution[task.difficulty]++;
  });

  const maxDiff = Math.max(...Object.values(diffDistribution));
  if (maxDiff / totalTasks > 0.5) {
    const preferredDiff = Object.keys(diffDistribution).find(
      (key) => diffDistribution[key as TaskDifficulty] === maxDiff
    );
    if (preferredDiff) {
      patterns.push({
        type: 'difficulty_preference',
        pattern: `Prefers ${preferredDiff} tasks`,
        confidence: maxDiff / totalTasks,
      });
    }
  }

  return patterns;
};

// ===================================
// HELPER EXPORTS
// ===================================

/**
 * Quick filter to get easy wins (short + easy)
 */
export const getEasyWins = (tasks: MicroTask[]): MicroTask[] => {
  return filterPending(tasks).filter(
    (task) => task.difficulty === 'easy' && task.durationMinutes <= 5
  );
};

/**
 * Quick filter to get spicy challenges
 */
export const getSpicyChallenges = (tasks: MicroTask[]): MicroTask[] => {
  return filterPending(tasks).filter((task) => task.spicyFlag);
};

/**
 * Group tasks by goal
 */
export const groupTasksByGoal = (
  tasks: MicroTask[]
): Record<string, MicroTask[]> => {
  return tasks.reduce((acc, task) => {
    if (!acc[task.goalId]) {
      acc[task.goalId] = [];
    }
    acc[task.goalId].push(task);
    return acc;
  }, {} as Record<string, MicroTask[]>);
};

/**
 * Get task completion percentage for a goal
 */
export const getGoalProgress = (
  goalId: string,
  allTasks: MicroTask[]
): number => {
  const goalTasks = allTasks.filter((task) => task.goalId === goalId);
  if (goalTasks.length === 0) return 0;

  const completed = goalTasks.filter(
    (task) => task.status === 'completed'
  ).length;
  return Math.round((completed / goalTasks.length) * 100);
};
