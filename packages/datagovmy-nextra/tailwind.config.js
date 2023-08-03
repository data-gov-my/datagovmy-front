const colors = require("tailwindcss/colors");
const { fontFamily } = require("tailwindcss/defaultTheme");

const makePrimaryColor =
  l =>
  ({ opacityValue }) => {
    if (opacityValue === undefined) {
      return `hsl(var(--nextra-primary-hue) 100% ${l}%)`;
    }
    return `hsl(var(--nextra-primary-hue) 100% ${l}% / ${opacityValue})`;
  };

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.tsx"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", ...fontFamily.sans],
        body: ["Inter", ...fontFamily.sans],
        header: ["Poppins", ...fontFamily.sans],
      },
      screens: {
        "sm": "640px",
        "md": "768px",
        "lg": "1024px",
        "xl": "1280px",
        "2xl": "1536px",
      },
      fontSize: {
        "xs": ".75rem",
        "sm": ".875rem",
        "base": "1rem",
        "lg": "1.125rem",
        "xl": "1.25rem",
        "2xl": "1.5rem",
        "3xl": "1.875rem",
        "4xl": "2.25rem",
        "5xl": "3rem",
        "6xl": "4rem",
      },
      boxShadow: {
        button: "0 1px 2px rgba(0, 0, 0, 0.1)",
        floating: "0 6px 24px rgba(0, 0, 0, 0.1)",
      },
      colors: {
        "dark": "#111",
        "black": "#18181B", // Zinc 900
        "primary": {
          50: makePrimaryColor(97),
          100: makePrimaryColor(94),
          200: makePrimaryColor(86),
          300: makePrimaryColor(77),
          400: makePrimaryColor(66),
          500: makePrimaryColor(50),
          600: makePrimaryColor(45),
          700: makePrimaryColor(39),
          750: makePrimaryColor(35),
          800: makePrimaryColor(32),
          900: makePrimaryColor(24),
        },
        "primary-dgm": "#2563EB",
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
        "background-dark": "#121212",
        "purple": "#7C3AED", // Violet 600
      },
      letterSpacing: {
        tight: "-0.015em",
      },
    },
  },
  darkMode: ["class", 'html[class~="dark"]'],
};
