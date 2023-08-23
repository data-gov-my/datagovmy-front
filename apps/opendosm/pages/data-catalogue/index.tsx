import DataCatalogue, { Catalogue } from "@data-catalogue/index";
import { get } from "datagovmy-ui/api";
import { Metadata } from "datagovmy-ui/components";
import { SHORT_LANG } from "datagovmy-ui/constants";
import { withi18n } from "datagovmy-ui/decorators";
import { sortAlpha } from "datagovmy-ui/helpers";
import { useTranslation } from "datagovmy-ui/hooks";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { Page } from "datagovmy-ui/types";

const CatalogueIndex: Page = ({
  query,
  collection,
  sources,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const { t } = useTranslation(["catalogue", "common"]);

  return (
    <>
      <Metadata title={t("header")} description={"description"} keywords={""} />
      <DataCatalogue query={query} collection={collection} sources={sources} />
    </>
  );
};

const recurSort = (data: Record<string, Catalogue[]> | Catalogue[]): any => {
  if (Array.isArray(data)) return sortAlpha(data, "catalog_name");

  return Object.fromEntries(
    Object.entries(data)
      .sort((a: [string, unknown], b: [string, unknown]) => a[0].localeCompare(b[0]))
      .map((item: [string, Record<string, Catalogue[]> | Catalogue[]]) => [
        item[0],
        recurSort(item[1]),
      ])
  );
};

export const getServerSideProps: GetServerSideProps = withi18n(
  ["catalogue", "common"],
  async ({ locale, query }) => {
    const { data } = await get("/data-catalog/", {
      lang: SHORT_LANG[locale! as keyof typeof SHORT_LANG],
      source: "DOSM",
      ...query,
    });

    return {
      props: {
        meta: {
          id: "data-catalogue",
          type: "misc",
          category: null,
          agency: null,
        },
        query: query ?? {},
        total: data.total_all,
        sources: data.source_filters.sort((a: string, b: string) => a.localeCompare(b)),
        collection: data.dataset ? recurSort(data.dataset) : {},
      },
    };
  }
);

export default CatalogueIndex;
