import { supabase } from '@/lib/supabase'

const BASE = import.meta.env.VITE_API_URL || 'http://localhost:3001'

/**
 * request — call the QFLOW backend, attaching the current Supabase access
 * token as a Bearer header when a session exists.
 * @param {string} method
 * @param {string} path   e.g. '/api/proposals'
 * @param {object} [body]
 */
async function request(method, path, body) {
  const {
    data: { session },
  } = await supabase.auth.getSession()
  const token = session?.access_token

  const res = await fetch(BASE + path, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: 'Bearer ' + token } : {}),
    },
    ...(body ? { body: JSON.stringify(body) } : {}),
  })

  if (!res.ok) throw new Error(await res.text())
  return res.json()
}

export const api = {
  get: (path) => request('GET', path),
  post: (path, body) => request('POST', path, body),
  put: (path, body) => request('PUT', path, body),
  delete: (path) => request('DELETE', path),
}
