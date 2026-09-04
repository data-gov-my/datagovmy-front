const config = require("tsconfig/tailwindcss");

module.exports = {
  ...config,
  content: [
    ...config.content,
    "../../packages/datagovmy-nextra/src/components/ai-helper.tsx",
    "../../packages/datagovmy-nextra/src/components/button.tsx",
    "../../packages/datagovmy-nextra/src/components/text-area.tsx",
    "../../packages/datagovmy-nextra/src/components/tooltip.tsx",
  ],
  theme: {
    ...config.theme,
    extend: {
      ...config.theme.extend,
      colors: {
        ...config.theme.extend.colors,
        "primary-dgm": "#2563EB",
      },
    },
  },
};
