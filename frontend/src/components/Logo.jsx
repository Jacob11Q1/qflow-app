import { cn } from '@/lib/utils'

/** QFLOW wordmark — Q in cyan, FLOW in white, Syne 800. */
export default function Logo({ className }) {
  return (
    <span
      className={cn('font-heading text-2xl font-extrabold tracking-tight', className)}
      aria-label="QFLOW"
    >
      <span className="text-qf-cyan">Q</span>
      <span className="text-white">FLOW</span>
    </span>
  )
}
