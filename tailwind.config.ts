import type { Config } from 'tailwindcss'

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        base: {
          900: '#14171c',
          800: '#1c2129',
          700: '#242b35',
          600: '#2f3845',
        },
        accent: {
          500: '#b97cff',
          400: '#d8a1ff',
          300: '#f0c9ff',
        },
      },
      fontFamily: {
        display: ['"Space Grotesk"', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      boxShadow: {
        card: '0 24px 60px rgba(0,0,0,0.35)',
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(18px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        glow: {
          '0%, 100%': { opacity: '0.4' },
          '50%': { opacity: '0.8' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.7s ease-out both',
        glow: 'glow 3.5s ease-in-out infinite',
      },
    },
  },
  plugins: [],
} satisfies Config
