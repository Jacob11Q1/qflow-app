const { Router } = require('express')

const router = Router()

// GET /api/revenue — revenue summary / time series (stub).
// Auth + real queries land with the full implementation in a later day.
router.get('/', (req, res) => res.json([]))

// GET /summary , /forecast — not implemented yet (501).

module.exports = router
