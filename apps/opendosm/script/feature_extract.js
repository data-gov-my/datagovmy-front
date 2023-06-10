/**
 * Script.

 * Arguments:
 * - type: "district" | "parlimen" | "dun" | "state"
 * - input: Path to GeoJSON object (.json)
 */

const fs = require("fs");
const path = require("path");
function main() {
  const ROOT_DIR = path.join(__dirname, "..");

  const [type, input] = process.argv.slice(2);
  const dir = path.join(ROOT_DIR, "./lib/geojson/kawasanku", type);

  import(input, { assert: { type: "json" } }).then(geojson => {
    const features = geojson.default.features;

    features.forEach(feature => {
      const id = {
        state: feature.id,
        district: feature.properties.district,
        parlimen: feature.properties.parlimen,
        dun: feature.properties.dun,
      }[type];
      fs.appendFileSync(
        path.join(dir, sanitizeId(id) + ".ts"),
        template(JSON.stringify(feature)),
        "utf-8"
      );
    });
  });
}

const sanitizeId = id => {
  return id.toLowerCase().replaceAll(" ", "_");
};

const template = feature => {
  return `export default ${feature}`;
};

/** Execution */
main();
