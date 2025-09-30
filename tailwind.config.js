/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        sage: {
          50: '#f6f7f6',
          100: '#e3e7e3',
          200: '#c7d2c7',
          300: '#a3b5a3',
          400: '#8FBC8F',
          500: '#6b8e6b',
          600: '#567456',
          700: '#475d47',
          800: '#3d4e3d',
          900: '#354135',
        },
        rose: {
          50: '#fdf2f2',
          100: '#fce7e7',
          200: '#fbd5d5',
          300: '#f8b4b4',
          400: '#D4A5A5',
          500: '#e57373',
          600: '#d45050',
          700: '#c53030',
          800: '#9b2c2c',
          900: '#742a2a',
        },
        cream: {
          50: '#fefefe',
          100: '#fefcf3',
          200: '#fef7e0',
          300: '#feecb3',
          400: '#fed580',
          500: '#fcb84d',
          600: '#f69e20',
          700: '#dd8710',
          800: '#b86f11',
          900: '#945a15',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
};