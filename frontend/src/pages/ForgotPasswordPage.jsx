import { useState } from 'react'
import { Link } from 'react-router-dom'
import { AlertCircle, Loader2, MailCheck, ArrowLeft } from 'lucide-react'

import { resetPassword, authErrorMessage } from '@/lib/auth'
import AuthShell from '@/components/AuthShell'

const inputClass =
  'w-full rounded-lg border border-qf-border2 bg-qf-bg px-3.5 py-2.5 text-sm text-qf-text outline-none transition placeholder:text-qf-text3 focus:border-qf-cyan focus:ring-2 focus:ring-qf-cyan/30'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    if (loading) return
    setError('')
    setLoading(true)
    try {
      await resetPassword(email)
      setSent(true)
    } catch (err) {
      setError(authErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }

  if (sent) {
    return (
      <AuthShell
        title="Check your email"
        subtitle={`If an account exists for ${email}, a reset link is on its way.`}
        footer={
          <Link to="/login" className="text-qf-cyan hover:underline">
            Back to login
          </Link>
        }
      >
        <div className="flex flex-col items-center gap-3 py-4 text-center">
          <MailCheck size={40} className="text-qf-green" />
          <p className="text-sm text-qf-text2">
            Follow the link in the email to set a new password. It may take a minute to arrive.
          </p>
        </div>
      </AuthShell>
    )
  }

  return (
    <AuthShell
      title="Reset your password"
      subtitle="Enter your email and we’ll send you a reset link."
      footer={
        <Link
          to="/login"
          className="inline-flex items-center gap-1.5 text-qf-cyan hover:underline"
        >
          <ArrowLeft size={14} /> Back to login
        </Link>
      }
    >
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
            aria-describedby={error ? 'reset-error' : undefined}
            className={inputClass}
            placeholder="you@studio.dev"
          />
        </div>

        {error ? (
          <p
            id="reset-error"
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
              <Loader2 size={18} className="animate-spin" /> Sending…
            </>
          ) : (
            'Send reset link'
          )}
        </button>
      </form>
    </AuthShell>
  )
}
