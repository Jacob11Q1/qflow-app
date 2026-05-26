const { Router } = require('express')

const { requireAuth } = require('../middleware/auth')
const { supabaseAdmin } = require('../lib/supabase')
const { generateProposal } = require('../services/ai')

const router = Router()

/* ------------------------------------------------------------------ *
 * Public routes (no auth) — declared first so they aren't shadowed.
 * ------------------------------------------------------------------ */

// POST /api/proposals/:id/view — public: bump the view counter when a client
// opens the shared proposal link.
router.post('/:id/view', async (req, res, next) => {
  try {
    const { id } = req.params

    const { data: current, error: fetchError } = await supabaseAdmin
      .from('proposals')
      .select('view_count')
      .eq('id', id)
      .single()

    if (fetchError || !current) {
      return res.status(404).json({ error: 'Proposal not found' })
    }

    const { error: updateError } = await supabaseAdmin
      .from('proposals')
      .update({ view_count: (current.view_count || 0) + 1, last_viewed_at: new Date() })
      .eq('id', id)

    if (updateError) throw updateError
    res.json({ ok: true, view_count: (current.view_count || 0) + 1 })
  } catch (err) {
    next(err)
  }
})

/* ------------------------------------------------------------------ *
 * Everything below requires a valid Supabase JWT.
 * ------------------------------------------------------------------ */
router.use(requireAuth)

// POST /api/proposals/generate — AI draft (mock until Day 9).
router.post('/generate', async (req, res, next) => {
  try {
    const proposal = await generateProposal({ ...req.body, userId: req.userId })
    res.json({ proposal })
  } catch (err) {
    next(err)
  }
})

// GET /api/proposals — list the user's proposals, paginated + filterable.
//   query: ?page=1&limit=20&status=draft
router.get('/', async (req, res, next) => {
  try {
    const page = Math.max(1, parseInt(req.query.page, 10) || 1)
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit, 10) || 20))
    const from = (page - 1) * limit
    const to = from + limit - 1

    let query = supabaseAdmin
      .from('proposals')
      .select('*', { count: 'exact' })
      .eq('user_id', req.userId)
      .order('created_at', { ascending: false })
      .range(from, to)

    if (req.query.status) {
      query = query.eq('status', req.query.status)
    }

    const { data, error, count } = await query
    if (error) throw error

    res.json({ data: data ?? [], page, limit, total: count ?? 0 })
  } catch (err) {
    next(err)
  }
})

// POST /api/proposals — create a draft owned by the current user.
router.post('/', async (req, res, next) => {
  try {
    const payload = { ...req.body, user_id: req.userId, status: req.body?.status || 'draft' }

    const { data, error } = await supabaseAdmin
      .from('proposals')
      .insert(payload)
      .select()
      .single()

    if (error) throw error
    res.status(201).json({ data })
  } catch (err) {
    next(err)
  }
})

// GET /api/proposals/:id — a single proposal the user owns.
router.get('/:id', async (req, res, next) => {
  try {
    const { data, error } = await supabaseAdmin
      .from('proposals')
      .select('*')
      .eq('id', req.params.id)
      .eq('user_id', req.userId)
      .single()

    if (error || !data) {
      return res.status(404).json({ error: 'Proposal not found' })
    }
    res.json({ data })
  } catch (err) {
    next(err)
  }
})

// PUT /api/proposals/:id — update a proposal the user owns.
router.put('/:id', async (req, res, next) => {
  try {
    // Never let the client reassign ownership.
    const { user_id, id, ...updates } = req.body || {}

    const { data, error } = await supabaseAdmin
      .from('proposals')
      .update(updates)
      .eq('id', req.params.id)
      .eq('user_id', req.userId)
      .select()
      .single()

    if (error || !data) {
      return res.status(404).json({ error: 'Proposal not found' })
    }
    res.json({ data })
  } catch (err) {
    next(err)
  }
})

// DELETE /api/proposals/:id — verify ownership, then delete.
router.delete('/:id', async (req, res, next) => {
  try {
    const { data: owned, error: fetchError } = await supabaseAdmin
      .from('proposals')
      .select('id')
      .eq('id', req.params.id)
      .eq('user_id', req.userId)
      .single()

    if (fetchError || !owned) {
      return res.status(404).json({ error: 'Proposal not found' })
    }

    const { error } = await supabaseAdmin.from('proposals').delete().eq('id', req.params.id)
    if (error) throw error

    res.json({ ok: true })
  } catch (err) {
    next(err)
  }
})

module.exports = router
