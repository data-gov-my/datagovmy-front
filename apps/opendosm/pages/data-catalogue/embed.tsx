import type { OptionType } from "@components/types";
import { get } from "@lib/api";
import { Page } from "@lib/types";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

import dynamic from "next/dynamic";
const CatalogueWidget = dynamic(() => import("@data-catalogue/widget"), { ssr: false });

const DataCatalogueEmbed: Page = ({
  params,
  config,
  dataset,
  metadata,
  urls,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  return (
    <CatalogueWidget
      params={params}
      config={config}
      dataset={dataset}
      explanation={undefined}
      metadata={metadata}
      urls={urls}
    />
  );
};

DataCatalogueEmbed.layout = page => {
  return <div>{page}</div>;
};

export const getServerSideProps: GetServerSideProps = async ({ locale, query, params }) => {
  return {
    notFound: true,
  };

  // Feature not ready yet.
  //   const i18n = await serverSideTranslations(locale!, ["common"]);

  //   const id = query.id;

  //   const { data } = await get("/data-variable/", { id, ...query });

  //   let filter_state;

  //   if (data.API.chart_type === "TIMESERIES") {
  //     filter_state = Object.fromEntries(
  //       data.API.filters.map((filter: any) => [
  //         filter.key,
  //         filter.options.find((item: OptionType) => item.value === query[filter.key]) ??
  //           filter.default,
  //       ])
  //     );
  //   }

  //   return {
  //     props: {
  //       ...i18n,
  //       config: {
  //         filter_state: filter_state ?? {},
  //         filter_mapping: data.API.filters ?? {},
  //         ...data.API,
  //       },
  //       params: {
  //         id,
  //       },
  //       dataset: {
  //         type: data.API.chart_type,
  //         chart: data.chart_details.chart_data ?? {},
  //         table: data.chart_details.table_data,
  //         meta: data.chart_details.intro,
  //       },
  //       metadata: data.metadata,
  //       urls: data.downloads,
  //     },
  //   };
};

export default DataCatalogueEmbed;
