import { useState, useEffect, useCallback } from 'react'

import { supabase, isSupabaseConfigured } from '@/lib/supabase'

/**
 * Shape returned by useDashboard. Kept stable so the UI can render skeletons
 * and empty states without null-checking every field.
 */
const EMPTY_METRICS = {
  revenueMtd: 0,
  openProposals: 0,
  scopeAlerts: 0,
  invoicesPaid: 0,
}

/**
 * Sum one numeric column of a row set, tolerating null/undefined.
 * @param {Array<object>} rows
 * @param {string} [field] column to sum (default 'amount')
 */
function sumAmount(rows, field = 'amount') {
  return (rows ?? []).reduce((sum, row) => sum + (Number(row[field]) || 0), 0)
}

function startOfMonthISO() {
  const now = new Date()
  return new Date(now.getFullYear(), now.getMonth(), 1).toISOString()
}

/**
 * useDashboard — loads the metrics, recent proposals, and activity feed for the
 * dashboard, and keeps them live via a Supabase realtime subscription on the
 * `proposals` table.
 *
 * When Supabase is not configured (local dev bypass), it resolves immediately
 * with empty data so the dashboard renders its zero/empty states instead of
 * erroring.
 *
 * @returns {{
 *   metrics: typeof EMPTY_METRICS,
 *   recentProposals: Array<object>,
 *   activities: Array<object>,
 *   loading: boolean,
 *   error: string|null,
 *   refresh: () => void,
 * }}
 */
export function useDashboard() {
  const [metrics, setMetrics] = useState(EMPTY_METRICS)
  const [recentProposals, setRecentProposals] = useState([])
  const [activities, setActivities] = useState([])
  const [loading, setLoading] = useState(isSupabaseConfigured())
  const [error, setError] = useState(null)

  // Pure fetch: returns the next state (or null when there's no backend) and
  // never touches setState itself, so it's safe to call from an effect. State
  // is committed in the `.then()` callbacks below.
  const fetchData = useCallback(async () => {
    if (!isSupabaseConfigured()) return null

    const monthStart = startOfMonthISO()

    const [
      openProposalsRes,
      scopeAlertsRes,
      recentProposalsRes,
      paidInvoicesRes,
      activitiesRes,
    ] = await Promise.all([
      // Open proposals = sent or viewed (awaiting a decision).
      supabase
        .from('proposals')
        .select('id', { count: 'exact', head: true })
        .in('status', ['sent', 'viewed']),
      // Unresolved scope-creep alerts.
      supabase
        .from('scope_alerts')
        .select('id', { count: 'exact', head: true })
        .eq('resolved', false),
      // Ten most recent proposals for the table.
      supabase
        .from('proposals')
        .select('id, project_type, client_name, amount, status, created_at')
        .order('created_at', { ascending: false })
        .limit(10),
      // Paid invoices — drives both revenue MTD and total invoices paid.
      supabase.from('invoices').select('total, paid_at').eq('status', 'paid'),
      // Recent activity feed (20 most recent).
      supabase
        .from('activities')
        .select('id, type, description, created_at')
        .order('created_at', { ascending: false })
        .limit(20),
    ])

    // Surface the first real error, but ignore "table does not exist yet"
    // (42P01) so the dashboard still renders during early build days.
    const firstError = [
      openProposalsRes,
      scopeAlertsRes,
      recentProposalsRes,
      paidInvoicesRes,
      activitiesRes,
    ].find((res) => res.error && res.error.code !== '42P01')
    if (firstError) throw firstError.error

    const paidInvoices = paidInvoicesRes.data ?? []
    const revenueMtd = sumAmount(
      paidInvoices.filter((inv) => inv.paid_at && inv.paid_at >= monthStart),
      'total',
    )

    return {
      metrics: {
        revenueMtd,
        openProposals: openProposalsRes.count ?? 0,
        scopeAlerts: scopeAlertsRes.count ?? 0,
        invoicesPaid: sumAmount(paidInvoices, 'total'),
      },
      recentProposals: recentProposalsRes.data ?? [],
      activities: activitiesRes.data ?? [],
    }
  }, [])

  // fetch + commit. setState only ever runs inside these promise callbacks,
  // never synchronously, so calling reload() from an effect is safe.
  const reload = useCallback(
    () =>
      fetchData()
        .then((data) => {
          if (!data) return
          setMetrics(data.metrics)
          setRecentProposals(data.recentProposals)
          setActivities(data.activities)
        })
        .catch((err) => setError(err?.message ?? 'Failed to load dashboard data.'))
        .finally(() => setLoading(false)),
    [fetchData],
  )

  // Manual re-fetch: flip the loading flag, then pull fresh data.
  const refresh = useCallback(() => {
    setLoading(true)
    setError(null)
    return reload()
  }, [reload])

  useEffect(() => {
    reload()

    if (!isSupabaseConfigured()) return

    // Live-refresh whenever a proposal changes.
    const channel = supabase
      .channel('dashboard-proposals')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'proposals' },
        () => reload(),
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [reload])

  return { metrics, recentProposals, activities, loading, error, refresh }
}
