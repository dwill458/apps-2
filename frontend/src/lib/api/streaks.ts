/**
 * COZY GROWTH - Streaks API Service
 * Handles all Supabase operations for streaks and badges
 */
import { supabase } from '../supabase';
import type { StreakLog, Badge } from '../../types';

export const streaksApi = {
  /**
   * Fetch streak history for a user
   */
  async getStreakLogs(userId: string, days?: number): Promise<StreakLog[]> {
    let query = supabase
      .from('streak_logs')
      .select('*')
      .eq('user_id', userId)
      .order('date', { ascending: false });

    if (days) {
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);
      query = query.gte('date', startDate.toISOString().split('T')[0]);
    }

    const { data, error } = await query;

    if (error) throw error;
    return (data || []).map(mapStreakLogFromDb);
  },

  /**
   * Create or update a streak log for a date
   */
  async upsertStreakLog(log: Omit<StreakLog, 'id'>): Promise<StreakLog> {
    const { data, error } = await supabase
      .from('streak_logs')
      .upsert([mapStreakLogToDb(log)], {
        onConflict: 'user_id,date',
      })
      .select()
      .single();

    if (error) throw error;
    return mapStreakLogFromDb(data);
  },

  /**
   * Get badges for a user
   */
  async getBadges(userId: string): Promise<Badge[]> {
    const { data, error } = await supabase
      .from('badges')
      .select('*')
      .eq('user_id', userId)
      .order('unlocked_at', { ascending: false });

    if (error) throw error;
    return (data || []).map(mapBadgeFromDb);
  },

  /**
   * Unlock a new badge
   */
  async unlockBadge(badge: Omit<Badge, 'id'>): Promise<Badge> {
    const { data, error } = await supabase
      .from('badges')
      .insert([mapBadgeToDb(badge)])
      .select()
      .single();

    if (error) throw error;
    return mapBadgeFromDb(data);
  },

  /**
   * Use a grace bloom
   */
  async useGraceBloom(userId: string): Promise<void> {
    const { error } = await supabase.rpc('use_grace_bloom', {
      p_user_id: userId,
    });

    if (error) throw error;
  },
};

// ==========================================
// DATA MAPPING HELPERS
// ==========================================

function mapStreakLogFromDb(dbLog: any): StreakLog {
  return {
    id: dbLog.id,
    userId: dbLog.user_id,
    date: dbLog.date,
    didShowUp: dbLog.did_show_up,
    tasksCompleted: dbLog.tasks_completed,
    totalMinutes: dbLog.total_minutes,
  };
}

function mapStreakLogToDb(log: Partial<StreakLog>): any {
  const dbLog: any = {};
  if (log.userId !== undefined) dbLog.user_id = log.userId;
  if (log.date !== undefined) dbLog.date = log.date;
  if (log.didShowUp !== undefined) dbLog.did_show_up = log.didShowUp;
  if (log.tasksCompleted !== undefined) dbLog.tasks_completed = log.tasksCompleted;
  if (log.totalMinutes !== undefined) dbLog.total_minutes = log.totalMinutes;
  return dbLog;
}

function mapBadgeFromDb(dbBadge: any): Badge {
  return {
    id: dbBadge.id,
    userId: dbBadge.user_id,
    badgeName: dbBadge.badge_name,
    badgeType: dbBadge.badge_type,
    description: dbBadge.description,
    icon: dbBadge.icon,
    unlockedAt: dbBadge.unlocked_at,
  };
}

function mapBadgeToDb(badge: Partial<Badge>): any {
  const dbBadge: any = {};
  if (badge.userId !== undefined) dbBadge.user_id = badge.userId;
  if (badge.badgeName !== undefined) dbBadge.badge_name = badge.badgeName;
  if (badge.badgeType !== undefined) dbBadge.badge_type = badge.badgeType;
  if (badge.description !== undefined) dbBadge.description = badge.description;
  if (badge.icon !== undefined) dbBadge.icon = badge.icon;
  if (badge.unlockedAt !== undefined) dbBadge.unlocked_at = badge.unlockedAt;
  return dbBadge;
}
