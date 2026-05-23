import {
  LayoutDashboard,
  FileText,
  AlertTriangle,
  Users,
  FileSignature,
  Receipt,
  TrendingUp,
  Settings,
} from 'lucide-react'

import Logo from '@/components/Logo'
import NavItem from '@/components/ui/NavItem'
import UserCard from '@/components/layout/UserCard'

/**
 * Badge counts. Placeholder demo values for the shell — wire these to real
 * queries (open proposals, unresolved scope-creep alerts) once those land.
 */
const badges = {
  proposals: 3,
  scopeCreepAlerts: 2,
}

const SECTIONS = [
  {
    label: 'Workspace',
    items: [
      { to: '/app/dashboard', label: 'Dashboard', icon: LayoutDashboard },
      { to: '/app/proposals', label: 'Proposals', icon: FileText, badge: badges.proposals },
      {
        to: '/app/scope-creep',
        label: 'Scope Creep',
        icon: AlertTriangle,
        badge: badges.scopeCreepAlerts,
        danger: true,
      },
      { to: '/app/clients', label: 'Clients', icon: Users },
      { to: '/app/contracts', label: 'Contracts', icon: FileSignature },
      { to: '/app/invoices', label: 'Invoices', icon: Receipt },
    ],
  },
  {
    label: 'Analytics',
    items: [{ to: '/app/revenue', label: 'Revenue', icon: TrendingUp }],
  },
  {
    label: 'Account',
    items: [{ to: '/app/settings', label: 'Settings', icon: Settings }],
  },
]

export default function Sidebar({ onNavigate }) {
  return (
    <div className="flex h-full flex-col bg-qf-surface">
      {/* Brand */}
      <div className="flex items-baseline gap-2 px-5 py-5">
        <Logo className="text-[22px]" />
        <span className="font-mono text-[10px] text-qf-text3">v1.0.0-beta</span>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-2">
        {SECTIONS.map((section) => (
          <div key={section.label} className="mb-4">
            <p className="px-5 pb-2 text-[9px] font-semibold uppercase tracking-[2px] text-qf-text3">
              {section.label}
            </p>
            <div className="flex flex-col">
              {section.items.map((item) => (
                <NavItem key={item.to} {...item} onNavigate={onNavigate} />
              ))}
            </div>
          </div>
        ))}
      </nav>

      {/* User */}
      <UserCard onNavigate={onNavigate} />
    </div>
  )
}
