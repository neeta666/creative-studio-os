import type { Config } from 'tailwindcss'

const config: Config = {
  // Only generate CSS for classes actually used in these files
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      // Design tokens — mirrors the CSS variables from styles.css
      colors: {
        'bg-base': '#0e0e0f',
        'bg-surface': '#161618',
        'bg-elevated': '#1e1e21',
        'bg-hover': '#26262a',
        'border-subtle': '#1f1f23',
        accent: '#e55a1e',
        'text-primary': '#f0efe8',
        'text-secondary': '#9e9d96',
        'text-muted': '#5a5a5e',
      },
      fontFamily: {
        display: ['Syne', 'sans-serif'],
        body: ['DM Sans', 'sans-serif'],
      },
      borderRadius: {
        sm: '6px',
        md: '10px',
        lg: '14px',
      },
    },
  },
  plugins: [],
}

export default config
