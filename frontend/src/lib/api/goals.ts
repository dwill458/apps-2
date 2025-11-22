/**
 * COZY GROWTH - Goals API Service
 * Handles all Supabase operations for goals and tasks
 */
import { supabase } from '../supabase';
import type { Goal, MicroTask } from '../../types';

// ==========================================
// GOALS API
// ==========================================

export const goalsApi = {
  /**
   * Fetch all goals for a user
   */
  async getGoals(userId: string): Promise<Goal[]> {
    const { data, error } = await supabase
      .from('goals')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return (data || []).map(mapGoalFromDb);
  },

  /**
   * Create a new goal
   */
  async createGoal(goal: Omit<Goal, 'id' | 'createdAt'>): Promise<Goal> {
    const { data, error } = await supabase
      .from('goals')
      .insert([mapGoalToDb(goal)])
      .select()
      .single();

    if (error) throw error;
    return mapGoalFromDb(data);
  },

  /**
   * Update an existing goal
   */
  async updateGoal(goalId: string, updates: Partial<Goal>): Promise<Goal> {
    const { data, error } = await supabase
      .from('goals')
      .update(mapGoalToDb(updates))
      .eq('id', goalId)
      .select()
      .single();

    if (error) throw error;
    return mapGoalFromDb(data);
  },

  /**
   * Delete a goal (and associated tasks via cascade)
   */
  async deleteGoal(goalId: string): Promise<void> {
    const { error } = await supabase
      .from('goals')
      .delete()
      .eq('id', goalId);

    if (error) throw error;
  },

  /**
   * Subscribe to goal changes for a user
   */
  subscribeToGoals(
    userId: string,
    callbacks: {
      onInsert?: (goal: Goal) => void;
      onUpdate?: (goal: Goal) => void;
      onDelete?: (goalId: string) => void;
    }
  ): () => void {
    const channel = supabase
      .channel(`goals-${userId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'goals',
          filter: `user_id=eq.${userId}`,
        },
        (payload) => callbacks.onInsert?.(mapGoalFromDb(payload.new))
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'goals',
          filter: `user_id=eq.${userId}`,
        },
        (payload) => callbacks.onUpdate?.(mapGoalFromDb(payload.new))
      )
      .on(
        'postgres_changes',
        {
          event: 'DELETE',
          schema: 'public',
          table: 'goals',
          filter: `user_id=eq.${userId}`,
        },
        (payload) => callbacks.onDelete?.(payload.old.id)
      )
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  },
};

// ==========================================
// TASKS API
// ==========================================

export const tasksApi = {
  /**
   * Fetch all tasks for a user's goals
   */
  async getTasks(userId: string): Promise<MicroTask[]> {
    const { data, error } = await supabase
      .from('micro_tasks')
      .select('*, goals!inner(user_id)')
      .eq('goals.user_id', userId)
      .order('order_index', { ascending: true });

    if (error) throw error;
    return (data || []).map(mapTaskFromDb);
  },

  /**
   * Fetch tasks for a specific goal
   */
  async getTasksByGoal(goalId: string): Promise<MicroTask[]> {
    const { data, error } = await supabase
      .from('micro_tasks')
      .select('*')
      .eq('goal_id', goalId)
      .order('order_index', { ascending: true });

    if (error) throw error;
    return (data || []).map(mapTaskFromDb);
  },

  /**
   * Create multiple tasks
   */
  async createTasks(tasks: Omit<MicroTask, 'id' | 'createdAt'>[]): Promise<MicroTask[]> {
    const { data, error } = await supabase
      .from('micro_tasks')
      .insert(tasks.map(mapTaskToDb))
      .select();

    if (error) throw error;
    return (data || []).map(mapTaskFromDb);
  },

  /**
   * Update a task
   */
  async updateTask(taskId: string, updates: Partial<MicroTask>): Promise<MicroTask> {
    const { data, error } = await supabase
      .from('micro_tasks')
      .update(mapTaskToDb(updates))
      .eq('id', taskId)
      .select()
      .single();

    if (error) throw error;
    return mapTaskFromDb(data);
  },

  /**
   * Complete a task
   */
  async completeTask(taskId: string): Promise<MicroTask> {
    const { data, error } = await supabase
      .from('micro_tasks')
      .update({
        status: 'completed',
        completed_at: new Date().toISOString(),
      })
      .eq('id', taskId)
      .select()
      .single();

    if (error) throw error;
    return mapTaskFromDb(data);
  },

  /**
   * Subscribe to task changes for a user
   */
  subscribeToTasks(
    userId: string,
    callbacks: {
      onInsert?: (task: MicroTask) => void;
      onUpdate?: (task: MicroTask) => void;
      onDelete?: (taskId: string) => void;
    }
  ): () => void {
    const channel = supabase
      .channel(`tasks-${userId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'micro_tasks',
        },
        (payload) => callbacks.onInsert?.(mapTaskFromDb(payload.new))
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'micro_tasks',
        },
        (payload) => callbacks.onUpdate?.(mapTaskFromDb(payload.new))
      )
      .on(
        'postgres_changes',
        {
          event: 'DELETE',
          schema: 'public',
          table: 'micro_tasks',
        },
        (payload) => callbacks.onDelete?.(payload.old.id)
      )
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  },
};

