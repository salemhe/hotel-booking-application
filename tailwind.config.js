/** @type {import('tailwindcss').Config} */
module.exports = {
   content: ["./app/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
   theme: {
    extend: {
      colors: {
        primary: "#1a73e8",
        secondary: "#f8f9fa",
        "text-primary": "#202124",
        "text-secondary": "#5f6368",
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
      },
    },
  },
   plugins: [],
 };
 