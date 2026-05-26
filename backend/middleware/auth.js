const { supabaseAdmin } = require('../lib/supabase')

/**
 * requireAuth — verifies a Supabase JWT from the `Authorization: Bearer <jwt>`
 * header using the service-role client. On success it attaches the user to the
 * request; otherwise it responds 401.
 *
 *   req.user   -> the Supabase user object
 *   req.userId -> user.id (convenience)
 */
async function requireAuth(req, res, next) {
  try {
    const header = req.headers.authorization || ''
    const token = header.startsWith('Bearer ') ? header.slice(7) : null

    if (!token) {
      return res.status(401).json({ error: 'Unauthorized' })
    }

    const { data, error } = await supabaseAdmin.auth.getUser(token)

    if (error || !data?.user) {
      return res.status(401).json({ error: 'Unauthorized' })
    }

    req.user = data.user
    req.userId = data.user.id
    next()
  } catch {
    // Network failure / unconfigured Supabase / malformed token all land here.
    return res.status(401).json({ error: 'Unauthorized' })
  }
}

module.exports = { requireAuth }
