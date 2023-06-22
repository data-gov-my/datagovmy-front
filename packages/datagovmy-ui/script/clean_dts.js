import fs from "fs";
import path from "path";
export const replaceContentInFiles = (
  directoryPath,
  fileExtension,
  searchContent,
  replaceContent
) => {
  // Read the contents of the directory
  fs.readdir(directoryPath, (err, files) => {
    if (err) {
      console.error("Error reading directory:", err);
      return;
    }

    // Iterate through the files
    files.forEach(file => {
      const filePath = path.join(directoryPath, file);

      // Check if the current item is a file or a directory
      fs.stat(filePath, (err, stats) => {
        if (err) {
          console.error("Error stating file:", err);
          return;
        }

        if (stats.isFile() && file.endsWith(fileExtension)) {
          // Read the file contents
          fs.readFile(filePath, "utf8", (err, data) => {
            if (err) {
              console.error("Error reading file:", err);
              return;
            }

            // Replace the content
            const updatedContent = data.replace(searchContent, replaceContent);

            // Write the updated content back to the file
            fs.writeFile(filePath, updatedContent, "utf8", err => {
              if (err) {
                console.error("Error writing to file:", err);
              } else {
                console.log(`Replaced content in file: ${filePath}`);
              }
            });
          });
        } else if (stats.isDirectory()) {
          // Recursively call the function for subdirectories
          replaceContentInFiles(filePath, fileExtension, searchContent, replaceContent);
        }
      });
    });
  });
};
