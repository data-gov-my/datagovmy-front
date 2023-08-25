import { ChartDataset, ChartTypeRegistry } from "chart.js";
import { Container, Dropdown, Section, Slider } from "datagovmy-ui/components";
import { AKSARA_COLOR } from "datagovmy-ui/constants";
import { SliderProvider } from "datagovmy-ui/contexts/slider";
import { numFormat, toDate } from "datagovmy-ui/helpers";
import { useData, useSlice, useTranslation } from "datagovmy-ui/hooks";
import { MetaPage, OptionType } from "datagovmy-ui/types";
import dynamic from "next/dynamic";
import { FunctionComponent, useCallback } from "react";

/**
 * Balance Of Payments Timeseries
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
    change: string;
  };
  prefix: string;
  chartName: string;
}

const Timeseries = dynamic(() => import("datagovmy-ui/charts/timeseries"), { ssr: false });

interface BOPProps {
  last_updated: string;
  timeseries: any;
  timeseries_callout: any;
  meta: MetaPage;
}

const BalanceOfPaymentsTimeseries: FunctionComponent<BOPProps> = ({
  last_updated,
  timeseries,
  timeseries_callout,
  meta,
}) => {
  const { t, i18n } = useTranslation(["dashboard-bop", "common"]);

  const INDEX_OPTIONS: Array<OptionType> = [
    { label: t("keys.net"), value: "net" },
    { label: t("keys.credit"), value: "credit" },
    { label: t("keys.debit"), value: "debit" },
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

  const formatToMillions = (number: number, dp: number = 1) => {
    if (number >= 1e9 || number <= -1e9) {
      return `${numFormat(number / 1e6, "standard", dp, "long", i18n.language)} mil`;
    }
    return numFormat(number, "compact", dp, "long", i18n.language, true);
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
    sectionHeaders.map(chartName => ({
      title: t(`keys.${chartName}`),
      prefix: "RM ",
      unitY: "",
      label: t(`keys.${chartName}`),
      data: coordinate[chartName],
      fill: data.shade_type.value === "no_shade",
      callout: {
        latest:
          timeseries_callout.data[data.index_type.value]?.[chartName].latest >= 0
            ? `RM ${formatToMillions(
                timeseries_callout.data[data.index_type.value]?.[chartName].latest
              )}`
            : `-RM ${
                formatToMillions(
                  timeseries_callout.data[data.index_type.value]?.[chartName].latest
                ).split("-")[1]
              }`,
        change:
          timeseries_callout.data[data.index_type.value]?.[chartName].change >= 0
            ? `+RM ${formatToMillions(
                timeseries_callout.data[data.index_type.value]?.[chartName].change
              )}`
            : `-RM ${
                formatToMillions(
                  timeseries_callout.data[data.index_type.value]?.[chartName].change
                ).split("-")[1]
              }`,
      },
      chartName,
    }));

  const detailsChartData = getChartData([
    "ca",
    "fa",
    "ka",
    "ca_goods",
    "ca_services",
    "ca_primary",
    "ca_secondary",
    "fa_dia",
    "fa_pi",
  ]);

  return (
    <>
      <Container className="min-h-screen">
        <Section
          title={t("section_1.title")}
          description={
            <div className="flex flex-col gap-4">
              <p className={"whitespace-pre-line text-base"}>{t("section_1.description")}</p>
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
                  enableAnimation={false}
                  className="h-[350px] w-full"
                  interval="quarter"
                  displayNumFormat={value => formatToMillions(value, 0)}
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
                        data: coordinate.bop,
                        label: t("keys.bop"),
                        fill: data.shade_type.value === "no_shade",
                        backgroundColor: AKSARA_COLOR.PRIMARY_H,
                        borderColor: AKSARA_COLOR.PRIMARY,
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
                      value: `${
                        timeseries_callout.data[data.index_type.value].bop.latest >= 0 ? "+" : "-"
                      }RM ${formatToMillions(
                        timeseries_callout.data[data.index_type.value].bop.latest
                      )}`,
                    },
                    {
                      title: t("keys.qoq_change"),
                      value: `${
                        timeseries_callout.data[data.index_type.value].bop.change >= 0 ? "+" : "-"
                      }RM ${formatToMillions(
                        timeseries_callout.data[data.index_type.value].bop.change
                      )}`,
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
                        displayNumFormat={value => formatToMillions(value, 0)}
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
                              backgroundColor: AKSARA_COLOR.PRIMARY_H,
                              borderColor: AKSARA_COLOR.PRIMARY,
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
                          {
                            title: t("keys.qoq_change"),
                            value: chartData.callout.change,
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

export default BalanceOfPaymentsTimeseries;
