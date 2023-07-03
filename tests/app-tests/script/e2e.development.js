/**
 * Run E2E tests on development server.
 *
 * Argument(s):
 * - project = "app" | "opendosm" | "docs"
 *
 * CLI Command:
 * - yarn e2e:dev --filter=app-tests
 */

const { testDevelopment } = require("utils");
testDevelopment("app", 3000);
