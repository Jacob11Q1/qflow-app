import { Link } from 'react-router-dom'
import Logo from '@/components/Logo'

/**
 * AuthShell — centered card on the dark background, shared by the
 * login / signup / forgot-password screens.
 */
export default function AuthShell({ title, subtitle, children, footer }) {
  return (
    <main className="grid min-h-screen place-items-center bg-qf-bg px-4 py-10 text-qf-text">
      <div className="w-full max-w-md">
        <div className="mb-6 flex justify-center">
          <Link to="/" aria-label="QFLOW home">
            <Logo className="text-3xl" />
          </Link>
        </div>

        <section className="rounded-[14px] border border-qf-border bg-qf-surface p-6 shadow-xl shadow-black/30 sm:p-8">
          <h1 className="text-center text-2xl">{title}</h1>
          {subtitle ? (
            <p className="mt-1.5 text-center text-sm text-qf-text2">{subtitle}</p>
          ) : null}
          <div className="mt-6">{children}</div>
        </section>

        {footer ? (
          <p className="mt-6 text-center text-sm text-qf-text2">{footer}</p>
        ) : null}
      </div>
    </main>
  )
}
