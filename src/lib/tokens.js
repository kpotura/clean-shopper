export const tokens = {
  colors: {
    primary: {
      DEFAULT: '#E60000',
      light:   '#FF3333',
      dark:    '#B30000',
    },
    secondary: {
      DEFAULT: '#FBEFEF',
      dark:    '#F5D5D5',
    },
    accent: {
      DEFAULT: '#899D78',
      light:   '#ABBE9D',
      dark:    '#6A7B5C',
    },
    success: '#1A7A4A',
    warning: '#92400E',
    error:   '#991B1B',
    neutral: {
      50:  '#FAFAFA',
      100: '#F5F5F5',
      200: '#E5E5E5',
      400: '#A3A3A3',
      600: '#525252',
      900: '#171717',
    },
  },

  typography: {
    fontFamily: {
      sans: 'Figtree, sans-serif',
    },
    fontSize: {
      display: '56px',
      h1:      '40px',
      h2:      '32px',
      h3:      '24px',
      h4:      '18px',
      body:    '16px',
      small:   '14px',
      micro:   '12px',
    },
    fontWeight: {
      display: '700',
      h1:      '700',
      h2:      '600',
      h3:      '600',
      h4:      '600',
      body:    '400',
      small:   '400',
      micro:   '400',
    },
    lineHeight: {
      display: '1.1',
      h1:      '1.2',
      h2:      '1.25',
      h3:      '1.3',
      h4:      '1.35',
      body:    '1.6',
      small:   '1.5',
      micro:   '1.4',
    },
  },

  spacing: {
    xs:  '4px',
    sm:  '8px',
    md:  '16px',
    lg:  '24px',
    xl:  '40px',
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
}

export default tokens
