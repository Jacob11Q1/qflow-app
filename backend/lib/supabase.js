// Node 20 has no native global WebSocket, which supabase-js's realtime client
// constructs eagerly. We don't use realtime on the server, but createClient
// still needs a constructor — provide one from the `ws` package.
if (!globalThis.WebSocket) {
  globalThis.WebSocket = require('ws')
}

const { createClient } = require('@supabase/supabase-js')

// Server-side Supabase client using the SERVICE ROLE key. This bypasses RLS,
// so it must never run in the browser — keep SUPABASE_SERVICE_ROLE_KEY in
// backend/.env only. Placeholder fallbacks keep createClient from throwing when
// env is unset during early dev; any real call simply fails (-> 401), which is
// the safe default.
const supabaseUrl = process.env.SUPABASE_URL || 'https://placeholder.supabase.co'
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'placeholder-service-role-key'

const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
  auth: { autoRefreshToken: false, persistSession: false },
})

function isSupabaseConfigured() {
  return Boolean(process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY)
}

module.exports = { supabaseAdmin, isSupabaseConfigured }
