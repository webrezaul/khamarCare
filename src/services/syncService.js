// KhamarCare — Hybrid Sync Engine
// Handles bidirectional sync between Dexie (Local) and Supabase (Cloud)

import db from '../db/database.js';
import { supabase } from '../stores/supabaseClient.js';
import useAuthStore from '../stores/useAuthStore.js';
import { create } from 'zustand';

// Sync Status Store
export const useSyncStore = create((set) => ({
  isSyncing: false,
  lastSync: null,
  pendingChanges: 0,
  syncErrors: [],

  setSyncState: (state) => set((prev) => ({ ...prev, ...state })),
}));

/**
 * Triggers a full bidirectional sync
 */
export async function triggerSync() {
  const syncStore = useSyncStore.getState();
  if (syncStore.isSyncing) return;

  const farm = useAuthStore.getState().farm;
  if (!farm || !farm.id) return;

  syncStore.setSyncState({ isSyncing: true, syncErrors: [] });

  try {
    // 1. PUSH local changes to Cloud
    await pushLocalChanges(farm.id);

    // 2. PULL remote changes from Cloud
    await pullRemoteChanges(farm.id);

    syncStore.setSyncState({
      isSyncing: false,
      lastSync: new Date().toISOString(),
      pendingChanges: 0,
    });
  } catch (error) {
    console.error('Sync failed:', error);
    syncStore.setSyncState({
      isSyncing: false,
      syncErrors: [...syncStore.syncErrors, error.message],
    });
  }
}

/**
 * Pushes locally modified records to Supabase
 */
async function pushLocalChanges(farmId) {
  // In a real implementation, you would track `sync_status = 'pending'` or `updated_at > last_sync_time`
  // For this MVP, we will simulate pushing local cattle data
  const localCattle = await db.animals.where('farmId').equals(farmId).toArray();
  
  // Since we don't have a real Supabase DB configured yet, this will fail gracefully or we can mock it
  if (supabase.supabaseUrl === 'https://placeholder-url.supabase.co') {
    console.log('[Simulated Sync] Pushing data to cloud...');
    await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate network latency
    return;
  }

  // Real implementation example:
  const { error } = await supabase.from('cattle').upsert(localCattle, { onConflict: 'id' });
  if (error) throw error;
}

/**
 * Pulls modified records from Supabase into Dexie
 */
async function pullRemoteChanges(farmId) {
  if (supabase.supabaseUrl === 'https://placeholder-url.supabase.co') {
    console.log('[Simulated Sync] Pulling data from cloud...');
    await new Promise(resolve => setTimeout(resolve, 1500));
    return;
  }

  // Real implementation example:
  const { data: remoteCattle, error } = await supabase
    .from('cattle')
    .select('*')
    .eq('farm_id', farmId);
    
  if (error) throw error;

  if (remoteCattle && remoteCattle.length > 0) {
    await db.animals.bulkPut(remoteCattle);
  }
}

// Background Auto-Sync Worker
let syncInterval = null;

export function startAutoSync(intervalMs = 60000) { // Default 1 minute
  if (syncInterval) clearInterval(syncInterval);
  syncInterval = setInterval(() => {
    triggerSync();
  }, intervalMs);
}

export function stopAutoSync() {
  if (syncInterval) {
    clearInterval(syncInterval);
    syncInterval = null;
  }
}
