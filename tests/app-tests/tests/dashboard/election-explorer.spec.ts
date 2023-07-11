import { test, expect } from "utils/playwright";
import { DashboardPage, HeroParameters } from "@model/dashboard.js";
import { enumify } from "utils/helper";

/**
 * Please fill this in.
 */
const parameters: HeroParameters = {
  _agency: "Election Commission of Malaysia",
  _category: "Democracy",
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

test("election-explorer/elections", async ({ page }) => {
  const board = new DashboardPage(page, "election-explorer/elections");
  await board.goto();
  await board.validateHero(parameters);
  await board.execute(mainTestSuite);
});

test("election-explorer/candidates", async ({ page }) => {
  const board = new DashboardPage(page, "election-explorer/candidates");
  await board.goto();
  await board.validateHero(parameters);
  await board.execute(mainTestSuite);
});

test("election-explorer/parties", async ({ page }) => {
  const board = new DashboardPage(page, "election-explorer/parties");
  await board.goto();
  await board.validateHero(parameters);
  await board.execute(mainTestSuite);
});

test("election-explorer/seats", async ({ page }) => {
  const board = new DashboardPage(page, "election-explorer/seats");
  await board.goto();
  await board.validateHero(parameters);
  await board.execute(mainTestSuite);
});

test("election-explorer/trivia", async ({ page }) => {
  const board = new DashboardPage(page, "election-explorer/trivia");
  await board.goto();
  await board.validateHero(parameters);
  await board.execute(mainTestSuite);
});
