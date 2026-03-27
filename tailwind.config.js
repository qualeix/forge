/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        forge: {
          bg: "#0D0D0D",
          card: "#161616",
          border: "#222222",
          amber: "#F59E0B",
          "amber-glow": "#D97706",
          "amber-dim": "#92400E",
          text: "#F5F5F5",
          muted: "#6B7280",
        },
      },
    },
  },
  plugins: [],
};