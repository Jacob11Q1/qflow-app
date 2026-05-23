import { supabase } from './supabase'

/**
 * QFLOW auth helpers — thin, throwing wrappers around supabase.auth.
 * Components catch the thrown error and pass it to authErrorMessage()
 * for a user-facing string.
 */

/** Sign in with email + password. Resolves to the session/user data. */
export async function signIn(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) throw error
  return data
}

/**
 * Create an account, then best-effort create the matching `profiles` row.
 * The DB trigger (see supabase/schema.sql) is the source of truth — this
 * client upsert just covers the email-confirmation-disabled flow where a
 * session exists immediately. Profile failures never block signup success.
 */
export async function signUp(email, password, fullName) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { full_name: fullName } },
  })
  if (error) throw error

  if (data.user && data.session) {
    const { error: profileError } = await supabase
      .from('profiles')
      .upsert(
        { id: data.user.id, full_name: fullName, email },
        { onConflict: 'id' },
      )
    if (profileError) {
      console.warn('[QFLOW] profile upsert failed:', profileError.message)
    }
  }

  return data
}

/** Start the Google OAuth redirect flow. */
export async function signInWithGoogle() {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: { redirectTo: `${window.location.origin}/app/dashboard` },
  })
  if (error) throw error
  return data
}

/** Sign the current user out. */
export async function signOut() {
  const { error } = await supabase.auth.signOut()
  if (error) throw error
}

/** Send a password-reset email. */
export async function resetPassword(email) {
  const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/reset-password`,
  })
  if (error) throw error
  return data
}

/** Return the current user, or null if not signed in. */
export async function getCurrentUser() {
  const { data, error } = await supabase.auth.getUser()
  if (error) return null
  return data.user
}

/**
 * Subscribe to auth changes. Calls back with (user, session).
 * Returns the subscription — call `.unsubscribe()` to clean up.
 */
export function onAuthStateChange(callback) {
  const { data } = supabase.auth.onAuthStateChange((_event, session) => {
    callback(session?.user ?? null, session)
  })
  return data.subscription
}

/**
 * Map a Supabase auth error to a friendly message.
 * Note: Supabase intentionally returns the same "Invalid login credentials"
 * for both a wrong password and a non-existent account (prevents account
 * enumeration), so those two cases share one message.
 */
export function authErrorMessage(error) {
  const msg = error?.message || ''
  if (error?.name === 'AuthRetryableFetchError' || /failed to fetch|network/i.test(msg)) {
    return 'Network error — check your connection and try again.'
  }
  if (/invalid login credentials/i.test(msg)) return 'Incorrect email or password.'
  if (/email not confirmed/i.test(msg)) return 'Confirm your email before signing in.'
  if (/already registered|already been registered|user already exists/i.test(msg)) {
    return 'An account with this email already exists.'
  }
  if (/password should be at least|weak|at least 6 characters/i.test(msg)) {
    return 'Password is too weak — use at least 8 characters.'
  }
  if (/rate limit|too many/i.test(msg)) return 'Too many attempts — please wait and try again.'
  return msg || 'Something went wrong. Please try again.'
}
