import type { Locators } from "../types";
import { expect, Locator, Page as PlaywrightPage } from "@playwright/test";
import { Page } from "./page";
import { toDate } from "../helper";

type CatalogueSchema = {
  title: string;
  description: string;
  methodology: string;
  caveat: string;
  publication: string;
  data_as_of: string;
  last_updated: string;
  next_update: string;
};

export class DataCataloguePage extends Page {
  schema: CatalogueSchema | undefined = undefined;
  readonly id: string;
  readonly locators: Locators = new Map<string, Locator>();

  constructor(page: PlaywrightPage, id: string) {
    super(page, `/data-catalogue/${id}`);
    this.id = id;
    this.locators.set("title", page.getByTestId("catalogue-title"));
    this.locators.set("description", page.getByTestId("catalogue-description"));
    // this.locators.set("methodology", page.getByTestId("catalogue-methodology"));
    // this.locators.set("caveat", page.getByTestId("catalogue-caveat"));
    // this.locators.set("publication", page.getByTestId("catalogue-publication"));
    this.locators.set("data_as_of", page.getByText("Data as of"));
    this.locators.set("last_updated", page.getByTestId("catalogue-last-updated"));
    this.locators.set("next_update", page.getByTestId("catalogue-next-update"));
  }

  async loadSchema(language: "en" | "bm" = "en"): Promise<CatalogueSchema | undefined> {
    return fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/data-variable/?id=${this.id}&lang=${language}`,
      {
        headers: { Authorization: process.env.NEXT_PUBLIC_AUTHORIZATION_TOKEN as string },
      }
    )
      .then(response => response.json())
      .then(result => {
        this.schema = {
          title: result.chart_details.intro.title,
          description: result.chart_details.intro.desc.substring(
            result.chart_details.intro.desc.indexOf("]") + 1
          ),
          methodology: result.explanation.methodology,
          caveat: result.explanation.caveat,
          publication: result.explanation.publication,
          data_as_of: `Data as of ${toDate(result.metadata.data_as_of, "dd MMM yyyy, HH:mm")}`,
          last_updated: toDate(result.metadata.last_updated, "dd MMM yyyy, HH:mm"),
          next_update: toDate(result.metadata.next_update, "dd MMM yyyy, HH:mm"),
        };

        return this.schema;
      })
      .catch(e => {
        throw new Error(e);
      });
  }

  async validate() {
    if (!this.schema) return;

    for (const [key, value] of this.locators.entries()) {
      await expect(value).toContainText(this.schema[key as keyof CatalogueSchema]);
    }
  }

  async execute(testSuite: (_page: DataCataloguePage) => Promise<void>) {
    await testSuite(this);
  }
}
