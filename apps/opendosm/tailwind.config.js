/** @type {import('tailwindcss').Config} */

module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./hooks/**/*.{js,ts,jsx,tsx}",
    "./dashboards/**/*.{js,ts,jsx,tsx}",
    "./data-catalogue/**/*.{js,ts,jsx,tsx}",
    "./lib/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      maxWidth: {
        hero: "780px",
      },
      spacing: {
        4.5: "18px",
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
      },
      colors: {
        "black": "#0F172A", // Slate 900
        "primary": "#2563EB",
        "primary-dark": "#0C204E",
        "success": "#22C55E", // Green 500
        "danger": "#DC2626", // Red 600
        "warning": "#FBBF24", // Amber 400
        "dim": "#64748B", // Slate 500
        "washed": "#F1F5F9", // Slate 100
        "outline": "#E2E8F0", // Slate 200
        "outlineHover": "#94A3B8", // Slate 400
        "background": "#F8FAFC", // Slate 500
      },
      gridTemplateColumns: {
        13: "repeat(13, minmax(0, 1fr))",
        14: "repeat(14, minmax(0, 1fr))",
      },
    },
  },
  plugins: [require("@tailwindcss/forms"), require("@tailwindcss/line-clamp")],
};
