/** @type {import("tailwindcss").Config} */
module.exports = {
  content: ["./src/**/*.{html,ts}"],
  theme: {
    extend: {},
  },
  plugins: [require("@tailwindcss/typography"), require("daisyui")],
  daisyui: {
    logs: false, // Logs create issues with prettier
    themes: ["pastel", "dracula"],
  },
  darkMode: ["selector", '[data-theme="dracula"]'],
};
