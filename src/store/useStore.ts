/**
 * Zustand Store - Global State Management
 */

import { create } from 'zustand';
import {
  UserProfile,
  AvatarState,
  Currency,
  Task,
  Goal,
  DailyProgress,
  StreakData,
  ShopItem,
  JournalEntry,
  WeatherMood,
  TimerState,
} from '../types';

interface CozyGrowthStore {
  // User
  user: UserProfile | null;
  setUser: (user: UserProfile) => void;

  // Avatar
  avatar: AvatarState;
  updateAvatar: (updates: Partial<AvatarState>) => void;
  setAvatarOutfit: (outfit: AvatarState['outfit']) => void;
  setAvatarAccessory: (accessory: AvatarState['accessory']) => void;
  setAvatarMood: (mood: AvatarState['mood']) => void;

  // Currency
  currency: Currency;
  addCurrency: (type: keyof Currency, amount: number) => void;
  spendCurrency: (type: keyof Currency, amount: number) => boolean;

  // Goals & Tasks
  goals: Goal[];
  currentGoal: Goal | null;
  addGoal: (goal: Omit<Goal, 'id' | 'createdAt'>) => void;
  updateGoal: (goalId: string, updates: Partial<Goal>) => void;
  setCurrentGoal: (goalId: string) => void;

  tasks: Task[];
  currentTask: Task | null;
  addTask: (task: Omit<Task, 'id' | 'createdAt'>) => void;
  updateTask: (taskId: string, updates: Partial<Task>) => void;
  completeTask: (taskId: string) => void;
  setCurrentTask: (taskId: string | null) => void;

  // Daily Progress
  dailyProgress: DailyProgress;
  updateDailyProgress: (updates: Partial<DailyProgress>) => void;
  logMinutes: (minutes: number) => void;

  // Streaks
  streakData: StreakData;
  updateStreak: () => void;
  useGraceBloom: () => boolean;

  // Shop
  shopItems: ShopItem[];
  purchaseItem: (itemId: string) => boolean;
  unlockItem: (itemId: string) => void;

  // Journal
  journalEntries: JournalEntry[];
  addJournalEntry: (entry: Omit<JournalEntry, 'id'>) => void;

  // UI State
  weatherMood: WeatherMood;
  setWeatherMood: (mood: WeatherMood) => void;
  isOnboarded: boolean;
  setIsOnboarded: (value: boolean) => void;

  // Timer
  timer: TimerState;
  startTimer: (taskId: string, durationMinutes: number) => void;
  pauseTimer: () => void;
  resumeTimer: () => void;
  stopTimer: () => void;
  updateTimerElapsed: (elapsed: number) => void;
  completeTimer: () => void;
}

const getTodayString = () => new Date().toISOString().split('T')[0];

