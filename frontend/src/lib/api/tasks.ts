/**
 * COZY GROWTH - Tasks API Service
 * Handles all Supabase operations for micro-tasks
 */
import { supabase } from '../supabase';
import type { MicroTask, Completion } from '../../types';

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
   * Create a new task
   */
  async createTask(task: Omit<MicroTask, 'id' | 'createdAt'>): Promise<MicroTask> {
    const { data, error } = await supabase
      .from('micro_tasks')
      .insert([mapTaskToDb(task)])
      .select()
      .single();

    if (error) throw error;
    return mapTaskFromDb(data);
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
   * Complete a task with actual duration tracking
   */
  async completeTask(
    taskId: string,
    actualDuration: number,
    chainCount: number = 1
  ): Promise<{ task: MicroTask; completion: Completion; bloomPoints: number }> {
    // Get current user
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      throw new Error('Not authenticated');
    }

    // Get the task to calculate bloom points
    const { data: task, error: taskError } = await supabase
      .from('micro_tasks')
      .select('*')
      .eq('id', taskId)
      .single();

    if (taskError || !task) {
      throw new Error('Task not found');
    }

    // Calculate bloom points
    let basePoints = 10;
    if (task.difficulty === 'medium') basePoints = 15;
    if (task.difficulty === 'hard') basePoints = 20;
    if (task.spicy_flag) basePoints += 5;
    const chainBonus = Math.min((chainCount - 1) * 2, 10);
    const bloomPoints = basePoints + chainBonus;

    // Update task status
    const { data: updatedTask, error: updateError } = await supabase
      .from('micro_tasks')
      .update({
        status: 'completed',
        completed_at: new Date().toISOString(),
      })
      .eq('id', taskId)
      .select()
      .single();

    if (updateError) {
      throw updateError;
    }

    // Create completion record
    const { data: completion, error: completionError } = await supabase
      .from('completions')
      .insert({
        micro_task_id: taskId,
        user_id: user.id,
        timestamp: new Date().toISOString(),
        duration_actual_minutes: actualDuration,
        chain_count: chainCount,
        bloom_points_earned: bloomPoints,
      })
      .select()
      .single();

    if (completionError) {
      throw completionError;
    }

    return {
      task: mapTaskFromDb(updatedTask),
      completion: mapCompletionFromDb(completion),
      bloomPoints,
    };
  },

  /**
   * Skip a task (mark as skipped without penalty)
   */
  async skipTask(taskId: string): Promise<MicroTask> {
    const { data, error } = await supabase
      .from('micro_tasks')
      .update({
        status: 'skipped',
      })
      .eq('id', taskId)
      .select()
      .single();

    if (error) throw error;
    return mapTaskFromDb(data);
  },

  /**
   * Delete a task
   */
  async deleteTask(taskId: string): Promise<void> {
    const { error } = await supabase.from('micro_tasks').delete().eq('id', taskId);

    if (error) throw error;
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

function mapCompletionFromDb(dbCompletion: any): Completion {
  return {
    id: dbCompletion.id,
    microTaskId: dbCompletion.micro_task_id,
    userId: dbCompletion.user_id,
    timestamp: dbCompletion.timestamp,
    durationActualMinutes: dbCompletion.duration_actual_minutes,
    chainCount: dbCompletion.chain_count,
    bloomPointsEarned: dbCompletion.bloom_points_earned,
  };
}
