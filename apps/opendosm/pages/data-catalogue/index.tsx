import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { Page } from "@lib/types";
import { Metadata } from "datagovmy-ui/components";
import { useTranslation } from "datagovmy-ui/hooks";
import { get } from "@lib/api";
import DataCatalogue, { Catalogue } from "@data-catalogue/index";
import { SHORT_LANG } from "@lib/constants";
import { sortAlpha } from "@lib/helpers";
import { withi18n } from "datagovmy-ui/decorators";

const CatalogueIndex: Page = ({
  query,
  collection,
  total,
  sources,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const { t } = useTranslation(["catalogue", "common"]);

  return (
    <>
      <Metadata title={t("header")} description={"description"} keywords={""} />
      <DataCatalogue query={query} collection={collection} total={total} sources={sources} />
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

    const collection = recurSort(data.dataset);

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
        collection,
      },
    };
  }
);

export default CatalogueIndex;
