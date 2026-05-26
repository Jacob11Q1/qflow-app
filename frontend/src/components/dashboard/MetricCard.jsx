import { useEffect, useRef, useState } from 'react'
import { ArrowDownRight, ArrowUpRight } from 'lucide-react'

import { cn, formatCurrency } from '@/lib/utils'

/**
 * useCountUp — animate a number from 0 to `target` over `duration` ms using
 * requestAnimationFrame and an ease-out curve. Re-runs when target changes.
 * @param {number} target
 * @param {number} [duration]
 */
function useCountUp(target, duration = 800) {
  const [value, setValue] = useState(0)
  const frame = useRef(0)

  useEffect(() => {
    const end = Number(target) || 0
    const start = performance.now()

    const tick = (now) => {
      const progress = Math.min((now - start) / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3) // easeOutCubic
      setValue(end * eased)
      if (progress < 1) {
        frame.current = requestAnimationFrame(tick)
      } else {
        setValue(end)
      }
    }

    frame.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame.current)
  }, [target, duration])

  return value
}

/**
 * MetricCard — a single dashboard stat with a count-up animation and a 2px
 * coloured gradient top border (a div with -mt-px so it sits over the border).
 *
 * @param {object} props
 * @param {string} props.label                      uppercase mono label
 * @param {number} props.value                      numeric target
 * @param {'currency'|'number'} [props.format]      how to render the value
 * @param {string} [props.change]                   e.g. "+12.5%"
 * @param {'up'|'down'} [props.changeDirection]     tints + picks the arrow
 * @param {string} props.accentColor                hex, e.g. "#00D4FF"
 * @param {React.ComponentType} [props.icon]        Lucide icon component
 */
export default function MetricCard({
  label,
  value,
  format = 'number',
  change,
  changeDirection = 'up',
  accentColor = '#00D4FF',
  icon: Icon,
}) {
  const animated = useCountUp(value)
  const display =
    format === 'currency'
      ? formatCurrency(animated)
      : Math.round(animated).toLocaleString('en-US')

  return (
    <div className="overflow-hidden rounded-xl border border-qf-border bg-qf-surface2">
      {/* 2px gradient top border — -mt-px pulls it over the card's own border */}
      <div
        aria-hidden="true"
        className="-mt-px h-0.5 w-full"
        style={{
          backgroundImage: `linear-gradient(90deg, ${accentColor}, transparent)`,
        }}
      />

      <div className="p-5">
        <div className="flex items-start justify-between">
          <p className="font-mono text-[10px] font-medium uppercase tracking-[0.14em] text-qf-text2">
            {label}
          </p>
          {Icon ? <Icon size={16} strokeWidth={1.75} className="text-qf-text3" /> : null}
        </div>

        <p className="mt-3 font-heading text-[28px] font-extrabold leading-none text-qf-text">
          {display}
        </p>

        {change ? (
          <div
            className={cn(
              'mt-3 inline-flex items-center gap-1 text-xs font-medium',
              changeDirection === 'down' ? 'text-qf-red' : 'text-qf-green',
            )}
          >
            {changeDirection === 'down' ? (
              <ArrowDownRight size={14} />
            ) : (
              <ArrowUpRight size={14} />
            )}
            {change}
          </div>
        ) : null}
      </div>
    </div>
  )
}
