import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'

/**
 * PrivateRoute — gate for /app/* routes.
 *   loading        → full-screen spinner
 *   no session     → redirect to /login (remembering where they were headed)
 *   authenticated  → render children
 */
export default function PrivateRoute({ children }) {
  const { user, loading } = useAuth()
  const location = useLocation()

  if (loading) {
    return (
      <div
        className="grid min-h-screen place-items-center bg-qf-bg"
        role="status"
        aria-live="polite"
        aria-busy="true"
      >
        <span className="sr-only">Loading…</span>
        <div className="h-9 w-9 animate-spin rounded-full border-2 border-qf-border2 border-t-qf-cyan" />
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />
  }

  return children
}
