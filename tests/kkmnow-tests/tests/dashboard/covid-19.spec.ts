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

test("covid-19", async ({ page }) => {
  const board = new DashboardPage(page, "covid-19");
  await board.goto();
  await board.validateHero(parameters);
  await board.execute(mainTestSuite);
});

test("covid-19/jhr", async ({ page }) => {
  const board = new DashboardPage(page, "covid-19/jhr");
  await board.goto();
  await board.validateHero(parameters);
  await board.execute(mainTestSuite);
});

test("covid-19/kdh", async ({ page }) => {
  const board = new DashboardPage(page, "covid-19/kdh");
  await board.goto();
  await board.validateHero(parameters);
  await board.execute(mainTestSuite);
});

test("covid-19/ktn", async ({ page }) => {
  const board = new DashboardPage(page, "covid-19/ktn");
  await board.goto();
  await board.validateHero(parameters);
  await board.execute(mainTestSuite);
});

test("covid-19/mlk", async ({ page }) => {
  const board = new DashboardPage(page, "covid-19/mlk");
  await board.goto();
  await board.validateHero(parameters);
  await board.execute(mainTestSuite);
});

test("covid-19/nsn", async ({ page }) => {
  const board = new DashboardPage(page, "covid-19/nsn");
  await board.goto();
  await board.validateHero(parameters);
  await board.execute(mainTestSuite);
});

test("covid-19/phg", async ({ page }) => {
  const board = new DashboardPage(page, "covid-19/phg");
  await board.goto();
  await board.validateHero(parameters);
  await board.execute(mainTestSuite);
});

test("covid-19/prk", async ({ page }) => {
  const board = new DashboardPage(page, "covid-19/prk");
  await board.goto();
  await board.validateHero(parameters);
  await board.execute(mainTestSuite);
});

test("covid-19/pls", async ({ page }) => {
  const board = new DashboardPage(page, "covid-19/pls");
  await board.goto();
  await board.validateHero(parameters);
  await board.execute(mainTestSuite);
});

test("covid-19/png", async ({ page }) => {
  const board = new DashboardPage(page, "covid-19/png");
  await board.goto();
  await board.validateHero(parameters);
  await board.execute(mainTestSuite);
});

test("covid-19/sbh", async ({ page }) => {
  const board = new DashboardPage(page, "covid-19/sbh");
  await board.goto();
  await board.validateHero(parameters);
  await board.execute(mainTestSuite);
});

test("covid-19/swk", async ({ page }) => {
  const board = new DashboardPage(page, "covid-19/swk");
  await board.goto();
  await board.validateHero(parameters);
  await board.execute(mainTestSuite);
});

test("covid-19/sgr", async ({ page }) => {
  const board = new DashboardPage(page, "covid-19/sgr");
  await board.goto();
  await board.validateHero(parameters);
  await board.execute(mainTestSuite);
});

test("covid-19/trg", async ({ page }) => {
  const board = new DashboardPage(page, "covid-19/trg");
  await board.goto();
  await board.validateHero(parameters);
  await board.execute(mainTestSuite);
});

test("covid-19/kul", async ({ page }) => {
  const board = new DashboardPage(page, "covid-19/kul");
  await board.goto();
  await board.validateHero(parameters);
  await board.execute(mainTestSuite);
});

test("covid-19/lbn", async ({ page }) => {
  const board = new DashboardPage(page, "covid-19/lbn");
  await board.goto();
  await board.validateHero(parameters);
  await board.execute(mainTestSuite);
});

test("covid-19/pjy", async ({ page }) => {
  const board = new DashboardPage(page, "covid-19/pjy");
  await board.goto();
  await board.validateHero(parameters);
  await board.execute(mainTestSuite);
});
