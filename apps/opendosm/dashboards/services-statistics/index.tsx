import { CustomerServiceIcon } from "@icons/division";
import type { ChartDataset } from "chart.js";
import { AgencyBadge, Container, Dropdown, Hero, Section, Slider } from "datagovmy-ui/components";
import { AKSARA_COLOR } from "datagovmy-ui/constants";
import { SliderProvider } from "datagovmy-ui/contexts/slider";
import { numFormat, toDate } from "datagovmy-ui/helpers";
import { useData, useSlice, useTranslation } from "datagovmy-ui/hooks";
import { MetaPage, OptionType, WithData } from "datagovmy-ui/types";
import dynamic from "next/dynamic";
import { FunctionComponent, useCallback } from "react";
import { useTheme } from "next-themes";

/**
 * Services Statistics
 * @overview Status: Live
 */

interface TimeseriesChartData {
  title: string;
  unitY: string;
  label: string;
  data: number[];
  fill: boolean;
  stats: Array<{ title: string; value: string }>;
  prefix: string;
}

const Timeseries = dynamic(() => import("datagovmy-ui/charts/timeseries"), { ssr: false });

const ServiceType = [
  "overall",
  "accommodation",
  "admin_support",
  "education",
  "food_beverage",
  "health",
  "information_communication",
  "motor_vehicles",
  "personal",
  "professional",
  "real_estate",
  "recreation",
  "retail_trade",
  "transport_storage",
  "wholesale_trade",
];

type ServiceTrend = "actual" | "growth_qoq" | "growth_yoy";
type ServiceMetric = "x" | "revenue" | "employees" | "wages";
type ServiceCallout = "employees" | "recession" | "revenue" | "wages";

interface ServicesStatisticsProps {
  last_updated: string;
  timeseries: WithData<
    Record<(typeof ServiceType)[number], Record<ServiceTrend, Record<ServiceMetric, number[]>>>
  >;
  timeseries_callout: WithData<
    Record<
      (typeof ServiceType)[number],
      Record<ServiceTrend, Record<ServiceCallout, { latest: number }>>
    >
  >;
  meta: MetaPage;
}

const ServicesStatistics: FunctionComponent<ServicesStatisticsProps> = ({
  last_updated,
  timeseries,
  timeseries_callout,
}) => {
  const { t, i18n } = useTranslation(["dashboard-services-statistics", "division", "common"]);
  const { theme } = useTheme();

  const TYPE_OPTIONS: Array<OptionType> = ServiceType.map(type => {
    return { label: t(`keys.${type}`), value: type };
  });

  const TREND_OPTIONS: Array<OptionType> = ["growth_yoy", "growth_qoq", "actual"].map(trend => {
    return { label: t(`keys.${trend}`), value: trend };
  });

  const SHADE_OPTIONS: Array<OptionType> = ["no_shade", "recession"].map(shade => {
    return { label: t(`keys.${shade}`), value: shade };
  });

  const { data, setData } = useData({
    minmax: [0, timeseries.data[TYPE_OPTIONS[0].value][TREND_OPTIONS[0].value].x.length - 1],
    type: TYPE_OPTIONS[0].value,
    trend: TREND_OPTIONS[0].value,
    shade: SHADE_OPTIONS[0].value,
  });
  const LATEST_TIMESTAMP =
    timeseries.data[data.type][data.trend].x[timeseries.data[data.type][data.trend].x.length - 1];
  const { coordinate } = useSlice(timeseries.data[data.type][data.trend], data.minmax);

  const shader = useCallback<(key: string) => ChartDataset<"line", any[]>>(
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
    [data.shade, theme]
  );

  const getChartData = (charts: string[]): TimeseriesChartData[] => {
    return charts.map(name => ({
      title: t(`keys.${name}`),
      prefix: name !== "employees" && data.trend === "actual" ? "RM " : "",
      unitY: data.trend !== "actual" ? "%" : "",
      label: t(`keys.${name}`),
      data: coordinate[name],
      fill: data.shade === "no_shade",
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
            name !== "employees" && data.trend === "actual" ? "RM " : "",
            numFormat(
              timeseries_callout.data[data.type][data.trend][name].latest,
              timeseries_callout.data[data.type][data.trend][name].latest > 1_000_000
                ? "compact"
                : "standard",
              name === "employees" && data.trend === "actual" ? [1, 0] : [1, 1],
              "long",
              i18n.language,
              false
            ),
            data.trend !== "actual" ? "%" : name === "employees" ? " employees" : "",
            ,
          ].join(""),
        },
      ],
    }));
  };

  return (
    <>
      <Hero
        background="red"
        category={[t("common:categories.services"), "text-danger"]}
        header={[t("header")]}
        description={[t("description")]}
        last_updated={last_updated}
        agencyBadge={
          <AgencyBadge name={t("division:bpp.full")} icon={<CustomerServiceIcon />} isDivision />
        }
      />

      <Container>
        <Section
          title={t("section_1.title")}
          description={
            <div className="flex flex-col gap-4">
              <p className={"whitespace-pre-line text-base"}>{t("section_1.description")}</p>
              <div className="grid grid-cols-2 gap-4 lg:flex lg:flex-row">
                <Dropdown
                  anchor="left"
                  selected={TYPE_OPTIONS.find(type => data.type === type.value)}
                  options={TYPE_OPTIONS}
                  onChange={e => setData("type", e.value)}
                />
                <Dropdown
                  anchor="left"
                  selected={TREND_OPTIONS.find(trend => data.trend === trend.value)}
                  options={TREND_OPTIONS}
                  onChange={e => setData("trend", e.value)}
                />
                <Dropdown
                  anchor="left"
                  options={SHADE_OPTIONS}
                  selected={SHADE_OPTIONS.find(shade => data.shade === shade.value)}
                  onChange={e => setData("shade", e.value)}
                />
              </div>
            </div>
          }
          date={timeseries.data_as_of}
        >
          <SliderProvider>
            {play => (
              <div>
                <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
                  {getChartData(["revenue", "employees", "wages"]).map(
                    ({ title, prefix, unitY, label, fill, stats, data: datum }) => (
                      <Timeseries
                        key={title}
                        title={title}
                        className="h-[350px] w-full"
                        interval="quarter"
                        enableAnimation={!play}
                        displayNumFormat={value =>
                          numFormat(
                            value,
                            "compact",
                            data.trend === "actual" ? [1, 0] : [1, 0],
                            "long",
                            i18n.language,
                            true
                          )
                        }
                        prefixY={prefix}
                        unitY={unitY}
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
                    )
                  )}
                </div>
                <Slider
                  type="range"
                  period={"quarter"}
                  value={data.minmax}
                  onChange={e => setData("minmax", e)}
                  data={timeseries.data[data.type][data.trend].x}
                />
              </div>
            )}
          </SliderProvider>
        </Section>
      </Container>
    </>
  );
};

export default ServicesStatistics;
