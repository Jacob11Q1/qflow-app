const { Router } = require('express')

const router = Router()

// GET /api/clients — list clients (stub).
// Auth + real queries land with the full implementation in a later day.
router.get('/', (req, res) => res.json([]))

// POST / , GET/PUT/DELETE /:id — not implemented yet (501).

module.exports = router
