const { Router } = require('express')

const router = Router()

// GET /api/scope — list scope-creep alerts (stub).
// Auth + real queries land with the full implementation (Day 11).
router.get('/', (req, res) => res.json([]))

// POST /api/scope/analyze — not implemented yet (501).

module.exports = router
