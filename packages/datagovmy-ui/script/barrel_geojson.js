/**
 * Script.

 * Arguments:
 * - type: "district" | "parlimen" | "dun" | "state"
 * - input: Path to GeoJSON object (.json)
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function main() {
  const ROOT_DIR = path.join(__dirname, "..");

  const [type, input] = process.argv.slice(2);
  const dir = path.join(ROOT_DIR, "./src/lib/geojson", type);

  let barrel = "";

  fs.readdirSync(dir).forEach(file => {
    // Ignore all files prefixed with _
    if (file.at(0) === "_") return;

    // Remove extension
    const _file = file.replace(".ts", "");

    // Add to barrel export
    barrel += `"${_file}": import("./${_file}").then(module => module.default),\n`;
  });

  fs.appendFileSync(path.join(dir, "index.ts"), template(barrel), "utf-8");
}

const template = feature => {
  return `export default {\n${feature}}`;
};

/** Execution */
main();
