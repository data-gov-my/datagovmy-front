import crypto from "crypto";
import fetch from "node-fetch";

const MAX_RETRIES = 5; // Max 5 attempts
const RETRY_DELAY_MS = 1000; // 1 second
const EDGE_CONFIG_URL = process.env.EDGE_CONFIG_URL;
const VERCEL_ACCESS_TOKEN = process.env.VERCEL_ACCESS_TOKEN;
const WORKFLOW_TOKEN = process.env.WORKFLOW_TOKEN;

/**
 * Token generator.
 * @param {number} length // token length
 * @returns {string}      // new token
 */
const generateToken = (length = 32) => {
  return crypto.randomBytes(length).toString("hex");
};

/**
 * Just wait.
 * @param {number} ms     // milliseconds
 * @returns {Promise<void>}
 */
const wait = ms => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

/**
 * POST helper to update BE services
 * @param {string} url
 * @param {{ ROLLING_TOKEN: string}} payload
 * @returns {{ url: string }}
 */
const post = (url, payload) =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${WORKFLOW_TOKEN}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`Request failed with status: ${JSON.stringify(response)}`);
      }

      //   const data = await response.json();
      resolve({ url });
    } catch (error) {
      console.error("Error:", error);
      reject({ url });
    }
  });
/**
 * PATCH helper to update EdgeConfig (token store)
 * @param {string} url
 * @param {{ items: [{operation: "update", key: "ROLLING_TOKEN", value: string}] } payload }
 * @returns {{ url: string } | Error}
 */
const patch = (url, payload) =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await fetch(url, {
        method: "PATCH",
        headers: {
          "Authorization": `Bearer ${VERCEL_ACCESS_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(JSON.stringify(response.error, null, 2));
      }

      const data = await response.json();
      resolve(data);
    } catch (error) {
      console.error("Error:", JSON.stringify(error));
      reject(error);
    }
  });

/**
 * Main Lambda entry function.
 * Workflow:
 * 1. Generate a new rolling token.
 * 2. PATCH the new token EdgeConfig (Vercel's token store)
 * 3. If PATCH fails, exit the lambda function.
 * 4. Else, POST the new token to all relevant services.
 * 5. If any of the POST attempt fails, retry. Maximum retries: 5; Interval between retries: 1s
 * 6. Lambda ends by:
 *    - Successfully POST to all services with max allowed retries
 *    - Max retries reached; if still fail, then gg loh
 * @param {Event} event
 * @returns {void}
 */
export const handler = async event => {
  let retries = 0;
  const token = generateToken();

  //   Update token to token store (Vercel EdgeConfig) first
  const patchToken = await patch(EDGE_CONFIG_URL, {
    items: [
      {
        operation: "update",
        key: "ROLLING_TOKEN",
        value: token,
      },
    ],
  });

  // If patch operation fails, retry entire lambda function.
  if (!patchToken)
    return {
      statusCode: 400,
      body: "Error: Failed to update Vercel EdgeConfig. Proceed to retry lambda function",
    };

  // Else (patch operation successful), push token to all relevant services
  const payload = { ROLLING_TOKEN: token };

  let services_to_update = [
    post("insert-url-here", payload), // BE
    // ...
  ];

  while (retries < MAX_RETRIES) {
    console.log("#### Attempt", retries + 1, "#####");

    const results = await Promise.allSettled(services_to_update);
    console.log("POST results", results);

    services_to_update = services_to_update.filter(
      (_, index) => results[index].status !== "fulfilled"
    );
    console.log("Services that failed POST:", services_to_update.length);

    // Exit the retry loop if the all services have been updated
    if (services_to_update.length === 0) {
      console.log("Exiting at attempt #", retries + 1);
      break;
    }
    retries++;

    if (retries < MAX_RETRIES) {
      await wait(RETRY_DELAY_MS);
    }
  }
  if (services_to_update.length > 0)
    return {
      statusCode: 400,
      body: "Error: Failed to update services. Proceed to retry lambda function",
    };
  else
    return {
      statusCode: 200,
      body: "Success: Rolling token generated & all services updated",
    };
};
