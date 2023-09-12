import { Precision } from "../../../types";
import { Slider, Spinner } from "../../components";
import { SliderProvider } from "../../contexts/slider";
import { useData, useSlice, useWatch } from "../../hooks";
import { CATALOGUE_COLORS, SHORT_PERIOD } from "../../lib/constants";
import { clx, numFormat } from "../../lib/helpers";
import { ChartDataset, ChartTypeRegistry } from "chart.js";
import { default as dynamic } from "next/dynamic";
import { FunctionComponent, useContext, useMemo } from "react";
import isEmpty from "lodash/isEmpty";
import { CatalogueContext } from "../../contexts/catalogue";
import { useTheme } from "next-themes";

const Timeseries = dynamic(() => import("../timeseries"), { ssr: false });
interface CatalogueTimeseriesProps {
  config: {
    precision: number | Precision;
    range: keyof typeof SHORT_PERIOD;
  };
  className?: string;
  translations: Record<string, string>;
}

const CatalogueTimeseries: FunctionComponent<CatalogueTimeseriesProps> = ({
  config,
  className = "h-[350px] w-full lg:h-[450px]",
  translations,
}) => {
  const { bind, dataset } = useContext(CatalogueContext);
  const { data, setData } = useData({
    minmax: [0, dataset.chart?.x ? dataset.chart?.x.length - 1 : 0],
  });
  const { coordinate } = useSlice(dataset.chart, data.minmax);
  const { theme } = useTheme();

  const getPrecision = (precision: number | Precision, key?: string): number | [number, number] => {
    if (!precision) return [1, 0];
    else if (typeof precision === "number") return precision;
    else if (precision.columns && key && key in precision.columns) return precision.columns[key];
    else return precision.default;
  };

  const getPrecisionMinMax = (precision: Precision): number => {
    if (precision.columns) return Math.min(...Object.values(precision.columns), precision.default);
    else return precision.default;
  };

  const _datasets = useMemo<ChartDataset<keyof ChartTypeRegistry, any[]>[]>(() => {
    const sets = Object.entries(coordinate).filter(([key, _]) => key !== "x");
    const NON_OVERLAPPING_BGCOLOR = ["#ecf0fd", "#f2f5f7", "#fff8ec", "#fde8e8"]; // [blue, gray, yellow, red]
    const DARK_NON_OVERLAPPING_BGCOLOR = ["#1B202F", "#25272B", "#2B271F", "#2A1C1D"]; // [blue, gray, yellow, red]
    return sets.map(([key, y], index) => ({
      type: "line",
      data: y as number[], // (y as number[]).map(e => numFormat(e, "standard", getPrecision(key, config.precision))),
      label: translations[key] ?? key,
      borderColor: CATALOGUE_COLORS[index],
      backgroundColor:
        theme === "light" ? NON_OVERLAPPING_BGCOLOR[index] : DARK_NON_OVERLAPPING_BGCOLOR[index],
      borderWidth: 1,
      fill: dataset.type === "STACKED_AREA" || sets.length <= 1,
    }));
  }, [coordinate]);

  useWatch(() => {
    if (dataset.chart.x) setData("minmax", [0, dataset.chart.x.length - 1]);
  }, [config.range, dataset.chart.x, data.ctx]);

  return (
    <SliderProvider>
      {play =>
        !isEmpty(dataset.chart.x) ? (
          <>
            <Timeseries
              _ref={ref => bind.chartjs(ref)}
              className={className}
              interval={SHORT_PERIOD[config.range]}
              round={SHORT_PERIOD[config.range]}
              precision={
                typeof config.precision === "number"
                  ? config.precision
                  : getPrecisionMinMax(config.precision)
              }
              tooltipCallback={function (item: any) {
                return `${item.dataset.label as string}: ${
                  item.parsed?.y
                    ? numFormat(item.parsed.y, "standard", getPrecision(config.precision))
                    : "-"
                }`;
              }}
              enableAnimation={!play}
              enableLegend={_datasets.length > 1}
              mode={dataset.type === "STACKED_AREA" ? "stacked" : "grouped"}
              data={{
                labels: coordinate.x,
                datasets: _datasets,
              }}
              beginZero={["STACKED_AREA", "INTRADAY"].includes(dataset.type)}
            />
            <Slider
              className="pt-4"
              type="range"
              data={dataset.chart.x}
              value={data.minmax}
              period={SHORT_PERIOD[config.range]}
              onChange={e => setData("minmax", e)}
            />
          </>
        ) : (
          <div className={clx(className, "flex items-center justify-center")}>
            <Spinner loading={isEmpty(dataset.chart.x)} />
          </div>
        )
      }
    </SliderProvider>
  );
};

export default CatalogueTimeseries;
