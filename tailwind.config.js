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
        '4.5': '1.125rem', // 18px
        '18': '4.5rem',
      },
    },
  },
  plugins: [],
}
