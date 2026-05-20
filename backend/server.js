import 'dotenv/config'
import express from 'express'
import cors from 'cors'

import healthRouter from './routes/health.js'
import proposalsRouter from './routes/proposals.js'

const app = express()
const PORT = process.env.PORT || 8080

/* ---------------------------------- CORS --------------------------------- */
// Allow the local Vite dev server and the deployed frontend (set via env).
const allowedOrigins = [
  'http://localhost:5173',
  process.env.FRONTEND_URL, // e.g. https://qflow.vercel.app
].filter(Boolean)

app.use(
  cors({
    origin(origin, callback) {
      // Allow non-browser tools (curl, server-to-server) with no Origin header.
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true)
      }
      return callback(new Error(`CORS: origin ${origin} not allowed`))
    },
    credentials: true,
  }),
)

app.use(express.json())

/* --------------------------------- Routes -------------------------------- */
app.use('/health', healthRouter)
app.use('/api/proposals', proposalsRouter)

app.get('/', (_req, res) => {
  res.json({ name: 'QFLOW API', version: '0.1.0', status: 'ok' })
})

/* ----------------------------- Error handling ---------------------------- */
app.use((_req, res) => {
  res.status(404).json({ error: 'Not found' })
})

// eslint-disable-next-line no-unused-vars
app.use((err, _req, res, _next) => {
  console.error(err)
  res.status(500).json({ error: err.message || 'Internal server error' })
})

app.listen(PORT, () => {
  console.log(`QFLOW API listening on http://localhost:${PORT}`)
})
