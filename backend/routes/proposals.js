import { Router } from 'express'

import { requireAuth } from '../middleware/auth.js'
import { generateProposal } from '../services/anthropic.js'

const router = Router()

// POST /api/proposals/generate — body: { brief: string }
router.post('/generate', requireAuth, async (req, res, next) => {
  try {
    const { brief } = req.body ?? {}
    if (!brief || typeof brief !== 'string') {
      return res.status(400).json({ error: 'A "brief" string is required' })
    }
    const proposal = await generateProposal(brief)
    res.json({ proposal })
  } catch (err) {
    next(err)
  }
})

export default router
