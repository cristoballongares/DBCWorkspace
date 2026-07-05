import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        'bg-base': 'var(--bg-base)',
        'bg-surface': 'var(--bg-surface)',
        'bg-elevated': 'var(--bg-elevated)',
        'border-default': 'var(--border-default)',
        'border-strong': 'var(--border-strong)',
        'text-primary': 'var(--text-primary)',
        'text-secondary': 'var(--text-secondary)',
        'text-muted': 'var(--text-muted)',
        'status-solved': 'var(--status-solved)',
        'status-attempted': 'var(--status-attempted)',
        'status-pending': 'var(--status-pending)',
        'status-editorial': 'var(--status-editorial)',
        'link-focus': 'var(--link-focus)',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      borderRadius: {
        sm: '4px',
        md: '8px',
      },
    },
  },
  plugins: [],
};

export default config;
