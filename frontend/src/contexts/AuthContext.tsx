/**
 * AuthContext - Authentication Provider for Cozy Growth
 *
 * Manages authentication state using Supabase
 * Syncs user profile with Zustand store
 * Provides sign in/out methods
 */
import React, { createContext, useEffect, useState, useCallback } from 'react';
import { User as SupabaseUser, Session, AuthError } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import { useUserStore } from '../store/useStore';
import type { User } from '../types';

// ==========================================
// TYPES
// ==========================================
interface AuthContextType {
  user: SupabaseUser | null;
  session: Session | null;
  profile: User | null;
  isLoading: boolean;
  error: AuthError | null;
  signIn: (email: string) => Promise<{ error: AuthError | null }>;
  signInWithGoogle: () => Promise<{ error: AuthError | null }>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

// ==========================================
// CONTEXT
// ==========================================
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

// ==========================================
// PROVIDER
// ==========================================
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<AuthError | null>(null);

  const { setUser: setZustandUser } = useUserStore();

  /**
   * Fetch user profile from database and sync with Zustand
   */
  const fetchProfile = useCallback(async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error fetching profile:', error);
        return null;
      }

      if (data) {
        // Map database profile to app User type
        const userProfile: User = {
          id: data.id,
          name: data.name || 'Anonymous',
          email: data.email || '',
          avatarCharacter: data.avatar_character || 'person',
          avatarColor: data.avatar_color || 'sage',
          reminderIntensity: data.reminder_intensity || 'sometimes',
          dailyGoalMinutes: data.daily_goal_minutes || 30,
          onboardingCompleted: data.onboarding_completed || false,
          graceBlooms: data.grace_blooms || 3,
          bloomPoints: data.bloom_points || 0,
          totalDaysShowedUp: data.total_days_showed_up || 0,
          longestStreak: data.longest_streak || 0,
          currentStreak: data.current_streak || 0,
          lastActiveDate: data.last_active_date,
          createdAt: data.created_at,
          settings: data.settings || {
            quietHoursEnabled: false,
            quietHoursStart: '22:00',
            quietHoursEnd: '08:00',
            notificationSound: true,
            notificationVibration: true,
            appearance: 'auto',
            textSize: 'cozy',
            dyslexiaFont: false,
            reduceMotion: false,
            highContrast: false,
            defaultEnergyLevel: 'medium',
            preferredDuration: 10,
            taskSuggestionsMode: 'surprise',
            chainIntensity: 'keep_momentum',
            debugPrompts: false,
            learningMode: true,
          },
        };

        setProfile(userProfile);
        setZustandUser(userProfile);
        return userProfile;
      }

      return null;
    } catch (err) {
      console.error('Error in fetchProfile:', err);
      return null;
    }
  }, [setZustandUser]);

  /**
   * Refresh profile data
   */
  const refreshProfile = useCallback(async () => {
    if (user?.id) {
      await fetchProfile(user.id);
    }
  }, [user, fetchProfile]);

  /**
   * Sign in with magic link
   */
  const signIn = async (email: string) => {
    try {
      setError(null);
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: window.location.origin + '/home',
        },
      });

      if (error) {
        setError(error);
        return { error };
      }

      return { error: null };
    } catch (err) {
      const authError = err as AuthError;
      setError(authError);
      return { error: authError };
    }
  };

  /**
   * Sign in with Google OAuth
   */
  const signInWithGoogle = async () => {
    try {
      setError(null);
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin + '/home',
        },
      });

      if (error) {
        setError(error);
        return { error };
      }

      return { error: null };
    } catch (err) {
      const authError = err as AuthError;
      setError(authError);
      return { error: authError };
    }
  };

  /**
   * Sign out
   */
  const signOut = async () => {
    try {
      setError(null);
      await supabase.auth.signOut();
      setUser(null);
      setSession(null);
      setProfile(null);
      setZustandUser(null as any); // Clear Zustand user
    } catch (err) {
      console.error('Error signing out:', err);
      setError(err as AuthError);
    }
  };

  /**
   * Listen to auth state changes
   */
  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);

      if (session?.user) {
        fetchProfile(session.user.id);
      }

      setIsLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event);

      setSession(session);
      setUser(session?.user ?? null);

      if (event === 'SIGNED_IN' && session?.user) {
        await fetchProfile(session.user.id);
      }

      if (event === 'SIGNED_OUT') {
        setProfile(null);
        setZustandUser(null as any);
      }

      setIsLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [fetchProfile, setZustandUser]);

  /**
   * Create profile on first sign in if it doesn't exist
   */
  useEffect(() => {
    const createProfileIfNeeded = async () => {
      if (user && !profile && !isLoading) {
        // Check if profile exists
        const { data: existingProfile } = await supabase
          .from('profiles')
          .select('id')
          .eq('id', user.id)
          .single();

        if (!existingProfile) {
          // Create new profile
          const { error } = await supabase.from('profiles').insert({
            id: user.id,
            email: user.email,
            name: user.user_metadata?.name || user.email?.split('@')[0] || 'Anonymous',
            avatar_character: 'person',
            avatar_color: 'sage',
            reminder_intensity: 'sometimes',
            daily_goal_minutes: 30,
            onboarding_completed: false,
            grace_blooms: 3,
            bloom_points: 0,
            total_days_showed_up: 0,
            longest_streak: 0,
            current_streak: 0,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          });

          if (!error) {
            await fetchProfile(user.id);
          } else {
            console.error('Error creating profile:', error);
          }
        }
      }
    };

    createProfileIfNeeded();
  }, [user, profile, isLoading, fetchProfile]);

  const value: AuthContextType = {
    user,
    session,
    profile,
    isLoading,
    error,
    signIn,
    signInWithGoogle,
    signOut,
    refreshProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
