import { test, expect } from "utils/playwright";
import { DashboardPage, HeroParameters } from "utils/model/dashboard";
import { enumify } from "utils/helper";

/**
 * Please fill this in.
 */
const parameters: HeroParameters = {
  _agency: "Inland Revenue Board of Malaysia",
  _category: "Economy",
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

test("income-taxation/overview", async ({ page }) => {
  const board = new DashboardPage(page, "income-taxation/overview");
  await board.goto();
  await board.validateHero(parameters);
  await board.execute(mainTestSuite);
});

test.skip("income-taxation/individual-taxes", async ({ page }) => {
  const board = new DashboardPage(page, "income-taxation/overview");
  await board.goto();
  await board.validateHero(parameters);
  await board.execute(mainTestSuite);
});

test.skip("income-taxation/how-do-i-rank", async ({ page }) => {
  const board = new DashboardPage(page, "income-taxation/how-do-i-rank");
  await board.goto();
  await board.validateHero(parameters);
  await board.execute(mainTestSuite);
});
