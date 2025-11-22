/**
 * COZY GROWTH - Sync Store
 * Handles offline changes, sync status, and conflict resolution
 */
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type SyncStatus = 'idle' | 'syncing' | 'error';

export type PendingChange = {
  id: string;
  timestamp: number;
  operation: 'create' | 'update' | 'delete';
  entity: 'goal' | 'task' | 'journal' | 'streak' | 'badge';
  data: any;
  retryCount: number;
};

interface SyncState {
  status: SyncStatus;
  lastSync: number | null;
  error: string | null;
  pendingChanges: PendingChange[];
  isOnline: boolean;

  // Sync status management
  setSyncStatus: (status: SyncStatus) => void;
  setLastSync: (timestamp: number) => void;
  setError: (error: string | null) => void;
  setOnlineStatus: (isOnline: boolean) => void;

  // Pending changes queue
  queueChange: (change: Omit<PendingChange, 'id' | 'timestamp' | 'retryCount'>) => void;
  removeChange: (changeId: string) => void;
  incrementRetryCount: (changeId: string) => void;
  clearPendingChanges: () => void;

  // Retry logic
  processPendingChanges: () => Promise<void>;
  retryFailedChanges: () => Promise<void>;
}

export const useSyncStore = create<SyncState>()(
  persist(
    (set, get) => ({
      status: 'idle',
      lastSync: null,
      error: null,
      pendingChanges: [],
      isOnline: typeof navigator !== 'undefined' ? navigator.onLine : true,

      // ========== STATUS MANAGEMENT ==========
      setSyncStatus: (status) => set({ status }),

      setLastSync: (timestamp) => set({ lastSync: timestamp }),

      setError: (error) => set({ error, status: error ? 'error' : 'idle' }),

      setOnlineStatus: (isOnline) => {
        set({ isOnline });
        // If we just came back online, process pending changes
        if (isOnline && get().pendingChanges.length > 0) {
          get().processPendingChanges();
        }
      },

      // ========== PENDING CHANGES QUEUE ==========
      queueChange: (change) => {
        const newChange: PendingChange = {
          ...change,
          id: `change-${Date.now()}-${Math.random()}`,
          timestamp: Date.now(),
          retryCount: 0,
        };

        set((state) => ({
          pendingChanges: [...state.pendingChanges, newChange],
        }));

        // If online, try to process immediately
        if (get().isOnline) {
          get().processPendingChanges();
        }
      },

      removeChange: (changeId) => {
        set((state) => ({
          pendingChanges: state.pendingChanges.filter((c) => c.id !== changeId),
        }));
      },

      incrementRetryCount: (changeId) => {
        set((state) => ({
          pendingChanges: state.pendingChanges.map((c) =>
            c.id === changeId ? { ...c, retryCount: c.retryCount + 1 } : c
          ),
        }));
      },

      clearPendingChanges: () => set({ pendingChanges: [] }),

      // ========== SYNC PROCESSING ==========
      processPendingChanges: async () => {
        const state = get();

        if (!state.isOnline || state.status === 'syncing' || state.pendingChanges.length === 0) {
          return;
        }

        set({ status: 'syncing', error: null });

        const changes = [...state.pendingChanges];
        const failedChanges: PendingChange[] = [];

        for (const change of changes) {
          try {
            // Process the change based on entity type
            // This would call the appropriate API methods
            // For now, we'll just simulate success
            await new Promise((resolve) => setTimeout(resolve, 100));

            // Remove successfully processed change
            get().removeChange(change.id);
          } catch (error: any) {
            console.error(`Failed to sync change ${change.id}:`, error);

            // Increment retry count
            get().incrementRetryCount(change.id);

            // If retry count exceeds threshold, move to failed
            if (change.retryCount >= 3) {
              failedChanges.push(change);
            }
          }
        }

        if (failedChanges.length > 0) {
          set({
            status: 'error',
            error: `Failed to sync ${failedChanges.length} change(s)`,
          });
        } else {
          set({
            status: 'idle',
            lastSync: Date.now(),
            error: null,
          });
        }
      },

      retryFailedChanges: async () => {
        const state = get();
        const failedChanges = state.pendingChanges.filter((c) => c.retryCount >= 3);

        // Reset retry counts for failed changes
        set((state) => ({
          pendingChanges: state.pendingChanges.map((c) =>
            failedChanges.includes(c) ? { ...c, retryCount: 0 } : c
          ),
        }));

        // Try processing again
        await get().processPendingChanges();
      },
    }),
    {
      name: 'cozy-sync-storage',
      partialize: (state) => ({
        // Only persist pending changes and last sync time
        pendingChanges: state.pendingChanges,
        lastSync: state.lastSync,
      }),
    }
  )
);

// ========== ONLINE/OFFLINE LISTENER ==========
// Set up online/offline event listeners
if (typeof window !== 'undefined') {
  window.addEventListener('online', () => {
    useSyncStore.getState().setOnlineStatus(true);
  });

  window.addEventListener('offline', () => {
    useSyncStore.getState().setOnlineStatus(false);
  });
}

// ========== HELPER FUNCTIONS ==========

/**
 * Get a human-readable sync status message
 */
export function getSyncStatusMessage(state: SyncState): string {
  if (!state.isOnline) {
    return 'Offline - Changes will sync when online';
  }

  if (state.status === 'syncing') {
    return 'Syncing...';
  }

  if (state.status === 'error' && state.error) {
    return `Sync error: ${state.error}`;
  }

  if (state.lastSync) {
    const timeSince = Date.now() - state.lastSync;
    const minutes = Math.floor(timeSince / 60000);

    if (minutes < 1) {
      return 'Synced just now';
    } else if (minutes < 60) {
      return `Synced ${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    } else {
      const hours = Math.floor(minutes / 60);
      return `Synced ${hours} hour${hours > 1 ? 's' : ''} ago`;
    }
  }

  return 'Ready to sync';
}

/**
 * Get a sync status color for UI
 */
export function getSyncStatusColor(state: SyncState): 'green' | 'yellow' | 'red' | 'gray' {
  if (!state.isOnline) return 'gray';
  if (state.status === 'error') return 'red';
  if (state.status === 'syncing') return 'yellow';
  if (state.pendingChanges.length > 0) return 'yellow';
  return 'green';
}
