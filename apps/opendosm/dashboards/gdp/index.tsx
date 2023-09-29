import { AccountingIcon } from "@icons/division";
import { ChartDataset, ChartTypeRegistry } from "chart.js";
import { Container, Slider, AgencyBadge, Dropdown, Hero, Section } from "datagovmy-ui/components";
import { SliderProvider } from "datagovmy-ui/contexts/slider";
import { numFormat, toDate } from "datagovmy-ui/helpers";
import { useTheme } from "next-themes";
import { useSlice, useData, useWatch, useTranslation } from "datagovmy-ui/hooks";
import { OptionType, WithData } from "datagovmy-ui/types";
import { AKSARA_COLOR } from "datagovmy-ui/constants";
import dynamic from "next/dynamic";
import { FunctionComponent, useCallback } from "react";

/**
 * GDP Dashboard
 * @overview Status: Live
 */

interface TimeseriesChartData {
  title: string;
  unitY: string;
  label: string;
  data: number[];
  fill: boolean;
  callout: string;
  prefix: string;
  chartName: string;
}

const Timeseries = dynamic(() => import("datagovmy-ui/charts/timeseries"), { ssr: false });

type GDPKeys =
  | "x"
  | "overall"
  | "supply_services"
  | "supply_manufacturing"
  | "supply_agri"
  | "supply_mining"
  | "supply_construction"
  | "supply_import_duties";

interface GDPDashboardProps {
  last_updated: string;
  timeseries: WithData<{
    growth_real_yoy: Record<GDPKeys, number[]>;
    growth_nominal_yoy: Record<GDPKeys, number[]>;
    growth_real_qoq: Record<GDPKeys, number[]>;
    growth_nominal_qoq: Record<GDPKeys, number[]>;
    real: Record<GDPKeys, number[]>;
    real_sa: Record<GDPKeys, number[]>;
    nominal: Record<GDPKeys, number[]>;
  }>;
  timeseries_callouts: WithData<{
    growth_real_yoy: Record<GDPKeys, { callout: number }>;
    growth_nominal_yoy: Record<GDPKeys, { callout: number }>;
    growth_real_qoq: Record<GDPKeys, { callout: number }>;
    growth_nominal_qoq: Record<GDPKeys, { callout: number }>;
    real: Record<GDPKeys, { callout: number }>;
    real_sa: Record<GDPKeys, { callout: number }>;
    nominal: Record<GDPKeys, { callout: number }>;
  }>;
}

