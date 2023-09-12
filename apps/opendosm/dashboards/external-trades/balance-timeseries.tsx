import { Dropdown, Section, Slider } from "datagovmy-ui/components";
import { AKSARA_COLOR } from "datagovmy-ui/constants";
import { SliderProvider } from "datagovmy-ui/contexts/slider";
import { numFormat, toDate } from "datagovmy-ui/helpers";
import { useData, useSlice, useTranslation } from "datagovmy-ui/hooks";
import { OptionType, WithData } from "datagovmy-ui/types";
import dynamic from "next/dynamic";
import { FunctionComponent, useCallback } from "react";
import { useTheme } from "next-themes";
import { ChartDataset, ChartTypeRegistry } from "chart.js";
import {
  TimeseriesChartData,
  TimeseriesData,
  TimeseriesOptions,
  TimeseriesOptionsCallout,
} from ".";

/**
 * External Trade Statistics - Balance
 * @overview Status: Live
 */

const Timeseries = dynamic(() => import("datagovmy-ui/charts/timeseries"), { ssr: false });

interface TradeBalanceTimeseriesProps {
  timeseries: WithData<TimeseriesOptions>;
  timeseries_callout: WithData<TimeseriesOptionsCallout>;
  INDEX_OPTIONS: Array<OptionType>;
  SHADE_OPTIONS: Array<OptionType>;
}

