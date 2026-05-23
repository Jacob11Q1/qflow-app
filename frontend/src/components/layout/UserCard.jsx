import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { User, CreditCard, LogOut } from 'lucide-react'

import { supabase } from '@/lib/supabase'
import { useAuth } from '@/hooks/useAuth'

/** Build up-to-two-letter initials from a name (or fall back to an email). */
function initialsFrom(name, email) {
  const source = (name || '').trim()
  if (source) {
    const parts = source.split(/\s+/)
    return (parts[0][0] + (parts[1]?.[0] ?? '')).toUpperCase()
  }
  return (email?.[0] ?? '?').toUpperCase()
}

export default function UserCard({ onNavigate }) {
  const navigate = useNavigate()
  const { user, signOut } = useAuth()
  const [profile, setProfile] = useState(null)
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  // Pull full_name + plan from the profiles table; fall back to auth metadata.
  useEffect(() => {
    if (!user) return
    let active = true
    supabase
      .from('profiles')
      .select('full_name, plan')
      .eq('id', user.id)
      .maybeSingle()
      .then(({ data }) => {
        if (active && data) setProfile(data)
      })
    return () => {
      active = false
    }
  }, [user])

  // Close the dropdown on any outside click.
  useEffect(() => {
    function handleClick(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    if (open) document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [open])

  const fullName =
    profile?.full_name || user?.user_metadata?.full_name || user?.email || 'Account'
  const plan = (profile?.plan || 'free').toUpperCase()
  const initials = initialsFrom(
    profile?.full_name || user?.user_metadata?.full_name,
    user?.email,
  )

  function go(path) {
    setOpen(false)
    onNavigate?.()
    navigate(path)
  }

  async function handleSignOut() {
    setOpen(false)
    try {
      await signOut()
    } finally {
      navigate('/login', { replace: true })
    }
  }

  return (
    <div ref={ref} className="relative border-t border-qf-border p-3">
      {open ? (
        <div
          role="menu"
          className="absolute bottom-[calc(100%-0.25rem)] left-3 right-3 mb-1 overflow-hidden rounded-xl border border-qf-border2 bg-qf-surface2 py-1 shadow-xl shadow-black/40"
        >
          <button
            type="button"
            role="menuitem"
            onClick={() => go('/app/settings')}
            className="flex w-full items-center gap-2.5 px-3 py-2 text-sm text-qf-text2 transition-colors hover:bg-[rgba(255,255,255,0.04)] hover:text-qf-text"
          >
            <User size={15} /> Profile
          </button>
          <button
            type="button"
            role="menuitem"
            onClick={() => go('/app/settings')}
            className="flex w-full items-center gap-2.5 px-3 py-2 text-sm text-qf-text2 transition-colors hover:bg-[rgba(255,255,255,0.04)] hover:text-qf-text"
          >
            <CreditCard size={15} /> Billing
          </button>
          <div className="my-1 h-px bg-qf-border" />
          <button
            type="button"
            role="menuitem"
            onClick={handleSignOut}
            className="flex w-full items-center gap-2.5 px-3 py-2 text-sm text-qf-text2 transition-colors hover:bg-[rgba(255,255,255,0.04)] hover:text-qf-red"
          >
            <LogOut size={15} /> Sign out
          </button>
        </div>
      ) : null}

      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={open}
        className="flex w-full items-center gap-3 rounded-lg p-2 text-left transition-colors hover:bg-[rgba(255,255,255,0.03)]"
      >
        <span
          aria-hidden="true"
          className="grid h-[34px] w-[34px] shrink-0 place-items-center rounded-full bg-gradient-to-br from-qf-cyan to-qf-purple font-mono text-xs font-semibold text-qf-bg"
        >
          {initials}
        </span>
        <span className="min-w-0 flex-1">
          <span className="block truncate text-[13px] font-medium text-qf-text">
            {fullName}
          </span>
          <span className="font-mono text-[10px] tracking-wide text-qf-cyan">{plan}</span>
        </span>
      </button>
    </div>
  )
}
