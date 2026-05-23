/**
 * scorePassword — lightweight strength estimate for the signup UI.
 * Returns a 0–4 score with a matching label and CSS color token.
 */
export function scorePassword(password = '') {
  let score = 0
  if (password.length >= 8) score++
  if (password.length >= 12) score++
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++
  if (/\d/.test(password)) score++
  if (/[^A-Za-z0-9]/.test(password)) score++
  score = Math.min(score, 4)

  const levels = [
    { label: 'Too weak', color: 'var(--qf-red)' },
    { label: 'Weak', color: 'var(--qf-red)' },
    { label: 'Fair', color: 'var(--qf-yellow)' },
    { label: 'Good', color: 'var(--qf-cyan)' },
    { label: 'Strong', color: 'var(--qf-green)' },
  ]

  return { score, ...levels[score] }
}
