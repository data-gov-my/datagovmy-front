import { test, expect } from "@playwright/test";

test("test", async ({ page }) => {
  await page.goto("about:blank");
  await page.goto("chrome-error://chromewebdata/");
  await page.goto("http://localhost:3000/data-catalogue");
  await page.getByRole("link", { name: "Horizontal Bar (4 bars)" }).click();
  await page.getByRole("button", { name: "Download" }).click();
  await page.getByRole("option", { name: "Embed" }).click();
  await page.getByRole("button", { name: "English" }).click();
  await page.getByText("Malay", { exact: true }).click();

  await page.getByRole("button", { name: "Download" }).click();
  await page.getByText("Embed").click();
  await page.getByRole("button", { name: "Copy" }).click();
  await page.goto("http://localhost:3000/data-catalogue");
  await page.getByRole("link", { name: "Horizontal Bar (4 bars)" }).click();
  await page.getByRole("button", { name: "Chart" }).click();
  await page.getByRole("option", { name: "Table" }).click();
  await page.locator(".mx-auto > div:nth-child(2)").first().click();
  await page.getByRole("cell", { name: "State Sort" }).click();
});