const TradeBalanceTimeseries: FunctionComponent<TradeBalanceTimeseriesProps> = ({
  timeseries,
  timeseries_callout,
  INDEX_OPTIONS,
  SHADE_OPTIONS,
}) => {
  const { t, i18n } = useTranslation(["dashboard-external-trade"]);
  const { theme } = useTheme();

  const { data, setData } = useData({
    minmax: [0, timeseries.data[INDEX_OPTIONS[0].value].x.length - 1],
    index: INDEX_OPTIONS[0].value,
    shade: SHADE_OPTIONS[0].value,
  });
  const LATEST_TIMESTAMP = timeseries.data[data.index].x[timeseries.data[data.index].x.length - 1];
  const { coordinate } = useSlice(timeseries.data[data.index], data.minmax);

  const shader = useCallback<(key: string) => ChartDataset<keyof ChartTypeRegistry, any[]>>(
    (key: string) => {
      if (key === "no_shade")
        return {
          data: [],
        };

      return {
        type: "line",
        data: coordinate[key],
        backgroundColor: theme === "light" ? AKSARA_COLOR.BLACK_H : AKSARA_COLOR.WASHED_DARK,
        borderWidth: 0,
        fill: true,
        yAxisID: "y2",
        stepped: true,
      };
    },
    [data, theme]
  );

  const plotTimeseries = (
    charts: Exclude<TimeseriesData, "x" | "balance" | "recession">[],
    play: boolean
  ) => {
    return charts.map(name => {
      const {
        title,
        prefix,
        label,
        data: datum,
        fill,
        stats,
      }: TimeseriesChartData = {
        title: t(`keys.${name}`),
        prefix: "",
        label: t(`keys.${name}`),
        data: coordinate[name],
        fill: data.shade === "no_shade",
        stats: [
          {
            title: t("common:common.latest", {
              date: toDate(LATEST_TIMESTAMP, "MMMM yyyy", i18n.language),
            }),
            value: [
              ["growth_yoy"].includes(data.index)
                ? timeseries_callout.data[data.index][name].latest > 0
                  ? ""
                  : "-"
                : "RM",
              numFormat(
                Math.abs(timeseries_callout.data[data.index][name].latest),
                "compact",
                1,
                "long",
                i18n.language,
                false
              ),
              ["growth_yoy"].includes(data.index) ? "%" : "",
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
          displayNumFormat={value => {
            const isPercentage = ["growth_yoy"].includes(data.index);
            return [
              isPercentage ? prefixPercentage(value, false) : prefixRM(value, false),
              numFormat(Math.abs(value), "compact", 0, "long", i18n.language, true),
              isPercentage ? "%" : "",
            ].join("");
          }}
          tooltipCallback={item => {
            const isPercentage = ["growth_yoy"].includes(data.index);
            return [
              item.dataset.label + ": ",
              isPercentage
                ? prefixPercentage(item.parsed.y, false)
                : prefixRM(item.parsed.y, false),
              numFormat(Math.abs(item.parsed.y), "compact", 1, "long", i18n.language, false),
              isPercentage ? "%" : "",
            ].join("");
          }}
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
                backgroundColor: AKSARA_COLOR.PRIMARY_H,

                borderColor: AKSARA_COLOR.PRIMARY,

                fill: fill,
                borderWidth: 1.5,
              },
              shader(data.shade),
            ],
          }}
          stats={stats}
        />
      );
    });
  };

  const prefixRM = (value: number, usePositiveSign: boolean = true) =>
    value > 0 ? (usePositiveSign ? "+RM" : "RM") : "-RM";
  const prefixPercentage = (value: number, usePositiveSign: boolean = true) =>
    value > 0 ? (usePositiveSign ? "+" : "") : "-";

  return (
    <>
      <Section
        title={t("section_timeseries.title")}
        description={
          <div className="flex flex-col gap-4">
            <p className={"whitespace-pre-line text-base"}>{t("section_timeseries.description")}</p>
            <div className="grid grid-cols-2 gap-4 lg:flex lg:flex-row">
              <Dropdown
                anchor="left"
                options={INDEX_OPTIONS}
                selected={INDEX_OPTIONS.find(option => data.index === option.value)}
                onChange={e => setData("index", e.value)}
              />
              <Dropdown
                anchor="left"
                options={SHADE_OPTIONS}
                selected={SHADE_OPTIONS.find(option => data.shade === option.value)}
                onChange={e => setData("shade", e.value)}
              />
            </div>
          </div>
        }
        date={timeseries.data_as_of}
      >
        <SliderProvider>
          {play => (
            <>
              <Timeseries
                enableAnimation={!play}
                className="h-[350px] w-full"
                interval="month"
                displayNumFormat={value => {
                  const isPercentage = ["growth_yoy"].includes(data.index);
                  return [
                    isPercentage ? prefixPercentage(value, false) : prefixRM(value, false),
                    numFormat(Math.abs(value), "compact", 0, "long", i18n.language, true),
                    isPercentage ? "%" : "",
                  ].join("");
                }}
                tooltipCallback={item => {
                  const isPercentage = ["growth_yoy"].includes(data.index);
                  return [
                    item.dataset.label + ": ",
                    isPercentage
                      ? prefixPercentage(item.parsed.y, false)
                      : prefixRM(item.parsed.y, false),
                    numFormat(Math.abs(item.parsed.y), "compact", 1, "long", i18n.language, false),
                    isPercentage ? "%" : "",
                  ].join("");
                }}
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
                      data: coordinate.balance,
                      label: t("keys.balance"),
                      fill: data.shade === "no_shade",
                      backgroundColor: AKSARA_COLOR.PRIMARY_H,
                      borderColor: AKSARA_COLOR.PRIMARY,
                      borderWidth: coordinate.x.length > 200 ? 1.0 : 1.5,
                    },
                    shader(data.shade),
                  ],
                }}
                stats={[
                  {
                    title: t("common:common.latest", {
                      date: toDate(LATEST_TIMESTAMP, "MMMM yyyy", i18n.language),
                    }),
                    value: [
                      ["growth_yoy"].includes(data.index)
                        ? prefixPercentage(timeseries_callout.data[data.index].balance.latest)
                        : prefixRM(timeseries_callout.data[data.index].balance.latest),
                      numFormat(
                        Math.abs(timeseries_callout.data[data.index].balance.latest),
                        "compact",
                        1,
                        "long",
                        i18n.language,
                        false
                      ),
                      ["growth_yoy"].includes(data.index) ? "%" : "",
                    ].join(""),
                  },
                ]}
              />
              <Slider
                type="range"
                period={"month"}
                value={data.minmax}
                onChange={e => setData("minmax", e)}
                data={timeseries.data[data.index].x}
              />
              <Section>
                <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
                  {plotTimeseries(["exports", "imports", "total"], play)}
                </div>
              </Section>
            </>
          )}
        </SliderProvider>
      </Section>
    </>
  );
};

export default TradeBalanceTimeseries;
