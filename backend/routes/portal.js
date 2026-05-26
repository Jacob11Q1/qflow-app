const { Router } = require('express')

const router = Router()

// GET /api/portal — public client-portal endpoints (stub). Client-facing, so
// these intentionally do NOT use the auth middleware; access is by share token.
router.get('/', (req, res) => res.json([]))

// GET /:token , POST /:token/respond — implemented in a later day.
// res.status(501).json({ error: 'Not implemented' })

module.exports = router
