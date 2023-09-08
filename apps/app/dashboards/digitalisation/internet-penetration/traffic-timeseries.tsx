import { useData, useSlice, useTranslation } from "datagovmy-ui/hooks";
import { WithData } from "datagovmy-ui/types";
import { FunctionComponent } from "react";
import { TimeseriesChartData, TrafficData } from ".";
import { numFormat, toDate } from "datagovmy-ui/helpers";
import dynamic from "next/dynamic";
import { AKSARA_COLOR } from "datagovmy-ui/constants";
import { Section, Slider } from "datagovmy-ui/components";
import { SliderProvider } from "datagovmy-ui/contexts/slider";

const Timeseries = dynamic(() => import("datagovmy-ui/charts/timeseries"), { ssr: false });

interface TrafficTimeseriesProps {
  timeseries: WithData<Record<TrafficData, number[]>>;
  timeseries_callout: WithData<Record<Exclude<TrafficData, "x">, { latest: number }>>;
}

const TrafficTimeseries: FunctionComponent<TrafficTimeseriesProps> = ({
  timeseries,
  timeseries_callout,
}) => {
  const { t, i18n } = useTranslation(["dashboard-internet-penetration"]);

  const { data, setData } = useData({
    minmax: [0, timeseries.data.x.length - 1],
  });

  const LATEST_TIMESTAMP = timeseries.data.x[timeseries.data.x.length - 1];
  const { coordinate } = useSlice(timeseries.data, data.minmax);

  const plotTimeseries = (charts: Exclude<TrafficData, "x">[], play: boolean) => {
    return charts.map(name => {
      const {
        title,
        label,
        data: datum,
        fill,
        stats,
      }: TimeseriesChartData = {
        title: t(`keys.${name}`),
        label: t(`keys.${name}`),
        data: coordinate[name],
        fill: true,
        stats: [
          {
            title: t("common:common.latest", {
              date: toDate(LATEST_TIMESTAMP, "MMMM yyyy", i18n.language),
            }),
            value: [
              numFormat(
                Math.abs(timeseries_callout.data[name].latest),
                "compact",
                2,
                "long",
                i18n.language,
                true
              ),
              " Exabytes",
            ].join(""),
          },
        ],
      };
      return (
        <Timeseries
          key={title}
          title={title}
          className="h-[350px] w-full"
          interval="month"
          enableAnimation={!play}
          tooltipCallback={item =>
            [
              item.dataset.label + ": ",
              numFormat(Math.abs(item.parsed.y), "compact", 2, "long", i18n.language, false),
              " Exabytes",
            ].join("")
          }
          axisY={{
            y2: {
              display: false,
              grid: {
                drawTicks: false,
                drawBorder: false,
                lineWidth: 0.5,
              },
              ticks: {
                display: false,
              },
            },
          }}
          data={{
            labels: coordinate.x,
            datasets: [
              {
                type: "line",
                label: label,
                data: datum,
                backgroundColor: AKSARA_COLOR.PURPLE_H,
                borderColor: AKSARA_COLOR.PURPLE,
                fill: fill,
                borderWidth: 1.5,
              },
            ],
          }}
          stats={stats}
        />
      );
    });
  };

  return (
    <>
      <Section
        title={t("section_traffic.title")}
        description={t("section_traffic.description")}
        date={timeseries.data_as_of}
      >
        <SliderProvider>
          {play => (
            <>
              <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
                {plotTimeseries(["traffic_fbb", "traffic_mbb"], play)}
              </div>
              <Slider
                type="range"
                period={"month"}
                value={data.minmax}
                onChange={e => setData("minmax", e)}
                data={timeseries.data.x}
              />
            </>
          )}
        </SliderProvider>
      </Section>
    </>
  );
};

export default TrafficTimeseries;
