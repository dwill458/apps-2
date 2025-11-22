/**
 * COZY GROWTH - Journal API Service
 * Handles all Supabase operations for journal entries
 */
import { supabase } from '../supabase';
import type { JournalEntry } from '../../types';

export const journalApi = {
  /**
   * Fetch all journal entries for a user
   */
  async getEntries(userId: string): Promise<JournalEntry[]> {
    const { data, error } = await supabase
      .from('journal_entries')
      .select('*')
      .eq('user_id', userId)
      .order('date', { ascending: false });

    if (error) throw error;
    return (data || []).map(mapEntryFromDb);
  },

  /**
   * Create a new journal entry
   */
  async createEntry(entry: Omit<JournalEntry, 'id' | 'createdAt'>): Promise<JournalEntry> {
    const { data, error } = await supabase
      .from('journal_entries')
      .insert([mapEntryToDb(entry)])
      .select()
      .single();

    if (error) throw error;
    return mapEntryFromDb(data);
  },

  /**
   * Update a journal entry
   */
  async updateEntry(entryId: string, updates: Partial<JournalEntry>): Promise<JournalEntry> {
    const { data, error } = await supabase
      .from('journal_entries')
      .update(mapEntryToDb(updates))
      .eq('id', entryId)
      .select()
      .single();

    if (error) throw error;
    return mapEntryFromDb(data);
  },

  /**
   * Delete a journal entry
   */
  async deleteEntry(entryId: string): Promise<void> {
    const { error } = await supabase
      .from('journal_entries')
      .delete()
      .eq('id', entryId);

    if (error) throw error;
  },

  /**
   * Subscribe to journal entry changes for a user (optional)
   */
  subscribeToEntries(
    userId: string,
    callbacks: {
      onInsert?: (entry: JournalEntry) => void;
      onUpdate?: (entry: JournalEntry) => void;
      onDelete?: (entryId: string) => void;
    }
  ): () => void {
    const channel = supabase
      .channel(`journal-${userId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'journal_entries',
          filter: `user_id=eq.${userId}`,
        },
        (payload) => callbacks.onInsert?.(mapEntryFromDb(payload.new))
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'journal_entries',
          filter: `user_id=eq.${userId}`,
        },
        (payload) => callbacks.onUpdate?.(mapEntryFromDb(payload.new))
      )
      .on(
        'postgres_changes',
        {
          event: 'DELETE',
          schema: 'public',
          table: 'journal_entries',
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
// DATA MAPPING HELPERS
// ==========================================

function mapEntryFromDb(dbEntry: any): JournalEntry {
  return {
    id: dbEntry.id,
    userId: dbEntry.user_id,
    date: dbEntry.date,
    content: dbEntry.content,
    type: dbEntry.type,
    linkedGoalId: dbEntry.linked_goal_id,
    linkedStepId: dbEntry.linked_step_id,
    createdAt: dbEntry.created_at,
  };
}

function mapEntryToDb(entry: Partial<JournalEntry>): any {
  const dbEntry: any = {};
  if (entry.userId !== undefined) dbEntry.user_id = entry.userId;
  if (entry.date !== undefined) dbEntry.date = entry.date;
  if (entry.content !== undefined) dbEntry.content = entry.content;
  if (entry.type !== undefined) dbEntry.type = entry.type;
  if (entry.linkedGoalId !== undefined) dbEntry.linked_goal_id = entry.linkedGoalId;
  if (entry.linkedStepId !== undefined) dbEntry.linked_step_id = entry.linkedStepId;
  return dbEntry;
}
