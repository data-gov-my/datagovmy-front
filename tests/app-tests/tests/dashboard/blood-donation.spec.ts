import { test, expect, Page as PlaywrightPage } from "utils/playwright";
import { DashboardPage, HeroParameters } from "@model/dashboard.js";

/**
 * Please fill this in.
 */
const parameters: HeroParameters = {
  _agency: "National Blood Centre",
  _category: "healthcare",
};

/**
 * Main test suite for the dashboard.
 * @param page Playwright page context
 * @description Note: For dashboard with children dashboards (ie. states, sekolah etc),
 *              DO NOT place any edge-test cases in here, as it will run at every child
 *              dashboard.
 *
 *              Create a separate test suite function and pass it to 'board.execute(...)'
 *              method
 * @example function sectionATestSuite (page: PlaywrightPage) { ... }
 *          await board.execute(sectionATestSuite)
 */

const mainTestSuite = async (page: PlaywrightPage) => {
  const daily_donation_chart = page.getByTestId("daily-donation");
  await expect(daily_donation_chart, "Chart is not visible").toBeVisible();
};

test("blood-donation", async ({ page }) => {
  const board = new DashboardPage(page, "/dashboard/blood-donation");
  await board.goto();
  await board.validateHero(parameters);
  await board.execute(mainTestSuite);
});

test("blood-donation/jhr", async ({ page }) => {
  const board = new DashboardPage(page, "/dashboard/blood-donation/jhr");
  await board.goto();
  await board.validateHero(parameters);
  await board.execute(mainTestSuite);
});

test("blood-donation/kdh", async ({ page }) => {
  const board = new DashboardPage(page, "/dashboard/blood-donation/kdh");
  await board.goto();
  await board.validateHero(parameters);
  await board.execute(mainTestSuite);
});

test("blood-donation/ktn", async ({ page }) => {
  const board = new DashboardPage(page, "/dashboard/blood-donation/ktn");
  await board.goto();
  await board.validateHero(parameters);
  await board.execute(mainTestSuite);
});

test("blood-donation/mlk", async ({ page }) => {
  const board = new DashboardPage(page, "/dashboard/blood-donation/mlk");
  await board.goto();
  await board.validateHero(parameters);
  await board.execute(mainTestSuite);
});

test("blood-donation/nsn", async ({ page }) => {
  const board = new DashboardPage(page, "/dashboard/blood-donation/nsn");
  await board.goto();
  await board.validateHero(parameters);
  await board.execute(mainTestSuite);
});

test("blood-donation/phg", async ({ page }) => {
  const board = new DashboardPage(page, "/dashboard/blood-donation/phg");
  await board.goto();
  await board.validateHero(parameters);
  await board.execute(mainTestSuite);
});

test("blood-donation/prk", async ({ page }) => {
  const board = new DashboardPage(page, "/dashboard/blood-donation/prk");
  await board.goto();
  await board.validateHero(parameters);
  await board.execute(mainTestSuite);
});

test("blood-donation/png", async ({ page }) => {
  const board = new DashboardPage(page, "/dashboard/blood-donation/png");
  await board.goto();
  await board.validateHero(parameters);
  await board.execute(mainTestSuite);
});

test("blood-donation/sbh", async ({ page }) => {
  const board = new DashboardPage(page, "/dashboard/blood-donation/sbh");
  await board.goto();
  await board.validateHero(parameters);
  await board.execute(mainTestSuite);
});

test("blood-donation/swk", async ({ page }) => {
  const board = new DashboardPage(page, "/dashboard/blood-donation/swk");
  await board.goto();
  await board.validateHero(parameters);
  await board.execute(mainTestSuite);
});

test("blood-donation/sgr", async ({ page }) => {
  const board = new DashboardPage(page, "/dashboard/blood-donation/sgr");
  await board.goto();
  await board.validateHero(parameters);
  await board.execute(mainTestSuite);
});

test("blood-donation/trg", async ({ page }) => {
  const board = new DashboardPage(page, "/dashboard/blood-donation/trg");
  await board.goto();
  await board.validateHero(parameters);
  await board.execute(mainTestSuite);
});

test("blood-donation/kul", async ({ page }) => {
  const board = new DashboardPage(page, "/dashboard/blood-donation/kul");
  await board.goto();
  await board.validateHero(parameters);
  await board.execute(mainTestSuite);
});
