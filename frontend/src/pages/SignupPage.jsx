import { useState, useMemo } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AlertCircle, CheckCircle2, Loader2 } from 'lucide-react'

import { signUp, signInWithGoogle, authErrorMessage } from '@/lib/auth'
import { scorePassword } from '@/lib/password'
import AuthShell from '@/components/AuthShell'
import GoogleButton from '@/components/GoogleButton'

const inputClass =
  'w-full rounded-lg border border-qf-border2 bg-qf-bg px-3.5 py-2.5 text-sm text-qf-text outline-none transition placeholder:text-qf-text3 focus:border-qf-cyan focus:ring-2 focus:ring-qf-cyan/30'

export default function SignupPage() {
  const navigate = useNavigate()

  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [emailSent, setEmailSent] = useState(false)

  const strength = useMemo(() => scorePassword(password), [password])
  const mismatch = confirm.length > 0 && confirm !== password

  async function handleSubmit(e) {
    e.preventDefault()
    if (loading) return
    setError('')

    if (password.length < 8) {
      setError('Password must be at least 8 characters.')
      return
    }
    if (password !== confirm) {
      setError('Passwords do not match.')
      return
    }

    setLoading(true)
    try {
      const data = await signUp(email, password, fullName)
      if (data.session) {
        // Email confirmation disabled — straight into the app.
        navigate('/app/dashboard', { replace: true })
      } else {
        // Confirmation required — prompt the user to check their inbox.
        setEmailSent(true)
        setLoading(false)
      }
    } catch (err) {
      setError(authErrorMessage(err))
      setLoading(false)
    }
  }

  async function handleGoogle() {
    if (loading) return
    setError('')
    setLoading(true)
    try {
      await signInWithGoogle()
    } catch (err) {
      setError(authErrorMessage(err))
      setLoading(false)
    }
  }

  if (emailSent) {
    return (
      <AuthShell
        title="Check your email"
        subtitle={`We sent a confirmation link to ${email}.`}
        footer={
          <Link to="/login" className="text-qf-cyan hover:underline">
            Back to login
          </Link>
        }
      >
        <div className="flex flex-col items-center gap-3 py-4 text-center">
          <CheckCircle2 size={40} className="text-qf-green" />
          <p className="text-sm text-qf-text2">
            Click the link in the email to activate your account, then log in.
          </p>
        </div>
      </AuthShell>
    )
  }

  return (
    <AuthShell
      title="Create your workspace"
      subtitle="Start running your dev business with QFLOW."
      footer={
        <>
          Already have an account?{' '}
          <Link to="/login" className="text-qf-cyan hover:underline">
            Log in
          </Link>
        </>
      }
    >
      <GoogleButton onClick={handleGoogle} disabled={loading} label="Sign up with Google" />

      <div className="my-5 flex items-center gap-3 text-qf-text3">
        <span className="h-px flex-1 bg-qf-border" />
        <span className="text-xs uppercase tracking-wider">or</span>
        <span className="h-px flex-1 bg-qf-border" />
      </div>

      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        <div>
          <label htmlFor="fullName" className="qf-label mb-1.5 block">
            Full name
          </label>
          <input
            id="fullName"
            name="fullName"
            type="text"
            autoComplete="name"
            required
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className={inputClass}
            placeholder="Jordan Dev"
          />
        </div>

        <div>
          <label htmlFor="email" className="qf-label mb-1.5 block">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={inputClass}
            placeholder="you@studio.dev"
          />
        </div>

        <div>
          <label htmlFor="password" className="qf-label mb-1.5 block">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="new-password"
            required
            minLength={8}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            aria-describedby="password-strength"
            className={inputClass}
            placeholder="At least 8 characters"
          />

          {/* Strength indicator */}
          <div id="password-strength" className="mt-2" aria-live="polite">
            <div className="flex gap-1.5">
              {[0, 1, 2, 3].map((i) => (
                <span
                  key={i}
                  className="h-1 flex-1 rounded-full bg-qf-border2 transition-colors"
                  style={i < strength.score ? { backgroundColor: strength.color } : undefined}
                />
              ))}
            </div>
            {password ? (
              <p className="mt-1 text-xs" style={{ color: strength.color }}>
                {strength.label}
              </p>
            ) : null}
          </div>
        </div>

        <div>
          <label htmlFor="confirm" className="qf-label mb-1.5 block">
            Confirm password
          </label>
          <input
            id="confirm"
            name="confirm"
            type="password"
            autoComplete="new-password"
            required
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            aria-invalid={mismatch}
            className={inputClass}
            placeholder="Re-enter your password"
          />
          {mismatch ? (
            <p className="mt-1 text-xs text-qf-red">Passwords do not match.</p>
          ) : null}
        </div>

        {error ? (
          <p
            role="alert"
            className="flex items-start gap-2 rounded-lg border border-qf-red/30 bg-qf-red/10 px-3 py-2.5 text-sm text-qf-red"
          >
            <AlertCircle size={16} className="mt-0.5 shrink-0" />
            <span>{error}</span>
          </p>
        ) : null}

        <button
          type="submit"
          disabled={loading}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-qf-cyan py-2.5 font-medium text-qf-bg transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? (
            <>
              <Loader2 size={18} className="animate-spin" /> Creating account…
            </>
          ) : (
            'Create account'
          )}
        </button>
      </form>
    </AuthShell>
  )
}
