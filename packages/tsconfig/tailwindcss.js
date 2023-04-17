/** @type {import('tailwindcss').Config} */
const { fontFamily } = require("tailwindcss/defaultTheme");

module.exports = {
  darkMode: "class",
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
        sans: ["var(--font-body)", ...fontFamily.sans],
        body: ["var(--font-body)", ...fontFamily.sans],
        header: ["var(--font-header)"],
      },
      colors: {
        "black": "#18181B", // Zinc 900
        "primary": "#2563EB",
        "primary-dark": "#3E7AFF",
        "success": "#22C55E", // Green 500
        "danger": "#DC2626", // Red 600
        "warning": "#FBBF24", // Amber 400
        "dim": "#71717A", // Zinc 500
        "washed": "#F1F5F9", // Slate 100
        "washed-dark": "#27272A", // Zinc 800
        "outline": "#E2E8F0", // Slate 200
        "outlineHover": "#94A3B8", // Slate 400
        "outlineHover-dark": "#3F3F46", // Zinc 700
        "background": "#F8FAFC", // Slate 500
        "background-dark": "#121212", // Slate 500
        "purple": "#7C3AED", // Violet 600
      },
      gridTemplateColumns: {
        13: "repeat(13, minmax(0, 1fr))",
        14: "repeat(14, minmax(0, 1fr))",
      },
      backgroundImage: {
        "gradient-radial":
          "radial-gradient(59.1% 166.02% at 50% -66.02%, var(--tw-gradient-stops))",
      },
    },
  },
  future: {
    hoverOnlyWhenSupported: true,
  },
  plugins: [require("@tailwindcss/forms")],
};
