/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js}"],
  theme: {
    extend: {
      // colors: {
      //   slate: '#2f4f4f',
      // },
      backgroundImage: {
      'matrix': "url('/matrix2.jpg')",
      },
    },
  },
  plugins: [],
}