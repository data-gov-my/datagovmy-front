import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { Page } from "@lib/types";
import Metadata from "@components/Metadata";
import { useTranslation } from "@hooks/useTranslation";
import { get } from "@lib/api";
import DataCatalogue, { Catalogue } from "@data-catalogue/index";
import { SHORT_LANG } from "@lib/constants";
import { sortAlpha } from "@lib/helpers";

const CatalogueIndex: Page = ({
  query,
  collection,
  total,
  sources,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const { t } = useTranslation();

  return (
    <>
      <Metadata title={t("nav.catalogue")} description={""} keywords={""} />
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

export const getServerSideProps: GetServerSideProps = async ({ locale, query }) => {
  const i18n = await serverSideTranslations(locale!, ["common"]);

  const { data } = await get("/data-catalog/", {
    lang: SHORT_LANG[locale! as keyof typeof SHORT_LANG],
    ...query,
  });

  const collection = recurSort(data.dataset);

  return {
    props: {
      ...i18n,
      query: query ?? {},
      total: data.total_all,
      sources: data.source_filters.sort((a: string, b: string) => a.localeCompare(b)),
      collection,
    },
  };
};

export default CatalogueIndex;
