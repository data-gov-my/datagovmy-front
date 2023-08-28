import { ChartDataset, ChartTypeRegistry } from "chart.js";
import { AgencyBadge, Container, Dropdown, Hero, Section, Slider } from "datagovmy-ui/components";
import { AKSARA_COLOR } from "datagovmy-ui/constants";
import { SliderProvider } from "datagovmy-ui/contexts/slider";
import { numFormat, toDate } from "datagovmy-ui/helpers";
import { useData, useSlice, useTranslation, useWatch } from "datagovmy-ui/hooks";
import { MetaPage, OptionType } from "datagovmy-ui/types";
import dynamic from "next/dynamic";
import { FunctionComponent, useCallback } from "react";

/**
 * Labour Productivity Dashboard
 * @overview Status: Live
 */

interface TimeseriesChartData {
  title: string;
  unitY: string;
  label: string;
  data: number[];
  fill: boolean;
  callout: {
    latest: string;
  };
  prefix: string;
  chartName: string;
}

const Timeseries = dynamic(() => import("datagovmy-ui/charts/timeseries"), { ssr: false });

interface LabourProductivityProp {
  last_updated: string;
  timeseries: any;
  timeseries_callout: any;
}

const InternationalInvestmentPosition: FunctionComponent<LabourProductivityProp> = ({
  last_updated,
  timeseries,
  timeseries_callout,
}) => {
  const { t, i18n } = useTranslation(["dashboard-labour-productivity", "common"]);

  const INDEX_OPTIONS: Array<OptionType> = [
    { label: t("keys.growth_yoy_vah"), value: "growth_yoy_vah" },
    { label: t("keys.growth_yoy_vae"), value: "growth_yoy_vae" },
    { label: t("keys.growth_yoy_hours"), value: "growth_yoy_hours" },
    { label: t("keys.vah"), value: "vah" },
    { label: t("keys.vae"), value: "vae" },
    { label: t("keys.hours"), value: "hours" },
  ];
  const SHADE_OPTIONS: Array<OptionType> = [
    { label: t("keys.no_shade"), value: "no_shade" },
    { label: t("keys.recession"), value: "recession" },
  ];

  const { data, setData } = useData({
    minmax: [0, timeseries.data[INDEX_OPTIONS[0].value].x.length - 1],
    index_type: INDEX_OPTIONS[0],
    shade_type: SHADE_OPTIONS[0],
  });
  const LATEST_TIMESTAMP =
    timeseries.data[data.index_type.value].x[timeseries.data[data.index_type.value].x.length - 1];
  const { coordinate } = useSlice(timeseries.data[data.index_type.value], data.minmax);

  const formatToTenth = (number: number, dp: number = 1) => {
    if (number >= 1e3) {
      return `${numFormat(number / 1, "standard", dp, "long", i18n.language)}`;
    }
    return numFormat(number, "compact", dp, "long", i18n.language, true);
  };

  const getCalloutUnit = (type: string) => {
    switch (type) {
      case "vah":
        return "/ hour";
      case "vae":
        return "/ employee";
      case "hours":
        return "hours worked";

      default:
        return "";
    }
  };

  const shader = useCallback<(key: string) => ChartDataset<keyof ChartTypeRegistry, any[]>>(
    (key: string) => {
      if (key === "no_shade")
        return {
          data: [],
        };

      return {
        type: "line",
        data: coordinate[key],
        backgroundColor: AKSARA_COLOR.BLACK_H,
        borderWidth: 0,
        fill: true,
        yAxisID: "y2",
        stepped: true,
      };
    },
    [data]
  );

  const getChartData = (sectionHeaders: string[]): TimeseriesChartData[] =>
    sectionHeaders.map(chartName => {
      const isPercentage: boolean = [
        "growth_yoy_vah",
        "growth_yoy_vae",
        "growth_yoy_hours",
      ].includes(data.index_type.value);
      return {
        title: t(`keys.${chartName}`),
        prefix: isPercentage ? "" : "RM",
        unitY: isPercentage ? "%" : "",
        label: t(`keys.${chartName}`),
        data: coordinate[chartName],
        fill: data.shade_type.value === "no_shade",
        callout: {
          latest: isPercentage
            ? `${formatToTenth(
                timeseries_callout.data[data.index_type.value][chartName].latest,
                1
              )}%`
            : `${data.index_type.value === "hours" ? "" : "RM"} ${formatToTenth(
                timeseries_callout.data[data.index_type.value][chartName].latest,
                0
              )} ${getCalloutUnit(data.index_type.value)}`,
        },
        chartName,
      };
    });

  const detailsChartData = getChartData([
    "agriculture",
    "mining",
    "mfg",
    "construction",
    "sevices",
  ]);

  return (
    <>
      <Hero
        background="purple"
        category={[t("common:categories.labour_markets"), "text-purple"]}
        header={[t("header")]}
        description={[t("description")]}
        last_updated={last_updated}
        agencyBadge={<AgencyBadge agency="dosm" />}
      />

      <Container className="min-h-screen">
        <Section
          title={t("section_1.title")}
          description={
            <div className="flex flex-col gap-4">
              <div className="grid grid-cols-2 gap-4 lg:flex lg:flex-row">
                <Dropdown
                  anchor="left"
                  selected={data.index_type}
                  options={INDEX_OPTIONS}
                  onChange={e => setData("index_type", e)}
                />
                <Dropdown
                  anchor="left"
                  options={SHADE_OPTIONS}
                  selected={data.shade_type}
                  onChange={e => setData("shade_type", e)}
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
                  title={t(`keys.overall`)}
                  interval="quarter"
                  displayNumFormat={value => formatToTenth(value, 0)}
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
                        fill: data.shade_type.value === "no_shade",
                        backgroundColor: AKSARA_COLOR.PURPLE_H,
                        borderColor: AKSARA_COLOR.PURPLE,
                        borderWidth: coordinate.x.length > 200 ? 1.0 : 1.5,
                      },
                      shader(data.shade_type.value),
                    ],
                  }}
                  stats={[
                    {
                      title: t("common:common.latest", {
                        date: toDate(LATEST_TIMESTAMP, "qQ yyyy", i18n.language),
                      }),
                      value: ["growth_yoy_vah", "growth_yoy_vae", "growth_yoy_hours"].includes(
                        data.index_type.value
                      )
                        ? `${formatToTenth(
                            timeseries_callout.data[data.index_type.value].overall.latest,
                            1
                          )}%`
                        : `${data.index_type.value === "hours" ? "" : "RM"} ${formatToTenth(
                            timeseries_callout.data[data.index_type.value].overall.latest,
                            0
                          )} ${getCalloutUnit(data.index_type.value)}`,
                    },
                  ]}
                />
                <Slider
                  type="range"
                  period={"quarter"}
                  value={data.minmax}
                  onChange={e => setData("minmax", e)}
                  data={timeseries.data[data.index_type.value].x}
                />
                <Section>
                  <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
                    {detailsChartData.map(chartData => (
                      <Timeseries
                        key={chartData.title}
                        title={chartData.title}
                        className="h-[350px] w-full"
                        interval="quarter"
                        enableAnimation={!play}
                        displayNumFormat={value => formatToTenth(value, 0)}
                        prefixY={chartData.prefix}
                        unitY={chartData.unitY}
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
                              label: chartData.label,
                              data: chartData.data,
                              backgroundColor: AKSARA_COLOR.PURPLE_H,
                              borderColor: AKSARA_COLOR.PURPLE,
                              fill: chartData.fill,
                              borderWidth: 1.5,
                            },
                            shader(data.shade_type.value),
                          ],
                        }}
                        stats={[
                          {
                            title: t("common:common.latest", {
                              date: toDate(LATEST_TIMESTAMP, "qQ yyyy", i18n.language),
                            }),
                            value: chartData.callout.latest,
                          },
                        ]}
                      />
                    ))}
                  </div>
                </Section>
              </>
            )}
          </SliderProvider>
        </Section>
      </Container>
    </>
  );
};

export default InternationalInvestmentPosition;
