/**
 * Builds target project (caches after) and run E2E tests.
 *
 * Argument(s):
 * - project = "app" | "opendosm" | "docs"
 *
 * CLI Command:
 * - yarn e2e:prod -- --filter=datagovmy-tests -- app
 */

const { testProduction } = require("utils");
testProduction("app", 3000);
