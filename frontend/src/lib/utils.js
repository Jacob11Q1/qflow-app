import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * cn — merge conditional class names and de-duplicate conflicting
 * Tailwind utilities (last one wins). Standard shadcn/ui helper.
 *
 * @param {...import('clsx').ClassValue} inputs
 * @returns {string}
 */
export function cn(...inputs) {
  return twMerge(clsx(inputs))
}

const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})

/**
 * formatCurrency — render a number as USD, e.g. 1234.5 -> "$1,234.50".
 * @param {number} amount
 * @returns {string}
 */
export function formatCurrency(amount) {
  return currencyFormatter.format(Number.isFinite(amount) ? amount : 0)
}

const relativeFormatter = new Intl.RelativeTimeFormat('en', { numeric: 'auto' })

const RELATIVE_DIVISIONS = [
  { amount: 60, unit: 'second' },
  { amount: 60, unit: 'minute' },
  { amount: 24, unit: 'hour' },
  { amount: 7, unit: 'day' },
  { amount: 4.34524, unit: 'week' },
  { amount: 12, unit: 'month' },
  { amount: Number.POSITIVE_INFINITY, unit: 'year' },
]

/**
 * formatRelativeTime — human "time ago" string, e.g. "3 hours ago".
 * Accepts a Date, ISO string, or epoch ms.
 * @param {Date|string|number} input
 * @returns {string}
 */
export function formatRelativeTime(input) {
  const date = input instanceof Date ? input : new Date(input)
  if (Number.isNaN(date.getTime())) return ''

  let duration = (date.getTime() - Date.now()) / 1000
  for (const division of RELATIVE_DIVISIONS) {
    if (Math.abs(duration) < division.amount) {
      return relativeFormatter.format(Math.round(duration), division.unit)
    }
    duration /= division.amount
  }
  return ''
}
