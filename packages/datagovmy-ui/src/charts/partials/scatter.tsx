import { CatalogueContext } from "../../contexts/catalogue";
import { CATALOGUE_COLORS } from "../../lib/constants";
import { ChartDataset } from "chart.js";
import { default as dynamic } from "next/dynamic";
import { FunctionComponent, useContext, useMemo } from "react";

const Scatter = dynamic(() => import("../scatter"), { ssr: false });

interface CatalogueScatterProps {
  className?: string;
  translations: any;
}

const CatalogueScatter: FunctionComponent<CatalogueScatterProps> = ({
  className = "mx-auto aspect-square w-full lg:h-[512px] lg:w-1/2",
  translations,
}) => {
  const { bind, dataset } = useContext(CatalogueContext);

  const _datasets = useMemo<ChartDataset<"scatter", any[]>[]>(() => {
    return dataset.chart.map((item: any, index: number) => ({
      type: "line",
      data: item.data,
      label: translations[item.label] ?? item.label,
      borderColor: CATALOGUE_COLORS[index],
      backgroundColor: CATALOGUE_COLORS[index],
      borderWidth: 0,
    }));
  }, [dataset.chart]);

  return (
    <Scatter
      _ref={ref => bind.chartjs(ref)}
      className={className}
      data={_datasets}
      enableRegression
      enableLegend
    />
  );
};

export default CatalogueScatter;
