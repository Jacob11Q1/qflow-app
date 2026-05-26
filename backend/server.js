require('dotenv').config({ quiet: true })

const express = require('express')
const cors = require('cors')
const morgan = require('morgan')
const helmet = require('helmet')
const rateLimit = require('express-rate-limit')

const app = express()

app.use(cors({ origin: process.env.FRONTEND_URL || 'http://localhost:5173', credentials: true }))
app.use(express.json({ limit: '10mb' }))
app.use(morgan('dev'))
app.use(helmet())

// General rate limit: 100 req/min
const generalLimit = rateLimit({ windowMs: 60000, max: 100, message: { error: 'Too many requests' } })
// AI rate limit: 10 req/min (expensive operations)
const aiLimit = rateLimit({ windowMs: 60000, max: 10, message: { error: 'AI rate limit exceeded' } })

app.use('/api', generalLimit)
app.use('/api/proposals/generate', aiLimit)
app.use('/api/scope/analyze', aiLimit)
app.use('/api/contracts/generate', aiLimit)

// Routes
app.use('/health', require('./routes/health'))
app.use('/api/proposals', require('./routes/proposals'))
app.use('/api/scope', require('./routes/scope'))
app.use('/api/contracts', require('./routes/contracts'))
app.use('/api/invoices', require('./routes/invoices'))
app.use('/api/portal', require('./routes/portal'))
app.use('/api/clients', require('./routes/clients'))
app.use('/api/revenue', require('./routes/revenue'))

// 404 handler
app.use((req, res) => res.status(404).json({ error: 'Route not found' }))

// Error handler
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(err.status || 500).json({ error: err.message || 'Internal server error' })
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => console.log('QFLOW backend running on localhost:' + PORT))
