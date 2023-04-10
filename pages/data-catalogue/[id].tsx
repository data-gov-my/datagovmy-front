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
  console.log(dataset);

  const availableOptions = useMemo<OptionType[]>(() => {
    switch (dataset.type) {
      case "TABLE":
        return [{ label: t("catalogue.table"), value: "table" }];

      case "GEOJSON":
        return [{ label: t("catalogue.chart"), value: "chart" }];
      default:
        return [
          { label: t("catalogue.chart"), value: "chart" },
          { label: t("catalogue.table"), value: "table" },
        ];
    }
  }, [dataset.type]);

  // const availableFilters = useMemo<{
  //   filter_state: Record<string, OptionType> | undefined;
  //   filter_mapping: Array<CatalogueFilter>;
  // }>(() => {
  //   return {
  //     filter_mapping: config.filter_mapping?.map(
  //       (filter: CatalogueFilter): CatalogueFilter => ({
  //         ...filter,
  //         options: filter.options.map((option: OptionType) => ({
  //           label: (t(`catalogue.show_filters.${option.value}`) as string).includes("catalogue")
  //             ? option.value
  //             : t(`catalogue.show_filters.${option.value}`),
  //           value: option.value,
  //         })),
  //       })
  //     ),
  //     filter_state: Object.fromEntries(
  //       Object.entries(config.filter_state).map(([key, option]: [string, unknown]) => [
  //         key,
  //         {
  //           label: (t(`catalogue.show_filters.${(option as OptionType).value}`) as string).includes(
  //             "catalogue"
  //           )
  //             ? (option as OptionType).value
  //             : t(`catalogue.show_filters.${(option as OptionType).value}`),
  //           value: (option as OptionType).value,
  //         },
  //       ])
  //     ),
  //   };
  // }, [config]);

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
    lang: SHORT_LANG[locale as "en-GB" | "ms-MY"],
    ...query,
  });
  let config: DCConfig = {
    context: {},
    dates: null,
    options: null,
    precision: data.API.precision,
    freeze: data.API.freeze ?? null,
  };
  data.API.filters.forEach((item: DCFilter) => {
    if (item.key === "date_slider") config.dates = item as FilterDate;
    Object.assign(config.context, {
      [item.key]:
        typeof item.options[0] === "string"
          ? { label: item.key, value: query[item.key] ?? item.default }
          : (item.options as OptionType[]).find(option => option.value === query[item.key]) ??
            item.default,
    });
  });
  config.options = data.API.filters.filter((item: DCFilter) => item.key !== "date_slider");

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
          csv: data.metadata.url.csv,
          parquet: data.metadata.url.parquet,
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
