const { fontFamily } = require("tailwindcss/defaultTheme");

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: [
    "../../packages/datagovmy-ui/src/**/*.{js,ts,jsx,tsx}",
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
        sans: ["var(--font-body)", ...fontFamily.sans],
        body: ["var(--font-body)", ...fontFamily.sans],
        header: ["var(--font-header)"],
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
      boxShadow: {
        button: "0 1px 2px rgba(0, 0, 0, 0.1)",
        floating: "0 6px 24px rgba(0, 0, 0, 0.1)",
      },
    },
  },
  plugins: [require("@tailwindcss/forms")],
};
