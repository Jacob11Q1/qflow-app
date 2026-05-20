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
