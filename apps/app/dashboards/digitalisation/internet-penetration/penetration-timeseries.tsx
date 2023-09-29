import { useData, useSlice, useTranslation } from "datagovmy-ui/hooks";
import { WithData } from "datagovmy-ui/types";
import { FunctionComponent } from "react";
import { PenetrationData, PenetrationOptions, TimeseriesChartData } from ".";
import { numFormat, toDate } from "datagovmy-ui/helpers";
import dynamic from "next/dynamic";
import { AKSARA_COLOR } from "datagovmy-ui/constants";
import { Section, Slider, Tabs } from "datagovmy-ui/components";
import { SliderProvider } from "datagovmy-ui/contexts/slider";

const Timeseries = dynamic(() => import("datagovmy-ui/charts/timeseries"), { ssr: false });

interface PenetrationTimeseriesProps {
  timeseries: WithData<Record<PenetrationOptions, Record<PenetrationData, number[]>>>;
  timeseries_callout: WithData<
    Record<Exclude<PenetrationData, "x">, { latest: number; rate: number }>
  >;
}

const PenetrationTimeseries: FunctionComponent<PenetrationTimeseriesProps> = ({
  timeseries,
  timeseries_callout,
}) => {
  const { t, i18n } = useTranslation(["dashboard-internet-penetration"]);

  const tabs: { [key: number]: PenetrationOptions } = {
    0: "actual",
    1: "rate",
  };

  const { data, setData } = useData({
    minmax: [0, timeseries.data.actual.x.length - 1],
    tab_index: 0,
    tab: tabs[0],
  });

  const tab = data.tab as PenetrationOptions;

  const LATEST_TIMESTAMP = timeseries.data[tab].x[timeseries.data[tab].x.length - 1];
  const { coordinate } = useSlice(timeseries.data[tab], data.minmax);

  const getRateUnit = (key: Exclude<PenetrationData, "x">) => {
    switch (key) {
      case "fbb":
        return "perHundredPremises";
      case "mbb":
      case "mc":
        return "perHundredPopulation";
      case "ptv":
        return "perHundredHouseholds";

      default:
        return "";
    }
  };

  const plotTimeseries = (charts: Exclude<PenetrationData, "x">[], play: boolean) => {
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
              date: toDate(
                LATEST_TIMESTAMP,
                `${i18n.language === "ms-MY" ? "'ST'" : ""}q${
                  i18n.language === "ms-MY" ? "" : "Q"
                } yyyy`,
                i18n.language
              ),
            }),
            value: [
              numFormat(
                Math.abs(timeseries_callout.data[name].latest),
                "compact",
                1,
                "long",
                i18n.language,
                true
              ),
            ].join(""),
          },
          // {
          //   title: `${t("keys.rate")}  (${t(`keys.${getRateUnit(name)}`)})`,
          //   value: [
          //     numFormat(
          //       Math.abs(timeseries_callout.data[name].rate),
          //       "compact",
          //       1,
          //       "long",
          //       i18n.language,
          //       true
          //     ),
          //   ].join(""),
          // },
        ],
      };
      return (
        <Timeseries
          key={title}
          title={title}
          className="h-[350px] w-full"
          interval="quarter"
          enableAnimation={!play}
          displayNumFormat={value => {
            return [numFormat(Math.abs(value), "compact", 0, "long", i18n.language, true)].join("");
          }}
          tooltipCallback={item =>
            [
              item.dataset.label + ": ",
              numFormat(Math.abs(item.parsed.y), "compact", 1, "long", i18n.language, false),
              ` ${tab === "rate" ? t(`keys.${getRateUnit(name)}`) : ""}`,
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
        title={t("section_penetration.title")}
        description={t("section_penetration.description")}
        date={timeseries.data_as_of}
        // menu={
        //   <Tabs.List
        //     options={[t("keys.actual"), t("keys.pen_rate")]}
        //     current={data.tab_index}
        //     onChange={index => {
        //       setData("tab_index", index);
        //       setData("tab", tabs[index]);
        //     }}
        //   />
        // }
      >
        <SliderProvider>
          {play => (
            <>
              <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
                {plotTimeseries(["fbb", "mbb", "mc", "ptv"], play)}
              </div>
              <Slider
                type="range"
                period={"quarter"}
                value={data.minmax}
                onChange={e => setData("minmax", e)}
                data={timeseries.data[tab].x}
              />
            </>
          )}
        </SliderProvider>
      </Section>
    </>
  );
};

export default PenetrationTimeseries;
