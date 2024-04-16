import { Dispatch, FunctionComponent, ReactNode, SetStateAction, useMemo } from "react";
import { CatalogueProvider, DatasetType } from "datagovmy-ui/contexts/catalogue";
import { Card } from "datagovmy-ui/components";
import dynamic from "next/dynamic";
import { WindowProvider } from "datagovmy-ui/contexts/window";
import { clx, recurDataMapping } from "datagovmy-ui/helpers";
import { DCDataViz } from "../../../types/data-catalogue";
import { useRouter } from "next/router";
import { groupBy } from "lodash";

/**
 * Catalogue Preview
 * For showing dataset preview
 * @overview Status: In-Development
 */

const Table = dynamic(() => import("datagovmy-ui/charts/table"), { ssr: false });
const CatalogueTimeseries = dynamic(() => import("datagovmy-ui/dc-charts/timeseries"), {
  ssr: false,
});
const CatalogueChoropleth = dynamic(() => import("datagovmy-ui/dc-charts/choropleth"), {
  ssr: false,
});
const CatalogueGeoChoropleth = dynamic(() => import("datagovmy-ui/dc-charts/geochoropleth"), {
  ssr: false,
});
const CatalogueScatter = dynamic(() => import("datagovmy-ui/dc-charts/scatter"), {
  ssr: false,
});
const CatalogueMapPlot = dynamic(() => import("datagovmy-ui/dc-charts/mapplot"), {
  ssr: false,
});
const CatalogueGeojson = dynamic(() => import("datagovmy-ui/dc-charts/geojson"), {
  ssr: false,
});
const CatalogueBar = dynamic(() => import("datagovmy-ui/dc-charts/bar"), {
  ssr: false,
});
const CataloguePyramid = dynamic(() => import("datagovmy-ui/dc-charts/pyramid"), {
  ssr: false,
});
const CatalogueHeatmap = dynamic(() => import("datagovmy-ui/dc-charts/heatmap"), {
  ssr: false,
});
const CatalogueLine = dynamic(() => import("datagovmy-ui/dc-charts/line"), {
  ssr: false,
});

interface CataloguePreviewProps {
  dataviz: undefined | DCDataViz;
  dataset: DatasetType;
  urls: {
    [key: string]: string;
  };
  translations: Record<string, string>;
  selectedViz: DCDataViz;
  setSelectedViz: Dispatch<SetStateAction<DCDataViz>>;
  scrollToChart: () => void;
}

const CataloguePreview: FunctionComponent<CataloguePreviewProps> = ({
  dataviz,
  dataset,
  urls,
  selectedViz,
  setSelectedViz,
  translations,
  scrollToChart,
}) => {
  if (!dataviz) {
    return null;
  }
  const router = useRouter();

  const slider = useMemo(() => {
    if (!dataviz.config.slider) {
      return null;
    }

    const groupedData = groupBy(dataset.table, dataviz.config.slider.key);

    const sliderOptions = Object.keys(groupedData);

    return router.query.date_slider
      ? (router.query.date_slider as string)
      : sliderOptions[sliderOptions.length - 1] ?? null;
  }, []);

  const renderChart = (): ReactNode | undefined => {
    switch (dataviz.chart_type) {
      case "TIMESERIES":
      case "STACKED_AREA":
      case "INTRADAY":
        return (
          <CatalogueTimeseries
            translations={translations}
            className={"h-[94px] w-full"}
            isPreview={true}
            config={{
              precision: dataviz?.config.precision,
              range: "DAILY",
            }}
          />
        );
      case "BAR":
      case "HBAR":
      case "STACKED_BAR":
        return (
          <WindowProvider>
            <CatalogueBar
              className={"h-[94px] w-full"}
              config={{
                precision: dataviz?.config.precision,
              }}
              translations={translations}
              isPreview={true}
            />
          </WindowProvider>
        );
      case "CHOROPLETH":
        return (
          <CatalogueChoropleth
            className={"h-[94px] w-full"}
            isPreview={true}
            config={dataviz.config}
          />
        );
      // case "GEOCHOROPLETH":
      //   return <CatalogueGeoChoropleth config={config} />;
      // case "GEOPOINT":
      //   return <CatalogueMapPlot />;
      // case "GEOJSON":
      //   return <CatalogueGeojson config={config} />;
      // case "PYRAMID":
      //   return <CataloguePyramid config={config} translations={translations} />;
      // case "HEATTABLE":
      //   return <CatalogueHeatmap config={config} translations={translations} />;
      // case "SCATTER":
      //   return (
      //     <CatalogueScatter
      //       className="mx-auto aspect-square w-full lg:h-[512px] lg:w-1/2"
      //       translations={translations}
      //     />
      //   );
      // case "LINE":
      //   return <CatalogueLine config={config} translations={translations} />;
      default:
        return;
    }
  };

  const extractChartDataset = (table_data: Record<string, any>[], currentViz: DCDataViz) => {
    if (slider) {
      const groupedData = groupBy(table_data, currentViz.config.slider?.key);
      const set = Object.entries(currentViz?.config.format).map(([key, value]) =>
        recurDataMapping(key, value, groupedData[slider])
      );
      return {
        ...Object.fromEntries(set.map(array => [array[0][0], array[0][1]])),
      };
    }

    const set = Object.entries(currentViz?.config.format).map(([key, value]) =>
      recurDataMapping(key, value, table_data)
    );
    return {
      ...Object.fromEntries(set.map(array => [array[0][0], array[0][1]])),
    };
  };

  const _dataset = {
    type: dataviz.chart_type,
    chart: extractChartDataset(dataset.table, dataviz),
    table: dataset.table,
    meta: dataset.meta,
  };

  return (
    <CatalogueProvider dataset={_dataset} urls={urls}>
      <div className="flex w-[200px] max-w-[200px] flex-col justify-start gap-2 lg:w-[calc(100%_/_4.5)]">
        <Card
          key={`${dataviz.dataviz_id}`}
          className={clx(
            "border-outline hover:border-outlineHover hover:bg-background dark:border-washed-dark hover:dark:border-outlineHover-dark dark:hover:bg-washed-dark/50 h-[110px] min-w-full  max-w-[200px] p-2 transition-colors lg:min-w-[calc(100%_/_4.5)]",
            selectedViz?.dataviz_id === dataviz.dataviz_id &&
              "border-primary dark:border-primary-dark"
          )}
          onClick={() => {
            setSelectedViz(dataviz);
            router.replace(
              {
                query: { ...router.query, visual: dataviz.dataviz_id },
              },
              undefined,
              { shallow: true }
            );
            scrollToChart();
          }}
        >
          {renderChart()}
        </Card>
        <p className="text-center text-xs">{dataviz.title}</p>
      </div>
    </CatalogueProvider>
  );
};

export default CataloguePreview;
