import dynamic from "next/dynamic";
import { useTheme } from "next-themes";
import {
  IndicesTimeseriesData,
  IndicesTimeseriesOptions,
  IndicesTimeseriesOptionsCallout,
  TimeseriesChartData,
  TradeIndices,
} from ".";
import { OptionType, WithData } from "datagovmy-ui/types";
import { ChartDataset, ChartTypeRegistry } from "chart.js";
import { FunctionComponent, useCallback } from "react";
import { useData, useSlice, useTranslation } from "datagovmy-ui/hooks";
import { numFormat, toDate } from "datagovmy-ui/helpers";
import { AKSARA_COLOR } from "datagovmy-ui/constants";
import { Dropdown, Section, Slider } from "datagovmy-ui/components";
import { SliderProvider } from "datagovmy-ui/contexts/slider";

/**
 * External Trade Statistics - Indices
 * @overview Status: Live
 */

const Timeseries = dynamic(() => import("datagovmy-ui/charts/timeseries"), { ssr: false });

interface IndicesTimeseriesProps {
  timeseries: WithData<Record<TradeIndices, IndicesTimeseriesOptions>>;
  timeseries_callout: WithData<
    Record<
      TradeIndices,
      Record<Exclude<IndicesTimeseriesData, "x" | "recession">, IndicesTimeseriesOptionsCallout>
    >
  >;
  INDEX_OPTIONS: Array<OptionType>;
  SHADE_OPTIONS: Array<OptionType>;
}

const IndicesTimeseries: FunctionComponent<IndicesTimeseriesProps> = ({
  timeseries,
  timeseries_callout,
  INDEX_OPTIONS,
  SHADE_OPTIONS,
}) => {
  const { t, i18n } = useTranslation(["dashboard-external-trade"]);
  const { theme } = useTheme();

  const OPTIONS: Array<OptionType> = [
    { label: t("keys.tot"), value: "tot" },
    { label: t("keys.export_value"), value: "export_value" },
    { label: t("keys.export_volume"), value: "export_volume" },
    { label: t("keys.import_value"), value: "import_value" },
    { label: t("keys.import_volume"), value: "import_volume" },
  ];

  const { data, setData } = useData({
    minmax: [0, timeseries.data[OPTIONS[0].value][INDEX_OPTIONS[0].value].x.length - 1],
    index: INDEX_OPTIONS[0].value,
    shade: SHADE_OPTIONS[0].value,
    options: OPTIONS[0].value,
  });
  const LATEST_TIMESTAMP =
    timeseries.data[data.options][data.index].x[
      timeseries.data[data.options][data.index].x.length - 1
    ];
  const { coordinate } = useSlice(timeseries.data[data.options][data.index], data.minmax);

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
    charts: Exclude<IndicesTimeseriesData, "x" | "overall" | "recession">[],
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
              numFormat(
                Math.abs(timeseries_callout.data[data.options][name].index),
                "compact",
                1,
                "long",
                i18n.language,
                true
              ),
            ].join(""),
          },
          {
            title: t("keys.growth_yoy"),
            value: [
              timeseries_callout.data[data.options][name].growth_yoy > 0 ? "" : "-",
              numFormat(
                Math.abs(timeseries_callout.data[data.options][name].growth_yoy),
                "compact",
                1,
                "long",
                i18n.language,
                true
              ),
              "%",
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
              value < 0 ? "-" : "",
              numFormat(Math.abs(value), "compact", 0, "long", i18n.language, true),
              isPercentage ? "%" : "",
            ].join("");
          }}
          tooltipCallback={item => {
            const isPercentage = ["growth_yoy"].includes(data.index);
            return [
              item.dataset.label + ": ",
              item.parsed.y < 0 ? "-" : "",
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
                backgroundColor: AKSARA_COLOR.DANGER_H,

                borderColor: AKSARA_COLOR.DANGER,

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

  return (
    <>
      <Section
        title={t("section_indices.title")}
        description={
          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-4 lg:flex lg:flex-row">
              <Dropdown
                anchor="left"
                options={OPTIONS}
                selected={OPTIONS.find(option => data.options === option.value)}
                onChange={e => setData("options", e.value)}
              />
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
                    value < 0 ? "-" : "",
                    numFormat(Math.abs(value), "compact", 0, "long", i18n.language, true),
                    isPercentage ? "%" : "",
                  ].join("");
                }}
                tooltipCallback={item => {
                  const isPercentage = ["growth_yoy"].includes(data.index);
                  return [
                    item.dataset.label + ": ",
                    item.parsed.y < 0 ? "-" : "",
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
                      data: coordinate.overall,
                      label: t("keys.overall"),
                      fill: data.shade === "no_shade",
                      backgroundColor: AKSARA_COLOR.DIM_H,
                      borderColor: AKSARA_COLOR.DIM,
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
                      numFormat(
                        Math.abs(timeseries_callout.data[data.options].overall.index),
                        "compact",
                        1,
                        "long",
                        i18n.language,
                        true
                      ),
                    ].join(""),
                  },
                  {
                    title: t("keys.growth_yoy"),
                    value: [
                      timeseries_callout.data[data.options].overall.growth_yoy > 0 ? "" : "-",
                      numFormat(
                        Math.abs(timeseries_callout.data[data.options].overall.growth_yoy),
                        "compact",
                        1,
                        "long",
                        i18n.language,
                        true
                      ),
                      "%",
                    ].join(""),
                  },
                ]}
              />
              <Slider
                type="range"
                period={"month"}
                value={data.minmax}
                onChange={e => setData("minmax", e)}
                data={timeseries.data[data.options][data.index].x}
              />
              <Section>
                <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
                  {plotTimeseries(
                    [
                      "food",
                      "beverage_tobacco",
                      "crude",
                      "fuels",
                      "oils",
                      "chemicals",
                      "mfg",
                      "machinery",
                      "misc_mfg",
                      "misc_trnsc",
                    ],
                    play
                  )}
                </div>
              </Section>
            </>
          )}
        </SliderProvider>
      </Section>
    </>
  );
};

export default IndicesTimeseries;
