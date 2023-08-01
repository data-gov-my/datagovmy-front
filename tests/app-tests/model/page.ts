import { Page as PlaywrightPage } from "utils/playwright";

export class Page {
  readonly page: PlaywrightPage;
  readonly path: string;

  constructor(page: PlaywrightPage, path: string) {
    this.page = page;
    this.path = path;
  }

  async goto() {
    await this.page.goto(this.path);
    await this.page.waitForLoadState("networkidle");
  }
}
