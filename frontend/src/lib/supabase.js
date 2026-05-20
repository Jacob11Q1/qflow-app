import { createClient } from '@supabase/supabase-js'

// Vite exposes only variables prefixed with VITE_ to the client bundle.
// These are read from frontend/.env.local (see .env.example).
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  // Fail loud in dev, but don't crash the whole app at import time.
  console.warn(
    '[QFLOW] Missing Supabase env vars. Set VITE_SUPABASE_URL and ' +
      'VITE_SUPABASE_ANON_KEY in frontend/.env.local',
  )
}

export const supabase = createClient(supabaseUrl ?? '', supabaseAnonKey ?? '', {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
})
