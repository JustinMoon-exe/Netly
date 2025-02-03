module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
    extend: {
      transitionProperty: {
        'colors': 'background-color, border-color, color, fill, stroke',
      },
      fontFamily: {
        funnel: ["Nunito", "sans-serif"],
      },
    }
  },
  plugins: [],
}