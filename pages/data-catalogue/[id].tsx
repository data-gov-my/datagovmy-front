import type { DCConfig, DCFilter, FilterDate, Page } from "@lib/types";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { SHORT_LANG } from "@lib/constants";
import { OptionType } from "@components/types";
import { useTranslation } from "@hooks/useTranslation";
import { get } from "@lib/api";

import Metadata from "@components/Metadata";
import DataCatalogueShow from "@data-catalogue/show";
import { useMemo } from "react";

const CatalogueShow: Page = ({
  params,
  config,
  dataset,
  explanation,
  metadata,
  urls,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const { t } = useTranslation();

  const availableOptions = useMemo<OptionType[]>(() => {
    switch (dataset.type) {
      case "TABLE":
        return [{ label: t("catalogue.table"), value: "table" }];

      case "GEOJSON":
      case "HEATTABLE":
        return [{ label: t("catalogue.chart"), value: "chart" }];

      default:
        return [
          { label: t("catalogue.chart"), value: "chart" },
          { label: t("catalogue.table"), value: "table" },
        ];
    }
  }, [dataset.type]);

  return (
    <>
      <Metadata
        title={dataset.meta.title}
        description={dataset.meta.desc.replace(/^(.*?)]/, "")}
        keywords={""}
      />
      <DataCatalogueShow
        options={availableOptions}
        params={params}
        config={config}
        dataset={dataset}
        explanation={explanation}
        metadata={metadata}
        urls={urls}
      />
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ locale, query, params }) => {
  const i18n = await serverSideTranslations(locale!, ["common"], null, ["en-GB", "ms-MY"]);

  const { data } = await get("/data-variable/", {
    id: params!.id,
    lang: SHORT_LANG[locale as keyof typeof SHORT_LANG],
    ...query,
  });
  let config: DCConfig = {
    context: {},
    dates: null,
    options: null,
    precision: data.API.precision ?? null,
    freeze: data.API.freeze ?? null,
    color: data.API.colour ?? "blues",
    geojson: data.API.file_json ?? null,
  };
  data.API.filters?.forEach((item: DCFilter) => {
    if (item.key === "date_slider") config.dates = item as FilterDate;
    Object.assign(config.context, {
      [item.key]:
        typeof item.options[0] === "string"
          ? { label: item.key, value: query[item.key] ?? item.default }
          : (item.options as OptionType[]).find(option => option.value === query[item.key]) ??
            item.default,
    });
  });
  config.options = data.API.filters?.filter((item: DCFilter) => item.key !== "date_slider") ?? null;

  return {
    // notFound: true,
    props: {
      ...i18n,
      config,
      params,
      dataset: {
        type: data.API.chart_type,
        chart: data.chart_details.chart_data ?? {},
        table: data.chart_details.table_data ?? null,
        meta: data.chart_details.intro,
      },
      explanation: data.explanation,
      metadata: {
        url: {
          csv: data.metadata.url.csv ?? null,
          parquet: data.metadata.url.parquet ?? null,
          link_geojson: data.metadata.url.link_geojson ?? null,
        },
        data_as_of: data.metadata.data_as_of,
        last_updated: data.metadata.last_updated,
        next_update: data.metadata.next_update,
        description: data.metadata.dataset_desc,
        source: data.metadata.data_source,
        definitions: data.metadata.out_dataset.concat(data.metadata?.in_dataset ?? []),
      },
      urls: data.downloads ?? {},
    },
  };
};

export default CatalogueShow;
/** ------------------------------------------------------------------------------------------------------------- */
