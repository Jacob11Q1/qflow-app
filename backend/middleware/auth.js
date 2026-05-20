/**
 * requireAuth — extracts the Supabase bearer token from the Authorization
 * header. Token verification against Supabase is wired in once the
 * service-role key is configured; for now it enforces the header's presence.
 */
export function requireAuth(req, res, next) {
  const header = req.headers.authorization || ''
  const token = header.startsWith('Bearer ') ? header.slice(7) : null

  if (!token) {
    return res.status(401).json({ error: 'Missing bearer token' })
  }

  req.accessToken = token
  next()
}
