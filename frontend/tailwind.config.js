/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // QFLOW design tokens — usable as bg-qf-surface, text-qf-text2, border-qf-border, etc.
        qf: {
          bg: '#07090F',
          surface: '#0D1017',
          surface2: '#111520',
          border: '#1A2035',
          border2: '#232B40',
          cyan: '#00D4FF',
          purple: '#8B7FFF',
          green: '#00E096',
          red: '#FF4D6D',
          yellow: '#FFB800',
          text: '#DDE3F0',
          text2: '#7A8AAD',
          text3: '#3D4D6A',
        },
      },
      fontFamily: {
        heading: ['Syne', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
        sans: ['"DM Sans"', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        glow: '0 0 0 1px rgba(0, 212, 255, 0.15), 0 8px 40px -12px rgba(0, 212, 255, 0.25)',
      },
      keyframes: {
        shimmer: {
          '100%': { transform: 'translateX(100%)' },
        },
      },
      animation: {
        shimmer: 'shimmer 1.5s infinite',
      },
    },
  },
  plugins: [],
}
