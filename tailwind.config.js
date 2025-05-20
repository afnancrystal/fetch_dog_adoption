module.exports = {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"], 
  theme: {
    extend: {
      fontFamily: {
        display: ['"Playfair Display"', 'serif'],
      },
      colors: {
        'beige': '#FDF6EC',
        'brown-900': '#4B3621',
        'brown-800': '#5C4033',
        'brown-600': '#7B5E57',
        'brown-500': '#A47148',
        'golden': '#D4AF37',
      },
    },
  },
  plugins: [],
};