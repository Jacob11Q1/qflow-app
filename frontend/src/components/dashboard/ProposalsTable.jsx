import { useMemo, useState } from 'react'
import { ChevronDown, ChevronUp, FileText, Sparkles } from 'lucide-react'
import { Link } from 'react-router-dom'

import { cn, formatCurrency, formatRelativeTime } from '@/lib/utils'

const FILTERS = ['All', 'Sent', 'Accepted', 'Draft', 'Viewed']

/** status → badge styling. Draft is neutral grey. */
const STATUS_BADGE = {
  accepted: 'bg-qf-green/15 text-qf-green',
  sent: 'bg-qf-yellow/15 text-qf-yellow',
  draft: 'bg-qf-surface2 text-qf-text2',
  viewed: 'bg-qf-purple/15 text-qf-purple',
}

const COLUMNS = [
  { key: 'client_name', label: 'Client', sortable: true },
  { key: 'project_type', label: 'Project', sortable: true },
  { key: 'amount', label: 'Amount', sortable: true, align: 'right' },
  { key: 'status', label: 'Status', sortable: true },
  { key: 'created_at', label: 'Date', sortable: true, align: 'right' },
]

function StatusBadge({ status }) {
  const key = String(status ?? '').toLowerCase()
  return (
    <span
      className={cn(
        'rounded-full px-2.5 py-0.5 text-[11px] font-medium capitalize',
        STATUS_BADGE[key] ?? STATUS_BADGE.draft,
      )}
    >
      {key || 'draft'}
    </span>
  )
}

/** A single shimmering skeleton row (no spinners). */
function SkeletonRow() {
  const cell = (
    <div className="relative overflow-hidden rounded bg-qf-border2/60">
      <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      <div className="h-3.5" />
    </div>
  )
  return (
    <tr className="border-t border-qf-border">
      <td className="px-4 py-3.5">
        <div className="w-32">{cell}</div>
      </td>
      <td className="px-4 py-3.5">
        <div className="w-40">{cell}</div>
      </td>
      <td className="px-4 py-3.5">
        <div className="ml-auto w-16">{cell}</div>
      </td>
      <td className="px-4 py-3.5">
        <div className="w-16">{cell}</div>
      </td>
      <td className="px-4 py-3.5">
        <div className="ml-auto w-20">{cell}</div>
      </td>
    </tr>
  )
}

/** Row whose hover background is a radial glow that follows the cursor. */
function ProposalRow({ proposal }) {
  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect()
    e.currentTarget.style.setProperty('--mx', `${e.clientX - rect.left}px`)
    e.currentTarget.style.setProperty('--my', `${e.clientY - rect.top}px`)
  }

  return (
    <tr
      onMouseMove={handleMouseMove}
      className="group relative border-t border-qf-border transition-colors"
      style={{
        backgroundImage:
          'radial-gradient(220px circle at var(--mx, 50%) var(--my, 50%), rgba(0,212,255,0.06), transparent 70%)',
      }}
    >
      <td className="px-4 py-3.5 font-medium text-qf-text">
        {proposal.client_name ?? 'Unknown client'}
      </td>
      <td className="px-4 py-3.5 text-qf-text2">
        {proposal.project_type ?? 'Untitled project'}
      </td>
      <td className="px-4 py-3.5 text-right font-mono text-qf-cyan">
        {formatCurrency(proposal.amount)}
      </td>
      <td className="px-4 py-3.5">
        <StatusBadge status={proposal.status} />
      </td>
      <td className="px-4 py-3.5 text-right text-qf-text2">
        {formatRelativeTime(proposal.created_at)}
      </td>
    </tr>
  )
}

/**
 * ProposalsTable — recent proposals with filter tabs, sortable columns,
 * shimmer skeletons while loading, and an empty state with a CTA.
 *
 * @param {object} props
 * @param {Array<object>} props.proposals
 * @param {boolean} [props.loading]
 */
export default function ProposalsTable({ proposals = [], loading = false }) {
  const [filter, setFilter] = useState('All')
  const [sort, setSort] = useState({ key: 'created_at', direction: 'desc' })

  const visible = useMemo(() => {
    const filtered =
      filter === 'All'
        ? proposals
        : proposals.filter(
            (p) => String(p.status).toLowerCase() === filter.toLowerCase(),
          )

    const sorted = [...filtered].sort((a, b) => {
      const av = a[sort.key]
      const bv = b[sort.key]
      if (av == null) return 1
      if (bv == null) return -1
      if (av < bv) return sort.direction === 'asc' ? -1 : 1
      if (av > bv) return sort.direction === 'asc' ? 1 : -1
      return 0
    })
    return sorted
  }, [proposals, filter, sort])

  const toggleSort = (key) =>
    setSort((prev) =>
      prev.key === key
        ? { key, direction: prev.direction === 'asc' ? 'desc' : 'asc' }
        : { key, direction: 'asc' },
    )

  return (
    <section className="rounded-xl border border-qf-border bg-qf-surface">
      {/* Header + filter tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-5 pt-5">
        <h2 className="font-heading text-base font-bold">Recent Proposals</h2>
        <div className="flex items-center gap-1 rounded-lg border border-qf-border bg-qf-bg p-1">
          {FILTERS.map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setFilter(f)}
              className={cn(
                'rounded-md px-3 py-1 text-xs font-medium transition-colors',
                filter === f
                  ? 'bg-qf-surface2 text-qf-text'
                  : 'text-qf-text2 hover:text-qf-text',
              )}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-4 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left">
              {COLUMNS.map((col) => {
                const isSorted = sort.key === col.key
                return (
                  <th
                    key={col.key}
                    className={cn(
                      'px-4 pb-2 font-mono text-[10px] font-medium uppercase tracking-[0.12em] text-qf-text3',
                      col.align === 'right' && 'text-right',
                    )}
                  >
                    {col.sortable ? (
                      <button
                        type="button"
                        onClick={() => toggleSort(col.key)}
                        className={cn(
                          'inline-flex items-center gap-1 transition-colors hover:text-qf-text2',
                          col.align === 'right' && 'flex-row-reverse',
                        )}
                      >
                        {col.label}
                        {isSorted ? (
                          sort.direction === 'asc' ? (
                            <ChevronUp size={12} />
                          ) : (
                            <ChevronDown size={12} />
                          )
                        ) : null}
                      </button>
                    ) : (
                      col.label
                    )}
                  </th>
                )
              })}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              Array.from({ length: 4 }).map((_, i) => <SkeletonRow key={i} />)
            ) : visible.length > 0 ? (
              visible.map((p) => <ProposalRow key={p.id} proposal={p} />)
            ) : (
              <tr>
                <td colSpan={COLUMNS.length} className="px-4 py-12">
                  <EmptyState filtered={filter !== 'All'} />
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  )
}

function EmptyState({ filtered }) {
  return (
    <div className="flex flex-col items-center text-center">
      <div className="grid h-12 w-12 place-items-center rounded-xl border border-qf-border2 bg-qf-surface2 text-qf-text3">
        <FileText size={20} strokeWidth={1.75} />
      </div>
      <p className="mt-3 text-sm text-qf-text2">
        {filtered
          ? 'No proposals match this filter.'
          : 'No proposals yet. Your pipeline starts here.'}
      </p>
      {!filtered ? (
        <Link
          to="/app/proposals"
          className="mt-4 inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-qf-cyan to-qf-purple px-4 py-2 text-sm font-semibold text-qf-bg transition-opacity hover:opacity-90"
        >
          <Sparkles size={15} />
          Generate your first proposal
        </Link>
      ) : null}
    </div>
  )
}
