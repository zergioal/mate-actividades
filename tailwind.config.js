/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'sans-serif'],
      },
      colors: {
        brand: {
          50:  '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
          950: '#172554',
        },
      },
      boxShadow: {
        card: '0 1px 3px rgba(0,0,0,0.07), 0 4px 16px rgba(0,0,0,0.05)',
        'card-hover': '0 4px 12px rgba(0,0,0,0.10), 0 12px 32px rgba(0,0,0,0.07)',
        panel: '0 0 0 1px rgba(0,0,0,0.06), 0 4px 24px rgba(0,0,0,0.07)',
      },
      animation: {
        'fade-in':    'fadeIn 0.25s ease-out',
        'slide-up':   'slideUp 0.3s ease-out',
        'pop':        'pop 0.2s ease-out',
        'shake':      'shake 0.4s ease-out',
      },
      keyframes: {
        fadeIn:  { from: { opacity: '0' },                         to: { opacity: '1' } },
        slideUp: { from: { opacity: '0', transform: 'translateY(12px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
        pop:     { '0%,100%': { transform: 'scale(1)' },           '50%': { transform: 'scale(1.06)' } },
        shake:   { '0%,100%': { transform: 'translateX(0)' }, '25%': { transform: 'translateX(-6px)' }, '75%': { transform: 'translateX(6px)' } },
      },
    },
  },
  plugins: [],
}
