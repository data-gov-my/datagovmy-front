import {
  CatalogueWidget as DataCatalogueWidget,
  DCVariable,
  DCDataViz,
  DCChartKeys,
} from "datagovmy-ui/data-catalogue";
import { get } from "datagovmy-ui/api";
import { Metadata } from "datagovmy-ui/components";
import { SHORT_LANG } from "datagovmy-ui/constants";
import { AnalyticsProvider } from "datagovmy-ui/contexts/analytics";
import { CatalogueProvider } from "datagovmy-ui/contexts/catalogue";
import { WindowProvider } from "datagovmy-ui/contexts/window";
import { withi18n } from "datagovmy-ui/decorators";
import { recurDataMapping } from "datagovmy-ui/helpers";
import { Page } from "datagovmy-ui/types";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { useMemo } from "react";
import { AxiosResponse } from "axios";

const CatalogueEmbed: Page = ({
  params,
  meta,
  query,
  ...variable
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const data = variable as DCVariable;
  console.log("huh", query);

  const extractChartDataset = (table_data: Record<string, any>[], currentViz: DCDataViz) => {
    const set = Object.entries(currentViz?.config.format).map(([key, value]) =>
      recurDataMapping(key, value, table_data)
    );
    return {
      ...Object.fromEntries(set.map(array => [array[0][0], array[0][1]])),
    };
  };

  const selectedDataset = useMemo(() => {
    const selectedViz = data.dataviz_set.find(item => item.dataviz_id === query.visual);

    if (selectedViz) {
      return {
        type: selectedViz.chart_type,
        chart:
          selectedViz.chart_type !== "TABLE" ? extractChartDataset(data.data, selectedViz) : {},
        table: data.data,
        meta: {
          unique_id: data.id,
          title: data.title,
          desc: data.description,
        },
      };
    } else {
      return {
        type: "TABLE" as DCChartKeys,
        chart: {} as any,
        table: data.data,
        meta: {
          unique_id: data.id,
          title: data.title,
          desc: data.description,
        },
      };
    }
  }, [params.currentVisual, query]);

  return (
    <AnalyticsProvider meta={meta}>
      <Metadata
        title={selectedDataset.meta.title}
        description={selectedDataset.meta.desc.replace(/^(.*?)]/, "")}
        keywords={""}
      />
      <WindowProvider>
        <CatalogueProvider
          dataset={selectedDataset}
          urls={{
            csv: data.link_csv,
            parquet: data.link_parquet,
          }}
        >
          <DataCatalogueWidget
            params={params}
            data={data}
            selectedViz={
              data.dataviz_set.find(item => item.dataviz_id === params.currentVisual) ??
              data.dataviz_set[0]
            }
            query={query}
          />
        </CatalogueProvider>
      </WindowProvider>
    </AnalyticsProvider>
  );
};

CatalogueEmbed.layout = page => <>{page}</>;
CatalogueEmbed.theme = "light";

export const getServerSideProps: GetServerSideProps = withi18n(
  "catalogue",
  async ({ locale, query, params }) => {
    const { theme, ...qs } = query;
    try {
      const { data } = (await get(`/data-catalogue2/${params?.id}`, {
        language: SHORT_LANG[locale as keyof typeof SHORT_LANG],
        ...qs,
      })) as AxiosResponse<DCVariable>;

      return {
        props: {
          meta: {
            id: data.id,
            type: "data-catalogue",
            category: null,
            agency: Array.isArray(data.data_source) ? data.data_source.join(",") : "",
          },
          params: { ...params },
          query: query,
          ...data,
        },
      };
    } catch (error) {
      console.error(error);
      return { notFound: true };
    }
  },
  {
    cache_expiry: 21600, // 6 hrs
  }
);

export default CatalogueEmbed;
