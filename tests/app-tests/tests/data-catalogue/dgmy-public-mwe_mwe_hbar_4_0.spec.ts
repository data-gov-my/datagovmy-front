import { test, expect } from "utils/playwright";
import { DataCataloguePage } from "utils/model/data-catalogue";

const ID = "dgmy-public-mwe_mwe_hbar_4_0";

test("catalogue content is validated", async ({ page }) => {
  const board = new DataCataloguePage(page, ID);
  await board.loadSchema("en");
  await board.goto();
  await board.validate();
});

test("embed has the correct src url", async ({ page }) => {
  const board = new DataCataloguePage(page, ID);
  await board.goto();

  await page.getByRole("button", { name: "Download" }).click();
  await page.getByRole("option", { name: "Embed" }).click();

  // Case 1: en-GB src
  let src = await board.page.getByTestId("catalogue-embed-frame").getAttribute("src");
  expect(src).toContain(`/data-catalogue/embed/${ID}`);

  // Case 2: ms-MY src
  await page.getByRole("button", { name: "English" }).click();
  await page.getByText("Malay", { exact: true }).click();
  src = await board.page.getByTestId("catalogue-embed-frame").getAttribute("src");
  expect(src).toContain(`/ms-MY/data-catalogue/embed/${ID}`);
});

test("embed copy function is working", async ({ page }) => {
  const board = new DataCataloguePage(page, ID);
  await board.goto();

  await board.page.getByRole("button", { name: "Download" }).click();
  await board.page.getByRole("option", { name: "Embed" }).click();

  // Case 1: en-GB
  let expectation = await board.page.getByTestId("catalogue-embed-code").textContent();
  await page.getByRole("button", { name: "Copy" }).click();
  let clipboard = await board.page.evaluate("navigator.clipboard.readText()");
  expect(clipboard).toContain(expectation);

  await board.page.getByRole("button", { name: "English" }).click();
  await board.page.getByText("Malay", { exact: true }).click();

  // Case 1: ms-MY
  expectation = await board.page.getByTestId("catalogue-embed-code").textContent();
  await board.page.getByRole("button", { name: "Copy" }).click();
  clipboard = await board.page.evaluate("navigator.clipboard.readText()");
  expect(clipboard).toContain(expectation);
});

test("table view is working", async ({ page }) => {
  const board = new DataCataloguePage(page, ID);
  await board.goto();

  await board.page.getByRole("button", { name: "Chart" }).click();
  await board.page.getByRole("option", { name: "Table" }).click();
  await board.page.waitForSelector("table", { state: "attached" });

  expect(board.page.getByTestId("catalogue-table")).toBeVisible();
});
