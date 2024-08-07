import { useTheme } from "next-themes";
import { CatalogueContext } from "../../contexts/catalogue";
import { WindowContext } from "../../contexts/window";
import { BREAKPOINTS, CATALOGUE_COLORS } from "../../lib/constants";
import { clx } from "../../lib/helpers";
import { ChartDataset } from "chart.js";
import { default as dynamic } from "next/dynamic";
import { FunctionComponent, useContext, useMemo } from "react";

const Bar = dynamic(() => import("../bar"), { ssr: false });

interface CatalogueBarProps {
  className?: string;
  config: {
    precision: number;
  };
  translations: Record<string, string>;
  isPreview?: boolean;
}

const CatalogueBar: FunctionComponent<CatalogueBarProps> = ({
  className,
  config,
  translations,
  isPreview,
}) => {
  const { bind, dataset } = useContext(CatalogueContext);
  const { forcedTheme } = useTheme();

  const { size } = useContext(WindowContext);
  const bar_layout = useMemo<"horizontal" | "vertical">(() => {
    if (dataset.type === "HBAR" || size.width < BREAKPOINTS.MD) return "horizontal";
    return "vertical";
  }, [dataset.type, size.width]);

  const _datasets = useMemo<ChartDataset<"bar", any[]>[]>(() => {
    const sets = Object.entries(dataset.chart).filter(([key, _]) => key !== "x");

    return sets.map(([key, y], index) => ({
      data: y as number[],
      label: translations[key] ?? key,
      borderColor: CATALOGUE_COLORS[index],
      backgroundColor: CATALOGUE_COLORS[index].concat("1A"),
      borderWidth: 1,
    }));
  }, [dataset.chart]);

  return (
    <Bar
      _ref={ref => bind.chartjs(ref)}
      className={clx(
        className
          ? className
          : bar_layout === "vertical"
            ? "h-[350px] w-full lg:h-[450px]"
            : "mx-auto h-[500px] w-full lg:h-[600px] lg:w-3/4"
      )}
      type="category"
      enableStack={dataset.type === "STACKED_BAR"}
      layout={bar_layout}
      enableGridX={bar_layout !== "vertical"}
      enableGridY={bar_layout === "vertical"}
      enableLegend={_datasets.length > 1}
      tooltipEnabled={isPreview ? false : true}
      displayXAxis={isPreview ? false : true}
      displayYAxis={isPreview ? false : true}
      precision={config?.precision ? [config.precision, config.precision] : [1, 1]}
      data={{
        labels: dataset.chart.x.map((_x: number | string) => {
          if (typeof _x === "number") {
            return _x.toString();
          }
          return _x;
        }),
        datasets: _datasets,
      }}
      forcedTheme={forcedTheme}
    />
  );
};

export default CatalogueBar;
