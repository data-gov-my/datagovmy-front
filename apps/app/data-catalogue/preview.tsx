import { Dispatch, FunctionComponent, ReactNode, SetStateAction } from "react";
import { IDataViz } from "./show";
import { CatalogueProvider, DatasetType } from "datagovmy-ui/contexts/catalogue";
import { Card } from "datagovmy-ui/components";
import dynamic from "next/dynamic";
import { WindowProvider } from "datagovmy-ui/contexts/window";
import { recurDataMapping } from "datagovmy-ui/helpers";
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
  setSelectedViz: Dispatch<SetStateAction<undefined | IDataViz>>;
}

const CataloguePreview: FunctionComponent<CataloguePreviewProps> = ({
  dataviz,
  dataset,
  urls,
  setSelectedViz,
  translations,
  config,
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
            className={"h-full w-full"}
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
      <Card
        key={`${dataviz.translation_key}`}
        className="flex h-48 min-w-[calc(100%_-_8px)] flex-col gap-2 p-2 lg:min-w-[calc(100%_/_2-_8px)]"
        onClick={() => setSelectedViz(dataviz)}
      >
        {renderChart()}
        <p className="text-center">{dataviz.translation_key ?? ""}</p>
      </Card>
    </CatalogueProvider>
  );
};

export default CataloguePreview;
