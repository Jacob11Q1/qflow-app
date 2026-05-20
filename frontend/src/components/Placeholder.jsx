/**
 * Placeholder — shared scaffold for the authenticated app pages.
 * Each route renders one of these until its real feature is built.
 */
export default function Placeholder({ eyebrow, title, description, icon: Icon }) {
  return (
    <section className="mx-auto max-w-5xl">
      <div className="flex items-start gap-4">
        {Icon ? (
          <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl border border-qf-border2 bg-qf-surface text-qf-cyan">
            <Icon size={22} strokeWidth={1.75} />
          </div>
        ) : null}
        <div>
          {eyebrow ? <p className="qf-label mb-1">{eyebrow}</p> : null}
          <h1 className="text-3xl">{title}</h1>
          {description ? (
            <p className="mt-2 max-w-2xl text-qf-text2">{description}</p>
          ) : null}
        </div>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="rounded-xl border border-qf-border bg-qf-surface p-5"
          >
            <div className="h-3 w-24 rounded bg-qf-border2" />
            <div className="mt-4 h-8 w-32 rounded bg-qf-surface2" />
            <div className="mt-3 h-3 w-full rounded bg-qf-surface2" />
            <div className="mt-2 h-3 w-2/3 rounded bg-qf-surface2" />
          </div>
        ))}
      </div>

      <div className="mt-6 rounded-xl border border-dashed border-qf-border2 bg-qf-surface/40 p-8 text-center">
        <p className="qf-label">Coming soon</p>
        <p className="mt-2 text-qf-text2">
          This screen is scaffolded and wired into routing. Feature work lands here next.
        </p>
      </div>
    </section>
  )
}
