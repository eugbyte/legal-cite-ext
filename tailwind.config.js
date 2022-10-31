/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "../../libs/components/**/*.{jsx,tsx}"
  ],
  theme: {
    extend: {},
  },
  plugins: [],
  presets: [require("../../tailwind.base.config.js")]
}
