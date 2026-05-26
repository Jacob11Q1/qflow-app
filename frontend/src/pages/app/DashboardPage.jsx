import {
  AlertTriangle,
  Activity as ActivityIcon,
  DollarSign,
  FileText,
  Receipt,
  Sparkles,
  Zap,
} from 'lucide-react'
import { Link } from 'react-router-dom'

import MetricCard from '@/components/dashboard/MetricCard'
import ProposalsTable from '@/components/dashboard/ProposalsTable'
import { useDashboard } from '@/hooks/useDashboard'
import { formatRelativeTime } from '@/lib/utils'

const MONTH_FORMAT = new Intl.DateTimeFormat('en-US', {
  month: 'long',
  year: 'numeric',
})

/** Activity type → dot colour. */
const ACTIVITY_DOT = {
  proposal: 'bg-qf-cyan',
  payment: 'bg-qf-green',
  scope: 'bg-qf-red',
  contract: 'bg-qf-purple',
  invoice: 'bg-qf-yellow',
}

export default function DashboardPage() {
  const { metrics, recentProposals, activities, loading } = useDashboard()
  const currentMonth = MONTH_FORMAT.format(new Date())

  return (
    <div className="mx-auto max-w-6xl">
      {/* Page header */}
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl font-bold text-qf-text">Dashboard</h1>
          <p className="mt-1 text-sm text-qf-text2">{currentMonth}</p>
        </div>
        <Link
          to="/app/proposals"
          className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-qf-cyan to-qf-purple px-4 py-2.5 text-sm font-semibold text-qf-bg transition-opacity hover:opacity-90"
        >
          <Zap size={16} />
          New Proposal
        </Link>
      </header>

      {/* Metric cards */}
      <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4">
        <MetricCard
          label="Revenue MTD"
          value={metrics.revenueMtd}
          format="currency"
          change="+0.0%"
          changeDirection="up"
          accentColor="#00D4FF"
          icon={DollarSign}
        />
        <MetricCard
          label="Open Proposals"
          value={metrics.openProposals}
          accentColor="#8B7FFF"
          icon={FileText}
        />
        <MetricCard
          label="Scope Alerts"
          value={metrics.scopeAlerts}
          accentColor="#FF4D6D"
          icon={AlertTriangle}
        />
        <MetricCard
          label="Invoices Paid"
          value={metrics.invoicesPaid}
          format="currency"
          accentColor="#FFB800"
          icon={Receipt}
        />
      </div>

      {/* Main content + right panel — stacks below 1200px */}
      <div className="mt-6 flex flex-col gap-6 min-[1200px]:flex-row">
        <main className="min-w-0 flex-1">
          <ProposalsTable proposals={recentProposals} loading={loading} />
        </main>

        {/* Right panel: 280px, hidden below 1200px */}
        <aside className="hidden w-[280px] shrink-0 flex-col gap-6 min-[1200px]:flex">
          <AiGeneratorWidget />
          <ActivityFeed activities={activities} loading={loading} />
        </aside>
      </div>
    </div>
  )
}

function AiGeneratorWidget() {
  return (
    <section className="rounded-xl border border-qf-border bg-qf-surface p-4">
      <div className="flex items-center gap-2">
        <Sparkles size={15} className="text-qf-cyan" />
        <h3 className="font-heading text-sm font-bold">Generate Proposal</h3>
      </div>
      <textarea
        rows={4}
        placeholder="Describe the project — scope, client, budget — and let QFLOW draft the proposal…"
        className="mt-3 w-full resize-none rounded-lg border border-qf-border2 bg-qf-bg px-3 py-2.5 text-sm text-qf-text placeholder:text-qf-text3 focus:border-qf-cyan focus:outline-none focus:ring-2 focus:ring-qf-cyan/30"
      />
      <button
        type="button"
        className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-qf-cyan to-qf-purple px-4 py-2.5 text-sm font-semibold text-qf-bg transition-opacity hover:opacity-90"
      >
        <Sparkles size={15} />
        Generate Proposal
      </button>
    </section>
  )
}

function ActivityFeed({ activities, loading }) {
  return (
    <section className="rounded-xl border border-qf-border bg-qf-surface p-4">
      <div className="flex items-center gap-2">
        <ActivityIcon size={15} className="text-qf-text2" />
        <h3 className="font-heading text-sm font-bold">Live Activity</h3>
      </div>

      {loading ? (
        <div className="mt-4 space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="relative overflow-hidden rounded bg-qf-border2/60">
              <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/10 to-transparent" />
              <div className="h-3.5" />
            </div>
          ))}
        </div>
      ) : activities.length > 0 ? (
        <ul className="mt-4 space-y-3.5">
          {activities.map((item) => (
            <li key={item.id} className="flex gap-3 text-sm">
              <span
                className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${
                  ACTIVITY_DOT[item.type] ?? 'bg-qf-text3'
                }`}
              />
              <div className="min-w-0">
                <p className="text-qf-text">{item.description}</p>
                <p className="mt-0.5 text-xs text-qf-text3">
                  {formatRelativeTime(item.created_at)}
                </p>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-4 text-xs text-qf-text3">No activity yet.</p>
      )}
    </section>
  )
}
