import { test, expect } from "utils/playwright";
import { DashboardPage, HeroParameters } from "utils/model/dashboard";
import { enumify } from "utils/helper";

/**
 * Please fill this in.
 */
const parameters: HeroParameters = {
  _agency: "ProtectHealth Corporation",
  _category: "Healthcare",
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

test("peka-b40", async ({ page }) => {
  const board = new DashboardPage(page, "peka-b40");
  await board.goto();
  await board.validateHero(parameters);
  await board.execute(mainTestSuite);
});

test("peka-b40/jhr", async ({ page }) => {
  const board = new DashboardPage(page, "peka-b40/jhr");
  await board.goto();
  await board.validateHero(parameters);
  await board.execute(mainTestSuite);
});

test("peka-b40/kdh", async ({ page }) => {
  const board = new DashboardPage(page, "peka-b40/kdh");
  await board.goto();
  await board.validateHero(parameters);
  await board.execute(mainTestSuite);
});

test("peka-b40/ktn", async ({ page }) => {
  const board = new DashboardPage(page, "peka-b40/ktn");
  await board.goto();
  await board.validateHero(parameters);
  await board.execute(mainTestSuite);
});

test("peka-b40/mlk", async ({ page }) => {
  const board = new DashboardPage(page, "peka-b40/mlk");
  await board.goto();
  await board.validateHero(parameters);
  await board.execute(mainTestSuite);
});

test("peka-b40/nsn", async ({ page }) => {
  const board = new DashboardPage(page, "peka-b40/nsn");
  await board.goto();
  await board.validateHero(parameters);
  await board.execute(mainTestSuite);
});

test("peka-b40/phg", async ({ page }) => {
  const board = new DashboardPage(page, "peka-b40/phg");
  await board.goto();
  await board.validateHero(parameters);
  await board.execute(mainTestSuite);
});

test("peka-b40/prk", async ({ page }) => {
  const board = new DashboardPage(page, "peka-b40/prk");
  await board.goto();
  await board.validateHero(parameters);
  await board.execute(mainTestSuite);
});

test("peka-b40/pls", async ({ page }) => {
  const board = new DashboardPage(page, "peka-b40/pls");
  await board.goto();
  await board.validateHero(parameters);
  await board.execute(mainTestSuite);
});

test("peka-b40/png", async ({ page }) => {
  const board = new DashboardPage(page, "peka-b40/png");
  await board.goto();
  await board.validateHero(parameters);
  await board.execute(mainTestSuite);
});

test("peka-b40/sbh", async ({ page }) => {
  const board = new DashboardPage(page, "peka-b40/sbh");
  await board.goto();
  await board.validateHero(parameters);
  await board.execute(mainTestSuite);
});

test("peka-b40/swk", async ({ page }) => {
  const board = new DashboardPage(page, "peka-b40/swk");
  await board.goto();
  await board.validateHero(parameters);
  await board.execute(mainTestSuite);
});

test("peka-b40/sgr", async ({ page }) => {
  const board = new DashboardPage(page, "peka-b40/sgr");
  await board.goto();
  await board.validateHero(parameters);
  await board.execute(mainTestSuite);
});

test("peka-b40/trg", async ({ page }) => {
  const board = new DashboardPage(page, "peka-b40/trg");
  await board.goto();
  await board.validateHero(parameters);
  await board.execute(mainTestSuite);
});

test("peka-b40/kul", async ({ page }) => {
  const board = new DashboardPage(page, "peka-b40/kul");
  await board.goto();
  await board.validateHero(parameters);
  await board.execute(mainTestSuite);
});

test("peka-b40/lbn", async ({ page }) => {
  const board = new DashboardPage(page, "peka-b40/lbn");
  await board.goto();
  await board.validateHero(parameters);
  await board.execute(mainTestSuite);
});

test("peka-b40/pjy", async ({ page }) => {
  const board = new DashboardPage(page, "peka-b40/pjy");
  await board.goto();
  await board.validateHero(parameters);
  await board.execute(mainTestSuite);
});
