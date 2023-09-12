import { CatalogueContext } from "../../contexts/catalogue";
import { AKSARA_COLOR } from "../../lib/constants";
import { ChartDataset } from "chart.js";
import { default as dynamic } from "next/dynamic";
import { FunctionComponent, useContext, useMemo } from "react";

const Pyramid = dynamic(() => import("../pyramid"), { ssr: false });
interface CataloguePyramidProps {
  className?: string;
  config: any;
  translations: Record<string, string>;
}

const CataloguePyramid: FunctionComponent<CataloguePyramidProps> = ({
  className = "h-[450px] lg:h-[400px] max-w-lg mx-auto",
  config,
  translations,
}) => {
  const { bind, dataset } = useContext(CatalogueContext);

  const _datasets = useMemo<ChartDataset<"bar", any[]>[]>(() => {
    const sets = Object.entries(dataset.chart);
    const colors = [AKSARA_COLOR.PRIMARY, AKSARA_COLOR.DANGER]; // [blue, red]

    return sets
      .filter(([key, _]) => key !== "x")
      .map(([key, y], index) => ({
        data: y as number[],
        label: translations[key] ?? key,
        backgroundColor: colors[index].concat("1A") ?? AKSARA_COLOR.PRIMARY_H,
        borderColor: colors[index] ?? AKSARA_COLOR.PRIMARY,
        borderWidth: 1,
      }));
  }, [dataset.chart]);

  return (
    <Pyramid
      _ref={ref => bind.chartjs(ref)}
      className={className}
      precision={config?.precision !== undefined ? [config.precision, 0] : [1, 0]}
      data={{
        labels: dataset.chart.x,
        datasets: _datasets,
      }}
    />
  );
};

export default CataloguePyramid;
