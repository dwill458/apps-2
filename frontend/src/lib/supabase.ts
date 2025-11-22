// ===================================
// SUPABASE CLIENT INITIALIZATION
// ===================================

import { createClient } from '@supabase/supabase-js';
import type { Database } from './database.types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    'Missing Supabase environment variables. Using placeholder values to prevent crash. Please check your .env file.'
  );
}

// Fallback values to prevent crash during initial load if env vars are missing
const url = supabaseUrl || 'https://placeholder.supabase.co';
const key = supabaseAnonKey || 'placeholder-key';

/**
 * Supabase client instance with TypeScript types
 *
 * @example
 * ```ts
 * import { supabase } from '@/lib/supabase';
 *
 * const { data, error } = await supabase
 *   .from('users')
 *   .select('*')
 *   .eq('id', userId);
 * ```
 */
export const supabase = createClient<Database>(url, key, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    storage: window.localStorage,
  },
  realtime: {
    params: {
      eventsPerSecond: 10,
    },
  },
});

/**
 * Subscribe to authentication state changes
 *
 * @param callback - Function to call when auth state changes
 * @returns Unsubscribe function
 *
 * @example
 * ```ts
 * const unsubscribe = onAuthStateChange((event, session) => {
 *   if (event === 'SIGNED_IN') {
 *     console.log('User signed in:', session?.user);
 *   }
 * });
 *
 * // Clean up when component unmounts
 * return () => unsubscribe();
 * ```
 */
export const onAuthStateChange = (
  callback: (
    event: 'SIGNED_IN' | 'SIGNED_OUT' | 'TOKEN_REFRESHED' | 'USER_UPDATED',
    session: any
  ) => void
) => {
  const {
    data: { subscription },
  } = supabase.auth.onAuthStateChange(callback);

  return () => subscription.unsubscribe();
};

/**
 * Helper to get the current user's ID
 *
 * @returns Current user ID or null
 *
 * @example
 * ```ts
 * const userId = await getCurrentUserId();
 * if (userId) {
 *   // User is authenticated
 * }
 * ```
 */
export const getCurrentUserId = async (): Promise<string | null> => {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user?.id ?? null;
};

/**
 * Helper to check if user is authenticated
 *
 * @returns True if user is authenticated
 *
 * @example
 * ```ts
 * if (await isAuthenticated()) {
 *   // Show authenticated content
 * }
 * ```
 */
export const isAuthenticated = async (): Promise<boolean> => {
  const {
    data: { session },
  } = await supabase.auth.getSession();
  return !!session;
};

export default supabase;
