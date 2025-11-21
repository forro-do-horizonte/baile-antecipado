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
          DEFAULT: '#FF6B35', // Laranja dos botões
          dark: '#E55A2B',
        },
        beige: {
          DEFAULT: '#F5F1E8', // Background bege
          light: '#FAF8F3',
        },
        brown: {
          DEFAULT: '#3D2817', // Texto marrom escuro
          light: '#5A3F2A',
        },
      },
      fontFamily: {
        serif: ['Georgia', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

