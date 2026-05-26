import { createClient } from '@supabase/supabase-js'

// Vite exposes only variables prefixed with VITE_ to the client bundle.
// These are read from frontend/.env.local (see .env.example).
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// The placeholder values shipped in .env.example / .env.local.
const PLACEHOLDER_URL = 'https://your-project-ref.supabase.co'
const PLACEHOLDER_KEY = 'your-anon-public-key'

/**
 * True only when real Supabase credentials are present (not blank, not the
 * shipped placeholders). Drives the local dev auth-bypass in useAuth.
 */
export function isSupabaseConfigured() {
  return Boolean(
    supabaseUrl &&
      supabaseAnonKey &&
      supabaseUrl !== PLACEHOLDER_URL &&
      supabaseAnonKey !== PLACEHOLDER_KEY,
  )
}

if (!isSupabaseConfigured()) {
  console.warn(
    '[QFLOW] Supabase is not configured. Set VITE_SUPABASE_URL and ' +
      'VITE_SUPABASE_ANON_KEY in frontend/.env.local to enable real auth. ' +
      'Until then, local dev uses the auth bypass so /app is viewable.',
  )
}

// Always pass syntactically valid args so createClient never throws and
// white-screens the app when env is missing or still placeholder.
export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder-anon-key',
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  },
)
