import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import { supabase } from '@/lib/supabase'

export default function Signup() {
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { full_name: name } },
      })
      if (error) throw error
      navigate('/app/dashboard')
    } catch (err) {
      setError(err.message ?? 'Unable to create account.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="grid min-h-screen place-items-center bg-qf-bg px-6 text-qf-text">
      <div className="w-full max-w-sm">
        <Link to="/" className="block text-center font-heading text-2xl qf-gradient-text">
          QFLOW
        </Link>
        <h1 className="mt-8 text-center text-2xl">Create your workspace</h1>
        <p className="mt-1 text-center text-sm text-qf-text2">Start running your dev business.</p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          <div>
            <label className="qf-label mb-1.5 block" htmlFor="name">
              Full name
            </label>
            <input
              id="name"
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-lg border border-qf-border2 bg-qf-surface px-3 py-2.5 text-sm outline-none placeholder:text-qf-text3 focus:border-qf-cyan"
              placeholder="Jordan Dev"
            />
          </div>
          <div>
            <label className="qf-label mb-1.5 block" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border border-qf-border2 bg-qf-surface px-3 py-2.5 text-sm outline-none placeholder:text-qf-text3 focus:border-qf-cyan"
              placeholder="you@studio.dev"
            />
          </div>
          <div>
            <label className="qf-label mb-1.5 block" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              type="password"
              required
              minLength={8}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg border border-qf-border2 bg-qf-surface px-3 py-2.5 text-sm outline-none placeholder:text-qf-text3 focus:border-qf-cyan"
              placeholder="At least 8 characters"
            />
          </div>

          {error ? <p className="text-sm text-qf-red">{error}</p> : null}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-qf-cyan py-2.5 font-medium text-qf-bg hover:opacity-90 disabled:opacity-50"
          >
            {loading ? 'Creating…' : 'Create account'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-qf-text2">
          Already have an account?{' '}
          <Link to="/login" className="text-qf-cyan hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </div>
  )
}
