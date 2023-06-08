import type { Page } from "@lib/types";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { SHORT_LANG } from "@lib/constants";
import { OptionType } from "@components/types";
import { useTranslation } from "@hooks/useTranslation";
import { get } from "@lib/api";

import Metadata from "@components/Metadata";
import DataCatalogueShow from "@data-catalogue/show";
import { useMemo } from "react";

type CatalogueFilter = {
  key: string;
  default: OptionType<string, string>;
  options: OptionType<string, string>[];
};

const CatalogueShow: Page = ({
  params,
  config,
  dataset,
  explanation,
  metadata,
  urls,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const { t, i18n } = useTranslation();
  const lang = SHORT_LANG[i18n.language as keyof typeof SHORT_LANG];

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

  const availableFilters = useMemo<{
    filter_state: Record<string, OptionType> | undefined;
    filter_mapping: Array<CatalogueFilter>;
  }>(() => {
    return {
      filter_mapping: config.filter_mapping?.map(
        (filter: CatalogueFilter): CatalogueFilter => ({
          ...filter,
          options: filter.options.map((option: OptionType) => ({
            label: (t(`catalogue.show_filters.${option.value}`) as string).includes("catalogue")
              ? option.value
              : t(`catalogue.show_filters.${option.value}`),
            value: option.value,
          })),
        })
      ),
      filter_state: Object.fromEntries(
        Object.entries(config.filter_state).map(([key, option]: [string, unknown]) => [
          key,
          {
            label: (t(`catalogue.show_filters.${(option as OptionType).value}`) as string).includes(
              "catalogue"
            )
              ? (option as OptionType).value
              : t(`catalogue.show_filters.${(option as OptionType).value}`),
            value: (option as OptionType).value,
          },
        ])
      ),
    };
  }, [config]);

  return (
    <>
      <Metadata
        title={dataset.meta[lang].title}
        description={dataset.meta[lang].desc.replace(/^(.*?)]/, "")}
        keywords={""}
      />
      <DataCatalogueShow
        options={availableOptions}
        params={params}
        config={{ ...config, ...availableFilters }}
        dataset={dataset}
        explanation={explanation}
        metadata={metadata}
        urls={urls}
      />
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ locale, query, params }) => {
  const i18n = await serverSideTranslations(locale!, ["common"]);

  const { data } = await get("/data-variable/", { id: params!.id, ...query });

  let filter_state;

  if (["TIMESERIES", "BAR", "HBAR", "PYRAMID"].includes(data.API.chart_type)) {
    filter_state = Object.fromEntries(
      data.API.filters.map((filter: any) => [
        filter.key,
        filter.options.find((item: OptionType) => item.value === query[filter.key]) ??
          filter.default,
      ])
    );
  }

  const { in_dataset: _, out_dataset: __, ...metadata } = data.metadata;

  return {
    props: {
      ...i18n,
      config: {
        filter_state: filter_state ?? {},
        filter_mapping: data.API.filters ?? null,
        ...data.API,
      },
      params: params,
      dataset: {
        type: data.API.chart_type,
        chart: data.chart_details.chart_data ?? {},
        table: data.chart_details.table_data ?? null,
        meta: data.chart_details.intro,
      },
      explanation: data.explanation,
      metadata: {
        ...metadata,
        definitions: [...(data.metadata?.in_dataset ?? []), ...data.metadata.out_dataset],
      },
      urls: data.downloads ?? {},
    },
  };
};

export default CatalogueShow;
/** ------------------------------------------------------------------------------------------------------------- */
