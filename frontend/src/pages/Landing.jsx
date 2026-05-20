import { Link } from 'react-router-dom'
import { ArrowRight, FileText, AlertTriangle, Receipt } from 'lucide-react'

const FEATURES = [
  {
    icon: FileText,
    title: 'AI Proposals',
    body: 'Generate scoped, priced proposals from a one-line brief in seconds.',
  },
  {
    icon: AlertTriangle,
    title: 'Scope Creep Radar',
    body: 'Detect out-of-scope requests before they eat your margin.',
  },
  {
    icon: Receipt,
    title: 'Contracts & Invoices',
    body: 'Send contracts, bill clients, and get paid — all in one place.',
  },
]

export default function Landing() {
  return (
    <div className="min-h-screen bg-qf-bg text-qf-text">
      {/* Nav */}
      <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
        <span className="font-heading text-2xl qf-gradient-text">QFLOW</span>
        <nav className="flex items-center gap-3">
          <Link to="/login" className="px-4 py-2 text-sm text-qf-text2 hover:text-qf-text">
            Log in
          </Link>
          <Link
            to="/signup"
            className="rounded-lg bg-qf-cyan px-4 py-2 text-sm font-medium text-qf-bg hover:opacity-90"
          >
            Get started
          </Link>
        </nav>
      </header>

      {/* Hero */}
      <section className="mx-auto max-w-6xl px-6 pb-16 pt-20 text-center">
        <p className="qf-label">The business OS for freelance web developers</p>
        <h1 className="mx-auto mt-4 max-w-3xl text-5xl leading-tight sm:text-6xl">
          Run your dev business <span className="qf-gradient-text">on autopilot</span>.
        </h1>
        <p className="mx-auto mt-5 max-w-xl text-lg text-qf-text2">
          QFLOW handles proposals, scope creep, contracts, and invoices so you can
          spend your time shipping — not chasing paperwork.
        </p>
        <div className="mt-8 flex items-center justify-center gap-3">
          <Link
            to="/signup"
            className="inline-flex items-center gap-2 rounded-lg bg-qf-cyan px-6 py-3 font-medium text-qf-bg hover:opacity-90"
          >
            Start free <ArrowRight size={18} />
          </Link>
          <Link
            to="/app/dashboard"
            className="rounded-lg border border-qf-border2 px-6 py-3 text-qf-text hover:bg-qf-surface"
          >
            Live demo
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto grid max-w-6xl gap-4 px-6 pb-24 sm:grid-cols-3">
        {FEATURES.map(({ icon: Icon, title, body }) => (
          <div key={title} className="rounded-xl border border-qf-border bg-qf-surface p-6">
            <div className="grid h-11 w-11 place-items-center rounded-lg border border-qf-border2 text-qf-purple">
              <Icon size={20} strokeWidth={1.75} />
            </div>
            <h3 className="mt-4 text-lg">{title}</h3>
            <p className="mt-2 text-sm text-qf-text2">{body}</p>
          </div>
        ))}
      </section>

      <footer className="border-t border-qf-border px-6 py-8 text-center">
        <p className="qf-label text-qf-text3">© {new Date().getFullYear()} QFLOW</p>
      </footer>
    </div>
  )
}
