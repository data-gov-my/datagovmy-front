import { CatalogueContext } from "../../contexts/catalogue";
import { HeatmapData, HeatmapDatum } from "../heatmap";
import { default as dynamic } from "next/dynamic";
import { FunctionComponent, useContext, useMemo } from "react";

const Heatmap = dynamic(() => import("../heatmap"), {
  ssr: false,
});

interface CatalogueHeatmapProps {
  className?: string;
  config: any;
  translations: any;
}

const CatalogueHeatmap: FunctionComponent<CatalogueHeatmapProps> = ({
  className,
  config,
  translations,
}) => {
  const { bind, dataset } = useContext(CatalogueContext);

  const _datasets = useMemo<HeatmapData>(() => {
    return dataset.chart.map((item: HeatmapDatum) => ({
      x: translations[item.x] ?? item.x,
      y: translations[item.y] ?? item.y,
      z: item.z,
    }));
  }, [dataset.chart]);

  return (
    <Heatmap
      _ref={ref => bind.chartjs(ref)}
      className={className}
      data={_datasets}
      color={config.color}
    />
  );
};

export default CatalogueHeatmap;
