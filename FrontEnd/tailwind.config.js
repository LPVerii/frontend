/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      boxShadow: {
        'shadow-3xl': 'box-shadow: 0 2px 10px 0 rgba(0, 0, 0, 0.5), 0 4px 10px 0 rgba(0, 0, 0, 0.19)',
      },
    },
  },
  plugins: [],
}
