/** @type {import('@tailwindcss/postcss').Config} */
module.exports = {
  content: [
    `./src/pages/**/*.{js,jsx,ts,tsx}`,
    `./src/components/**/*.{js,jsx,ts,tsx}`,
    './public/index.html',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
