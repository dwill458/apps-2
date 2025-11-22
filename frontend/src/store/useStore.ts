/**
 * COZY GROWTH - Zustand Store
 * Global state management for the ADHD-friendly productivity app
 */
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { goalsApi, tasksApi } from '../lib/api/goals';
import { journalApi } from '../lib/api/journal';
import { streaksApi } from '../lib/api/streaks';
import { completionsApi } from '../lib/api/completions';
import { getCurrentUserId } from '../lib/supabase';
import type {
  User,
  Goal,
  MicroTask,
  JournalEntry,
  StreakLog,
  Badge,
  EnergyLevel,
  TaskDuration,
  ChainState,
  OnboardingState,
  CelebrationEvent,
  TimerState,
  DailyStats,
  TaskSuggestionResponse,
  Completion,
} from '../types';

// ==========================================
// USER & SETTINGS STORE
// ==========================================
interface UserState {
  user: User | null;
  isLoading: boolean;
  setUser: (user: User) => void;
  updateSettings: (settings: Partial<User['settings']>) => void;
  incrementStreak: () => void;
  resetStreak: () => void;
  useGraceBloom: () => boolean;
  addBloomPoints: (points: number) => void;
  spendBloomPoints: (points: number) => boolean;
  setLoading: (loading: boolean) => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      user: null,
      isLoading: false,
      setUser: (user) => set({ user, isLoading: false }),
      updateSettings: (settings) =>
        set((state) => ({
          user: state.user
            ? { ...state.user, settings: { ...state.user.settings, ...settings } }
            : null,
        })),
      incrementStreak: () =>
        set((state) => {
          if (!state.user) return state;
          const newStreak = state.user.currentStreak + 1;
          return {
            user: {
              ...state.user,
              currentStreak: newStreak,
              longestStreak: Math.max(newStreak, state.user.longestStreak),
              totalDaysShowedUp: state.user.totalDaysShowedUp + 1,
              lastActiveDate: new Date().toISOString().split('T')[0],
            },
          };
        }),
      resetStreak: () =>
        set((state) => ({
          user: state.user ? { ...state.user, currentStreak: 0 } : null,
        })),
      useGraceBloom: () => {
        const state = get();
        if (!state.user || state.user.graceBlooms <= 0) return false;
        set((state) => ({
          user: state.user
            ? { ...state.user, graceBlooms: state.user.graceBlooms - 1 }
            : null,
        }));
        return true;
      },
      addBloomPoints: (points) =>
        set((state) => ({
          user: state.user
            ? { ...state.user, bloomPoints: state.user.bloomPoints + points }
            : null,
        })),
      spendBloomPoints: (points) => {
        const state = get();
        if (!state.user || state.user.bloomPoints < points) return false;
        set((state) => ({
          user: state.user
            ? { ...state.user, bloomPoints: state.user.bloomPoints - points }
            : null,
        }));
        return true;
      },
      setLoading: (loading) => set({ isLoading: loading }),
    }),
    { name: 'cozy-user-storage' }
  )
);

