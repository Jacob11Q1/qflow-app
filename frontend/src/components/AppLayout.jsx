import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard,
  FileText,
  AlertTriangle,
  Users,
  Receipt,
  FileSignature,
  TrendingUp,
  Settings as SettingsIcon,
  LogOut,
} from 'lucide-react'

import { cn } from '@/lib/utils'

const NAV = [
  { to: '/app/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/app/proposals', label: 'Proposals', icon: FileText },
  { to: '/app/scope-creep', label: 'Scope Creep', icon: AlertTriangle },
  { to: '/app/clients', label: 'Clients', icon: Users },
  { to: '/app/invoices', label: 'Invoices', icon: Receipt },
  { to: '/app/contracts', label: 'Contracts', icon: FileSignature },
  { to: '/app/revenue', label: 'Revenue', icon: TrendingUp },
  { to: '/app/settings', label: 'Settings', icon: SettingsIcon },
]

export default function AppLayout() {
  const navigate = useNavigate()

  return (
    <div className="flex min-h-screen bg-qf-bg text-qf-text">
      {/* Sidebar */}
      <aside className="fixed inset-y-0 left-0 flex w-64 flex-col border-r border-qf-border bg-qf-surface">
        <div className="flex h-16 items-center gap-2 border-b border-qf-border px-6">
          <span className="font-heading text-xl tracking-tight qf-gradient-text">QFLOW</span>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
          {NAV.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors',
                  isActive
                    ? 'bg-qf-surface2 text-qf-cyan'
                    : 'text-qf-text2 hover:bg-qf-surface2 hover:text-qf-text',
                )
              }
            >
              <Icon size={18} strokeWidth={1.75} />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="border-t border-qf-border p-3">
          <button
            type="button"
            onClick={() => navigate('/login')}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-qf-text2 transition-colors hover:bg-qf-surface2 hover:text-qf-red"
          >
            <LogOut size={18} strokeWidth={1.75} />
            <span>Sign out</span>
          </button>
        </div>
      </aside>

      {/* Content */}
      <div className="flex flex-1 flex-col pl-64">
        <header className="flex h-16 items-center justify-between border-b border-qf-border bg-qf-surface/60 px-8 backdrop-blur">
          <p className="qf-label">QFLOW · Business OS</p>
          <div className="flex items-center gap-3">
            <span className="qf-label text-qf-text3">v0.1.0</span>
            <div className="grid h-8 w-8 place-items-center rounded-full bg-qf-surface2 font-mono text-xs text-qf-cyan">
              QF
            </div>
          </div>
        </header>

        <main className="flex-1 px-8 py-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
