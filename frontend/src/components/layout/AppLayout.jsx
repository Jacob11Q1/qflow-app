import { useState, useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import { Menu, X } from 'lucide-react'

import Sidebar from '@/components/layout/Sidebar'
import { cn } from '@/lib/utils'

export default function AppLayout() {
  const [open, setOpen] = useState(false)

  // Lock body scroll while the mobile drawer is open.
  // (Nav clicks close the drawer via Sidebar's onNavigate.)
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  return (
    <div className="min-h-screen bg-qf-bg text-qf-text">
      {/* Mobile toggle — fixed top-left */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? 'Close menu' : 'Open menu'}
        aria-expanded={open}
        className="fixed left-4 top-4 z-[110] grid h-10 w-10 place-items-center rounded-lg border border-qf-border bg-qf-surface text-qf-text transition-colors hover:bg-qf-surface2 lg:hidden"
      >
        {open ? <X size={18} /> : <Menu size={18} />}
      </button>

      {/* Overlay (mobile only) — click outside to close */}
      {open ? (
        <div
          onClick={() => setOpen(false)}
          aria-hidden="true"
          className="fixed inset-0 z-[100] bg-black/50 lg:hidden"
        />
      ) : null}

      {/* Sidebar: fixed 260px, sticky full-height on desktop; slide-in on mobile */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-[100] h-screen w-[260px] border-r border-qf-border',
          'transition-transform duration-200 ease-in-out lg:translate-x-0',
          open ? 'translate-x-0' : '-translate-x-full',
        )}
      >
        <Sidebar onNavigate={() => setOpen(false)} />
      </aside>

      {/* Main panel */}
      <div className="flex min-h-screen flex-col lg:pl-[260px]">
        <main className="flex-1 overflow-y-auto px-5 pb-10 pt-20 sm:px-8 lg:pt-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