// ==========================================
// GOALS & TASKS STORE
// ==========================================
interface GoalsState {
  goals: Goal[];
  tasks: MicroTask[];
  isLoading: boolean;
  error: string | null;
  realtimeUnsubscribe: (() => void) | null;
  // Sync methods
  loadGoals: (userId: string) => Promise<void>;
  loadTasks: (userId: string) => Promise<void>;
  subscribeToGoals: (userId: string) => void;
  unsubscribeFromGoals: () => void;
  // CRUD operations (now async with Supabase)
  addGoal: (goal: Omit<Goal, 'id' | 'createdAt'>) => Promise<void>;
  updateGoal: (goalId: string, updates: Partial<Goal>) => Promise<void>;
  deleteGoal: (goalId: string) => Promise<void>;
  addTasks: (tasks: Omit<MicroTask, 'id' | 'createdAt'>[]) => Promise<void>;
  updateTask: (taskId: string, updates: Partial<MicroTask>) => Promise<void>;
  completeTask: (taskId: string) => Promise<void>;
  skipTask: (taskId: string) => Promise<void>;
  // Local getters (remain sync)
  getTasksByGoal: (goalId: string) => MicroTask[];
  getPendingTasks: () => MicroTask[];
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useGoalsStore = create<GoalsState>()(
  persist(
    (set, get) => ({
      goals: [],
      tasks: [],
      isLoading: false,
      error: null,
      realtimeUnsubscribe: null,

      // ========== SYNC METHODS ==========
      loadGoals: async (userId: string) => {
        set({ isLoading: true, error: null });
        try {
          const goals = await goalsApi.getGoals(userId);
          set({ goals, isLoading: false });
        } catch (error: any) {
          set({ error: error.message, isLoading: false });
          throw error;
        }
      },

      loadTasks: async (userId: string) => {
        set({ isLoading: true, error: null });
        try {
          const tasks = await tasksApi.getTasks(userId);
          set({ tasks, isLoading: false });
        } catch (error: any) {
          set({ error: error.message, isLoading: false });
          throw error;
        }
      },

      subscribeToGoals: (userId: string) => {
        const state = get();
        // Unsubscribe if already subscribed
        state.realtimeUnsubscribe?.();

        const unsubscribe = goalsApi.subscribeToGoals(userId, {
          onInsert: (goal) => {
            set((state) => ({ goals: [goal, ...state.goals] }));
          },
          onUpdate: (goal) => {
            set((state) => ({
              goals: state.goals.map((g) => (g.id === goal.id ? goal : g)),
            }));
          },
          onDelete: (goalId) => {
            set((state) => ({
              goals: state.goals.filter((g) => g.id !== goalId),
              tasks: state.tasks.filter((t) => t.goalId !== goalId),
            }));
          },
        });

        set({ realtimeUnsubscribe: unsubscribe });
      },

      unsubscribeFromGoals: () => {
        const state = get();
        state.realtimeUnsubscribe?.();
        set({ realtimeUnsubscribe: null });
      },

      // ========== CRUD OPERATIONS (with optimistic updates) ==========
      addGoal: async (goal) => {
        const tempId = `temp-${Date.now()}`;
        const tempGoal = { ...goal, id: tempId, createdAt: new Date().toISOString() } as Goal;

        // Optimistic update
        set((state) => ({ goals: [tempGoal, ...state.goals], error: null }));

        try {
          const newGoal = await goalsApi.createGoal(goal);
          // Replace temp goal with real one
          set((state) => ({
            goals: state.goals.map((g) => (g.id === tempId ? newGoal : g)),
          }));
        } catch (error: any) {
          // Rollback on error
          set((state) => ({
            goals: state.goals.filter((g) => g.id !== tempId),
            error: error.message,
          }));
          throw error;
        }
      },

      updateGoal: async (goalId, updates) => {
        const state = get();
        const originalGoal = state.goals.find((g) => g.id === goalId);
        if (!originalGoal) return;

        // Optimistic update
        set((state) => ({
          goals: state.goals.map((g) =>
            g.id === goalId ? { ...g, ...updates } : g
          ),
        }));

        try {
          const updatedGoal = await goalsApi.updateGoal(goalId, updates);
          set((state) => ({
            goals: state.goals.map((g) => (g.id === goalId ? updatedGoal : g)),
          }));
        } catch (error: any) {
          // Rollback on error
          set((state) => ({
            goals: state.goals.map((g) => (g.id === goalId ? originalGoal : g)),
            error: error.message,
          }));
          throw error;
        }
      },

      deleteGoal: async (goalId) => {
        const state = get();
        const originalGoal = state.goals.find((g) => g.id === goalId);
        const relatedTasks = state.tasks.filter((t) => t.goalId === goalId);

        // Optimistic delete
        set((state) => ({
          goals: state.goals.filter((g) => g.id !== goalId),
          tasks: state.tasks.filter((t) => t.goalId !== goalId),
        }));

        try {
          await goalsApi.deleteGoal(goalId);
        } catch (error: any) {
          // Rollback on error
          if (originalGoal) {
            set((state) => ({
              goals: [...state.goals, originalGoal],
              tasks: [...state.tasks, ...relatedTasks],
              error: error.message,
            }));
          }
          throw error;
        }
      },

      addTasks: async (tasks) => {
        const tempTasks = tasks.map((t, i) => ({
          ...t,
          id: `temp-${Date.now()}-${i}`,
          createdAt: new Date().toISOString(),
        })) as MicroTask[];

        // Optimistic update
        set((state) => ({ tasks: [...state.tasks, ...tempTasks], error: null }));

        try {
          const newTasks = await tasksApi.createTasks(tasks);
          // Replace temp tasks with real ones
          set((state) => ({
            tasks: [
              ...state.tasks.filter((t) => !t.id.startsWith('temp-')),
              ...newTasks,
            ],
          }));
        } catch (error: any) {
          // Rollback on error
          set((state) => ({
            tasks: state.tasks.filter((t) => !t.id.startsWith('temp-')),
            error: error.message,
          }));
          throw error;
        }
      },

      updateTask: async (taskId, updates) => {
        const state = get();
        const originalTask = state.tasks.find((t) => t.id === taskId);
        if (!originalTask) return;

        // Optimistic update
        set((state) => ({
          tasks: state.tasks.map((t) =>
            t.id === taskId ? { ...t, ...updates } : t
          ),
        }));

        try {
          const updatedTask = await tasksApi.updateTask(taskId, updates);
          set((state) => ({
            tasks: state.tasks.map((t) => (t.id === taskId ? updatedTask : t)),
          }));
        } catch (error: any) {
          // Rollback on error
          set((state) => ({
            tasks: state.tasks.map((t) => (t.id === taskId ? originalTask : t)),
            error: error.message,
          }));
          throw error;
        }
      },

      completeTask: async (taskId) => {
        const state = get();
        const task = state.tasks.find((t) => t.id === taskId);
        if (!task) return;

        const originalTask = { ...task };
        const goal = state.goals.find((g) => g.id === task.goalId);

        // Calculate new progress optimistically
        const updatedTasks = state.tasks.map((t) =>
          t.id === taskId
            ? { ...t, status: 'completed' as const, completedAt: new Date().toISOString() }
            : t
        );

        let updatedGoals = state.goals;
        if (goal) {
          const completedSteps = updatedTasks.filter(
            (t) => t.goalId === goal.id && t.status === 'completed'
          ).length;
          const newPlantStage = Math.min(
            5,
            Math.ceil((completedSteps / goal.totalSteps) * 5)
          ) as 1 | 2 | 3 | 4 | 5;

          updatedGoals = state.goals.map((g) =>
            g.id === goal.id
              ? {
                  ...g,
                  completedSteps,
                  plantStage: newPlantStage,
                  status:
                    completedSteps >= goal.totalSteps
                      ? ('completed' as const)
                      : g.status,
                  completedAt:
                    completedSteps >= goal.totalSteps
                      ? new Date().toISOString()
                      : undefined,
                }
              : g
          );
        }

        // Optimistic update
        set({ tasks: updatedTasks, goals: updatedGoals });

        try {
          await tasksApi.completeTask(taskId);
          if (goal && goal.completedSteps !== undefined) {
            await goalsApi.updateGoal(goal.id, {
              completedSteps: updatedGoals.find((g) => g.id === goal.id)?.completedSteps,
              plantStage: updatedGoals.find((g) => g.id === goal.id)?.plantStage,
              status: updatedGoals.find((g) => g.id === goal.id)?.status,
            });
          }
        } catch (error: any) {
          // Rollback on error
          set((state) => ({
            tasks: state.tasks.map((t) => (t.id === taskId ? originalTask : t)),
            goals: goal ? state.goals.map((g) => (g.id === goal.id ? goal : g)) : state.goals,
            error: error.message,
          }));
          throw error;
        }
      },

      skipTask: async (taskId) => {
        const state = get();
        const originalTask = state.tasks.find((t) => t.id === taskId);
        if (!originalTask) return;

        // Optimistic update
        set((state) => ({
          tasks: state.tasks.map((t) =>
            t.id === taskId ? { ...t, status: 'skipped' as const } : t
          ),
        }));

        try {
          await tasksApi.updateTask(taskId, { status: 'skipped' });
        } catch (error: any) {
          // Rollback on error
          set((state) => ({
            tasks: state.tasks.map((t) => (t.id === taskId ? originalTask : t)),
            error: error.message,
          }));
          throw error;
        }
      },

      // ========== LOCAL GETTERS ==========
      getTasksByGoal: (goalId) => {
        const state = get();
        return state.tasks.filter((t) => t.goalId === goalId).sort((a, b) => a.orderIndex - b.orderIndex);
      },

      getPendingTasks: () => {
        const state = get();
        return state.tasks.filter((t) => t.status === 'pending');
      },

      setLoading: (loading) => set({ isLoading: loading }),
      setError: (error) => set({ error }),
    }),
    { name: 'cozy-goals-storage' }
  )
);

// ==========================================
// TASK FLOW STORE (Current session)
// ==========================================
interface TaskFlowState {
  currentEnergy: EnergyLevel;
  currentDuration: TaskDuration;
  suggestedTask: TaskSuggestionResponse | null;
  chainState: ChainState;
  timerState: TimerState;
  todayStats: DailyStats;
  setEnergy: (energy: EnergyLevel) => void;
  setDuration: (duration: TaskDuration) => void;
  setSuggestedTask: (suggestion: TaskSuggestionResponse | null) => void;
  startChain: (task: MicroTask) => void;
  incrementChain: (nextTask?: MicroTask) => void;
  endChain: () => void;
  startTimer: (durationMinutes: number) => void;
  pauseTimer: () => void;
  resumeTimer: () => void;
  stopTimer: () => void;
  updateTodayStats: (updates: Partial<DailyStats>) => void;
  resetTimer: () => void;
  // Sync methods
  loadTodayStats: (userId: string, date: string) => Promise<void>;
  syncCompletion: (completion: Omit<Completion, 'id'>) => Promise<void>;
}

export const useTaskFlowStore = create<TaskFlowState>()(
  persist(
    (set, get) => ({
      currentEnergy: 'medium',
      currentDuration: 10,
      suggestedTask: null,
      chainState: { isActive: false, count: 0 },
      timerState: {
        isRunning: false,
        durationMinutes: 10,
        elapsedSeconds: 0,
        isPaused: false,
      },
      todayStats: {
        date: new Date().toISOString().split('T')[0],
        minutesCompleted: 0,
        tasksCompleted: 0,
        chainCount: 0,
        bloomPointsEarned: 0,
        goalsWorkedOn: [],
      },
      setEnergy: (energy) => set({ currentEnergy: energy }),
      setDuration: (duration) => set({ currentDuration: duration }),
      setSuggestedTask: (suggestion) => set({ suggestedTask: suggestion }),
      startChain: (task) =>
        set({
          chainState: { isActive: true, count: 1, currentTask: task },
        }),
      incrementChain: (nextTask) =>
        set((state) => ({
          chainState: {
            isActive: true,
            count: state.chainState.count + 1,
            currentTask: nextTask,
            nextTask: undefined,
          },
        })),
      endChain: () =>
        set({
          chainState: { isActive: false, count: 0 },
        }),
      startTimer: (durationMinutes) =>
        set({
          timerState: {
            isRunning: true,
            startTime: Date.now(),
            durationMinutes,
            elapsedSeconds: 0,
            isPaused: false,
          },
        }),
      pauseTimer: () =>
        set((state) => ({
          timerState: { ...state.timerState, isPaused: true, isRunning: false },
        })),
      resumeTimer: () =>
        set((state) => ({
          timerState: { ...state.timerState, isPaused: false, isRunning: true },
        })),
      stopTimer: () =>
        set({
          timerState: {
            isRunning: false,
            durationMinutes: 10,
            elapsedSeconds: 0,
            isPaused: false,
          },
        }),
      resetTimer: () =>
        set({
          timerState: {
            isRunning: false,
            durationMinutes: 10,
            elapsedSeconds: 0,
            isPaused: false,
          },
        }),
      updateTodayStats: (updates) =>
        set((state) => ({
          todayStats: { ...state.todayStats, ...updates },
        })),

      // ========== SYNC METHODS ==========
      loadTodayStats: async (userId: string, date: string) => {
        try {
          const stats = await completionsApi.getDailyStats(userId, date);
          if (stats) {
            set({ todayStats: stats });
          }
        } catch (error: any) {
          console.error('Failed to load today stats:', error);
        }
      },

      syncCompletion: async (completion: Omit<Completion, 'id'>) => {
        try {
          await completionsApi.createCompletion(completion);
          // Update local stats after syncing
          const userId = await getCurrentUserId();
          if (userId) {
            const date = new Date().toISOString().split('T')[0];
            await get().loadTodayStats(userId, date);
          }
        } catch (error: any) {
          console.error('Failed to sync completion:', error);
          throw error;
        }
      },
    }),
    { name: 'cozy-task-flow-storage' }
  )
);

// ==========================================
// JOURNAL STORE
// ==========================================
interface JournalState {
  entries: JournalEntry[];
  isLoading: boolean;
  error: string | null;
  // Sync methods
  loadEntries: (userId: string) => Promise<void>;
  subscribeToEntries: (userId: string) => void;
  unsubscribeFromEntries: () => void;
  realtimeUnsubscribe: (() => void) | null;
  // CRUD operations (now async)
  addEntry: (entry: Omit<JournalEntry, 'id' | 'createdAt'>) => Promise<void>;
  updateEntry: (entryId: string, updates: Partial<JournalEntry>) => Promise<void>;
  deleteEntry: (entryId: string) => Promise<void>;
  // Local getters
  getEntriesByType: (type: JournalEntry['type']) => JournalEntry[];
  getRecentEntries: (limit: number) => JournalEntry[];
}

export const useJournalStore = create<JournalState>()(
  persist(
    (set, get) => ({
      entries: [],
      isLoading: false,
      error: null,
      realtimeUnsubscribe: null,

      // ========== SYNC METHODS ==========
      loadEntries: async (userId: string) => {
        set({ isLoading: true, error: null });
        try {
          const entries = await journalApi.getEntries(userId);
          set({ entries, isLoading: false });
        } catch (error: any) {
          set({ error: error.message, isLoading: false });
          throw error;
        }
      },

      subscribeToEntries: (userId: string) => {
        const state = get();
        state.realtimeUnsubscribe?.();

        const unsubscribe = journalApi.subscribeToEntries(userId, {
          onInsert: (entry) => {
            set((state) => ({ entries: [entry, ...state.entries] }));
          },
          onUpdate: (entry) => {
            set((state) => ({
              entries: state.entries.map((e) => (e.id === entry.id ? entry : e)),
            }));
          },
          onDelete: (entryId) => {
            set((state) => ({
              entries: state.entries.filter((e) => e.id !== entryId),
            }));
          },
        });

        set({ realtimeUnsubscribe: unsubscribe });
      },

      unsubscribeFromEntries: () => {
        const state = get();
        state.realtimeUnsubscribe?.();
        set({ realtimeUnsubscribe: null });
      },

      // ========== CRUD OPERATIONS ==========
      addEntry: async (entry) => {
        const tempId = `temp-${Date.now()}`;
        const tempEntry = { ...entry, id: tempId, createdAt: new Date().toISOString() } as JournalEntry;

        // Optimistic update
        set((state) => ({ entries: [tempEntry, ...state.entries], error: null }));

        try {
          const newEntry = await journalApi.createEntry(entry);
          set((state) => ({
            entries: state.entries.map((e) => (e.id === tempId ? newEntry : e)),
          }));
        } catch (error: any) {
          // Rollback on error
          set((state) => ({
            entries: state.entries.filter((e) => e.id !== tempId),
            error: error.message,
          }));
          throw error;
        }
      },

      updateEntry: async (entryId, updates) => {
        const state = get();
        const originalEntry = state.entries.find((e) => e.id === entryId);
        if (!originalEntry) return;

        // Optimistic update
        set((state) => ({
          entries: state.entries.map((e) =>
            e.id === entryId ? { ...e, ...updates } : e
          ),
        }));

        try {
          const updatedEntry = await journalApi.updateEntry(entryId, updates);
          set((state) => ({
            entries: state.entries.map((e) => (e.id === entryId ? updatedEntry : e)),
          }));
        } catch (error: any) {
          // Rollback on error
          set((state) => ({
            entries: state.entries.map((e) => (e.id === entryId ? originalEntry : e)),
            error: error.message,
          }));
          throw error;
        }
      },

      deleteEntry: async (entryId) => {
        const state = get();
        const originalEntry = state.entries.find((e) => e.id === entryId);

        // Optimistic delete
        set((state) => ({
          entries: state.entries.filter((e) => e.id !== entryId),
        }));

        try {
          await journalApi.deleteEntry(entryId);
        } catch (error: any) {
          // Rollback on error
          if (originalEntry) {
            set((state) => ({
              entries: [originalEntry, ...state.entries],
              error: error.message,
            }));
          }
          throw error;
        }
      },

      // ========== LOCAL GETTERS ==========
      getEntriesByType: (type) => {
        const state = get();
        return state.entries.filter((e) => e.type === type);
      },

      getRecentEntries: (limit) => {
        const state = get();
        return state.entries.slice(0, limit);
      },
    }),
    { name: 'cozy-journal-storage' }
  )
);

// ==========================================
// STREAKS & BADGES STORE
// ==========================================
interface StreaksState {
  streakLogs: StreakLog[];
  badges: Badge[];
  isLoading: boolean;
  error: string | null;
  // Sync methods
  loadStreakHistory: (userId: string, days?: number) => Promise<void>;
  loadBadges: (userId: string) => Promise<void>;
  // CRUD operations (now async)
  addStreakLog: (log: Omit<StreakLog, 'id'>) => Promise<void>;
  unlockBadge: (badge: Omit<Badge, 'id'>) => Promise<void>;
  useGraceBloom: (userId: string) => Promise<void>;
  // Local getters
  getStreakForDate: (date: string) => StreakLog | undefined;
  getStreakHistory: (days: number) => StreakLog[];
}

export const useStreaksStore = create<StreaksState>()(
  persist(
    (set, get) => ({
      streakLogs: [],
      badges: [],
      isLoading: false,
      error: null,

      // ========== SYNC METHODS ==========
      loadStreakHistory: async (userId: string, days?: number) => {
        set({ isLoading: true, error: null });
        try {
          const streakLogs = await streaksApi.getStreakLogs(userId, days);
          set({ streakLogs, isLoading: false });
        } catch (error: any) {
          set({ error: error.message, isLoading: false });
          throw error;
        }
      },

      loadBadges: async (userId: string) => {
        set({ isLoading: true, error: null });
        try {
          const badges = await streaksApi.getBadges(userId);
          set({ badges, isLoading: false });
        } catch (error: any) {
          set({ error: error.message, isLoading: false });
          throw error;
        }
      },

      // ========== CRUD OPERATIONS ==========
      addStreakLog: async (log) => {
        const tempId = `temp-${Date.now()}`;
        const tempLog = { ...log, id: tempId } as StreakLog;

        // Optimistic update
        set((state) => ({ streakLogs: [...state.streakLogs, tempLog], error: null }));

        try {
          const newLog = await streaksApi.upsertStreakLog(log);
          set((state) => ({
            streakLogs: state.streakLogs.map((l) => (l.id === tempId ? newLog : l)),
          }));
        } catch (error: any) {
          // Rollback on error
          set((state) => ({
            streakLogs: state.streakLogs.filter((l) => l.id !== tempId),
            error: error.message,
          }));
          throw error;
        }
      },

      unlockBadge: async (badge) => {
        const tempId = `temp-${Date.now()}`;
        const tempBadge = { ...badge, id: tempId } as Badge;

        // Optimistic update
        set((state) => ({ badges: [...state.badges, tempBadge], error: null }));

        try {
          const newBadge = await streaksApi.unlockBadge(badge);
          set((state) => ({
            badges: state.badges.map((b) => (b.id === tempId ? newBadge : b)),
          }));
        } catch (error: any) {
          // Rollback on error
          set((state) => ({
            badges: state.badges.filter((b) => b.id !== tempId),
            error: error.message,
          }));
          throw error;
        }
      },

      useGraceBloom: async (userId: string) => {
        try {
          await streaksApi.useGraceBloom(userId);
        } catch (error: any) {
          set({ error: error.message });
          throw error;
        }
      },

      // ========== LOCAL GETTERS ==========
      getStreakForDate: (date) => {
        const state = get();
        return state.streakLogs.find((log) => log.date === date);
      },

      getStreakHistory: (days) => {
        const state = get();
        const today = new Date();
        const startDate = new Date(today.getTime() - days * 24 * 60 * 60 * 1000);
        return state.streakLogs
          .filter((log) => new Date(log.date) >= startDate)
          .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      },
    }),
    { name: 'cozy-streaks-storage' }
  )
);

// ==========================================
// ONBOARDING STORE
// ==========================================
interface OnboardingStoreState extends OnboardingState {
  nextStep: () => void;
  previousStep: () => void;
  completeOnboarding: () => void;
  resetOnboarding: () => void;
}

export const useOnboardingStore = create<OnboardingStoreState>()(
  persist(
    (set) => ({
      currentStep: 0,
      totalSteps: 5,
      completed: false,
      nextStep: () =>
        set((state) => ({
          currentStep: Math.min(state.currentStep + 1, state.totalSteps),
        })),
      previousStep: () =>
        set((state) => ({
          currentStep: Math.max(state.currentStep - 1, 0),
        })),
      completeOnboarding: () => set({ completed: true }),
      resetOnboarding: () => set({ currentStep: 0, completed: false }),
    }),
    { name: 'cozy-onboarding-storage' }
  )
);

// ==========================================
// CELEBRATION STORE
// ==========================================
interface CelebrationState {
  currentCelebration: CelebrationEvent | null;
  celebrationQueue: CelebrationEvent[];
  showCelebration: (event: CelebrationEvent) => void;
  dismissCelebration: () => void;
  queueCelebration: (event: CelebrationEvent) => void;
  processQueue: () => void;
}

export const useCelebrationStore = create<CelebrationState>()((set, get) => ({
  currentCelebration: null,
  celebrationQueue: [],
  showCelebration: (event) => set({ currentCelebration: event }),
  dismissCelebration: () => {
    set({ currentCelebration: null });
    // Auto-process queue
    setTimeout(() => get().processQueue(), 500);
  },
  queueCelebration: (event) =>
    set((state) => ({
      celebrationQueue: [...state.celebrationQueue, event],
    })),
  processQueue: () => {
    const state = get();
    if (!state.currentCelebration && state.celebrationQueue.length > 0) {
      const [next, ...rest] = state.celebrationQueue;
      set({ currentCelebration: next, celebrationQueue: rest });
    }
  },
}));
