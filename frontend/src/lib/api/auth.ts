// ===================================
// AUTHENTICATION API
// ===================================

import { supabase } from '../supabase';
import type { User } from '@/types';

/**
 * Sign in with magic link sent to email
 *
 * @param email - User's email address
 * @returns Success status and optional error message
 *
 * @example
 * ```ts
 * const result = await signIn('user@example.com');
 * if (result.success) {
 *   console.log('Check your email for the magic link!');
 * }
 * ```
 */
export const signIn = async (
  email: string
): Promise<{ success: boolean; error?: string }> => {
  try {
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Unknown error occurred',
    };
  }
};

/**
 * Sign in with Google OAuth
 *
 * @returns Success status and optional error message
 *
 * @example
 * ```ts
 * const result = await signInWithGoogle();
 * if (result.success) {
 *   // User will be redirected to Google sign-in
 * }
 * ```
 */
export const signInWithGoogle = async (): Promise<{
  success: boolean;
  error?: string;
}> => {
  try {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
        },
      },
    });

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Unknown error occurred',
    };
  }
};

/**
 * Sign out the current user
 *
 * @returns Success status and optional error message
 *
 * @example
 * ```ts
 * const result = await signOut();
 * if (result.success) {
 *   // Redirect to login page
 * }
 * ```
 */
export const signOut = async (): Promise<{
  success: boolean;
  error?: string;
}> => {
  try {
    const { error } = await supabase.auth.signOut();

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Unknown error occurred',
    };
  }
};

/**
 * Get the current authenticated user with profile data
 *
 * @returns User object or null if not authenticated
 *
 * @example
 * ```ts
 * const user = await getCurrentUser();
 * if (user) {
 *   console.log(`Welcome ${user.name}!`);
 * }
 * ```
 */
export const getCurrentUser = async (): Promise<User | null> => {
  try {
    const {
      data: { user: authUser },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !authUser) {
      return null;
    }

    // Get full user profile from users table
    const { data: profile, error: profileError } = await supabase
      .from('users')
      .select('*')
      .eq('id', authUser.id)
      .single();

    if (profileError || !profile) {
      return null;
    }

    return profile as User;
  } catch (err) {
    console.error('Error getting current user:', err);
    return null;
  }
};

/**
 * Update user profile data
 *
 * @param data - Partial user data to update
 * @returns Updated user object or error
 *
 * @example
 * ```ts
 * const result = await updateProfile({
 *   name: 'New Name',
 *   avatarCharacter: 'fox',
 *   avatarColor: 'sage'
 * });
 * if (result.success && result.data) {
 *   console.log('Profile updated!');
 * }
 * ```
 */
export const updateProfile = async (
  data: Partial<Omit<User, 'id' | 'email' | 'createdAt'>>
): Promise<{ success: boolean; data?: User; error?: string }> => {
  try {
    const {
      data: { user: authUser },
    } = await supabase.auth.getUser();

    if (!authUser) {
      return { success: false, error: 'Not authenticated' };
    }

    const { data: updatedProfile, error } = await supabase
      .from('users')
      .update(data)
      .eq('id', authUser.id)
      .select()
      .single();

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, data: updatedProfile as User };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Unknown error occurred',
    };
  }
};

/**
 * Check if a user session exists
 *
 * @returns True if user is authenticated
 *
 * @example
 * ```ts
 * const isLoggedIn = await isAuthenticated();
 * if (!isLoggedIn) {
 *   // Redirect to login
 * }
 * ```
 */
export const isAuthenticated = async (): Promise<boolean> => {
  const {
    data: { session },
  } = await supabase.auth.getSession();
  return !!session;
};
