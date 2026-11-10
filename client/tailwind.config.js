/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          50: '#F0F3F8',
          100: '#D9E1ED',
          200: '#B3C4DB',
          300: '#8DA6C9',
          400: '#5379AB',
          500: '#2A5087',
          600: '#1F3C66',
          700: '#182E4E',
          800: '#14213D', // Primary Dark Navy
          900: '#0C1425',
          DEFAULT: '#14213D'
        },
        gold: {
          50: '#FAF7F0',
          100: '#F4ECE0',
          200: '#EBD9C1',
          300: '#E2C7A1',
          400: '#DAB582',
          500: '#D4AF77', // Secondary Champagne Gold
          600: '#BE9452',
          700: '#997339',
          800: '#735424',
          900: '#4D3613',
          DEFAULT: '#D4AF77'
        },
        offwhite: '#FAF9F6',
        charcoal: {
          50: '#F5F5F5',
          100: '#E5E5E5',
          200: '#CCCCCC',
          300: '#999999',
          400: '#666666',
          500: '#404040',
          800: '#252525', // Primary Text Charcoal
          900: '#171717',
          DEFAULT: '#252525'
        },
        beige: {
          light: '#F8F4ED',
          DEFAULT: '#EDE5D8', // Accent Soft Beige
          dark: '#DECDB5'
        }
      },
      fontFamily: {
        serif: ['Cinzel', 'Playfair Display', 'Georgia', 'serif'],
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'gold-sm': '0 2px 8px -1px rgba(212, 175, 119, 0.25)',
        'gold-md': '0 8px 24px -4px rgba(212, 175, 119, 0.3)',
        'gold-lg': '0 16px 36px -6px rgba(212, 175, 119, 0.35)',
        'luxury': '0 10px 40px -10px rgba(20, 33, 61, 0.12)',
      }
    },
  },
  plugins: [],
}

