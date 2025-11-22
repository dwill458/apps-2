/**
 * COZY GROWTH - Completions API Service
 * Handles task completions and daily stats
 */
import { supabase } from '../supabase';
import type { Completion, DailyStats } from '../../types';

export const completionsApi = {
  /**
   * Create a task completion record
   */
  async createCompletion(completion: Omit<Completion, 'id'>): Promise<Completion> {
    const { data, error } = await supabase
      .from('completions')
      .insert([mapCompletionToDb(completion)])
      .select()
      .single();

    if (error) throw error;
    return mapCompletionFromDb(data);
  },

  /**
   * Get daily stats for a user
   */
  async getDailyStats(userId: string, date: string): Promise<DailyStats | null> {
    const { data, error } = await supabase
      .from('completions')
      .select('*')
      .eq('user_id', userId)
      .gte('timestamp', `${date}T00:00:00`)
      .lt('timestamp', `${date}T23:59:59`);

    if (error) throw error;

    if (!data || data.length === 0) {
      return {
        date,
        minutesCompleted: 0,
        tasksCompleted: 0,
        chainCount: 0,
        bloomPointsEarned: 0,
        goalsWorkedOn: [],
      };
    }

    // Aggregate the completions
    const stats: DailyStats = {
      date,
      minutesCompleted: data.reduce((sum, c) => sum + c.duration_actual_minutes, 0),
      tasksCompleted: data.length,
      chainCount: Math.max(...data.map((c) => c.chain_count || 0)),
      bloomPointsEarned: data.reduce((sum, c) => sum + c.bloom_points_earned, 0),
      goalsWorkedOn: [],
    };

    // Get unique goals worked on
    const taskIds = data.map((c) => c.micro_task_id);
    const { data: tasks } = await supabase
      .from('micro_tasks')
      .select('goal_id')
      .in('id', taskIds);

    if (tasks) {
      stats.goalsWorkedOn = [...new Set(tasks.map((t) => t.goal_id))];
    }

    return stats;
  },
};

// ==========================================
// DATA MAPPING HELPERS
// ==========================================

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

function mapCompletionToDb(completion: Partial<Completion>): any {
  const dbCompletion: any = {};
  if (completion.microTaskId !== undefined) dbCompletion.micro_task_id = completion.microTaskId;
  if (completion.userId !== undefined) dbCompletion.user_id = completion.userId;
  if (completion.timestamp !== undefined) dbCompletion.timestamp = completion.timestamp;
  if (completion.durationActualMinutes !== undefined)
    dbCompletion.duration_actual_minutes = completion.durationActualMinutes;
  if (completion.chainCount !== undefined) dbCompletion.chain_count = completion.chainCount;
  if (completion.bloomPointsEarned !== undefined)
    dbCompletion.bloom_points_earned = completion.bloomPointsEarned;
  return dbCompletion;
}