export const useStore = create<CozyGrowthStore>((set, get) => ({
  // Initial User
  user: null,
  setUser: (user) => set({ user }),

  // Initial Avatar
  avatar: {
    outfit: 'gardener',
    accessory: 'watering-can',
    mood: 'idle',
    isWorking: false,
  },
  updateAvatar: (updates) =>
    set((state) => ({ avatar: { ...state.avatar, ...updates } })),
  setAvatarOutfit: (outfit) =>
    set((state) => ({ avatar: { ...state.avatar, outfit } })),
  setAvatarAccessory: (accessory) =>
    set((state) => ({ avatar: { ...state.avatar, accessory } })),
  setAvatarMood: (mood) =>
    set((state) => ({ avatar: { ...state.avatar, mood } })),

  // Initial Currency
  currency: {
    sunlight: 0,
    seeds: 0,
    bloomPoints: 0,
  },
  addCurrency: (type, amount) =>
    set((state) => ({
      currency: { ...state.currency, [type]: state.currency[type] + amount },
    })),
  spendCurrency: (type, amount) => {
    const { currency } = get();
    if (currency[type] >= amount) {
      set({
        currency: { ...currency, [type]: currency[type] - amount },
      });
      return true;
    }
    return false;
  },

  // Goals & Tasks (with default goal)
  goals: [
    {
      id: 'default_goal',
      title: 'My Growth Garden',
      description: 'A place for all my personal growth tasks',
      status: 'active' as const,
      createdAt: new Date(),
      plantType: 'sunflower' as const,
      progress: 0,
      tasks: [],
    },
  ],
  currentGoal: null,
  addGoal: (goalData) => {
    const newGoal: Goal = {
      ...goalData,
      id: `goal_${Date.now()}`,
      createdAt: new Date(),
      tasks: [],
    };
    set((state) => ({ goals: [...state.goals, newGoal] }));
  },
  updateGoal: (goalId, updates) =>
    set((state) => ({
      goals: state.goals.map((goal) =>
        goal.id === goalId ? { ...goal, ...updates } : goal
      ),
    })),
  setCurrentGoal: (goalId) =>
    set((state) => ({
      currentGoal: state.goals.find((g) => g.id === goalId) || null,
    })),

  tasks: [],
  currentTask: null,
  addTask: (taskData) => {
    const newTask: Task = {
      ...taskData,
      id: `task_${Date.now()}`,
      createdAt: new Date(),
    };
    set((state) => ({ tasks: [...state.tasks, newTask] }));
  },
  updateTask: (taskId, updates) =>
    set((state) => ({
      tasks: state.tasks.map((task) =>
        task.id === taskId ? { ...task, ...updates } : task
      ),
    })),
  completeTask: (taskId) => {
    set((state) => ({
      tasks: state.tasks.map((task) =>
        task.id === taskId
          ? { ...task, status: 'completed' as const, completedAt: new Date() }
          : task
      ),
    }));

    // Award currency
    const task = get().tasks.find((t) => t.id === taskId);
    if (task) {
      const sunlightReward = Math.ceil(task.durationMinutes / 5) * 10;
      get().addCurrency('sunlight', sunlightReward);
      get().logMinutes(task.durationMinutes);
    }
  },
  setCurrentTask: (taskId) =>
    set((state) => ({
      currentTask: taskId ? state.tasks.find((t) => t.id === taskId) || null : null,
    })),

  // Daily Progress
  dailyProgress: {
    date: getTodayString(),
    minutesCompleted: 0,
    goalMinutes: 30,
    tasksCompleted: 0,
    weedsCleared: 0,
    plantGrowth: 0,
  },
  updateDailyProgress: (updates) =>
    set((state) => ({
      dailyProgress: { ...state.dailyProgress, ...updates },
    })),
  logMinutes: (minutes) => {
    const { dailyProgress } = get();
    const newMinutes = dailyProgress.minutesCompleted + minutes;
    const newGrowth = Math.min(
      100,
      (newMinutes / dailyProgress.goalMinutes) * 100
    );

    set({
      dailyProgress: {
        ...dailyProgress,
        minutesCompleted: newMinutes,
        tasksCompleted: dailyProgress.tasksCompleted + 1,
        plantGrowth: newGrowth,
        weedsCleared: Math.floor((newGrowth / 100) * 3),
      },
    });
  },

  // Streaks
  streakData: {
    currentStreak: 0,
    longestStreak: 0,
    totalDaysShowedUp: 0,
    graceBloomsAvailable: 0,
  },
  updateStreak: () => {
    const { streakData, dailyProgress } = get();
    const today = getTodayString();

    // Simple streak logic (can be enhanced)
    if (dailyProgress.tasksCompleted > 0) {
      const newStreak = streakData.currentStreak + 1;
      set({
        streakData: {
          ...streakData,
          currentStreak: newStreak,
          longestStreak: Math.max(newStreak, streakData.longestStreak),
          totalDaysShowedUp: streakData.totalDaysShowedUp + 1,
          lastActivityDate: today,
        },
      });

      // Award seeds every 7 days
      if (newStreak % 7 === 0) {
        get().addCurrency('seeds', 10);
      }
    }
  },
  useGraceBloom: () => {
    const { streakData } = get();
    if (streakData.graceBloomsAvailable > 0) {
      set({
        streakData: {
          ...streakData,
          graceBloomsAvailable: streakData.graceBloomsAvailable - 1,
        },
      });
      return true;
    }
    return false;
  },

  // Shop
  shopItems: [],
  purchaseItem: (itemId) => {
    const item = get().shopItems.find((i) => i.id === itemId);
    if (!item || item.isPurchased) return false;

    const success = get().spendCurrency(item.currencyType, item.cost);
    if (success) {
      set((state) => ({
        shopItems: state.shopItems.map((i) =>
          i.id === itemId ? { ...i, isPurchased: true } : i
        ),
      }));
    }
    return success;
  },
  unlockItem: (itemId) =>
    set((state) => ({
      shopItems: state.shopItems.map((item) =>
        item.id === itemId ? { ...item, isUnlocked: true } : item
      ),
    })),

  // Journal
  journalEntries: [],
  addJournalEntry: (entryData) => {
    const newEntry: JournalEntry = {
      ...entryData,
      id: `journal_${Date.now()}`,
    };
    set((state) => ({ journalEntries: [...state.journalEntries, newEntry] }));
  },

  // UI State
  weatherMood: 'sunny',
  setWeatherMood: (mood) => set({ weatherMood: mood }),
  isOnboarded: false,
  setIsOnboarded: (value) => set({ isOnboarded: value }),

  // Timer
  timer: {
    isActive: false,
    isPaused: false,
    duration: 0,
    elapsed: 0,
    taskId: null,
    startedAt: null,
    pausedAt: null,
    completedAt: null,
  },
  startTimer: (taskId, durationMinutes) => {
    const duration = durationMinutes * 60; // Convert to seconds
    set({
      timer: {
        isActive: true,
        isPaused: false,
        duration,
        elapsed: 0,
        taskId,
        startedAt: new Date(),
        pausedAt: null,
        completedAt: null,
      },
    });
    // Update task status
    get().updateTask(taskId, { status: 'in_progress' });
    get().setCurrentTask(taskId);
    get().setAvatarMood('working');
  },
  pauseTimer: () => {
    set((state) => ({
      timer: {
        ...state.timer,
        isPaused: true,
        pausedAt: new Date(),
      },
    }));
  },
  resumeTimer: () => {
    set((state) => ({
      timer: {
        ...state.timer,
        isPaused: false,
        pausedAt: null,
      },
    }));
  },
  stopTimer: () => {
    set({
      timer: {
        isActive: false,
        isPaused: false,
        duration: 0,
        elapsed: 0,
        taskId: null,
        startedAt: null,
        pausedAt: null,
        completedAt: null,
      },
    });
    get().setAvatarMood('idle');
  },
  updateTimerElapsed: (elapsed) => {
    set((state) => ({
      timer: {
        ...state.timer,
        elapsed,
      },
    }));
  },
  completeTimer: () => {
    const { timer } = get();
    if (timer.taskId) {
      get().completeTask(timer.taskId);
      get().setAvatarMood('happy');
      set((state) => ({
        timer: {
          ...state.timer,
          isActive: false,
          completedAt: new Date(),
        },
      }));
    }
  },
}));

export default useStore;
