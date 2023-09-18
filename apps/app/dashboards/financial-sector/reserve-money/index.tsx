import { ChartDataset, ChartTypeRegistry } from "chart.js";
import { AgencyBadge, Container, Dropdown, Hero, Section, Slider } from "datagovmy-ui/components";
import { AKSARA_COLOR } from "datagovmy-ui/constants";
import { SliderProvider } from "datagovmy-ui/contexts/slider";
import { numFormat, smartNumFormat, toDate } from "datagovmy-ui/helpers";
import { useData, useSlice, useTranslation, useWatch } from "datagovmy-ui/hooks";
import { OptionType } from "datagovmy-ui/types";
import { useTheme } from "next-themes";
import dynamic from "next/dynamic";
import { FunctionComponent, useCallback } from "react";

/**
 * Reserve Money Dashboard
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
}

const Timeseries = dynamic(() => import("datagovmy-ui/charts/timeseries"), { ssr: false });

interface ReserveMoneyDashboardProps {
  last_updated: string;
  timeseries: any;
  timeseries_callouts: any;
}

const ReserveMoneyDashboard: FunctionComponent<ReserveMoneyDashboardProps> = ({
  last_updated,
  timeseries,
  timeseries_callouts,
}) => {
  const { t, i18n } = useTranslation(["dashboard-reserve-money", "common"]);
  const { theme } = useTheme();
  const INDEX_OPTIONS: Array<OptionType> = Object.keys(timeseries.data)
    .reverse()
    .map((key: string) => ({
      label: t(`keys.${key}`),
      value: key,
    }));
  const SHADE_OPTIONS: Array<OptionType> = [
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
      const prefix =
        data.index_type.value.includes("value") && !data.index_type.value.includes("growth")
          ? "RM"
          : "";
      const unit = data.index_type.value.includes("growth") ? "%" : "";
      const callout = data.index_type.value.includes("growth")
        ? [
            numFormat(
              timeseries_callouts.data[data.index_type.value][key].callout,
              "standard",
              [1, 1]
            ),
            unit,
          ].join("")
        : [
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
          ].join("");
      return {
        prefix,
        unit,
        callout,
        fill: data.shade_type.value === "no_shade",
      };
    },
    [data.index_type, data.shade_type]
  );

  const getChartData = (sectionHeaders: string[]): TimeseriesChartData[] =>
    sectionHeaders.map(chartName => ({
      title: t(`keys.${chartName}`),
      unitY: configs(chartName).unit,
      label: t(`keys.${chartName}`),
      data: coordinate[chartName],
      fill: configs(chartName).fill,
      callout: configs(chartName).callout,
      prefix: configs(chartName).prefix,
    }));

  const section1ChartData = getChartData(["currency", "reserves_required", "reserves_excess"]);
  const section2ChartData = getChartData([
    "net_claims_gov",
    "claims_gov",
    "deposits_gov",
    "claims_private",
    "external",
    "others",
  ]);

  useWatch(() => {
    setData("minmax", [0, timeseries.data[data.index_type.value].x.length - 1]);
  }, [data.index_type]);

  return (
    <>
      <Hero
        background="gray"
        category={[t("common:categories.financial_sector")]}
        header={[t("header")]}
        description={[t("description")]}
        last_updated={last_updated}
        agencyBadge={<AgencyBadge agency="bnm" />}
      />

      <Container className="min-h-screen">
        <SliderProvider>
          {play => (
            <>
              {/* How is reserve money trending? */}
              <Section
                title={t("section_1.title")}
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
                date={timeseries.data_as_of}
              >
                <Timeseries
                  title={t("keys.total")}
                  className="h-[350px] w-full"
                  interval="month"
                  enableAnimation={!play}
                  displayType="compact"
                  displayNumFormat={(value, type, precision) =>
                    numFormat(value, type, precision, "long", i18n.language, true)
                  }
                  unitY={configs("total").unit}
                  prefixY={configs("total").prefix}
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
                        data: coordinate.total,
                        label: t("keys.total"),
                        borderColor: AKSARA_COLOR.PRIMARY,
                        backgroundColor: AKSARA_COLOR.PRIMARY_H,
                        borderWidth: 1.5,
                        fill: configs("total").fill,
                      },
                      shader(data.shade_type.value),
                    ],
                  }}
                  stats={[
                    {
                      title: t("common:common.latest", {
                        date: toDate(LATEST_TIMESTAMP, "MMM yyyy", i18n.language),
                      }),
                      value: configs("total").callout,
                    },
                  ]}
                />
                <Slider
                  className="pb-12 pt-8"
                  type="range"
                  value={data.minmax}
                  data={timeseries.data[data.index_type.value].x}
                  period="month"
                  onChange={e => setData("minmax", e)}
                />
                <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
                  {section1ChartData.map(chartData => (
                    <Timeseries
                      key={chartData.title}
                      title={chartData.title}
                      className="h-[350px] w-full"
                      interval="month"
                      enableAnimation={!play}
                      displayType={
                        ["growth_yoy", "growth_mom"].includes(data.index_type.value)
                          ? "standard"
                          : "compact"
                      }
                      displayNumFormat={(value, type, precision) =>
                        numFormat(value, type, precision, "long", i18n.language, true)
                      }
                      unitY={chartData.unitY}
                      prefixY={chartData.prefix}
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
                            date: toDate(LATEST_TIMESTAMP, "MMM yyyy", i18n.language),
                          }),
                          value: chartData.callout,
                        },
                      ]}
                    />
                  ))}
                </div>
              </Section>
              {/* Factors affecting Reserve Money */}
              <Section
                title={t("section_2.title")}
                description={t("section_2.description")}
                date={timeseries.data_as_of}
              >
                <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
                  {section2ChartData.map(chartData => (
                    <Timeseries
                      key={chartData.title}
                      title={chartData.title}
                      className="h-[350px] w-full"
                      interval="month"
                      enableAnimation={!play}
                      displayNumFormat={value => {
                        const isPercentage = ["growth_yoy", "growth_mom"].includes(
                          data.index_type.value
                        );
                        return [
                          value < 0 ? "-" : "",
                          !isPercentage ? "RM" : "",
                          numFormat(Math.abs(value), "compact", 0, "long", i18n.language, true),
                          isPercentage ? "%" : "",
                        ].join("");
                      }}
                      tooltipCallback={item => {
                        const isPercentage = ["growth_yoy", "growth_mom"].includes(
                          data.index_type.value
                        );
                        return [
                          item.dataset.label + ": ",
                          item.parsed.y < 0 ? "-" : "",
                          !isPercentage ? "RM" : "",
                          numFormat(
                            Math.abs(item.parsed.y),
                            isPercentage ? "standard" : "compact",
                            1,
                            "long",
                            i18n.language,
                            true
                          ),
                          isPercentage ? "%" : "",
                          ,
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
                            date: toDate(LATEST_TIMESTAMP, "MMM yyyy", i18n.language),
                          }),
                          value: chartData.callout,
                        },
                      ]}
                    />
                  ))}
                </div>
              </Section>
            </>
          )}
        </SliderProvider>
      </Container>
    </>
  );
};

export default ReserveMoneyDashboard;
