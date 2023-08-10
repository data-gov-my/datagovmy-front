import { test, expect } from "utils/playwright";
import { DashboardPage, HeroParameters } from "utils/model/dashboard";
import { enumify } from "utils/helper";

/**
 * Please fill this in.
 */
const parameters: HeroParameters = {
  _agency: "National Transplant Resource Centre",
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

test("organ-donation", async ({ page }) => {
  const board = new DashboardPage(page, "organ-donation");
  await board.goto();
  await board.validateHero(parameters);
  await board.execute(mainTestSuite);
});

test("organ-donation/jhr", async ({ page }) => {
  const board = new DashboardPage(page, "organ-donation/jhr");
  await board.goto();
  await board.validateHero(parameters);
  await board.execute(mainTestSuite);
});

test("organ-donation/kdh", async ({ page }) => {
  const board = new DashboardPage(page, "organ-donation/kdh");
  await board.goto();
  await board.validateHero(parameters);
  await board.execute(mainTestSuite);
});

test("organ-donation/ktn", async ({ page }) => {
  const board = new DashboardPage(page, "organ-donation/ktn");
  await board.goto();
  await board.validateHero(parameters);
  await board.execute(mainTestSuite);
});

test("organ-donation/mlk", async ({ page }) => {
  const board = new DashboardPage(page, "organ-donation/mlk");
  await board.goto();
  await board.validateHero(parameters);
  await board.execute(mainTestSuite);
});

test("organ-donation/nsn", async ({ page }) => {
  const board = new DashboardPage(page, "organ-donation/nsn");
  await board.goto();
  await board.validateHero(parameters);
  await board.execute(mainTestSuite);
});

test("organ-donation/phg", async ({ page }) => {
  const board = new DashboardPage(page, "organ-donation/phg");
  await board.goto();
  await board.validateHero(parameters);
  await board.execute(mainTestSuite);
});

test("organ-donation/prk", async ({ page }) => {
  const board = new DashboardPage(page, "organ-donation/prk");
  await board.goto();
  await board.validateHero(parameters);
  await board.execute(mainTestSuite);
});

test("organ-donation/pls", async ({ page }) => {
  const board = new DashboardPage(page, "organ-donation/pls");
  await board.goto();
  await board.validateHero(parameters);
  await board.execute(mainTestSuite);
});

test("organ-donation/png", async ({ page }) => {
  const board = new DashboardPage(page, "organ-donation/png");
  await board.goto();
  await board.validateHero(parameters);
  await board.execute(mainTestSuite);
});

test("organ-donation/sbh", async ({ page }) => {
  const board = new DashboardPage(page, "organ-donation/sbh");
  await board.goto();
  await board.validateHero(parameters);
  await board.execute(mainTestSuite);
});

test("organ-donation/swk", async ({ page }) => {
  const board = new DashboardPage(page, "organ-donation/swk");
  await board.goto();
  await board.validateHero(parameters);
  await board.execute(mainTestSuite);
});

test("organ-donation/sgr", async ({ page }) => {
  const board = new DashboardPage(page, "organ-donation/sgr");
  await board.goto();
  await board.validateHero(parameters);
  await board.execute(mainTestSuite);
});

test("organ-donation/trg", async ({ page }) => {
  const board = new DashboardPage(page, "organ-donation/trg");
  await board.goto();
  await board.validateHero(parameters);
  await board.execute(mainTestSuite);
});

test("organ-donation/kul", async ({ page }) => {
  const board = new DashboardPage(page, "organ-donation/kul");
  await board.goto();
  await board.validateHero(parameters);
  await board.execute(mainTestSuite);
});

test("organ-donation/lbn", async ({ page }) => {
  const board = new DashboardPage(page, "organ-donation/lbn");
  await board.goto();
  await board.validateHero(parameters);
  await board.execute(mainTestSuite);
});

test("organ-donation/pjy", async ({ page }) => {
  const board = new DashboardPage(page, "organ-donation/pjy");
  await board.goto();
  await board.validateHero(parameters);
  await board.execute(mainTestSuite);
});
