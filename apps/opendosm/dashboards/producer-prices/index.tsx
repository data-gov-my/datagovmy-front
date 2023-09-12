import { PricesIncomeIcon } from "@icons/division";
import { ChartDataset, ChartTypeRegistry } from "chart.js";
import { Container, Dropdown, Section, Slider, Hero, AgencyBadge } from "datagovmy-ui/components";
import { AKSARA_COLOR } from "datagovmy-ui/constants";
import { SliderProvider } from "datagovmy-ui/contexts/slider";
import { numFormat, toDate } from "datagovmy-ui/helpers";
import { useSlice, useData, useTranslation } from "datagovmy-ui/hooks";
import { OptionType, WithData } from "datagovmy-ui/types";
import dynamic from "next/dynamic";
import { FunctionComponent, useCallback } from "react";
import { useTheme } from "next-themes";

/**
 * Producer Proces (PPI) Dashboard
 * @overview Status: Live
 */

interface TimeseriesChartData {
  title: string;
  unitY: string;
  label: string;
  data: number[];
  fill: boolean;
  callout: string;
  prefix?: string;
}

const Timeseries = dynamic(() => import("datagovmy-ui/charts/timeseries"), {
  ssr: false,
});

type ProducerPricesKeys =
  | "electricity"
  | "agriculture"
  | "manufacturing"
  | "water"
  | "mining"
  | "overall";

interface ProducerPricesDashboardProps {
  last_updated: string;
  timeseries: WithData<{
    growth_mom: Record<ProducerPricesKeys | "x" | "recession", number[]>;
    growth_yoy: Record<ProducerPricesKeys | "x" | "recession", number[]>;
    value: Record<ProducerPricesKeys | "x" | "recession", number[]>;
  }>;
  timeseries_callouts: WithData<Record<ProducerPricesKeys, { callout: number }>>;
}
const ProducerPricesDashboard: FunctionComponent<ProducerPricesDashboardProps> = ({
  last_updated,
  timeseries,
  timeseries_callouts,
}) => {
  const { t, i18n } = useTranslation(["dashboard-producer-prices", "common"]);
  const { theme } = useTheme();

  const INDEX_OPTIONS: Array<OptionType> = ["growth_yoy", "growth_mom", "value"].map(
    (key: string) => ({
      label: t(`keys.${key}`),
      value: key,
    })
  );
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

  const configs = useCallback<(key: string) => { unit: string; callout: string; fill: boolean }>(
    (key: string) => {
      const unit = data.index_type.value === "value" ? "" : "%";
      const callout = [
        numFormat(timeseries_callouts.data[data.index_type.value][key].callout, "standard", [1, 1]),
        unit,
      ].join("");

      return {
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
    }));

  const section1ChartData = getChartData([
    "agriculture",
    "mining",
    "manufacturing",
    "electricity",
    "water",
  ]);

  return (
    <>
      <Hero
        background="orange"
        category={[t("common:categories.economy"), `text-orange-500`]}
        header={[t("header")]}
        description={[t("description")]}
        last_updated={last_updated}
        agencyBadge={
          <AgencyBadge name={t("division:bphpp.full")} icon={<PricesIncomeIcon />} isDivision />
        }
      />

      <Container className="min-h-screen">
        {/* How is the CPI trending? */}
        <SliderProvider>
          {play => (
            <Section
              title={t("section_1.title")}
              description={t("section_1.description")}
              date={timeseries.data_as_of}
            >
              <div className="space-y-8">
                <div className="grid grid-cols-2 gap-4 lg:flex lg:flex-row">
                  <Dropdown
                    anchor="left"
                    selected={data.index_type}
                    options={INDEX_OPTIONS}
                    onChange={(e: any) => setData("index_type", e)}
                  />
                  <Dropdown
                    anchor="left"
                    options={SHADE_OPTIONS}
                    selected={data.shade_type}
                    onChange={(e: any) => setData("shade_type", e)}
                  />
                </div>

                <Timeseries
                  title={t("keys.overall")}
                  className="h-[300px] w-full"
                  interval="month"
                  enableAnimation={!play}
                  unitY={configs("overall").unit}
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
                        borderColor: AKSARA_COLOR.ORANGE,
                        backgroundColor: AKSARA_COLOR.ORANGE_H,
                        borderWidth: 1.5,
                        fill: configs("overall").fill,
                      },
                      shader(data.shade_type.value),
                    ],
                  }}
                  stats={[
                    {
                      title: t("common:common.latest", {
                        date: toDate(LATEST_TIMESTAMP, "MMM yyyy", i18n.language),
                      }),
                      value: configs("overall").callout,
                    },
                  ]}
                />

                <Slider
                  className=""
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
                      className="h-[300px] w-full"
                      enableAnimation={!play}
                      interval="month"
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
                            borderColor: AKSARA_COLOR.ORANGE,
                            backgroundColor: AKSARA_COLOR.ORANGE_H,
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
              </div>
            </Section>
          )}
        </SliderProvider>
      </Container>
    </>
  );
};

export default ProducerPricesDashboard;
