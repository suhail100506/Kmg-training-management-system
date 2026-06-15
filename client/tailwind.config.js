/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class', // support class-based dark mode
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f4f6fb',
          100: '#e8eef6',
          200: '#cbd9eb',
          300: '#9ebad9',
          400: '#6b95c2',
          500: '#4675a8',
          600: '#345c8c',
          700: '#1f4e79', // Primary Corporate Navy Blue
          800: '#213f60',
          900: '#1e334d',
          950: '#132133',
        }
      },
      fontFamily: {
        sans: ['Inter', 'Segoe UI', 'Roboto', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
