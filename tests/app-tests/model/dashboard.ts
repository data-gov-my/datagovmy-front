import { expect, Locator, Page as PlaywrightPage } from "utils/playwright";
import { Page } from "./page.js";
import { PATTERN } from "utils/helper";

export type HeroParameters = {
  _category: string;
  _agency: string;
};

export class DashboardPage extends Page {
  readonly header: Locator;
  readonly description: Locator;
  readonly category: Locator;
  readonly agency: Locator;
  readonly last_updated: Locator;

  constructor(page: PlaywrightPage, path: string) {
    super(page, path);
    this.header = page.getByTestId("hero_header");
    this.description = page.getByTestId("hero_description");
    this.category = page.getByTestId("hero_category");
    this.agency = page.getByTestId("hero_agency").first();
    this.last_updated = page.getByTestId("hero_last_updated");
  }

  async validateHero({ _category, _agency }: HeroParameters, containSelector?: boolean) {
    await Promise.all([
      expect(this.header).not.toContainText(PATTERN.I18N_FAILURE),
      expect(this.description).not.toContainText(PATTERN.I18N_FAILURE),
      expect(this.category).toContainText(_category, { ignoreCase: true }),
      expect(this.agency).toContainText(_agency, { ignoreCase: true }),
      expect(this.last_updated).not.toContainText(PATTERN.I18N_FAILURE),
      expect(this.last_updated).not.toContainText("N/A"),
    ])
      .then(() => console.info(`[${this.path}] ✅ Hero validated`))
      .catch(e => {
        console.error(`[${this.path}] ❌ ${e}`);
        throw new Error(e);
      });
  }

  async execute(testSuite: (_page: PlaywrightPage) => Promise<void>) {
    await testSuite(this.page);
  }
}
