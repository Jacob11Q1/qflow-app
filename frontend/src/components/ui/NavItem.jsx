import { Link, useLocation } from 'react-router-dom'
import { cn } from '@/lib/utils'

/**
 * NavItem — a single sidebar link.
 *
 * @param {object}   props
 * @param {React.ComponentType} props.icon   Lucide icon component
 * @param {string}   props.label
 * @param {string}   props.to                route path
 * @param {number|string} [props.badge]      optional count / text
 * @param {boolean}  [props.danger]          render the badge in red
 * @param {() => void} [props.onNavigate]    called on click (closes mobile menu)
 */
export default function NavItem({ icon: Icon, label, to, badge, danger, onNavigate }) {
  const location = useLocation()
  const active =
    location.pathname === to || location.pathname.startsWith(`${to}/`)

  const hasBadge = badge !== undefined && badge !== null && badge !== 0

  return (
    <Link
      to={to}
      onClick={onNavigate}
      aria-current={active ? 'page' : undefined}
      className={cn(
        'group flex h-[38px] items-center gap-3 border-l-2 px-4 text-sm transition-all duration-150 ease-in-out',
        active
          ? 'border-qf-cyan bg-[rgba(0,212,255,0.06)] text-qf-cyan'
          : 'border-transparent text-qf-text2 hover:bg-[rgba(255,255,255,0.03)] hover:text-qf-text',
      )}
    >
      <Icon size={16} strokeWidth={1.75} className="shrink-0" />
      <span className="flex-1 truncate">{label}</span>

      {hasBadge ? (
        <span
          className={cn(
            'rounded-full px-2 py-0.5 font-mono text-[10px] font-medium leading-none',
            danger
              ? 'bg-qf-red/15 text-qf-red'
              : active
                ? 'bg-qf-cyan/15 text-qf-cyan'
                : 'bg-qf-surface2 text-qf-text2',
          )}
        >
          {badge}
        </span>
      ) : null}
    </Link>
  )
}
