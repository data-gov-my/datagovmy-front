import { defineConfig } from "tsup";
import tsconfig from "./tsconfig.json";

export default defineConfig({
  name: "datagovmy-nextra",
  entry: ["src/index.tsx"],
  format: "esm",
  dts: true,
  external: ["nextra"],
  outExtension: () => ({ js: ".js" }),
  target: tsconfig.compilerOptions.target as "es2016",
});
