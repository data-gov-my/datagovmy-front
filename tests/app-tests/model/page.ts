import { Page as PlaywrightPage } from "utils/playwright";

export class Page {
  readonly page: PlaywrightPage;
  readonly path: string;
  // i18n: Record<string, string> = {};

  constructor(page: PlaywrightPage, path: string) {
    this.page = page;
    this.path = path;
  }

  /**
   * i18n validation. For now, not required
   */
  // async loadI18n(id: string, language: "en-GB" | "ms-MY" = "en-GB") {
  //   fetch(`${process.env.API_URL}/i18n?filename=${id}&lang=${language}`, {
  //     headers: { Authorization: process.env.AUTHORIZATION_TOKEN as string },
  //   })
  //     .then(response => response.json())
  //     .then(result => {
  //       this.i18n = result;
  //     });
  // }

  async goto() {
    await this.page.goto(`http://localhost:3000${this.path}`);
    await this.page.waitForLoadState("networkidle");
  }
}
