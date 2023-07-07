import { test, expect, Page as PlaywrightPage } from "utils/playwright";
import { DashboardPage, HeroParameters } from "@model/dashboard.js";
// import { generateEnum } from "utils/helper";

/**
 * Please fill this in.
 */
const parameters: HeroParameters = {
  _agency: "National Blood Centre",
  _category: "healthcare",
};
// const test_id = generateEnum(["timeseries-daily-donation"]);

/************************** PREP WORK **************************/
test("Preparation", async ({ page }) => {
  const board = new DashboardPage(page, "/dashboard/blood-donation");
  await board.goto();
  await board.page
    .getByTestId("timeseries-daily-donation")
    .screenshot({ path: "visual/blood-donation/timeseries-daily-donation.png" });

  await board.page.getByRole("tab", { name: "Annual" }).click();
  await board.page
    .getByTestId("bar-newdonor-total-annual")
    .screenshot({ path: "visual/blood-donation/bar-newdonor-total-annual.png" });

  await board.page.getByRole("tab", { name: "Monthly" }).click();
  await board.page
    .getByTestId("bar-newdonor-total-monthly")
    .screenshot({ path: "visual/blood-donation/bar-newdonor-total-monthly.png" });

  await board.page.getByRole("tab", { name: "Past 1 year" }).click();
  await board.page
    .getByTestId("bar-newdonor-age-annual")
    .screenshot({ path: "visual/blood-donation/bar-newdonor-age-annual.png" });

  await board.page.getByRole("tab", { name: "Past 1 month" }).click();
  await board.page
    .getByTestId("bar-newdonor-age-month")
    .screenshot({ path: "visual/blood-donation/bar-newdonor-age-month.png" });
});

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
const mainTestSuite = async (page: PlaywrightPage) => {
  const daily_donation_chart = page.getByTestId("daily-donation");
  await expect(daily_donation_chart).toBeVisible();
};

/************************** TEST SUITE **************************/

test.describe.only("Test Suite", async () => {
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
});
