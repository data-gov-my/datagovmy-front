import http from "http";
import { exec } from "child_process";

/**
 * Builds target project (caches after) and run E2E tests.
 *
 * Argument(s):
 * - project = "app" | "opendosm" | "docs"
 * - port = 3000 | 3001 | 3002
 *
 * CLI Command:
 * @example yarn e2e:prod --filter=app=test
 */

export const testProduction = (project, port) => {
  function clog(text) {
    console.log(`[${project}] ${text}`);
  }
  try {
    if (!project && !port) throw new Error("Missing or invalid project / workspace argument");
    const command = `start-server-and-test "(cd ../../apps/${project} && yarn start)" http://localhost:${port} "playwright test"`;

    exec(command, (error, stdout, stderr) => {
      clog(stdout);
      if (error) throw new Error(error);
      else clog("E2E tests completed successfully!");
    });
  } catch (error) {
    clog(error.message);
  }
};

/**
 * Run E2E tests on development server.
 *
 * Argument(s):
 * - project = "app" | "opendosm" | "docs"
 * - port = 3000 | 3001 | 3002
 *
 * CLI Command:
 * @example yarn e2e:dev --filter=app=test
 */

export const testDevelopment = (project, port) => {
  function clog(text) {
    console.log(`[${project}] ${text}`);
  }

  try {
    // Validation layer
    if (!project && !port) throw new Error("Missing or invalid project / workspace argument");
    if (checkUrlExists(port)) {
      clog("Project is running & ready for E2E testing.");
    } else {
      throw new Error("Development server is not running.");
    }

    // E2E begins
    const command = "playwright test";
    exec(command, (error, stdout, stderr) => {
      clog(stdout);
      if (error) throw new Error(error);
      else clog("E2E tests completed successfully!");
    });
  } catch (error) {
    clog(error.message);
  }
};

/**
 * Checks if development server is running
 * @param {number} port
 * @returns {boolean} result
 */

async function checkUrlExists(port) {
  return new Promise(resolve => {
    http
      .request({ method: "GET", host: "localhost", port, path: "/" }, () => resolve(true))
      .on("error", e => {
        console.error(e);
        resolve(false);
      })
      .end();
  });
}