// ==========================================
// DATA MAPPING HELPERS
// ==========================================

function mapGoalFromDb(dbGoal: any): Goal {
  return {
    id: dbGoal.id,
    userId: dbGoal.user_id,
    title: dbGoal.title,
    description: dbGoal.description,
    plantType: dbGoal.plant_type,
    plantStage: dbGoal.plant_stage,
    status: dbGoal.status,
    totalSteps: dbGoal.total_steps,
    completedSteps: dbGoal.completed_steps,
    estimatedHours: dbGoal.estimated_hours,
    createdAt: dbGoal.created_at,
    completedAt: dbGoal.completed_at,
  };
}

function mapGoalToDb(goal: Partial<Goal>): any {
  const dbGoal: any = {};
  if (goal.userId !== undefined) dbGoal.user_id = goal.userId;
  if (goal.title !== undefined) dbGoal.title = goal.title;
  if (goal.description !== undefined) dbGoal.description = goal.description;
  if (goal.plantType !== undefined) dbGoal.plant_type = goal.plantType;
  if (goal.plantStage !== undefined) dbGoal.plant_stage = goal.plantStage;
  if (goal.status !== undefined) dbGoal.status = goal.status;
  if (goal.totalSteps !== undefined) dbGoal.total_steps = goal.totalSteps;
  if (goal.completedSteps !== undefined) dbGoal.completed_steps = goal.completedSteps;
  if (goal.estimatedHours !== undefined) dbGoal.estimated_hours = goal.estimatedHours;
  if (goal.completedAt !== undefined) dbGoal.completed_at = goal.completedAt;
  return dbGoal;
}

function mapTaskFromDb(dbTask: any): MicroTask {
  return {
    id: dbTask.id,
    goalId: dbTask.goal_id,
    parentStepId: dbTask.parent_step_id,
    title: dbTask.title,
    description: dbTask.description,
    durationMinutes: dbTask.duration_minutes,
    difficulty: dbTask.difficulty,
    spicyFlag: dbTask.spicy_flag,
    orderIndex: dbTask.order_index,
    status: dbTask.status,
    completedAt: dbTask.completed_at,
    createdAt: dbTask.created_at,
  };
}

function mapTaskToDb(task: Partial<MicroTask>): any {
  const dbTask: any = {};
  if (task.goalId !== undefined) dbTask.goal_id = task.goalId;
  if (task.parentStepId !== undefined) dbTask.parent_step_id = task.parentStepId;
  if (task.title !== undefined) dbTask.title = task.title;
  if (task.description !== undefined) dbTask.description = task.description;
  if (task.durationMinutes !== undefined) dbTask.duration_minutes = task.durationMinutes;
  if (task.difficulty !== undefined) dbTask.difficulty = task.difficulty;
  if (task.spicyFlag !== undefined) dbTask.spicy_flag = task.spicyFlag;
  if (task.orderIndex !== undefined) dbTask.order_index = task.orderIndex;
  if (task.status !== undefined) dbTask.status = task.status;
  if (task.completedAt !== undefined) dbTask.completed_at = task.completedAt;
  return dbTask;
}
