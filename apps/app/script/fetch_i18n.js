const axios = require("axios");
const path = require("path");
const fs = require("fs");
const { promisify } = require("util");
require("dotenv").config();

/**
 * Constants & Functions
 */
const lang_map = {
  "en-GB": "en",
  "ms-MY": "bm",
};
const map_lang = {
  en: "en-GB",
  bm: "ms-MY",
};
const base_dir = path.resolve(__dirname, "../public/locales");
const instance = () => {
  return axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    headers: {
      Authorization: process.env.NEXT_PUBLIC_AUTHORIZATION_TOKEN,
    },
  });
};
const fetchAvailablei18n = async () => {
  let files = [];
  const { data } = await instance()
    .get("/i18n")
    .catch(e => {
      throw new Error(e);
    });

  Object.entries(data).forEach(([key, i18ns]) => {
    i18ns.forEach(filename => {
      files.push([key, filename]);
    });
  });

  return files;
};
const fetchJson = (lang, filename) =>
  new Promise(async (resolve, reject) => {
    const { data } = await instance()
      .get(`/i18n?lang=${lang_map[lang]}&filename=${filename}`)
      .catch(e => {
        reject(e);
        throw new Error(e);
      });

    resolve(data);
  });
const writeFileAsync = promisify(fs.writeFile);
const ensureDirectoryExistence = filePath => {
  if (fs.existsSync(filePath)) {
    return true;
  }
  fs.mkdirSync(filePath);
};

/**
 * Script.
 */
const main = async () => {
  try {
    // Initialize
    ensureDirectoryExistence(base_dir);

    // Fetch available jsons
    const availablei18ns = await fetchAvailablei18n();

    // Fetch all i18ns
    const jsons = await Promise.all(availablei18ns.map(i18n => fetchJson(i18n[0], i18n[1])));

    // Writes the updated i18n JSONs to file
    await Promise.all(
      jsons.map(async file => {
        await writeFileAsync(
          path.join(base_dir, `${map_lang[file.language]}/${file.filename}`),
          JSON.stringify(file.translation_json, null, 2)
        );
        console.log(`${file.filename} saved successfully`);
      })
    );

    console.log("All files saved successfully");
  } catch (error) {
    console.error("Error saving files:", error);
    throw new Error(error);
  }
};

main();
