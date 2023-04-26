// const { Command } = require("commander");
const axios = require("axios");
const path = require("path");
const fs = require("fs/promises");
require("dotenv").config();

// TODO: Pls do not use this. Leaving it here for future use case

const base_dir = path.resolve(__dirname, ".");
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
/**
 * Patches the i18n JSON on prod
 * @param {"en-GB" | "ms-MY"} lang
 * @param {Object} filename
 * @returns {Promise<Array<[language, namespace, json]>>}
 */
const patchJson = (lang, namespace, json) =>
  new Promise(async (resolve, reject) => {
    await instance()
      .patch("/i18", { data: { filaname: namespace, translation: json, lang: lang } })
      .catch(e => {
        reject(e);
        throw new Error(e);
      });
    console.log(`${lang}/${namespace} successfullt patched to production`);
    resolve(`${lang}/${namespace} successfullt patched to production`);
  });
/**
 * Patches the i18n JSON on prod
 * @param {"en-GB" | "ms-MY"} lang
 * @param {Object} filename
 * @returns {Promise<Array<[language, namespace, json]>>}
 */
const postJson = (lang, namespace, json) =>
  new Promise(async (resolve, reject) => {
    await instance()
      .post("/i18", { data: { filaname: namespace, translation: json, lang: lang } })
      .catch(e => {
        reject(e);
        throw new Error(e);
      });
    console.log(`${lang}/${namespace} successfullt patched to production`);
    resolve(`${lang}/${namespace} successfullt patched to production`);
  });
/**
 * Reads the i18n JSON
 * @param {"en-GB" | "ms-MY"} lang
 * @param {Object} filename
 * @returns {Promise<Array<[language, namespace, json]>>}
 */
const readJson = (dir, lang, namespace) =>
  new Promise(async (resolve, reject) => {
    const data = await fs
      .readFile(path.resolve(dir, `${lang}/${namespace}.json`), {
        encoding: "utf-8",
      })
      .catch(e => reject(e));
    resolve([lang, namespace, data]);
  });

const ensureDirectoryExists = filePath => {
  if (fs.existsSync(filePath)) {
    return true;
  }
  fs.mkdirSync(filePath);
};

/** ---------------------------------------------------------------------------------------------------------------------------- */

/**
 * @deprecated Production i18ns are now managed in `datagovmy-meta`.
 * CLI commands to manage i18n.
 * @example yarn i18n pull ... | (turborepo) yarn workspace app i18n pull ...
 * @example yarn i18n push ... | (turborepo) yarn workspace app i18n push ...
 */

const program = new Command("i18n")
  .description("Commands to manage i18n for development and production environment")
  .version("0.0.1");

program
  .name("pull")
  .command("pull")
  .description(
    "Pulls and populates local i18n jsons. Sourced from production i18n. WARNING: Running this script will override existing i18n files in your local development. Make sure to rename any file to avoid from being overridden"
  )
  .option("-d --dir <path>", "Directory to populate to", base_dir)
  .action(async (name, option, command) => {
    try {
      // Initialize
      ensureDirectoryExists(option.dir);

      // Fetch available jsons
      const availablei18ns = await fetchAvailablei18n();

      // Fetch all i18ns
      const jsons = await Promise.all(
        availablei18ns.map(([lang, namespace]) => fetchJson(lang, namespace))
      );

      // Writes the updated i18n JSONs to file
      await Promise.all(
        jsons.map(async ([lang, namespace, json]) => {
          await fs.writeFile(
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
  });

program
  .name("push")
  .command("push")
  .description("Pushes local i18n json to production.")
  .argument("<namespace>")
  .requiredOption("-l --locale <language...>", "Available: en-GB, ms-MY")
  .option("-d --dir <path>", "Parent direcortory for locales", base_dir)
  .option("-n --new", "New i18n file", false)
  .addHelpText(
    "after",
    "\nExamples: \n<yarn command> i18n push common --locale en-GB  // Push common.json for en-GB"
  )
  .addHelpText(
    "after",
    "<yarn command> i18n push common --locale en-GB ms-MY // Push common.json for both en-GB and ms-MY\n"
  )
  .action(async (namespace, option) => {
    try {
      const locales = option.locale;
      const dir = option.dir;
      const is_new = option.new;

      // Checks for valid locales
      if (!Array.isArray(locales))
        throw new Error("Invalid locales given. Available options: en-GB, ms-MY");

      // Reads the specified i18n json with the locales given
      const jsons = await Promise.all(locales.map(([lang]) => readJson(dir, lang, namespace)));

      // If the pushed i18n is a new translation, POST. Else, PATCH
      if (is_new)
        await Promise.all(jsons.map(([lang, namespace, json]) => postJson(lang, namespace, json)));
      else
        await Promise.all(jsons.map(([lang, namespace, json]) => patchJson(lang, namespace, json)));
      console.log("Push operation complete");
    } catch (error) {
      console.error("Error pushing:", error);
      throw new Error(error);
    }
  });

program.parse(process.argv);
