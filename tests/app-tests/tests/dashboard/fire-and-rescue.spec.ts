import { test, expect } from "utils/playwright";
import { DashboardPage, HeroParameters } from "utils/model/dashboard";
import { enumify } from "utils/helper";

/**
 * Please fill this in.
 */
const parameters: HeroParameters = {
  _agency: "Fire and Rescue Department of Malaysia",
  _category: "Public Safety",
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

test("fire-and-rescue", async ({ page }) => {
  const board = new DashboardPage(page, "fire-and-rescue");
  await board.goto();
  await board.validateHero(parameters);
  await board.execute(mainTestSuite);
});

test("fire-and-rescue/jhr", async ({ page }) => {
  const board = new DashboardPage(page, "fire-and-rescue/jhr");
  await board.goto();
  await board.validateHero(parameters);
  await board.execute(mainTestSuite);
});

test("fire-and-rescue/kdh", async ({ page }) => {
  const board = new DashboardPage(page, "fire-and-rescue/kdh");
  await board.goto();
  await board.validateHero(parameters);
  await board.execute(mainTestSuite);
});

test("fire-and-rescue/ktn", async ({ page }) => {
  const board = new DashboardPage(page, "fire-and-rescue/ktn");
  await board.goto();
  await board.validateHero(parameters);
  await board.execute(mainTestSuite);
});

test("fire-and-rescue/mlk", async ({ page }) => {
  const board = new DashboardPage(page, "fire-and-rescue/mlk");
  await board.goto();
  await board.validateHero(parameters);
  await board.execute(mainTestSuite);
});

test("fire-and-rescue/nsn", async ({ page }) => {
  const board = new DashboardPage(page, "fire-and-rescue/nsn");
  await board.goto();
  await board.validateHero(parameters);
  await board.execute(mainTestSuite);
});

test("fire-and-rescue/phg", async ({ page }) => {
  const board = new DashboardPage(page, "fire-and-rescue/phg");
  await board.goto();
  await board.validateHero(parameters);
  await board.execute(mainTestSuite);
});

test("fire-and-rescue/prk", async ({ page }) => {
  const board = new DashboardPage(page, "fire-and-rescue/prk");
  await board.goto();
  await board.validateHero(parameters);
  await board.execute(mainTestSuite);
});

test("fire-and-rescue/pls", async ({ page }) => {
  const board = new DashboardPage(page, "fire-and-rescue/pls");
  await board.goto();
  await board.validateHero(parameters);
  await board.execute(mainTestSuite);
});

test("fire-and-rescue/png", async ({ page }) => {
  const board = new DashboardPage(page, "fire-and-rescue/png");
  await board.goto();
  await board.validateHero(parameters);
  await board.execute(mainTestSuite);
});

test("fire-and-rescue/sbh", async ({ page }) => {
  const board = new DashboardPage(page, "fire-and-rescue/sbh");
  await board.goto();
  await board.validateHero(parameters);
  await board.execute(mainTestSuite);
});

test("fire-and-rescue/swk", async ({ page }) => {
  const board = new DashboardPage(page, "fire-and-rescue/swk");
  await board.goto();
  await board.validateHero(parameters);
  await board.execute(mainTestSuite);
});

test("fire-and-rescue/sgr", async ({ page }) => {
  const board = new DashboardPage(page, "fire-and-rescue/sgr");
  await board.goto();
  await board.validateHero(parameters);
  await board.execute(mainTestSuite);
});

test("fire-and-rescue/trg", async ({ page }) => {
  const board = new DashboardPage(page, "fire-and-rescue/trg");
  await board.goto();
  await board.validateHero(parameters);
  await board.execute(mainTestSuite);
});

test("fire-and-rescue/kul", async ({ page }) => {
  const board = new DashboardPage(page, "fire-and-rescue/kul");
  await board.goto();
  await board.validateHero(parameters);
  await board.execute(mainTestSuite);
});

test("fire-and-rescue/lbn", async ({ page }) => {
  const board = new DashboardPage(page, "fire-and-rescue/lbn");
  await board.goto();
  await board.validateHero(parameters);
  await board.execute(mainTestSuite);
});

test("fire-and-rescue/pjy", async ({ page }) => {
  const board = new DashboardPage(page, "fire-and-rescue/pjy");
  await board.goto();
  await board.validateHero(parameters);
  await board.execute(mainTestSuite);
});
