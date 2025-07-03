/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        sudan: {
          red: '#D32F2F',
          white: '#FFFFFF',
          black: '#000000',
          blue: '#1976D2',
          green: '#388E3C',
          gold: '#FFD700'
        }
      },
      fontFamily: {
        arabic: ['Amiri', 'serif'],
        sans: ['Inter', 'sans-serif']
      }
    },
  },
  plugins: [],
}