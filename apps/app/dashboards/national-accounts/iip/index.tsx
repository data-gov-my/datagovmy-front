import { ChartDataset, ChartTypeRegistry } from "chart.js";
import { AgencyBadge, Container, Dropdown, Hero, Section, Slider } from "datagovmy-ui/components";
import { AKSARA_COLOR } from "datagovmy-ui/constants";
import { SliderProvider } from "datagovmy-ui/contexts/slider";
import { numFormat } from "datagovmy-ui/helpers";
import { useData, useSlice, useTranslation, useWatch } from "datagovmy-ui/hooks";
import { MetaPage, OptionType } from "datagovmy-ui/types";
import dynamic from "next/dynamic";
import { FunctionComponent, useCallback } from "react";

/**
 * International Investment Position Dashboard
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

interface IIPProps {
  last_updated: string;
  timeseries: any;
  timeseries_callout: any;
  meta: MetaPage;
}

const InternationalInvestmentPosition: FunctionComponent<IIPProps> = ({
  last_updated,
  timeseries,
  timeseries_callout,
  meta,
}) => {
  const { t } = useTranslation("");

  const INDEX_OPTIONS: Array<OptionType> = [
    { label: "Net", value: "net" },
    { label: "Assets", value: "assets" },
    { label: "Liabilities", value: "liabilities" },
  ];
  const SHADE_OPTIONS: Array<OptionType> = [
    { label: "No shading", value: "no_shade" },
    { label: "Recession", value: "recession" },
  ];

  const { data, setData } = useData({
    minmax: [0, timeseries.data[INDEX_OPTIONS[0].value].x.length - 1],
    index_type: INDEX_OPTIONS[0],
    shade_type: SHADE_OPTIONS[0],
  });

  const { coordinate } = useSlice(timeseries.data[data.index_type.value], data.minmax);

  const formatToBillions = (number: number) => {
    if (number >= 1e12) {
      return `${numFormat(number / 1e9, "standard", 1, "long")} bil`;
    }
    return numFormat(number, "compact", [1, 1], "long", undefined, true);
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
      title: chartName,
      prefix: "RM ",
      unitY: "",
      label: t(`keys.${chartName}`),
      data: coordinate[chartName],
      fill: data.shade_type.value === "no_shade",
      callout: {
        latest:
          timeseries_callout.data[data.index_type.value][chartName].latest > 0
            ? `RM ${formatToBillions(
                timeseries_callout.data[data.index_type.value][chartName].latest
              )}`
            : `-RM ${
                formatToBillions(
                  timeseries_callout.data[data.index_type.value][chartName].latest
                ).split("-")[1]
              }`,
        change:
          timeseries_callout.data[data.index_type.value][chartName].change > 0
            ? `+RM ${formatToBillions(
                timeseries_callout.data[data.index_type.value][chartName].change
              )}`
            : `-RM ${
                formatToBillions(
                  timeseries_callout.data[data.index_type.value][chartName].change
                ).split("-")[1]
              }`,
      },
      chartName,
    }));

  const detailsChartData = getChartData([
    "derivatives",
    "direct_debt",
    "direct_equity",
    "direct_total",
    "other",
    "porfolio_equity",
    "portfolio_debt",
    "portfolio_total",
    "reserve",
  ]);

  useWatch(() => {
    setData("minmax", [0, timeseries.data[data.index_type.value].x.length - 1]);
  }, [data.index_type]);

  return (
    <>
      <Hero
        background="blue"
        category={["National Accounts", "text-primary dark:text-primary-dark"]}
        header={["International Investment Position"]}
        description={[
          "How much money is the world investing in Malaysia? And how much money is Malaysia investing overseas? These are two critical questions for our policymakers, answered through data on what is called our International Investment Position (IIP). The IIP is one of 3 primary national accounts that convey Malaysia's economic performance, the other two being Gross Domestic Product (GDP) and the Balance of Payments (BOP). This dashboard gives you an easy way to explore key IIP trends and patterns. Enjoy!",
        ]}
        last_updated={last_updated}
        agencyBadge={<AgencyBadge agency={meta.agency} />}
      />

      <Container className="min-h-screen">
        <Section
          title={"How is Malaysia’s International Investment Position (IIP) trending?"}
          description={
            <div className="flex flex-col gap-4">
              <p className={"whitespace-pre-line text-base"}>
                Net figures are derived by subtracting liabilities from assets. A positive number
                indicates net assets, while a negative number indicates net liabilities.
              </p>
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
                  interval="quarter"
                  displayNumFormat={value => formatToBillions(value)}
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
                        label: "Total",
                        fill: data.shade_type.value === "no_shade",
                        backgroundColor: AKSARA_COLOR.PRIMARY_H,
                        borderColor: AKSARA_COLOR.PRIMARY,
                        borderWidth: coordinate.x.length > 200 ? 1.0 : 1.5,
                      },
                      // shader(data.shade_type.value),
                    ],
                  }}
                  stats={[
                    {
                      title: "Latest (2Q 2023)",
                      value: `${
                        timeseries_callout.data[data.index_type.value].total.latest > 0 ? "+" : "-"
                      }RM ${formatToBillions(
                        timeseries_callout.data[data.index_type.value].total.latest
                      )}`,
                    },
                    {
                      title: "QoQ change",
                      value: `${
                        timeseries_callout.data[data.index_type.value].total.change > 0 ? "+" : "-"
                      }RM ${formatToBillions(
                        timeseries_callout.data[data.index_type.value].total.change
                      )}`,
                    },
                  ]}
                />
                <Slider
                  type="range"
                  period={"month"}
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
                        displayNumFormat={value => formatToBillions(value)}
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
                            // shader(data.shade_type.value),
                          ],
                        }}
                        stats={[
                          {
                            title: "Latest (2Q 2023)",
                            value: chartData.callout.latest,
                          },
                          {
                            title: "QoQ change",
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

export default InternationalInvestmentPosition;
