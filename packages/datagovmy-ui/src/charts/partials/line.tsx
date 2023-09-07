import { Precision } from "../../../types";
import { CatalogueContext } from "../../contexts/catalogue";
import { CATALOGUE_COLORS } from "../../lib/constants";
import { numFormat } from "../../lib/helpers";
import { ChartDataset } from "chart.js";
import { default as dynamic } from "next/dynamic";
import { FunctionComponent, useContext, useMemo } from "react";

const Line = dynamic(() => import("../line"), { ssr: false });
interface CatalogueLineProps {
  className?: string;
  config: {
    line_variables?: Record<string, any>;
    precision: number | Precision;
  };
  translations: Record<string, string>;
}

const CatalogueLine: FunctionComponent<CatalogueLineProps> = ({
  className = "h-[350px] w-full lg:h-[450px]",
  config,
  translations,
}) => {
  const { bind, dataset } = useContext(CatalogueContext);

  const getPrecision = (key: string, precision: number | Precision): number | [number, number] => {
    if (!precision) return [1, 0];
    else if (typeof precision === "number") return precision;
    else if (precision.columns && key in precision.columns) return precision.columns[key];
    else return precision.default;
  };

  const getPrecisionMinMax = (precision: Precision): number => {
    if (precision.columns) return Math.min(...Object.values(precision.columns), precision.default);
    else return precision.default;
  };

  const _datasets = useMemo<ChartDataset<"line", any[]>[]>(() => {
    const sets = Object.entries(dataset.chart).filter(([key, _]) => key !== "x");

    return sets.map(([key, y], index) => ({
      type: "line",
      data: (y as number[]).map(e => numFormat(e, "standard", getPrecision(key, config.precision))),
      label: translations[key] ?? key,
      fill: sets.length === 1,
      backgroundColor: CATALOGUE_COLORS[index].concat("1A"),
      borderColor: CATALOGUE_COLORS[index],
      borderWidth: 1,
      pointRadius: 0,
      pointHitRadius: 2,
      stepped: config.line_variables && config.line_variables[key].stepped,
      tension: config.line_variables && config.line_variables[key].tension,
    }));
  }, [dataset.chart]);

  return (
    <Line
      className={className}
      _ref={ref => bind.chartjs(ref)}
      precision={
        typeof config.precision === "number"
          ? config.precision
          : getPrecisionMinMax(config.precision)
      }
      tooltipCallback={function (item: any) {
        return `${item.dataset.label as string}: ${
          item.raw !== undefined || item.raw !== null ? item.raw : "-"
        }`;
      }}
      data={{
        labels: dataset.chart.x,
        datasets: _datasets,
      }}
      enableTooltip
      enableCrosshair
      enableLegend={_datasets.length > 1}
    />
  );
};

export default CatalogueLine;
