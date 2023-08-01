import { test, expect } from "utils/playwright";
import { DataCataloguePage } from "@model/data-catalogue.js";

test("dgmy-public-mwe-mwe-hbar-4-0", async ({ page }) => {
  const board = new DataCataloguePage(page, "dgmy-public-mwe_mwe_hbar_4_0");
  await board.loadSchema("en");
  await board.goto();
  await board.validate();
});
