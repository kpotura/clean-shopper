/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: 'var(--color-primary)',
          light: 'var(--color-primary-light)',
          dark: 'var(--color-primary-dark)',
        },
        secondary: {
          DEFAULT: 'var(--color-secondary)',
          dark: 'var(--color-secondary-dark)',
        },
        accent: {
          DEFAULT: 'var(--color-accent)',
          light: 'var(--color-accent-light)',
          dark: 'var(--color-accent-dark)',
        },
        success: 'var(--color-success)',
        warning: 'var(--color-warning)',
        error: 'var(--color-error)',
        'on-primary':   'var(--color-on-primary)',
        'on-secondary': 'var(--color-on-secondary)',
        'on-accent':    'var(--color-on-accent)',
        'on-warning':   'var(--color-on-warning)',
        neutral: {
          50:  'var(--color-neutral-50)',
          100: 'var(--color-neutral-100)',
          200: 'var(--color-neutral-200)',
          400: 'var(--color-neutral-400)',
          600: 'var(--color-neutral-600)',
          900: 'var(--color-neutral-900)',
        },
        surface:          'var(--color-surface)',
        'surface-subtle': 'var(--color-surface-subtle)',
        'dot-bhds':    '#16488E',
        'dot-crimson': '#E60000',
      },
      fontFamily: {
        sans: ['var(--font-sans)'],
      },
      fontSize: {
        display: ['56px', { fontWeight: '700', lineHeight: '1.1' }],
        h1:      ['40px', { fontWeight: '700', lineHeight: '1.2' }],
        h2:      ['32px', { fontWeight: '600', lineHeight: '1.25' }],
        h3:      ['24px', { fontWeight: '600', lineHeight: '1.3' }],
        h4:      ['18px', { fontWeight: '600', lineHeight: '1.35' }],
        body:    ['16px', { fontWeight: '400', lineHeight: '1.6' }],
        small:   ['14px', { fontWeight: '400', lineHeight: '1.5' }],
        micro:   ['12px', { fontWeight: '400', lineHeight: '1.4' }],
      },
      spacing: {
        'xs':  '4px',
        'sm':  '8px',
        'md':  '16px',
        'lg':  '24px',
        'xl':  '40px',
        '2xl': '64px',
        '3xl': '96px',
        '4xl': '128px',
      },
      borderRadius: {
        sm:   '4px',
        md:   '8px',
        lg:   '16px',
        full: '9999px',
      },
      boxShadow: {
        sm: '0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.04)',
        md: '0 4px 12px rgba(0,0,0,0.10), 0 2px 4px rgba(0,0,0,0.06)',
        lg: '0 16px 40px rgba(0,0,0,0.12), 0 4px 16px rgba(0,0,0,0.08)',
      },
    },
  },
  plugins: [],
}
