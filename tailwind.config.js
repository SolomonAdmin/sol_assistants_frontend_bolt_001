/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      animation: {
        'slide-up': 'slideUp 0.3s ease-out forwards',
        'fade-in': 'fadeIn 0.3s ease-out forwards',
      },
      keyframes: {
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: 0 },
          '100%': { transform: 'translateY(0)', opacity: 1 },
        },
        fadeIn: {
          '0%': { opacity: 0 },
          '100%': { opacity: 1 },
        },
      },
      boxShadow: {
        'luxury': '0 8px 32px rgba(0, 0, 0, 0.1)',
        'luxury-hover': '0 12px 40px rgba(0, 0, 0, 0.15)',
        'luxury-dark': '0 8px 32px rgba(0, 0, 0, 0.3)',
        'luxury-hover-dark': '0 12px 40px rgba(0, 0, 0, 0.4)',
      },
      colors: {
        dark: {
          50: '#1a1b1e',
          100: '#141517',
          200: '#0f1012',
          300: '#0a0b0c',
          400: '#050607',
          500: '#000000',
        },
      },
    },
  },
  plugins: [],
};