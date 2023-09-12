import { test, expect } from "utils/playwright";
import { DashboardPage, HeroParameters } from "utils/model/dashboard";
import { enumify } from "utils/helper";

/**
 * Please fill this in.
 */
const parameters: HeroParameters = {
  _agency: "Ministry of Health Malaysia",
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

test("covid-vaccination", async ({ page }) => {
  const board = new DashboardPage(page, "covid-vaccination");
  await board.goto();
  await board.validateHero(parameters);
  await board.execute(mainTestSuite);
});

test("covid-vaccination/jhr", async ({ page }) => {
  const board = new DashboardPage(page, "covid-vaccination/jhr");
  await board.goto();
  await board.validateHero(parameters);
  await board.execute(mainTestSuite);
});

test("covid-vaccination/kdh", async ({ page }) => {
  const board = new DashboardPage(page, "covid-vaccination/kdh");
  await board.goto();
  await board.validateHero(parameters);
  await board.execute(mainTestSuite);
});

test("covid-vaccination/ktn", async ({ page }) => {
  const board = new DashboardPage(page, "covid-vaccination/ktn");
  await board.goto();
  await board.validateHero(parameters);
  await board.execute(mainTestSuite);
});

test("covid-vaccination/mlk", async ({ page }) => {
  const board = new DashboardPage(page, "covid-vaccination/mlk");
  await board.goto();
  await board.validateHero(parameters);
  await board.execute(mainTestSuite);
});

test("covid-vaccination/nsn", async ({ page }) => {
  const board = new DashboardPage(page, "covid-vaccination/nsn");
  await board.goto();
  await board.validateHero(parameters);
  await board.execute(mainTestSuite);
});

test("covid-vaccination/phg", async ({ page }) => {
  const board = new DashboardPage(page, "covid-vaccination/phg");
  await board.goto();
  await board.validateHero(parameters);
  await board.execute(mainTestSuite);
});

test("covid-vaccination/prk", async ({ page }) => {
  const board = new DashboardPage(page, "covid-vaccination/prk");
  await board.goto();
  await board.validateHero(parameters);
  await board.execute(mainTestSuite);
});

test("covid-vaccination/pls", async ({ page }) => {
  const board = new DashboardPage(page, "covid-vaccination/pls");
  await board.goto();
  await board.validateHero(parameters);
  await board.execute(mainTestSuite);
});

test("covid-vaccination/png", async ({ page }) => {
  const board = new DashboardPage(page, "covid-vaccination/png");
  await board.goto();
  await board.validateHero(parameters);
  await board.execute(mainTestSuite);
});

test("covid-vaccination/sbh", async ({ page }) => {
  const board = new DashboardPage(page, "covid-vaccination/sbh");
  await board.goto();
  await board.validateHero(parameters);
  await board.execute(mainTestSuite);
});

test("covid-vaccination/swk", async ({ page }) => {
  const board = new DashboardPage(page, "covid-vaccination/swk");
  await board.goto();
  await board.validateHero(parameters);
  await board.execute(mainTestSuite);
});

test("covid-vaccination/sgr", async ({ page }) => {
  const board = new DashboardPage(page, "covid-vaccination/sgr");
  await board.goto();
  await board.validateHero(parameters);
  await board.execute(mainTestSuite);
});

test("covid-vaccination/trg", async ({ page }) => {
  const board = new DashboardPage(page, "covid-vaccination/trg");
  await board.goto();
  await board.validateHero(parameters);
  await board.execute(mainTestSuite);
});

test("covid-vaccination/kul", async ({ page }) => {
  const board = new DashboardPage(page, "covid-vaccination/kul");
  await board.goto();
  await board.validateHero(parameters);
  await board.execute(mainTestSuite);
});

test("covid-vaccination/lbn", async ({ page }) => {
  const board = new DashboardPage(page, "covid-vaccination/lbn");
  await board.goto();
  await board.validateHero(parameters);
  await board.execute(mainTestSuite);
});

test("covid-vaccination/pjy", async ({ page }) => {
  const board = new DashboardPage(page, "covid-vaccination/pjy");
  await board.goto();
  await board.validateHero(parameters);
  await board.execute(mainTestSuite);
});
