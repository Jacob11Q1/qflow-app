import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { AlertCircle, Loader2 } from 'lucide-react'

import { signIn, signInWithGoogle, authErrorMessage } from '@/lib/auth'
import AuthShell from '@/components/AuthShell'
import GoogleButton from '@/components/GoogleButton'

const inputClass =
  'w-full rounded-lg border border-qf-border2 bg-qf-bg px-3.5 py-2.5 text-sm text-qf-text outline-none transition placeholder:text-qf-text3 focus:border-qf-cyan focus:ring-2 focus:ring-qf-cyan/30'

export default function LoginPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const from = location.state?.from?.pathname || '/app/dashboard'

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    if (loading) return // prevent double-submit
    setError('')
    setLoading(true)
    try {
      await signIn(email, password)
      navigate(from, { replace: true })
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
      await signInWithGoogle() // redirects away on success
    } catch (err) {
      setError(authErrorMessage(err))
      setLoading(false)
    }
  }

  return (
    <AuthShell
      title="Welcome back"
      subtitle="Log in to your QFLOW workspace."
      footer={
        <>
          New to QFLOW?{' '}
          <Link to="/signup" className="text-qf-cyan hover:underline">
            Create an account
          </Link>
        </>
      }
    >
      <GoogleButton onClick={handleGoogle} disabled={loading} />

      <div className="my-5 flex items-center gap-3 text-qf-text3">
        <span className="h-px flex-1 bg-qf-border" />
        <span className="text-xs uppercase tracking-wider">or</span>
        <span className="h-px flex-1 bg-qf-border" />
      </div>

      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
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
            aria-invalid={Boolean(error)}
            className={inputClass}
            placeholder="you@studio.dev"
          />
        </div>

        <div>
          <div className="mb-1.5 flex items-center justify-between">
            <label htmlFor="password" className="qf-label">
              Password
            </label>
            <Link to="/forgot-password" className="text-xs text-qf-text2 hover:text-qf-cyan">
              Forgot?
            </Link>
          </div>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            aria-invalid={Boolean(error)}
            aria-describedby={error ? 'login-error' : undefined}
            className={inputClass}
            placeholder="••••••••"
          />
        </div>

        {error ? (
          <p
            id="login-error"
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
              <Loader2 size={18} className="animate-spin" /> Signing in…
            </>
          ) : (
            'Log in'
          )}
        </button>
      </form>
    </AuthShell>
  )
}
