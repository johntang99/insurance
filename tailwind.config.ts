import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // CSS variable-driven theme (overridden per site via theme.json)
        primary: {
          DEFAULT: 'var(--primary)',
          dark: 'var(--primary-dark)',
          light: 'var(--primary-light)',
          50: 'var(--primary-50)',
          100: 'var(--primary-100)',
        },
        secondary: {
          DEFAULT: 'var(--secondary)',
          dark: 'var(--secondary-dark)',
          light: 'var(--secondary-light)',
          50: 'var(--secondary-50)',
        },
        backdrop: {
          primary: 'var(--backdrop-primary)',
          secondary: 'var(--backdrop-secondary)',
        },
        // Insurance platform static tokens — Navy + Gold
        'insurance-navy': '#0B1F3A',
        'insurance-navy-dark': '#071529',
        'insurance-navy-light': '#1A3352',
        'insurance-gold': '#C9933A',
        'insurance-gold-dark': '#A87830',
        'insurance-gold-light': '#DFB060',
        'insurance-success': '#1A7A4A',
        'insurance-danger': '#C74B4B',
        'insurance-bg': '#F7F8FA',
        'insurance-text': '#2C3E50',
        'insurance-text-muted': '#7A8A9A',
        'insurance-border': '#E2E8F0',
      },
      fontFamily: {
        // Insurance platform fonts
        heading: ['var(--font-heading)', 'Playfair Display', 'Georgia', 'serif'],
        body: ['var(--font-body)', 'Inter', 'system-ui', 'sans-serif'],
        // Legacy CSS variable fonts
        display: ['var(--font-display)', 'var(--font-body-default)', 'sans-serif'],
        ui: ['var(--font-body)', 'var(--font-body-default)', 'sans-serif'],
      },
      fontSize: {
        'display': ['var(--text-display)', { lineHeight: '1.1' }],
        'heading': ['var(--text-heading)', { lineHeight: '1.2' }],
        'subheading': ['var(--text-subheading)', { lineHeight: '1.3' }],
        'body': 'var(--text-body)',
        'small': 'var(--text-small)',
      },
      boxShadow: {
        'card': '0 2px 12px rgba(11,31,58,0.08)',
        'card-hover': '0 8px 32px rgba(11,31,58,0.14)',
        'navy-sm': '0 1px 4px rgba(11,31,58,0.12)',
      },
      borderRadius: {
        'card': '12px',
      },
      maxWidth: {
        'container': '1280px',
      },
    },
  },
  plugins: [],
}

export default config
