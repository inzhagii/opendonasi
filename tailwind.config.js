/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#2E7DFA',
          soft: '#EFF6FF',
          dark: '#1D62D1',
        },
        background: {
          DEFAULT: '#FFFFFF',
          soft: '#F8FAFC',
        },
        'text-primary': '#172033',
        'text-secondary': '#667085',
        border: '#E5E7EB',
        success: '#16A34A',
        warning: '#D97706',
        error: '#DC2626',
        disabled: '#98A2B3',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      fontSize: {
        'display': ['2.5rem', { lineHeight: '1.2' }],        // 40px
        'display-mobile': ['2rem', { lineHeight: '1.25' }],   // 32px
        'h1': ['2rem', { lineHeight: '1.25' }],               // 32px
        'h1-mobile': ['1.75rem', { lineHeight: '1.3' }],      // 28px
        'h2': ['1.5rem', { lineHeight: '1.3' }],              // 24px
        'h2-mobile': ['1.375rem', { lineHeight: '1.35' }],    // 22px
        'h3': ['1.25rem', { lineHeight: '1.4' }],             // 20px
        'h3-mobile': ['1.125rem', { lineHeight: '1.4' }],     // 18px
      },
      maxWidth: {
        desktop: '1320px',
        mobile: '448px',
      },
      borderRadius: {
        card: '12px',
        input: '8px',
        button: '8px',
      },
      spacing: {
        'space-1': '4px',
        'space-2': '8px',
        'space-3': '12px',
        'space-4': '16px',
        'space-6': '24px',
        'space-8': '32px',
        'space-12': '48px',
        'space-16': '64px',
      },
    },
  },
  plugins: [],
}
