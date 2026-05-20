import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="grid min-h-screen place-items-center bg-qf-bg px-6 text-center text-qf-text">
      <div>
        <p className="qf-label text-qf-purple">Error 404</p>
        <h1 className="mt-3 text-6xl qf-gradient-text">Lost</h1>
        <p className="mt-3 text-qf-text2">This page doesn’t exist — or hasn’t been built yet.</p>
        <Link
          to="/"
          className="mt-6 inline-block rounded-lg border border-qf-border2 px-5 py-2.5 hover:bg-qf-surface"
        >
          Back home
        </Link>
      </div>
    </div>
  )
}
