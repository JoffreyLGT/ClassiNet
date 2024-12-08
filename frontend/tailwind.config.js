/** @type {import("tailwindcss").Config} */
module.exports = {
  content: ["./src/**/*.{html,ts}"],
  theme: {
    extend: {},
  },
  plugins: [require("@tailwindcss/typography"), require("daisyui")],
  daisyui: {
    themes: ["pastel", "dracula"],
  },
  darkMode: ["selector", '[data-theme="dracula"]'],
};
