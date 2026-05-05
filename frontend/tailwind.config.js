/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Playfair Display"', 'Georgia', 'serif'],
        sans: ['"DM Sans"', 'system-ui', 'sans-serif'],
      },
      colors: {
        fern: { DEFAULT: '#4a7c59', dark: '#2d5c3e', light: '#7aad8a' },
        marigold: { DEFAULT: '#f9a620', light: '#ffd166' },
        terra: { DEFAULT: '#b7472a' },
        cream: { DEFAULT: '#f5f3ed', dark: '#ede9df' },
        ink: { DEFAULT: '#1a2318', mid: '#3a4a3a', soft: '#6b7c6b' },
      },
      boxShadow: {
        'soft': '0 4px 24px rgba(26,35,24,0.07)',
        'fern': '0 20px 60px rgba(74,124,89,0.18)',
        'card': '0 8px 40px rgba(26,35,24,0.10)',
      },
      borderRadius: {
        '4xl': '2rem',
        '5xl': '2.5rem',
      },
    },
  },
  plugins: [],
};
