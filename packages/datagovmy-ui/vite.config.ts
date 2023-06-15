import { defineConfig } from "vite";
import dts from "vite-plugin-dts";
import react from "@vitejs/plugin-react";
import rename_node_modules from "rollup-plugin-rename-node-modules";
import { replaceContentInFiles } from "./script/clean_dts";
import { resolve } from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    dts({
      insertTypesEntry: true,
      clearPureImport: true,
      afterBuild: () => replaceContentInFiles("dist", ".d.ts", "./datagovmy-ui", "datagovmy-ui"),
    }),
  ],
  resolve: {
    alias: {
      src: resolve(__dirname, "./src/"),
    },
  },
  // define: {
  //   global: "window",
  // },
  build: {
    lib: {
      entry: {
        components: resolve(__dirname, "src/components/index.ts"),
        charts: resolve(__dirname, "src/components/Chart/index.ts"),
        hooks: resolve(__dirname, "src/hooks/index.ts"),
        api: resolve(__dirname, "src/lib/api.ts"),
        helpers: resolve(__dirname, "src/lib/helpers.ts"),
        decorators: resolve(__dirname, "src/lib/decorators.ts"),
        // styles: resolve(__dirname, "src/styles/index.ts"),
      },
      name: "datagovmy-ui",
      fileName: format => `[name].${format}.js`,
      formats: ["es"],
    },

    outDir: "dist",
    rollupOptions: {
      treeshake: true,
      external: [
        "react",
        "react-dom",
        "next",
        "next/link",
        "next/head",
        "next/image",
        "next/router",
        "next-i18next",
        "react-i18next",
        "i18next",
        "lodash",
        "luxon",
      ],

      output: {
        format: "esm",
        esModule: true,
        preserveModules: true,
        globals: {
          "react": "React",
          "next": "Next",
          "next/link": "NextLink",
          "next/head": "NextHead",
          "next/image": "NextImage",
          "next/router": "NextRouter",
          "next-i18next": "Nexti18Next",
          "react-i18next": "Reacti18Next",
          "i18next": "i18Next",
          "luxon": "Luxon",
          "lodash": "Lodash",
        },
        // Renames built 'node_modules' from to 'external'
        entryFileNames: chunkInfo => {
          if (chunkInfo.name.includes("node_modules")) {
            return chunkInfo.name.replace("node_modules", "external") + ".js";
          }
          return "[name].js";
        },
      },
    },
  },
});
