import { test, expect } from "utils/playwright";
import { DashboardPage, HeroParameters } from "@model/dashboard.js";
import { enumify } from "utils/helper";

/**
 * Please fill this in.
 */
const parameters: HeroParameters = {
  _agency: "",
  _category: "",
};
const ID = enumify([
  // eg. "timeseries-test-id"
]);

/************************** COMMON TEST **************************/

/**
 * Main test suite for the dashboard.
 * @param page Playwright page context
 * @description Note: For dashboard with children dashboards (ie. states, sekolah etc),
 *              DO NOT place any edge-test cases in here, as it will run at every child
 *              dashboard.
 *              Create a separate or inline function and pass it to `board.execute()`
 *              method
 * @example // Separate function
 * async function sectionATestSuite (board: DashboardPage) { ... }
 * await board.execute(sectionATestSuite)
 * @example // Inline function
 * await board.execute(async (board: DashboardPage) => { ... })
 */
const mainTestSuite = async (board: DashboardPage) => {};

/************************** TEST SUITE **************************/

test.skip("birthday-explorer", async ({ page }) => {
  const board = new DashboardPage(page, "birthday-explorer");
  await board.goto();
  await board.validateHero(parameters);
  await board.execute(mainTestSuite);
});
