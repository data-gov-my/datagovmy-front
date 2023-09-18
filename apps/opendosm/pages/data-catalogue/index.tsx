import DataCatalogue, { Catalogue } from "@data-catalogue/index";
import { get } from "datagovmy-ui/api";
import { Metadata } from "datagovmy-ui/components";
import { SHORT_LANG } from "datagovmy-ui/constants";
import { withi18n } from "datagovmy-ui/decorators";
import { sortAlpha } from "datagovmy-ui/helpers";
import { useTranslation } from "datagovmy-ui/hooks";
import { Page } from "datagovmy-ui/types";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";

const CatalogueIndex: Page = ({
  query,
  collection,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const { t } = useTranslation("catalogue");

  return (
    <>
      <Metadata title={t("header")} description={t("description")} keywords={""} />
      <DataCatalogue query={query} collection={collection} />
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
  ["catalogue", "common", "opendosm-home"],
  async ({ locale, query }) => {
    const { data } = await get("/data-catalog/", {
      lang: SHORT_LANG[locale! as keyof typeof SHORT_LANG],
      source: "DOSM",
      opendosm: true,
      ...query,
    });

    return {
      props: {
        meta: {
          id: "catalogue-index",
          type: "misc",
          category: null,
          agency: null,
        },
        query: query ?? {},
        total: data.total_all,
        collection: data.dataset ? recurSort(data.dataset) : {},
      },
    };
  },
  {
    cache_expiry: 600, // 10 min
  }
);

export default CatalogueIndex;
