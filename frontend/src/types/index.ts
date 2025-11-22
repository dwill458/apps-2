// ===================================
// COZY GROWTH TYPE DEFINITIONS
// ===================================

export type EnergyLevel = 'low' | 'medium' | 'high';
export type TaskDuration = 3 | 5 | 10 | 15;
export type TaskDifficulty = 'easy' | 'medium' | 'hard';
export type TaskStatus = 'pending' | 'in_progress' | 'completed' | 'skipped';
export type GoalStatus = 'active' | 'completed' | 'archived';
export type JournalEntryType = 'seed' | 'sprout' | 'bloom';
export type ReminderIntensity = 'rarely' | 'sometimes' | 'often';
export type PlantStage = 1 | 2 | 3 | 4 | 5;
export type BadgeType = 'streak' | 'milestone' | 'seasonal';
export type AvatarCharacter = 'person' | 'fox' | 'bear' | 'bird' | 'plant';
export type ColorPalette = 'sage' | 'moss' | 'lavender' | 'peach' | 'sky';

// User Profile
export interface User {
  id: string;
  name: string;
  email: string;
  avatarCharacter: AvatarCharacter;
  avatarColor: ColorPalette;
  reminderIntensity: ReminderIntensity;
  dailyGoalMinutes: number;
  onboardingCompleted: boolean;
  graceBlooms: number;
  bloomPoints: number;
  totalDaysShowedUp: number;
  longestStreak: number;
  currentStreak: number;
  lastActiveDate: string | null;
  createdAt: string;
  settings: UserSettings;
}

export interface UserSettings {
  quietHoursEnabled: boolean;
  quietHoursStart: string;
  quietHoursEnd: string;
  notificationSound: boolean;
  notificationVibration: boolean;
  appearance: 'light' | 'dark' | 'auto';
  textSize: 'cozy' | 'comfortable' | 'spacious';
  dyslexiaFont: boolean;
  reduceMotion: boolean;
  highContrast: boolean;
  defaultEnergyLevel: EnergyLevel;
  preferredDuration: TaskDuration;
  taskSuggestionsMode: 'surprise' | 'predictable' | 'easy';
  chainIntensity: 'one_and_done' | 'keep_momentum' | 'flow_state';
  debugPrompts: boolean;
  learningMode: boolean;
}

// Goal
export interface Goal {
  id: string;
  userId: string;
  title: string;
  description?: string;
  plantType: string;
  plantStage: PlantStage;
  status: GoalStatus;
  totalSteps: number;
  completedSteps: number;
  estimatedHours: number;
  createdAt: string;
  completedAt?: string;
}

// Micro-Task (Step)
export interface MicroTask {
  id: string;
  goalId: string;
  parentStepId?: string;
  title: string;
  description?: string;
  durationMinutes: TaskDuration;
  difficulty: TaskDifficulty;
  spicyFlag: boolean;
  orderIndex: number;
  status: TaskStatus;
  completedAt?: string;
  createdAt: string;
}

// Task Completion
export interface Completion {
  id: string;
  microTaskId: string;
  userId: string;
  timestamp: string;
  durationActualMinutes: number;
  chainCount: number;
  bloomPointsEarned: number;
}

// Journal Entry
export interface JournalEntry {
  id: string;
  userId: string;
  date: string;
  content: string;
  type: JournalEntryType;
  linkedGoalId?: string;
  linkedStepId?: string;
  createdAt: string;
}

// Streak Log
export interface StreakLog {
  id: string;
  userId: string;
  date: string;
  didShowUp: boolean;
  tasksCompleted: number;
  totalMinutes: number;
}

// Badge / Achievement
export interface Badge {
  id: string;
  userId: string;
  badgeName: string;
  badgeType: BadgeType;
  description: string;
  icon: string;
  unlockedAt: string;
}

// Learning Pattern
export interface LearningPattern {
  id: string;
  userId: string;
  patternType: string;
  patternData: Record<string, any>;
  occurrences: number;
  lastSuggestedAt?: string;
}

// Task Suggestion Request
export interface TaskSuggestionRequest {
  energyLevel: EnergyLevel;
  duration: TaskDuration;
  excludeTaskIds?: string[];
}

// Task Suggestion Response
export interface TaskSuggestionResponse {
  task: MicroTask;
  goal: Goal;
  reasoning?: string;
}

// Blocker Type (Debug Loop)
export type BlockerType =
  | 'too_big'
  | 'wrong_time'
  | 'unexpected_event'
  | 'not_feeling_it';

// Debug Loop Feedback
export interface DebugFeedback {
  taskId: string;
  blocker: BlockerType;
  timestamp: string;
  fallbackAction?: string;
  rescheduleTime?: string;
}

// Plant Collection Item
export interface PlantCollectionItem {
  plantType: string;
  name: string;
  rarity: 'common' | 'uncommon' | 'rare' | 'legendary';
  unlockRequirement: string;
  isUnlocked: boolean;
  icon: string;
  description: string;
}

// Shop Item
export interface ShopItem {
  id: string;
  name: string;
  description: string;
  category: 'plant' | 'decoration' | 'theme' | 'accessory' | 'charity';
  price: number;
  icon: string;
  isPurchased: boolean;
}

// Daily Stats
export interface DailyStats {
  date: string;
  minutesCompleted: number;
  tasksCompleted: number;
  chainCount: number;
  bloomPointsEarned: number;
  goalsWorkedOn: string[];
}

// Chain of Action State
export interface ChainState {
  isActive: boolean;
  count: number;
  currentTask?: MicroTask;
  nextTask?: MicroTask;
}

// Onboarding State
export interface OnboardingState {
  currentStep: number;
  totalSteps: number;
  completed: boolean;
}

// Celebration Event
export interface CelebrationEvent {
  type: 'task_complete' | 'streak_milestone' | 'goal_complete' | 'badge_unlock';
  title: string;
  message: string;
  animation: 'small' | 'medium' | 'large';
  bloomPointsEarned?: number;
  badge?: Badge;
}

// Timer State
export interface TimerState {
  isRunning: boolean;
  startTime?: number;
  durationMinutes: number;
  elapsedSeconds: number;
  isPaused: boolean;
}

// Notification
export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'reminder' | 'celebration';
  timestamp: string;
  isRead: boolean;
}

// API Response Wrapper
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Goal Breakdown Request (for AI)
export interface GoalBreakdownRequest {
  goalTitle: string;
  goalDescription?: string;
  userContext?: {
    energyLevel: EnergyLevel;
    availableTimePerDay: number;
  };
}

// Goal Breakdown Response (from AI)
export interface GoalBreakdownResponse {
  steps: Array<{
    title: string;
    description: string;
    durationMinutes: TaskDuration;
    difficulty: TaskDifficulty;
    spicyFlag: boolean;
    orderIndex: number;
  }>;
  totalEstimatedHours: number;
  efficiency: 'well_balanced' | 'needs_simplification' | 'needs_depth';
}

// Grace Bloom Use
export interface GraceBloomUse {
  id: string;
  userId: string;
  usedDate: string;
  streakProtected: number;
  timestamp: string;
}

// Seasonal Event
export interface SeasonalEvent {
  id: string;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  challengeType: 'streak' | 'tasks' | 'points';
  targetValue: number;
  reward: {
    badge?: string;
    bloomPoints?: number;
    unlockable?: string;
  };
  isActive: boolean;
}
