import type { Locators } from "../types";
import { expect, Locator, Page as PlaywrightPage } from "@playwright/test";
import { Page } from "./page";
import { PATTERN } from "../helper";

export type HeroParameters = {
  _category: string;
  _agency: string;
};

export class DashboardPage extends Page {
  readonly locators: Locators = new Map<string, Locator>();

  constructor(page: PlaywrightPage, name: string) {
    super(page, `/dashboard/${name}`);
    this.locators.set("header", page.getByTestId("hero-header"));
    this.locators.set("description", page.getByTestId("hero-description"));
    this.locators.set("category", page.getByTestId("hero-category"));
    this.locators.set("agency", page.getByTestId("hero-agency").first());
    this.locators.set("last_updated", page.getByTestId("hero-last-updated"));
  }

  async snapshot(id: string) {
    return await this.page.getByTestId(id).screenshot();
  }

  /**
   * @todo Issue with chart.js animation. Snapshot occurs while animation is ongoing,
   *       leading to differences in expected and actual. Need to explore further.
   *       findings: `waitForTimeout` is UI render-blocking. cannot be used
   * @param id
   */
  async matchSnapshot(id: string) {
    expect(await this.snapshot(id)).toMatchSnapshot(`${this.path}_${id}.png`, {
      maxDiffPixels: 200,
      threshold: 0.8,
    });
  }

  async validateHero({ _category, _agency }: HeroParameters, containSelector?: boolean) {
    await Promise.all([
      expect(await this.locators.get("header")!.innerText()).not.toMatch("header"),
      expect(await this.locators.get("description")!.innerText()).not.toMatch("description"),
      expect(this.locators.get("category")!).toContainText(_category, { ignoreCase: true }),
      expect(this.locators.get("agency")!).toContainText(_agency, { ignoreCase: true }),
      expect(this.locators.get("last_updated")!).not.toContainText(PATTERN.I18N_FAILURE),
      expect(this.locators.get("last_updated")!).not.toContainText("N/A"),
    ])
      .then(() => console.info(`[${this.path}] ✅ Hero validated`))
      .catch(e => {
        console.error(`[${this.path}] ❌ ${e}`);
        throw new Error(e);
      });
  }

  async execute(testSuite: (_page: DashboardPage) => Promise<void>) {
    await testSuite(this);
    await this.page.evaluate(() => window.scrollTo(0, 0)); // To prevent playwright from closing prematurely
  }
}
