import { test, expect } from "utils/playwright";
import { DashboardPage, HeroParameters } from "@model/dashboard.js";
import { enumify } from "utils/helper";

/**
 * Please fill this in.
 */
const parameters: HeroParameters = {
  _agency: "National Blood Centre",
  _category: "healthcare",
};
const ID = enumify([
  "timeseries-daily-donation",
  "bar-newdonor-total-annual",
  "bar-newdonor-total-monthly",
  "bar-newdonor-age-annual",
  "bar-newdonor-age-monthly",
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
 * async function sectionATestSuite (page: PlaywrightPage) { ... }
 * await board.execute(sectionATestSuite)
 * @example // Inline function
 * await board.execute(async (page: PlaywrightPage) => { ... })
 */
const mainTestSuite = async (board: DashboardPage) => {
  // await board.matchSnapshot(ID.TIMESERIES_DAILY_DONATION);
  // await board.page.getByRole("tab", { name: "Annual" }).click();
  // await board.matchSnapshot(ID.BAR_NEWDONOR_TOTAL_ANNUAL);
  // await board.page.getByRole("tab", { name: "Monthly" }).click();
  // await board.matchSnapshot(ID.BAR_NEWDONOR_TOTAL_MONTHLY);
  // await board.page.getByRole("tab", { name: "Past 1 year" }).click();
  // await board.matchSnapshot(ID.BAR_NEWDONOR_AGE_ANNUAL);
  // await board.page.getByRole("tab", { name: "Past 1 month" }).click();
  // await board.matchSnapshot(ID.BAR_NEWDONOR_AGE_MONTHLY);
};

/************************** TEST SUITE **************************/

test("blood-donation", async ({ page }) => {
  const board = new DashboardPage(page, "blood-donation", "/dashboard/blood-donation");
  await board.goto();
  await board.validateHero(parameters);
  await board.execute(mainTestSuite);
});

test("blood-donation/jhr", async ({ page }) => {
  const board = new DashboardPage(page, "blood-donation", "/dashboard/blood-donation/jhr");
  await board.goto();
  await board.validateHero(parameters);
  await board.execute(mainTestSuite);
});

test("blood-donation/kdh", async ({ page }) => {
  const board = new DashboardPage(page, "blood-donation", "/dashboard/blood-donation/kdh");
  await board.goto();
  await board.validateHero(parameters);
  await board.execute(mainTestSuite);
});

test("blood-donation/ktn", async ({ page }) => {
  const board = new DashboardPage(page, "blood-donation", "/dashboard/blood-donation/ktn");
  await board.goto();
  await board.validateHero(parameters);
  await board.execute(mainTestSuite);
});

test("blood-donation/mlk", async ({ page }) => {
  const board = new DashboardPage(page, "blood-donation", "/dashboard/blood-donation/mlk");
  await board.goto();
  await board.validateHero(parameters);
  await board.execute(mainTestSuite);
});

test("blood-donation/nsn", async ({ page }) => {
  const board = new DashboardPage(page, "blood-donation", "/dashboard/blood-donation/nsn");
  await board.goto();
  await board.validateHero(parameters);
  await board.execute(mainTestSuite);
});

test("blood-donation/phg", async ({ page }) => {
  const board = new DashboardPage(page, "blood-donation", "/dashboard/blood-donation/phg");
  await board.goto();
  await board.validateHero(parameters);
  await board.execute(mainTestSuite);
});

test("blood-donation/prk", async ({ page }) => {
  const board = new DashboardPage(page, "blood-donation", "/dashboard/blood-donation/prk");
  await board.goto();
  await board.validateHero(parameters);
  await board.execute(mainTestSuite);
});

test("blood-donation/png", async ({ page }) => {
  const board = new DashboardPage(page, "blood-donation", "/dashboard/blood-donation/png");
  await board.goto();
  await board.validateHero(parameters);
  await board.execute(mainTestSuite);
});

test("blood-donation/sbh", async ({ page }) => {
  const board = new DashboardPage(page, "blood-donation", "/dashboard/blood-donation/sbh");
  await board.goto();
  await board.validateHero(parameters);
  await board.execute(mainTestSuite);
});

test("blood-donation/swk", async ({ page }) => {
  const board = new DashboardPage(page, "blood-donation", "/dashboard/blood-donation/swk");
  await board.goto();
  await board.validateHero(parameters);
  await board.execute(mainTestSuite);
});

test("blood-donation/sgr", async ({ page }) => {
  const board = new DashboardPage(page, "blood-donation", "/dashboard/blood-donation/sgr");
  await board.goto();
  await board.validateHero(parameters);
  await board.execute(mainTestSuite);
});

test("blood-donation/trg", async ({ page }) => {
  const board = new DashboardPage(page, "blood-donation", "/dashboard/blood-donation/trg");
  await board.goto();
  await board.validateHero(parameters);
  await board.execute(mainTestSuite);
});

test("blood-donation/kul", async ({ page }) => {
  const board = new DashboardPage(page, "blood-donation", "/dashboard/blood-donation/kul");
  await board.goto();
  await board.validateHero(parameters);
  await board.execute(mainTestSuite);
});
