import { createClient } from '@supabase/supabase-js';
import useFarmStore from './useFarmStore.js';

// Since the user is testing locally, these are placeholders for now.
// In a real environment, they would be in .env files (VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY).
// We'll read from local settings first in case the user configures them dynamically.

export const createSupabaseClient = () => {
  const settings = useFarmStore.getState().settings;
  const url = settings?.supabaseUrl || import.meta.env.VITE_SUPABASE_URL || 'https://placeholder-url.supabase.co';
  const key = settings?.supabaseKey || import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder-key';

  return createClient(url, key);
};

export const supabase = createSupabaseClient();
