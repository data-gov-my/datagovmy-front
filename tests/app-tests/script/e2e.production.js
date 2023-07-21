import { testProduction } from "utils";

/**
 * Builds target project (caches after) and run E2E tests.
 */
testProduction("app", 3000);
