import { Section, Slider } from "datagovmy-ui/components";
import { AKSARA_COLOR } from "datagovmy-ui/constants";
import { SliderProvider } from "datagovmy-ui/contexts/slider";
import { numFormat, toDate } from "datagovmy-ui/helpers";
import { useData, useSlice, useTranslation } from "datagovmy-ui/hooks";
import dynamic from "next/dynamic";
import { FunctionComponent, ReactNode } from "react";
import { growth } from "./types";

const Timeseries = dynamic(() => import("datagovmy-ui/charts/timeseries"), { ssr: false });

interface ArrivalsGridProps {
  title: ReactNode;
  description: ReactNode;
  data_as_of: string;
  keys: readonly string[];
  /** Monthly series: x in epoch ms, plus one array per key */
  timeseries: Record<string, number[]>;
  chartTitle: (key: string) => ReactNode;
}

/** A grid of small monthly charts sharing one range slider */
const ArrivalsGrid: FunctionComponent<ArrivalsGridProps> = ({
  title,
  description,
  data_as_of,
  keys,
  timeseries,
  chartTitle,
}) => {
  const { t, i18n } = useTranslation(["dashboard-immigration", "common"]);
  const { data, setData } = useData({ minmax: [0, timeseries.x.length - 1] });
  const { coordinate } = useSlice(timeseries, data.minmax);
  const month = toDate(data_as_of, "MMM yyyy", i18n.language);

  return (
    <Section title={title} description={description}>
      <SliderProvider>
        {play => (
          <>
            <div className="grid grid-cols-1 gap-12 pb-6 lg:grid-cols-2 xl:grid-cols-3">
              {keys.map(key => {
                const yoy = growth(timeseries[key], 12);
                return (
                  <Timeseries
                    key={key}
                    className="h-[300px] w-full"
                    title={chartTitle(key)}
                    enableAnimation={!play}
                    interval="month"
                    precision={[1, 0]}
                    data={{
                      labels: coordinate.x,
                      datasets: [
                        {
                          type: "line",
                          data: coordinate[key],
                          label: t("keys.arrivals"),
                          fill: true,
                          backgroundColor: AKSARA_COLOR.PURPLE_H,
                          borderColor: AKSARA_COLOR.PURPLE,
                          borderWidth: 1.5,
                        },
                      ],
                    }}
                    stats={[
                      {
                        title: month,
                        value: numFormat(timeseries[key].at(-1) ?? 0, "standard"),
                      },
                      {
                        title: t("section_2.stat_yoy"),
                        value:
                          yoy === null
                            ? "-"
                            : `${yoy > 0 ? "+" : ""}${numFormat(yoy, "standard", [1, 1])}%`,
                      },
                    ]}
                  />
                );
              })}
            </div>
            <Slider
              type="range"
              period="month"
              value={data.minmax}
              data={timeseries.x}
              onChange={e => setData("minmax", e)}
            />
          </>
        )}
      </SliderProvider>
    </Section>
  );
};

export default ArrivalsGrid;
