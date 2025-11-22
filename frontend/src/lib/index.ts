/**
 * COZY GROWTH - Library Index
 * Central export point for Supabase client and API services
 */

// Export Supabase client and helpers
export { supabase, onAuthStateChange, getCurrentUserId, isAuthenticated } from './supabase';

// Export all API services
export * from './api';

// Export database types
export type { Database } from './database.types';
