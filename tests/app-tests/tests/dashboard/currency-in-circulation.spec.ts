import { test, expect } from "utils/playwright";
import { DashboardPage, HeroParameters } from "utils/model/dashboard";
import { enumify } from "utils/helper";

/**
 * Please fill this in.
 */
const parameters: HeroParameters = {
  _agency: "Central Bank of Malaysia",
  _category: "Financial Sector",
};
const ID = enumify([
  "timeseries-rm1-notes",
  "timeseries-rm5-notes",
  "timeseries-rm10-notes",
  "timeseries-rm20-notes",
  "timeseries-rm50-notes",
  "timeseries-rm100-notes",
  "timeseries-10sen-coins",
  "timeseries-20sen-coins",
  "timeseries-50sen-coins",
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
const mainTestSuite = async (board: DashboardPage) => {
  for (const id of Object.values(ID)) {
    expect(board.page.getByTestId(id)).toBeVisible();
  }
};

/************************** TEST SUITE **************************/

test("currency-in-circulation", async ({ page }) => {
  const board = new DashboardPage(page, "currency-in-circulation");
  await board.goto();
  await board.validateHero(parameters);
  await board.execute(mainTestSuite);
});
