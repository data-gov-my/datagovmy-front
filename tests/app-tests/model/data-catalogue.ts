import { expect, Locator, Page as PlaywrightPage } from "utils/playwright";
import { Page } from "./page.js";

export class DataCataloguePage extends Page {
  constructor(page: PlaywrightPage, path: string) {
    super(page, path);
  }

  async initialize() {}
}
