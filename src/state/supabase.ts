import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient, type Session } from '@supabase/supabase-js';

const url = process.env.EXPO_PUBLIC_SUPABASE_URL;
const anonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

if (!url || !anonKey) {
  // Fail loudly in dev. In prod we still create a noop-ish client so the
  // app loads — sync just becomes a no-op.
  // eslint-disable-next-line no-console
  console.warn(
    '[supabase] Missing EXPO_PUBLIC_SUPABASE_URL or EXPO_PUBLIC_SUPABASE_ANON_KEY. ' +
      'Backend sync will be disabled.',
  );
}

export const supabase = createClient(url ?? 'https://placeholder.supabase.co', anonKey ?? 'placeholder-anon-key', {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

export const supabaseEnabled = Boolean(url && anonKey);

// Sign in anonymously if there's no session yet, then return the session.
export async function ensureSession(): Promise<Session | null> {
  if (!supabaseEnabled) return null;
  const { data } = await supabase.auth.getSession();
  if (data.session) return data.session;
  const { data: anon, error } = await supabase.auth.signInAnonymously();
  if (error) {
    // eslint-disable-next-line no-console
    console.warn('[supabase] anonymous sign-in failed:', error.message);
    return null;
  }
  return anon.session;
}
