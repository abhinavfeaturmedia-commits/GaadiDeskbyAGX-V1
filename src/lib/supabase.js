import { createClient } from '@supabase/supabase-js';

const env = (typeof import.meta !== 'undefined' && import.meta.env) ? import.meta.env : (typeof process !== 'undefined' && process.env ? process.env : {});

const supabaseUrl = env.VITE_SUPABASE_URL || 'https://xbeivqsjwjjrmxshyobv.supabase.co';
const supabaseAnonKey = env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhiZWl2cXNqd2pqcm14c2h5b2J2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODgwNzk4NTEsImV4cCI6MjEwMzY1NTg1MX0.7kKsTFeloOzfiWVMV5IJXhxql0grOmN2ueo0sKhM4kw';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: false
  }
});

/**
 * Checks connectivity with the Supabase PostgreSQL database
 * @returns {Promise<{ isConnected: boolean, error: string | null }>}
 */
export async function checkSupabaseHealth() {
  try {
    const { error } = await supabase.from('businesses').select('id').limit(1);
    if (error) {
      console.warn('[Supabase Health Check Warning]:', error.message);
      return { isConnected: false, error: error.message };
    }
    return { isConnected: true, error: null };
  } catch (err) {
    console.error('[Supabase Health Check Error]:', err);
    return { isConnected: false, error: err?.message || 'Unknown network error' };
  }
}
