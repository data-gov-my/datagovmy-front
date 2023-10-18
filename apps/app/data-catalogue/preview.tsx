import { Dispatch, FunctionComponent, ReactNode, SetStateAction } from "react";
import { IDataViz } from "./show";
import { CatalogueProvider, DatasetType } from "datagovmy-ui/contexts/catalogue";
import { Card } from "datagovmy-ui/components";
import dynamic from "next/dynamic";
import { WindowProvider } from "datagovmy-ui/contexts/window";
import { clx, recurDataMapping } from "datagovmy-ui/helpers";
import { DCConfig } from "datagovmy-ui/types";

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
  dataviz: undefined | IDataViz;
  dataset: DatasetType;
  urls: {
    [key: string]: string;
  };
  translations: {
    [key: string]: string;
  };
  config: DCConfig;
  selectedViz: IDataViz | undefined;
  setSelectedViz: Dispatch<SetStateAction<undefined | IDataViz>>;
  scrollToChart: () => void;
}

const CataloguePreview: FunctionComponent<CataloguePreviewProps> = ({
  dataviz,
  dataset,
  urls,
  selectedViz,
  setSelectedViz,
  translations,
  config,
  scrollToChart,
}) => {
  if (!dataviz) {
    return null;
  }

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
              precision: dataviz?.chart_filters.precision ?? config.precision,
              range: "WEEKLY" || "INTRADAY",
            }}
          />
        );
      // case "BAR":
      // case "HBAR":
      // case "STACKED_BAR":
      //   return (
      //     <WindowProvider>
      //       <CatalogueBar config={config} translations={translations} />
      //     </WindowProvider>
      //   );
      // case "CHOROPLETH":
      //   return <CatalogueChoropleth config={config} />;
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

  const extractChartDataset = (table_data: Record<string, any>[], currentViz: IDataViz) => {
    const set = Object.entries(currentViz?.chart_variables.format).map(([key, value]) =>
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
      <div className="flex w-[calc(100%_/_1.5-_0.5rem)] flex-col justify-start gap-2 lg:w-[calc(100%_/_5.5-_0.5rem)] lg:max-w-[200px]">
        <Card
          key={`${dataviz.translation_key}`}
          className={clx(
            "border-outline hover:border-outlineHover hover:bg-background dark:border-washed-dark hover:dark:border-outlineHover-dark dark:hover:bg-washed-dark/50 h-[110px] min-w-[calc(100%_/_1.5-_0.5rem)]  p-2 transition-colors lg:min-w-[calc(100%_/_5.5-_0.5rem)] lg:max-w-[200px]",
            selectedViz?.translation_key === dataviz.translation_key && "border-outlineHover"
          )}
          onClick={() => {
            setSelectedViz(dataviz);
            scrollToChart();
          }}
        >
          {renderChart()}
        </Card>
        <p className="text-center text-xs">{dataviz.translation_key ?? ""}</p>
      </div>
    </CatalogueProvider>
  );
};

export default CataloguePreview;
