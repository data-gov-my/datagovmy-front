import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";
import { resolve } from "path";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
  },
  // build: {
  //   lib: {
  //     entry: resolve(__dirname, "src/index.tsx"),
  //     name: "datagovmy-nextra",
  //     fileName: "index",
  //     formats: ["es"],
  //   },
  //   outDir: "dist",
  //   rollupOptions: {
  //     treeshake: true,
  //     external: ["nextra", "react"],
  //     plugins: [],
  //     output: {
  //       format: "esm",
  //       esModule: true,
  //       preserveModules: false,
  //     },
  //   },
  // },
});