const GDPDashboard: FunctionComponent<GDPDashboardProps> = ({
  last_updated,
  timeseries,
  timeseries_callouts,
}) => {
  const { t, i18n } = useTranslation(["dashboard-gdp", "common"]);
  const { theme } = useTheme();
  const INDEX_OPTIONS: OptionType[] = [
    "growth_real_yoy",
    "growth_nominal_yoy",
    "growth_real_qoq",
    "growth_nominal_qoq",
    "real",
    "real_sa",
    "nominal",
  ].map((key: string) => ({
    label: t(`keys.${key}`),
    value: key,
  }));
  const SHADE_OPTIONS: OptionType[] = [
    { label: t("keys.no_shade"), value: "no_shade" },
    { label: t("keys.recession"), value: "recession" },
  ];

  const { data, setData } = useData({
    index_type: INDEX_OPTIONS[0],
    shade_type: SHADE_OPTIONS[0],
    minmax: [0, timeseries.data[INDEX_OPTIONS[0].value].x.length - 1],
  });
  const LATEST_TIMESTAMP =
    timeseries.data[data.index_type.value].x[timeseries.data[data.index_type.value].x.length - 1];
  const { coordinate } = useSlice(timeseries.data[data.index_type.value], data.minmax);

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

  const configs = useCallback<
    (key: string) => { prefix: string; unit: string; callout: string; fill: boolean }
  >(
    (key: string) => {
      const isRM: boolean = ["real", "real_sa", "nominal"].includes(data.index_type.value);
      const prefix = isRM ? "RM" : "";
      const unit = isRM ? "" : "%";
      const callout = [
        timeseries_callouts.data[data.index_type.value][key].callout > 0 ? "" : "-",
        prefix,
        numFormat(
          Math.abs(timeseries_callouts.data[data.index_type.value][key].callout),
          "compact",
          [1, 1],
          "long",
          i18n.language,
          false
        ),
        unit,
      ].join("");

      return {
        prefix,
        unit,
        callout,
        fill: data.shade_type.value === "no_shade",
      };
    },
    [data.index_type, data.shade_type, i18n]
  );

  const getChartData = (sectionHeaders: string[]): TimeseriesChartData[] =>
    sectionHeaders.map(chartName => ({
      title: t(`keys.${chartName}`),
      prefix: configs(chartName).prefix,
      unitY: configs(chartName).unit,
      label: t(`keys.${chartName}`),
      data: coordinate[chartName],
      fill: configs(chartName).fill,
      callout: configs(chartName).callout,
      chartName,
    }));

  const section2ChartData = getChartData([
    "supply_services",
    "supply_manufacturing",
    "supply_agri",
    "supply_mining",
    "supply_construction",
    "supply_import_duties",
  ]);

  const section3ChartData = getChartData([
    "demand_c",
    "demand_i",
    "demand_g",
    "demand_x",
    "demand_m",
    "demand_nx",
    "demand_inventory",
  ]);

  useWatch(() => {
    setData("minmax", [0, timeseries.data[data.index_type.value].x.length - 1]);
  }, [data.index_type]);

  return (
    <>
      <Hero
        background="blue"
        category={[t("common:categories.economy"), "text-primary"]}
        header={[t("header")]}
        description={[t("description")]}
        last_updated={last_updated}
        agencyBadge={
          <AgencyBadge name={t("division:bpan.full")} icon={<AccountingIcon />} isDivision />
        }
      />
      <SliderProvider>
        {play => (
          <Container className="min-h-screen">
            {/* How is GDP trending? */}
            <Section
              title={t("section_1.title")}
              date={timeseries.data_as_of}
              description={
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
              }
            >
              <Timeseries
                title={t("keys.overall")}
                className="h-[300px] w-full"
                interval="quarter"
                enableAnimation={!play}
                displayNumFormat={value =>
                  numFormat(value, "compact", 0, "long", i18n.language, true)
                }
                tooltipCallback={item =>
                  [
                    item.dataset.label + ": ",
                    item.parsed.y < 0 ? "-" : "",
                    configs("overall").prefix,
                    numFormat(Math.abs(item.parsed.y), "compact", 1, "long", i18n.language, false),
                    configs("overall").unit,
                  ].join("")
                }
                prefixY={configs("overall").prefix}
                unitY={configs("overall").unit}
                lang={i18n.language}
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
                      borderColor: AKSARA_COLOR.PRIMARY,
                      backgroundColor: AKSARA_COLOR.PRIMARY_H,
                      borderWidth: 1.5,
                      fill: configs("overall").fill,
                    },
                    shader(data.shade_type.value),
                  ],
                }}
                stats={[
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
                    value: configs("overall").callout,
                  },
                ]}
              />
              <Slider
                type="range"
                value={data.minmax}
                data={timeseries.data[data.index_type.value].x}
                period="quarter"
                onChange={e => setData("minmax", e)}
              />
            </Section>
            {/* A deeper look at GDP by economic sector */}
            <Section title={t("section_2.title")} date={timeseries.data_as_of}>
              <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
                {section2ChartData.map(chartData => (
                  <Timeseries
                    key={chartData.title}
                    title={chartData.title}
                    className="h-[300px] w-full"
                    interval="quarter"
                    enableAnimation={!play}
                    displayNumFormat={value =>
                      numFormat(value, "compact", 0, "long", i18n.language, true)
                    }
                    tooltipCallback={item =>
                      [
                        item.dataset.label + ": ",
                        item.parsed.y < 0 ? "-" : "",
                        chartData.prefix,
                        numFormat(
                          Math.abs(item.parsed.y),
                          "compact",
                          1,
                          "long",
                          i18n.language,
                          false
                        ),
                        chartData.unitY,
                      ].join("")
                    }
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
                          borderColor: AKSARA_COLOR.PRIMARY,
                          backgroundColor: AKSARA_COLOR.PRIMARY_H,
                          fill: chartData.fill,
                          borderWidth: 1.5,
                        },
                        shader(data.shade_type.value),
                      ],
                    }}
                    stats={[
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
                        value: chartData.callout,
                      },
                    ]}
                  />
                ))}
              </div>
            </Section>
            {/* A deeper look at GDP by expenditure category */}
            <Section title={t("section_3.title")} date={timeseries.data_as_of}>
              <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
                {section3ChartData.map(chartData => {
                  const chart = (
                    <Timeseries
                      key={chartData.title}
                      title={chartData.title}
                      className="h-[300px] w-full"
                      interval="quarter"
                      enableAnimation={!play}
                      displayNumFormat={value =>
                        [
                          value < 0 ? "-" : "",
                          data.index_type.value.includes("growth") ? "" : "RM",
                          numFormat(Math.abs(value), "compact", 0, "long", i18n.language, true),
                        ].join("")
                      }
                      tooltipCallback={item =>
                        [
                          item.dataset.label + ": ",
                          item.parsed.y < 0 ? "-" : "",
                          chartData.prefix,
                          numFormat(
                            Math.abs(item.parsed.y),
                            "compact",
                            1,
                            "long",
                            i18n.language,
                            false
                          ),
                          chartData.unitY,
                        ].join("")
                      }
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
                            borderColor: AKSARA_COLOR.DANGER,
                            backgroundColor: AKSARA_COLOR.DANGER_H,
                            fill: chartData.fill,
                            borderWidth: 1.5,
                          },
                          shader(data.shade_type.value),
                        ],
                      }}
                      stats={[
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
                          value: chartData.callout,
                        },
                      ]}
                    />
                  );

                  if (
                    [
                      "growth_real_yoy",
                      "growth_real_qoq",
                      "growth_nominal_yoy",
                      "growth_nominal_qoq",
                    ].includes(data.index_type.value)
                  ) {
                    if (!["demand_nx", "demand_inventory"].includes(chartData.chartName)) {
                      return chart;
                    }
                  } else {
                    return chart;
                  }
                })}
              </div>
            </Section>
          </Container>
        )}
      </SliderProvider>
    </>
  );
};

export default GDPDashboard;
