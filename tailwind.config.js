/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        qltt: {
          50: '#f0f7ff',
          100: '#e0effe',
          200: '#bae0fd',
          300: '#7cc7fb',
          400: '#38a8f8',
          500: '#0e8ce7',
          600: '#0270c7',
          700: '#0358a1',
          800: '#074c85',
          900: '#0c406e',
          950: '#082949'
        },
        gold: {
          500: '#d97706',
          600: '#b45309'
        }
      }
    },
  },
  plugins: [],
}
