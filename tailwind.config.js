/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js}"],
  theme: {
    extend: {
      backgroundImage: {
      'matrix': "url('/matrix2.jpg')",
      },
    },
  },
  plugins: [],
}