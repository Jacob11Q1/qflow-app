import { Router } from 'express'

const router = Router()

// GET /health — liveness probe for the VPS / load balancer.
router.get('/', (_req, res) => {
  res.json({
    status: 'ok',
    service: 'qflow-api',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  })
})

export default router
