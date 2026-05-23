import { useState, useEffect, useCallback } from 'react'

import {
  getCurrentUser,
  onAuthStateChange,
  signIn as signInHelper,
  signUp as signUpHelper,
  signOut as signOutHelper,
} from '@/lib/auth'

/**
 * useAuth — exposes the current user, a loading flag, and auth actions.
 * Stays in sync via supabase's onAuthStateChange subscription.
 */
export function useAuth() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
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
  const signOut = useCallback(() => signOutHelper(), [])

  return { user, loading, signIn, signUp, signOut }
}
