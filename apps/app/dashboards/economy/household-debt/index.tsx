import { AgencyBadge, Container, Dropdown, Hero, Section, Slider } from "datagovmy-ui/components";
import { AKSARA_COLOR } from "datagovmy-ui/constants";
import { numFormat, toDate } from "datagovmy-ui/helpers";
import { useData, useSlice, useTranslation } from "datagovmy-ui/hooks";
import { ChartDataset, ChartTypeRegistry } from "chart.js";
import { OptionType, WithData } from "datagovmy-ui/types";
import dynamic from "next/dynamic";
import { FunctionComponent, useCallback } from "react";
import { SliderProvider } from "datagovmy-ui/contexts/slider";
import { useTheme } from "next-themes";

/**
 * Household Debt Dashboard
 * @overview Status: Live
 */

export interface TimeseriesChartData {
  title: string;
  label: string;
  data: number[];
  fill: boolean;
  stats: Array<{ title: string; value: string }>;
  prefix: string;
}

const Timeseries = dynamic(() => import("datagovmy-ui/charts/timeseries"), { ssr: false });

const TIMESERIESDATA = [
  "x",
  "credit_card",
  "vehicles_passenger",
  "property_residental",
  "personal_total",
  "securities",
  "recession",
] as const;

const TIMESERIESTYPE = ["applied", "approved", "disbursed", "repaid"] as const;

type TimeseriesData = (typeof TIMESERIESDATA)[number];

type TimeseriesType = (typeof TIMESERIESTYPE)[number];

interface TimeseriesOptions {
  rm: Record<TimeseriesData, number[]>;
  growth_yoy: Record<TimeseriesData, number[]>;
}
interface TimeseriesCalloutOptions {
  rm: Record<Exclude<TimeseriesData, "x" | "recession">, { latest: number }>;
  growth_yoy: Record<Exclude<TimeseriesData, "x" | "recession">, { latest: number }>;
}

interface HouseholdDebtProp {
  last_updated: string;
  timeseries: WithData<Record<TimeseriesType, TimeseriesOptions>>;
  timeseries_callout: WithData<Record<TimeseriesType, TimeseriesCalloutOptions>>;
}

const HouseholdDebtDashboard: FunctionComponent<HouseholdDebtProp> = ({
  last_updated,
  timeseries,
  timeseries_callout,
}) => {
  const { t, i18n } = useTranslation(["dashboard-household-debt"]);
  const { theme } = useTheme();

  const OPTIONS: Array<OptionType> = TIMESERIESTYPE.map(type => ({
    label: t(`keys.${type}`),
    value: type,
  }));

  const INDEX_OPTIONS: Array<OptionType> = [
    { label: t("keys.rm"), value: "rm" },
    { label: t("keys.growth_yoy"), value: "growth_yoy" },
  ];

  const SHADE_OPTIONS: Array<OptionType> = [
    { label: t("keys.no_shade"), value: "no_shade" },
    { label: t("keys.recession"), value: "recession" },
  ];

  const { data, setData } = useData({
    minmax: [0, timeseries.data.disbursed.rm.x.length - 1],
    index: INDEX_OPTIONS[0].value,
    shade: SHADE_OPTIONS[0].value,
    options: OPTIONS[0].value,
  });

  const options = data.options as TimeseriesType;
  const index = data.index as "rm" | "growth_yoy";

  const LATEST_TIMESTAMP =
    timeseries.data[options][index].x[timeseries.data[options][index].x.length - 1];
  const { coordinate } = useSlice(timeseries.data[options][index], data.minmax);

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

  const plotTimeseries = (charts: Exclude<TimeseriesData, "x" | "recession">[], play: boolean) => {
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
              "RM ",
              numFormat(
                Math.abs(timeseries_callout.data[options].rm[name].latest),
                "compact",
                2,
                "long",
                i18n.language,
                false
              ),
            ].join(""),
          },
          {
            title: t("keys.growth_yoy"),
            value: [
              timeseries_callout.data[options].growth_yoy[name].latest > 0 ? "" : "-",
              numFormat(
                Math.abs(timeseries_callout.data[options].growth_yoy[name].latest),
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
              !isPercentage ? "RM" : "",
              numFormat(Math.abs(value), "compact", 0, "long", i18n.language, true),
              isPercentage ? "%" : "",
            ].join("");
          }}
          tooltipCallback={item => {
            const isPercentage = ["growth_yoy"].includes(data.index);
            return [
              item.dataset.label + ": ",
              item.parsed.y < 0 ? "-" : "",
              !isPercentage ? "RM" : "",
              numFormat(
                Math.abs(item.parsed.y),
                isPercentage ? "standard" : "compact",
                isPercentage ? 1 : 2,
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
                label: label,
                data: datum,
                backgroundColor: AKSARA_COLOR.DIM_H,
                borderColor: AKSARA_COLOR.DIM,
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
      <Hero
        background="gray"
        category={[t("common:categories.economy"), "text-primary"]}
        header={[t("header")]}
        description={[t("description")]}
        last_updated={last_updated}
        agencyBadge={<AgencyBadge agency="bnm" />}
      />
      <Container className="min-h-screen">
        <Section
          title={t("section_1.title")}
          description={
            <div className="flex flex-col gap-4">
              <p className={"whitespace-pre-line text-base"}>{t("section_1.description")}</p>
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
                <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
                  {plotTimeseries(
                    [
                      "credit_card",
                      "vehicles_passenger",
                      "property_residental",
                      "personal_total",
                      "securities",
                    ],
                    play
                  )}
                </div>
                <Slider
                  type="range"
                  period={"month"}
                  value={data.minmax}
                  onChange={e => setData("minmax", e)}
                  data={timeseries.data[options][index].x}
                />
              </>
            )}
          </SliderProvider>
        </Section>
      </Container>
    </>
  );
};

export default HouseholdDebtDashboard;
