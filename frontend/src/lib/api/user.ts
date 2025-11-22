/**
 * COZY GROWTH - User API Service
 * Handles all Supabase operations for user profiles and settings
 */
import { supabase } from '../supabase';
import type { User, UserSettings } from '../../types';

export const userApi = {
  /**
   * Get user profile by ID
   */
  async getProfile(userId: string): Promise<User> {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) throw error;
    return mapUserFromDb(data);
  },

  /**
   * Update user profile
   */
  async updateProfile(userId: string, updates: Partial<User>): Promise<User> {
    const { data, error } = await supabase
      .from('users')
      .update(mapUserToDb(updates))
      .eq('id', userId)
      .select()
      .single();

    if (error) throw error;
    return mapUserFromDb(data);
  },

  /**
   * Update user settings
   */
  async updateSettings(userId: string, settings: Partial<UserSettings>): Promise<User> {
    const { data: currentUser, error: fetchError } = await supabase
      .from('users')
      .select('settings')
      .eq('id', userId)
      .single();

    if (fetchError) throw fetchError;

    const updatedSettings = {
      ...currentUser.settings,
      ...settings,
    };

    const { data, error } = await supabase
      .from('users')
      .update({ settings: updatedSettings })
      .eq('id', userId)
      .select()
      .single();

    if (error) throw error;
    return mapUserFromDb(data);
  },

  /**
   * Increment bloom points
   */
  async incrementBloomPoints(userId: string, points: number): Promise<User> {
    const { data, error } = await supabase.rpc('increment_bloom_points', {
      p_user_id: userId,
      p_points: points,
    });

    if (error) throw error;

    // Fetch updated user
    return this.getProfile(userId);
  },

  /**
   * Spend bloom points (e.g., for shop purchases)
   */
  async spendBloomPoints(userId: string, points: number): Promise<User> {
    const { data, error } = await supabase.rpc('spend_bloom_points', {
      p_user_id: userId,
      p_points: points,
    });

    if (error) throw error;

    // Fetch updated user
    return this.getProfile(userId);
  },

  /**
   * Update streak information
   */
  async updateStreak(
    userId: string,
    currentStreak: number,
    longestStreak: number,
    totalDaysShowedUp: number
  ): Promise<User> {
    const { data, error } = await supabase
      .from('users')
      .update({
        current_streak: currentStreak,
        longest_streak: longestStreak,
        total_days_showed_up: totalDaysShowedUp,
        last_active_date: new Date().toISOString().split('T')[0],
      })
      .eq('id', userId)
      .select()
      .single();

    if (error) throw error;
    return mapUserFromDb(data);
  },

  /**
   * Use a grace bloom
   */
  async useGraceBloom(userId: string): Promise<User> {
    const { data, error } = await supabase.rpc('use_grace_bloom', {
      p_user_id: userId,
    });

    if (error) throw error;

    // Fetch updated user
    return this.getProfile(userId);
  },

  /**
   * Complete onboarding
   */
  async completeOnboarding(userId: string): Promise<User> {
    const { data, error } = await supabase
      .from('users')
      .update({
        onboarding_completed: true,
      })
      .eq('id', userId)
      .select()
      .single();

    if (error) throw error;
    return mapUserFromDb(data);
  },

  /**
   * Subscribe to user profile changes
   */
  subscribeToProfile(
    userId: string,
    callback: (user: User) => void
  ): () => void {
    const channel = supabase
      .channel(`user-${userId}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'users',
          filter: `id=eq.${userId}`,
        },
        (payload) => callback(mapUserFromDb(payload.new))
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

function mapUserFromDb(dbUser: any): User {
  return {
    id: dbUser.id,
    name: dbUser.name,
    email: dbUser.email,
    avatarCharacter: dbUser.avatar_character,
    avatarColor: dbUser.avatar_color,
    reminderIntensity: dbUser.reminder_intensity,
    dailyGoalMinutes: dbUser.daily_goal_minutes,
    onboardingCompleted: dbUser.onboarding_completed,
    graceBlooms: dbUser.grace_blooms,
    bloomPoints: dbUser.bloom_points,
    totalDaysShowedUp: dbUser.total_days_showed_up,
    longestStreak: dbUser.longest_streak,
    currentStreak: dbUser.current_streak,
    lastActiveDate: dbUser.last_active_date,
    createdAt: dbUser.created_at,
    settings: dbUser.settings,
  };
}

function mapUserToDb(user: Partial<User>): any {
  const dbUser: any = {};
  if (user.name !== undefined) dbUser.name = user.name;
  if (user.email !== undefined) dbUser.email = user.email;
  if (user.avatarCharacter !== undefined) dbUser.avatar_character = user.avatarCharacter;
  if (user.avatarColor !== undefined) dbUser.avatar_color = user.avatarColor;
  if (user.reminderIntensity !== undefined) dbUser.reminder_intensity = user.reminderIntensity;
  if (user.dailyGoalMinutes !== undefined) dbUser.daily_goal_minutes = user.dailyGoalMinutes;
  if (user.onboardingCompleted !== undefined) dbUser.onboarding_completed = user.onboardingCompleted;
  if (user.graceBlooms !== undefined) dbUser.grace_blooms = user.graceBlooms;
  if (user.bloomPoints !== undefined) dbUser.bloom_points = user.bloomPoints;
  if (user.totalDaysShowedUp !== undefined) dbUser.total_days_showed_up = user.totalDaysShowedUp;
  if (user.longestStreak !== undefined) dbUser.longest_streak = user.longestStreak;
  if (user.currentStreak !== undefined) dbUser.current_streak = user.currentStreak;
  if (user.lastActiveDate !== undefined) dbUser.last_active_date = user.lastActiveDate;
  if (user.settings !== undefined) dbUser.settings = user.settings;
  return dbUser;
}
