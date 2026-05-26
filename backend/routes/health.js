const { Router } = require('express')

const router = Router()

// GET /health — liveness probe.
router.get('/', (req, res) => {
  res.json({
    status: 'ok',
    version: '1.0.0',
    uptime: process.uptime(),
    timestamp: new Date(),
    environment: process.env.NODE_ENV || 'development',
  })
})

module.exports = router
