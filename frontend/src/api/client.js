import { supabase } from '@/lib/supabase'

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8080'

/**
 * apiFetch — thin wrapper around fetch that targets the QFLOW backend
 * and automatically attaches the Supabase access token (if signed in).
 *
 * @param {string} path  e.g. '/health'
 * @param {RequestInit} [options]
 */
export async function apiFetch(path, options = {}) {
  const {
    data: { session },
  } = await supabase.auth.getSession()

  const headers = {
    'Content-Type': 'application/json',
    ...(session?.access_token
      ? { Authorization: `Bearer ${session.access_token}` }
      : {}),
    ...options.headers,
  }

  const res = await fetch(`${API_URL}${path}`, { ...options, headers })

  if (!res.ok) {
    const body = await res.text()
    throw new Error(`API ${res.status}: ${body || res.statusText}`)
  }

  return res.status === 204 ? null : res.json()
}
