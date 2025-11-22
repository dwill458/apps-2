/**
 * COZY GROWTH - Supabase Database Types
 *
 * This file contains TypeScript type definitions for the Supabase database schema.
 *
 * To regenerate these types from your Supabase project:
 * npx supabase gen types typescript --project-id YOUR_PROJECT_ID > src/lib/database.types.ts
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          name: string
          email: string
          avatar_character: string
          avatar_color: string
          reminder_intensity: string
          daily_goal_minutes: number
          onboarding_completed: boolean
          grace_blooms: number
          bloom_points: number
          total_days_showed_up: number
          longest_streak: number
          current_streak: number
          last_active_date: string | null
          created_at: string
          settings: Json
        }
        Insert: {
          id?: string
          name: string
          email: string
          avatar_character?: string
          avatar_color?: string
          reminder_intensity?: string
          daily_goal_minutes?: number
          onboarding_completed?: boolean
          grace_blooms?: number
          bloom_points?: number
          total_days_showed_up?: number
          longest_streak?: number
          current_streak?: number
          last_active_date?: string | null
          created_at?: string
          settings?: Json
        }
        Update: {
          id?: string
          name?: string
          email?: string
          avatar_character?: string
          avatar_color?: string
          reminder_intensity?: string
          daily_goal_minutes?: number
          onboarding_completed?: boolean
          grace_blooms?: number
          bloom_points?: number
          total_days_showed_up?: number
          longest_streak?: number
          current_streak?: number
          last_active_date?: string | null
          created_at?: string
          settings?: Json
        }
      }
      goals: {
        Row: {
          id: string
          user_id: string
          title: string
          description: string | null
          plant_type: string
          plant_stage: number
          status: string
          total_steps: number
          completed_steps: number
          estimated_hours: number
          created_at: string
          completed_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          description?: string | null
          plant_type: string
          plant_stage?: number
          status?: string
          total_steps: number
          completed_steps?: number
          estimated_hours: number
          created_at?: string
          completed_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          description?: string | null
          plant_type?: string
          plant_stage?: number
          status?: string
          total_steps?: number
          completed_steps?: number
          estimated_hours?: number
          created_at?: string
          completed_at?: string | null
        }
      }
      micro_tasks: {
        Row: {
          id: string
          goal_id: string
          parent_step_id: string | null
          title: string
          description: string | null
          duration_minutes: number
          difficulty: string
          spicy_flag: boolean
          order_index: number
          status: string
          completed_at: string | null
          created_at: string
        }
        Insert: {
          id?: string
          goal_id: string
          parent_step_id?: string | null
          title: string
          description?: string | null
          duration_minutes: number
          difficulty: string
          spicy_flag?: boolean
          order_index: number
          status?: string
          completed_at?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          goal_id?: string
          parent_step_id?: string | null
          title?: string
          description?: string | null
          duration_minutes?: number
          difficulty?: string
          spicy_flag?: boolean
          order_index?: number
          status?: string
          completed_at?: string | null
          created_at?: string
        }
      }
      completions: {
        Row: {
          id: string
          micro_task_id: string
          user_id: string
          timestamp: string
          duration_actual_minutes: number
          chain_count: number
          bloom_points_earned: number
        }
        Insert: {
          id?: string
          micro_task_id: string
          user_id: string
          timestamp?: string
          duration_actual_minutes: number
          chain_count?: number
          bloom_points_earned: number
        }
        Update: {
          id?: string
          micro_task_id?: string
          user_id?: string
          timestamp?: string
          duration_actual_minutes?: number
          chain_count?: number
          bloom_points_earned?: number
        }
      }
      journal_entries: {
        Row: {
          id: string
          user_id: string
          date: string
          content: string
          type: string
          linked_goal_id: string | null
          linked_step_id: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          date: string
          content: string
          type: string
          linked_goal_id?: string | null
          linked_step_id?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          date?: string
          content?: string
          type?: string
          linked_goal_id?: string | null
          linked_step_id?: string | null
          created_at?: string
        }
      }
      streak_logs: {
        Row: {
          id: string
          user_id: string
          date: string
          did_show_up: boolean
          tasks_completed: number
          total_minutes: number
        }
        Insert: {
          id?: string
          user_id: string
          date: string
          did_show_up: boolean
          tasks_completed?: number
          total_minutes?: number
        }
        Update: {
          id?: string
          user_id?: string
          date?: string
          did_show_up?: boolean
          tasks_completed?: number
          total_minutes?: number
        }
      }
      badges: {
        Row: {
          id: string
          user_id: string
          badge_name: string
          badge_type: string
          description: string
          icon: string
          unlocked_at: string
        }
        Insert: {
          id?: string
          user_id: string
          badge_name: string
          badge_type: string
          description: string
          icon: string
          unlocked_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          badge_name?: string
          badge_type?: string
          description?: string
          icon?: string
          unlocked_at?: string
        }
      }
      learning_patterns: {
        Row: {
          id: string
          user_id: string
          pattern_type: string
          pattern_data: Json
          occurrences: number
          last_suggested_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          pattern_type: string
          pattern_data: Json
          occurrences?: number
          last_suggested_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          pattern_type?: string
          pattern_data?: Json
          occurrences?: number
          last_suggested_at?: string | null
        }
      }
      grace_bloom_uses: {
        Row: {
          id: string
          user_id: string
          used_date: string
          streak_protected: number
          timestamp: string
        }
        Insert: {
          id?: string
          user_id: string
          used_date: string
          streak_protected: number
          timestamp?: string
        }
        Update: {
          id?: string
          user_id?: string
          used_date?: string
          streak_protected?: number
          timestamp?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      increment_bloom_points: {
        Args: {
          p_user_id: string
          p_points: number
        }
        Returns: void
      }
      spend_bloom_points: {
        Args: {
          p_user_id: string
          p_points: number
        }
        Returns: void
      }
      use_grace_bloom: {
        Args: {
          p_user_id: string
        }
        Returns: void
      }
    }
    Enums: {
      [_ in never]: never
    }
  }
}
