import { useState, useEffect, useCallback } from 'react'

import { isSupabaseConfigured } from '@/lib/supabase'
import {
  getCurrentUser,
  onAuthStateChange,
  signIn as signInHelper,
  signUp as signUpHelper,
  signOut as signOutHelper,
} from '@/lib/auth'

/**
 * DEV auth bypass — engages ONLY in a local dev build (import.meta.env.DEV)
 * AND only while Supabase is unconfigured. It lets you view /app without a
 * live backend. It turns itself off the instant real creds are added, and
 * is impossible in a production build (DEV is false there).
 */
const DEV_BYPASS = import.meta.env.DEV && !isSupabaseConfigured()
const DEV_USER = {
  id: '00000000-0000-0000-0000-000000000000',
  email: 'dev@qflow.local',
  user_metadata: { full_name: 'Dev User' },
  app_metadata: {},
}

/**
 * useAuth — exposes the current user, a loading flag, and auth actions.
 * Stays in sync via supabase's onAuthStateChange subscription.
 */
export function useAuth() {
  const [user, setUser] = useState(DEV_BYPASS ? DEV_USER : null)
  const [loading, setLoading] = useState(!DEV_BYPASS)

  useEffect(() => {
    if (DEV_BYPASS) return // no backend to talk to; stay signed in as DEV_USER
    let mounted = true

    // Seed from any persisted session.
    getCurrentUser().then((u) => {
      if (!mounted) return
      setUser(u)
      setLoading(false)
    })

    // Keep in sync with sign in / out / token refresh.
    const subscription = onAuthStateChange((nextUser) => {
      if (!mounted) return
      setUser(nextUser)
      setLoading(false)
    })

    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  }, [])

  const signIn = useCallback((email, password) => signInHelper(email, password), [])
  const signUp = useCallback(
    (email, password, fullName) => signUpHelper(email, password, fullName),
    [],
  )
  // In bypass mode there's no session to clear — resolve to a no-op so the
  // sign-out button doesn't throw against the placeholder backend.
  const signOut = useCallback(
    () => (DEV_BYPASS ? Promise.resolve() : signOutHelper()),
    [],
  )

  return { user, loading, signIn, signUp, signOut }
}
