import { test, expect } from "utils/playwright";
import { DashboardPage, HeroParameters } from "@model/dashboard.js";
import { enumify } from "utils/helper";

/**
 * Please fill this in.
 */
const parameters: HeroParameters = {
  _agency: "Ministry of the Economy",
  _category: "Government Programs",
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

test("ipr", async ({ page }) => {
  const board = new DashboardPage(page, "ipr");
  await board.goto();
  await board.validateHero(parameters);
  await board.execute(mainTestSuite);
});

test("ipr/jhr", async ({ page }) => {
  const board = new DashboardPage(page, "ipr/jhr");
  await board.goto();
  await board.validateHero(parameters);
  await board.execute(mainTestSuite);
});

test("ipr/kdh", async ({ page }) => {
  const board = new DashboardPage(page, "ipr/kdh");
  await board.goto();
  await board.validateHero(parameters);
  await board.execute(mainTestSuite);
});

test("ipr/ktn", async ({ page }) => {
  const board = new DashboardPage(page, "ipr/ktn");
  await board.goto();
  await board.validateHero(parameters);
  await board.execute(mainTestSuite);
});

test("ipr/mlk", async ({ page }) => {
  const board = new DashboardPage(page, "ipr/mlk");
  await board.goto();
  await board.validateHero(parameters);
  await board.execute(mainTestSuite);
});

test("ipr/nsn", async ({ page }) => {
  const board = new DashboardPage(page, "ipr/nsn");
  await board.goto();
  await board.validateHero(parameters);
  await board.execute(mainTestSuite);
});

test("ipr/phg", async ({ page }) => {
  const board = new DashboardPage(page, "ipr/phg");
  await board.goto();
  await board.validateHero(parameters);
  await board.execute(mainTestSuite);
});

test("ipr/prk", async ({ page }) => {
  const board = new DashboardPage(page, "ipr/prk");
  await board.goto();
  await board.validateHero(parameters);
  await board.execute(mainTestSuite);
});

test("ipr/pls", async ({ page }) => {
  const board = new DashboardPage(page, "ipr/pls");
  await board.goto();
  await board.validateHero(parameters);
  await board.execute(mainTestSuite);
});

test("ipr/png", async ({ page }) => {
  const board = new DashboardPage(page, "ipr/png");
  await board.goto();
  await board.validateHero(parameters);
  await board.execute(mainTestSuite);
});

test("ipr/sbh", async ({ page }) => {
  const board = new DashboardPage(page, "ipr/sbh");
  await board.goto();
  await board.validateHero(parameters);
  await board.execute(mainTestSuite);
});

test("ipr/swk", async ({ page }) => {
  const board = new DashboardPage(page, "ipr/swk");
  await board.goto();
  await board.validateHero(parameters);
  await board.execute(mainTestSuite);
});

test("ipr/sgr", async ({ page }) => {
  const board = new DashboardPage(page, "ipr/sgr");
  await board.goto();
  await board.validateHero(parameters);
  await board.execute(mainTestSuite);
});

test("ipr/trg", async ({ page }) => {
  const board = new DashboardPage(page, "ipr/trg");
  await board.goto();
  await board.validateHero(parameters);
  await board.execute(mainTestSuite);
});

test("ipr/kul", async ({ page }) => {
  const board = new DashboardPage(page, "ipr/kul");
  await board.goto();
  await board.validateHero(parameters);
  await board.execute(mainTestSuite);
});

test("ipr/lbn", async ({ page }) => {
  const board = new DashboardPage(page, "ipr/lbn");
  await board.goto();
  await board.validateHero(parameters);
  await board.execute(mainTestSuite);
});

test("ipr/pjy", async ({ page }) => {
  const board = new DashboardPage(page, "ipr/pjy");
  await board.goto();
  await board.validateHero(parameters);
  await board.execute(mainTestSuite);
});
