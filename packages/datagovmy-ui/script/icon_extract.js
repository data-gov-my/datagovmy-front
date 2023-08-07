/**
 * Script to extract SVG icon, convert to tsx and sanitize to React-friendly attributes.
 * Arguments: None
 */
const fs = require("fs");
const path = require("path");

// Declare constants & helper functions
const outputImportStatements = `import { FunctionComponent } from "react";
import { IconProps } from ".";

`;

const outputIconTemplate = (name, text) => {
  return `/**
* ${name} Icon
* @param className
* @returns ${name}Icon
*/
export const ${name}Icon: FunctionComponent<IconProps> = ({ className }) => {
    return ${sanitizeToReactAttrs(text)}
}`;
};

const sanitizeToReactAttrs = text => {
  return text
    .replace(
      `xmlns="http://www.w3.org/2000/svg"`,
      `xmlns="http://www.w3.org/2000/svg" className={className}`
    )
    .replaceAll("clip-rule", "clipRule")
    .replaceAll("clip-path", "clipPath")
    .replaceAll("stroke-width", "strokeWidth")
    .replaceAll("stroke-linecap", "strokeLinecap")
    .replaceAll("stroke-linejoin", "strokeLinejoin")
    .replaceAll("fill-rule", "fillRule");
};

// Script.
function main() {
  const ROOT_DIR = path.join(__dirname, "..");
  //   const [type, input] = process.argv.slice(2);

  // Input dir
  const iconsDir = path.join(__dirname, "./assets/icons");

  // Output dir
  const outputFilename = path.join(ROOT_DIR, "./components/Icon/agency.tsx");

  // Read the directory and filter only the SVG files
  const svgFiles = fs.readdirSync(iconsDir).filter(file => path.extname(file) === ".svg");

  // Build the output string with the export statements for each SVG icon
  const outputString = outputImportStatements.concat(
    svgFiles
      .map(svgFile => {
        const iconName = path.basename(svgFile, ".svg");
        const svgContent = fs.readFileSync(path.join(iconsDir, svgFile), "utf-8");
        return outputIconTemplate(iconName, svgContent);
      })
      .join("\n")
  );

  // Save & format output file
  fs.writeFileSync(outputFilename, outputString, "utf-8");

  console.log("✅ Conversion finished. \nOutput file: ", outputFilename);
}

main();
