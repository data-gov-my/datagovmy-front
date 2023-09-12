import { test, expect } from "utils/playwright";
import { DashboardPage, HeroParameters } from "utils/model/dashboard";
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

test.skip("crime", async ({ page }) => {
  const board = new DashboardPage(page, "crime");
  await board.goto();
  await board.validateHero(parameters);
  await board.execute(mainTestSuite);
});

test.skip("crime/jhr", async ({ page }) => {
  const board = new DashboardPage(page, "crime/jhr");
  await board.goto();
  await board.validateHero(parameters);
  await board.execute(mainTestSuite);
});

test.skip("crime/kdh", async ({ page }) => {
  const board = new DashboardPage(page, "crime/kdh");
  await board.goto();
  await board.validateHero(parameters);
  await board.execute(mainTestSuite);
});

test.skip("crime/ktn", async ({ page }) => {
  const board = new DashboardPage(page, "crime/ktn");
  await board.goto();
  await board.validateHero(parameters);
  await board.execute(mainTestSuite);
});

test.skip("crime/mlk", async ({ page }) => {
  const board = new DashboardPage(page, "crime/mlk");
  await board.goto();
  await board.validateHero(parameters);
  await board.execute(mainTestSuite);
});

test.skip("crime/nsn", async ({ page }) => {
  const board = new DashboardPage(page, "crime/nsn");
  await board.goto();
  await board.validateHero(parameters);
  await board.execute(mainTestSuite);
});

test.skip("crime/phg", async ({ page }) => {
  const board = new DashboardPage(page, "crime/phg");
  await board.goto();
  await board.validateHero(parameters);
  await board.execute(mainTestSuite);
});

test.skip("crime/prk", async ({ page }) => {
  const board = new DashboardPage(page, "crime/prk");
  await board.goto();
  await board.validateHero(parameters);
  await board.execute(mainTestSuite);
});

test.skip("crime/pls", async ({ page }) => {
  const board = new DashboardPage(page, "crime/pls");
  await board.goto();
  await board.validateHero(parameters);
  await board.execute(mainTestSuite);
});

test.skip("crime/png", async ({ page }) => {
  const board = new DashboardPage(page, "crime/png");
  await board.goto();
  await board.validateHero(parameters);
  await board.execute(mainTestSuite);
});

test.skip("crime/sbh", async ({ page }) => {
  const board = new DashboardPage(page, "crime/sbh");
  await board.goto();
  await board.validateHero(parameters);
  await board.execute(mainTestSuite);
});

test.skip("crime/swk", async ({ page }) => {
  const board = new DashboardPage(page, "crime/swk");
  await board.goto();
  await board.validateHero(parameters);
  await board.execute(mainTestSuite);
});

test.skip("crime/sgr", async ({ page }) => {
  const board = new DashboardPage(page, "crime/sgr");
  await board.goto();
  await board.validateHero(parameters);
  await board.execute(mainTestSuite);
});

test.skip("crime/trg", async ({ page }) => {
  const board = new DashboardPage(page, "crime/trg");
  await board.goto();
  await board.validateHero(parameters);
  await board.execute(mainTestSuite);
});

test.skip("crime/kul", async ({ page }) => {
  const board = new DashboardPage(page, "crime/kul");
  await board.goto();
  await board.validateHero(parameters);
  await board.execute(mainTestSuite);
});

test.skip("crime/lbn", async ({ page }) => {
  const board = new DashboardPage(page, "crime/lbn");
  await board.goto();
  await board.validateHero(parameters);
  await board.execute(mainTestSuite);
});

test.skip("crime/pjy", async ({ page }) => {
  const board = new DashboardPage(page, "crime/pjy");
  await board.goto();
  await board.validateHero(parameters);
  await board.execute(mainTestSuite);
});
