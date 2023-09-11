import { InformationCircleIcon } from "@heroicons/react/24/outline";
import { PricesIncomeIcon } from "@icons/division";
import InflationGeography from "./inflation-geography";
import InflationSnapshot from "./inflation-snapshot";
import InflationTrends from "./inflation-trends";
import { useTheme } from "next-themes";
import { ChartDataset, ChartTypeRegistry } from "chart.js";
import { Container, Dropdown, Section, Slider, Hero, AgencyBadge } from "datagovmy-ui/components";
import { AKSARA_COLOR } from "datagovmy-ui/constants";
import { numFormat, toDate } from "datagovmy-ui/helpers";
import { useData, useSlice, useTranslation } from "datagovmy-ui/hooks";
import { OptionType, WithData } from "datagovmy-ui/types";
import dynamic from "next/dynamic";
import { FunctionComponent, useCallback } from "react";

/**
 * Consumer Prices (CPI) Dashboard
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
const Choropleth = dynamic(() => import("datagovmy-ui/charts/choropleth"), { ssr: false });

type ConsumerPriceKeys =
  | "alcohol_tobacco"
  | "clothing_footwear"
  | "communication"
  | "education"
  | "food_beverage"
  | "furnishings"
  | "health"
  | "hospitality"
  | "housing_utilities"
  | "misc"
  | "overall"
  | "recreation_culture"
  | "transport";

interface ConsumerPricesDashboardProps {
  last_updated: string;
  bar: WithData<{
    mom: Record<string, { x: string[]; y: number[] }>;
    yoy: Record<string, { x: string[]; y: number[] }>;
  }>;
  timeseries: WithData<{
    core: {
      growth_mom: Record<ConsumerPriceKeys | "x" | "recession", number[]>;
      growth_yoy: Record<ConsumerPriceKeys | "x" | "recession", number[]>;
      value: Record<ConsumerPriceKeys | "x" | "recession", number[]>;
    };
    headline: {
      growth_mom: Record<ConsumerPriceKeys | "x" | "recession", number[]>;
      growth_yoy: Record<ConsumerPriceKeys | "x" | "recession", number[]>;
      value: Record<ConsumerPriceKeys | "x" | "recession", number[]>;
    };
  }>;
  timeseries_callouts: WithData<{
    core: {
      growth_mom: Record<ConsumerPriceKeys, { callout: number | null }>;
      growth_yoy: Record<ConsumerPriceKeys, { callout: number | null }>;
      value: Record<ConsumerPriceKeys, { callout: number | null }>;
    };
    headline: {
      growth_mom: Record<ConsumerPriceKeys, { callout: number | null }>;
      growth_yoy: Record<ConsumerPriceKeys, { callout: number | null }>;
      value: Record<ConsumerPriceKeys, { callout: number | null }>;
    };
  }>;
  choropleth: WithData<{ x: string[]; y: Record<string, number[]> }>;
}

const ConsumerPricesDashboard: FunctionComponent<ConsumerPricesDashboardProps> = ({
  last_updated,
  bar,
  timeseries,
  timeseries_callouts,
  choropleth,
}) => {
  const { t, i18n } = useTranslation(["dashboard-consumer-prices", "common"]);
  const { theme } = useTheme();
  const CPI_OPTIONS: Array<OptionType> = ["headline", "core"].map((key: string) => ({
    label: t(`keys.${key}`),
    value: key,
  }));
  const INDEX_OPTIONS: Array<OptionType> = ["growth_yoy", "growth_mom", "value"].map(
    (key: string) => ({
      label: t(`keys.${key}`),
      value: key,
    })
  );
  const COICOP_OPTIONS: Array<OptionType> = Object.keys(choropleth.data.y).map((key: string) => ({
    label: t(`keys.${key}`),
    value: key,
  }));
  const SHADE_OPTIONS: Array<OptionType> = [
    { label: t("keys.no_shade"), value: "no_shade" },
    { label: t("keys.recession"), value: "recession" },
  ];

  const { data, setData } = useData({
    cpi_type: CPI_OPTIONS[0],
    index_type: INDEX_OPTIONS[0],
    shade_type: SHADE_OPTIONS[0],
    coicop_type: COICOP_OPTIONS[0],
    minmax: [0, timeseries.data[CPI_OPTIONS[0].value][INDEX_OPTIONS[0].value].x.length - 1],
  });
  const LATEST_TIMESTAMP =
    timeseries.data[data.cpi_type.value][data.index_type.value].x[
      timeseries.data[data.cpi_type.value][data.index_type.value].x.length - 1
    ];
  const { coordinate } = useSlice(
    timeseries.data[data.cpi_type.value][data.index_type.value],
    data.minmax
  );

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
      const callout =
        timeseries_callouts.data[data.cpi_type.value][data.index_type.value][key].callout !== null
          ? [
              numFormat(
                timeseries_callouts.data[data.cpi_type.value][data.index_type.value][key].callout,
                "standard",
                [1, 1]
              ),
              unit,
            ].join("")
          : "-";

      return {
        unit,
        callout,
        fill: data.shade_type.value === "no_shade",
      };
    },
    [data.cpi_type, data.index_type, data.shade_type]
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
    "food_beverage",
    "alcohol_tobacco",
    "clothing_footwear",
    "housing_utilities",
    "furnishings",
    "health",
    "transport",
    "communication",
    "recreation_culture",
    "education",
    "hospitality",
    "misc",
  ]);

  return (
    <>
      <Hero
        background="orange"
        category={[t("common:categories.economy"), "text-orange-500"]}
        header={[t("header")]}
        description={[t("description")]}
        last_updated={last_updated}
        agencyBadge={
          <AgencyBadge name={t("division:bphpp.full")} icon={<PricesIncomeIcon />} isDivision />
        }
      />

      <Container className="min-h-screen">
        {/* Chart-builder: Inflation trends for specific items */}
        <Section
          title={t("section_1.title")}
          description={t("section_1.description")}
          date={bar.data_as_of}
        >
          <InflationGeography bar={bar} />
        </Section>

        {/* How is the CPI trending? */}
        <Section
          title={t("section_2.title")}
          description={t("section_2.description")}
          date={timeseries.data_as_of}
        >
          <div className="space-y-8">
            <div className="grid grid-cols-2 gap-4 lg:flex lg:flex-row">
              <div className="col-span-2">
                <Dropdown
                  anchor="left"
                  selected={data.cpi_type}
                  options={CPI_OPTIONS}
                  onChange={(e: any) => setData("cpi_type", e)}
                />
              </div>
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
              unitY={configs("overall").unit}
              displayNumFormat={value =>
                numFormat(value, "compact", 0, "short", i18n.language, true)
              }
              tooltipCallback={item => {
                return [
                  item.dataset.label + ": ",
                  item.parsed.y < 0 ? "-" : "",
                  numFormat(Math.abs(item.parsed.y), "compact", 1, "long", i18n.language, false),
                  configs("overall").unit,
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
              type="range"
              value={data.minmax}
              data={timeseries.data[data.cpi_type.value][data.index_type.value].x}
              period="month"
              onChange={e => setData("minmax", e)}
            />

            <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
              {section1ChartData.map(chartData => (
                <Timeseries
                  key={chartData.title}
                  title={chartData.title}
                  className="h-[300px] w-full"
                  interval="month"
                  displayNumFormat={value =>
                    numFormat(value, "compact", 0, "short", i18n.language, true)
                  }
                  tooltipCallback={item => {
                    return [
                      item.dataset.label + ": ",
                      item.parsed.y < 0 ? "-" : "",
                      numFormat(
                        Math.abs(item.parsed.y),
                        "compact",
                        1,
                        "long",
                        i18n.language,
                        false
                      ),
                      chartData.unitY,
                    ].join("");
                  }}
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
                      title:
                        chartData.callout !== "-" ? (
                          t("common:common.latest", {
                            date: toDate(LATEST_TIMESTAMP, "MMM yyyy", i18n.language),
                          })
                        ) : (
                          <span>
                            <InformationCircleIcon className="mr-2 inline-block h-4 w-4" />
                            {t("section_2.null_alcohol_tobacco")}
                          </span>
                        ),
                      value: chartData.callout !== "-" && chartData.callout,
                    },
                  ]}
                />
              ))}
            </div>
          </div>
        </Section>

        {/* Chart-builder: Inflation trends for specific items */}
        <Section
          title={t("section_3.title")}
          description={t("section_3.description")}
          date={timeseries.data_as_of}
        >
          <InflationTrends />
        </Section>

        {/* A granular snapshot of inflation in the Malaysian economy */}
        <Section
          title={t("section_4.title")}
          description={t("section_4.description")}
          date={timeseries.data_as_of}
        >
          <InflationSnapshot />
        </Section>

        {/* Section 5: Choropleth District */}
        <Section title={t("section_5.title")} date={choropleth.data_as_of}>
          <div className="space-y-2">
            <Dropdown
              anchor="left"
              sublabel={t("section_5.select_item") + ":"}
              selected={data.coicop_type}
              options={COICOP_OPTIONS}
              onChange={(e: any) => setData("coicop_type", e)}
            />
            <Choropleth
              data={{
                labels: choropleth.data.x,
                values: choropleth.data.y[data.coicop_type.value],
              }}
              precision={[2, 2]}
              prefix="RM"
              type="district"
              color="reds"
            />
          </div>
        </Section>
      </Container>
    </>
  );
};

export default ConsumerPricesDashboard;
