const axios = require("axios");
const path = require("path");
const fs = require("fs");
const { promisify } = require("util");
require("dotenv").config();

const base_dir = path.resolve(__dirname, "../public/locales");
const instance = () => {
  return axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    headers: {
      Authorization: process.env.NEXT_PUBLIC_AUTHORIZATION_TOKEN,
    },
  });
};
/**
 * Fetches the available i18n JSON in production
 * @returns {Promise<Array<[language, namespace]>>}
 */
const fetchAvailablei18n = async () => {
  let files = [];
  const { data } = await instance()
    .get("/i18n")
    .catch(e => {
      throw new Error(e);
    });

  Object.entries(data).forEach(([lang, i18ns]) => {
    i18ns.forEach(namespace => {
      files.push([lang, namespace]);
    });
  });

  return files;
};
/**
 * Fetches the i18n JSON
 * @param {"en-GB" | "ms-MY"} lang
 * @param {Object} filename
 * @returns {Promise<Array<[language, namespace, json]>>}
 */
const fetchJson = (lang, namespace) =>
  new Promise(async (resolve, reject) => {
    const { data } = await instance()
      .get(`/i18n?lang=${lang}&filename=${namespace}`)
      .catch(e => {
        reject(e);
        throw new Error(e);
      });

    resolve([lang, namespace, data]);
  });
const writeFileAsync = promisify(fs.writeFile);
const ensureDirectoryExists = filePath => {
  if (fs.existsSync(filePath)) {
    return true;
  }
  fs.mkdirSync(filePath);
};

/** ---------------------------------------------------------------------------------------------------------------------------- */

/**
 * Script to populate local i18n jsons for development environment. Sourced from production i18n.
 * @override Warning: Running this script will override existing i18n files in your local development. Make sure to rename any file to avoid from being overridden
 * @summary Command: yarn i18n | yarn workspace app i18n (turborepo)
 */
const main = async () => {
  try {
    // Initialize
    ensureDirectoryExists(base_dir);

    // Fetch available jsons
    const availablei18ns = await fetchAvailablei18n();

    // Fetch all i18ns
    const jsons = await Promise.all(
      availablei18ns.map(([lang, namespace]) => fetchJson(lang, namespace))
    );

    // Writes the updated i18n JSONs to file
    await Promise.all(
      jsons.map(async ([lang, namespace, json]) => {
        await writeFileAsync(
          path.join(base_dir, `${lang}/${namespace}`),
          JSON.stringify(json, null, 2)
        );
        console.log(`${namespace} saved successfully`);
      })
    );

    console.log("All files saved successfully");
  } catch (error) {
    console.error("Error saving files:", error);
    throw new Error(error);
  }
};

main();
