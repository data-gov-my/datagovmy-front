import { AgencyBadge, Container, Hero, List, Section, Slider } from "datagovmy-ui/components";
import { AKSARA_COLOR } from "datagovmy-ui/constants";
import { SliderProvider } from "datagovmy-ui/contexts/slider";
import { numFormat } from "datagovmy-ui/helpers";
import { useData, useSlice, useTranslation } from "datagovmy-ui/hooks";
import { TimeseriesOption, WithData } from "datagovmy-ui/types";
import dynamic from "next/dynamic";
import { FunctionComponent } from "react";

const Timeseries = dynamic(() => import("datagovmy-ui/charts/timeseries"), { ssr: false });

/**
 * Public Transportation Dashboard
 * @overview Status: Live
 */

export const TIMESERIESDATA = [
  "x",
  "overall",
  "bus",
  "rail",
  "lrt_ampang",
  "lrt_kj",
  "mrt_kajang",
  "mrt_pjy",
  "monorail",
  "komuter",
  "komuter_utara",
  "ets",
  "intercity",
  "tebrau",
  "bus_rkl",
  "bus_rpn",
  "bus_rkn",
] as const;

export type TimeseriesData = (typeof TIMESERIESDATA)[number];
export type TimeseriesOptions = Record<TimeseriesData, number[]>;

export const TIMESERIESCALLOUT = ["daily", "growth_mom", "growth_wow"] as const;

export type TimeseriesCallout = (typeof TIMESERIESCALLOUT)[number];

interface PublicTransportationProps {
  last_updated: string;
  timeseries: WithData<Record<TimeseriesOption["periodly"], TimeseriesOptions>>;
  timeseries_callout: WithData<
    Record<TimeseriesData, Record<TimeseriesCallout, { value: number }>>
  >;
}

const PublicTransportation: FunctionComponent<PublicTransportationProps> = ({
  last_updated,
  timeseries,
  timeseries_callout,
}) => {
  const { t } = useTranslation(["dashboard-public-transportation", "common"]);
  const config: { [key: string]: TimeseriesOption } = {
    0: {
      period: "auto",
      periodly: "daily_7d",
    },
    1: {
      period: "auto",
      periodly: "daily",
    },
    2: {
      period: "month",
      periodly: "monthly",
    },
    3: {
      period: "year",
      periodly: "yearly",
    },
  };

  const { data, setData } = useData({
    minmax: [0, timeseries.data.daily.x.length - 1],
    index: 0,
    period: "auto",
    periodly: "daily_7d",
  });

  const periodly = data.periodly as TimeseriesOption["periodly"];
  const { coordinate } = useSlice(timeseries.data[periodly], data.minmax);

  return (
    <>
      <Hero
        background="blue"
        category={[t("common:categories.transportation"), "text-primary dark:text-primary-dark"]}
        header={[t("header")]}
        description={[t("description")]}
        last_updated={last_updated}
        agencyBadge={<AgencyBadge agency="mot" />}
      />

      <Container className="min-h-screen">
        {/* How is ridership of public transportation services trending? */}
        <Section
          title={t("title")}
          description={t("timeseries_desc")}
          date={timeseries.data_as_of}
          menu={
            <List
              current={data.index}
              onChange={index => {
                setData("index", index);
                setData("minmax", [0, timeseries.data[config[index].periodly].x.length - 1]);
                setData("period", config[index].period);
                setData("periodly", config[index].periodly);
              }}
              options={[
                t("common:time.daily_7d"),
                t("common:time.daily"),
                t("common:time.monthly"),
                t("common:time.yearly"),
              ]}
            />
          }
        >
          <SliderProvider>
            {play => (
              <>
                <Timeseries
                  className="h-[300px]"
                  title={t("ridership_overall")}
                  enableAnimation={!play}
                  interval={data.period}
                  data={{
                    labels: coordinate.x,
                    datasets: [
                      {
                        type: coordinate.x.length === 1 ? "bar" : "line",
                        data: coordinate.overall,
                        label: t(`common:time.${data.periodly}`),
                        fill: true,
                        backgroundColor: AKSARA_COLOR.PRIMARY_H,
                        borderColor: AKSARA_COLOR.PRIMARY,
                        borderWidth: coordinate.x.length > 200 ? 1.0 : 1.5,
                        barThickness: 12,
                      },
                    ],
                  }}
                  stats={[
                    {
                      title: t("common:time.daily"),
                      value: `+${numFormat(
                        timeseries_callout.data.overall.daily.value,
                        "standard"
                      )}`,
                    },
                    {
                      title: t("trend_weekly"),
                      value:
                        (timeseries_callout.data.overall.growth_wow.value > 0 ? "+" : "") +
                        `${numFormat(
                          timeseries_callout.data.overall.growth_wow.value,
                          "standard",
                          [1, 1]
                        )}%`,
                    },
                    {
                      title: t("trend_monthly"),
                      value:
                        (timeseries_callout.data.overall.growth_mom.value > 0 ? "+" : "") +
                        `${numFormat(
                          timeseries_callout.data.overall.growth_mom.value,
                          "standard",
                          [1, 1]
                        )}%`,
                    },
                  ]}
                />
                <Slider
                  type="range"
                  period={data.period}
                  value={data.minmax}
                  onChange={e => setData("minmax", e)}
                  data={timeseries.data[periodly].x}
                />
                <div className="grid grid-cols-1 gap-12 pt-12 lg:grid-cols-2">
                  <Timeseries
                    className="h-[300px]"
                    title={t("ridership_rail")}
                    enableAnimation={!play}
                    interval={data.period}
                    data={{
                      labels: coordinate.x,
                      datasets: [
                        {
                          type: coordinate.x.length === 1 ? "bar" : "line",
                          data: coordinate.rail,
                          label: t(`common:time.${data.periodly}`),
                          fill: true,
                          backgroundColor: AKSARA_COLOR.PRIMARY_H,
                          borderColor: AKSARA_COLOR.PRIMARY,
                          borderWidth: coordinate.x.length > 200 ? 1.0 : 1.5,
                          barThickness: 12,
                        },
                      ],
                    }}
                    stats={[
                      {
                        title: t("common:time.daily"),
                        value: `+${numFormat(
                          timeseries_callout.data.rail.daily.value,
                          "standard"
                        )}`,
                      },
                      {
                        title: t("trend_weekly"),
                        value:
                          (timeseries_callout.data.rail.growth_wow.value > 0 ? "+" : "") +
                          `${numFormat(
                            timeseries_callout.data.rail.growth_wow.value,
                            "standard",
                            [1, 1]
                          )}%`,
                      },
                      {
                        title: t("trend_monthly"),
                        value:
                          (timeseries_callout.data.rail.growth_mom.value > 0 ? "+" : "") +
                          `${numFormat(
                            timeseries_callout.data.rail.growth_mom.value,
                            "standard",
                            [1, 1]
                          )}%`,
                      },
                    ]}
                  />
                  <Timeseries
                    className="h-[300px]"
                    title={t("ridership_bus")}
                    enableAnimation={!play}
                    interval={data.period}
                    data={{
                      labels: coordinate.x,
                      datasets: [
                        {
                          type: coordinate.x.length === 1 ? "bar" : "line",
                          data: coordinate.bus,
                          label: t(`common:time.${data.periodly}`),
                          fill: true,
                          backgroundColor: AKSARA_COLOR.PRIMARY_H,
                          borderColor: AKSARA_COLOR.PRIMARY,
                          borderWidth: coordinate.x.length > 200 ? 1.0 : 1.5,
                          barThickness: 12,
                        },
                      ],
                    }}
                    stats={[
                      {
                        title: t("common:time.daily"),
                        value: `+${numFormat(timeseries_callout.data.bus.daily.value, "standard")}`,
                      },
                      {
                        title: t("trend_weekly"),
                        value:
                          (timeseries_callout.data.bus.growth_wow.value > 0 ? "+" : "") +
                          `${numFormat(
                            timeseries_callout.data.bus.growth_wow.value,
                            "standard",
                            [1, 1]
                          )}%`,
                      },
                      {
                        title: t("trend_monthly"),
                        value:
                          (timeseries_callout.data.bus.growth_mom.value > 0 ? "+" : "") +
                          `${numFormat(
                            timeseries_callout.data.bus.growth_mom.value,
                            "standard",
                            [1, 1]
                          )}%`,
                      },
                    ]}
                  />
                </div>
                <div className="grid grid-cols-1 gap-12 pt-12 lg:grid-cols-2 xl:grid-cols-3">
                  {TIMESERIESDATA.filter(
                    item => item !== "x" && item !== "bus" && item !== "rail" && item !== "overall"
                  ).map(key => (
                    <Timeseries
                      className="h-[300px] w-full"
                      title={t(`ridership_${key}`)}
                      enableAnimation={!play}
                      interval={data.period}
                      data={{
                        labels: coordinate.x,
                        datasets: [
                          {
                            type: coordinate.x.length === 1 ? "bar" : "line",
                            data: coordinate[key],
                            label: t(`common:time.${data.periodly}`),
                            fill: true,
                            backgroundColor: AKSARA_COLOR.PRIMARY_H,
                            borderColor: AKSARA_COLOR.PRIMARY,
                            borderWidth: coordinate.x.length > 200 ? 1.0 : 1.5,
                            barThickness: 12,
                          },
                        ],
                      }}
                      stats={[
                        {
                          title: t("common:time.daily"),
                          value: `+${numFormat(
                            timeseries_callout.data[key].daily.value,
                            "standard"
                          )}`,
                        },
                        {
                          title: t("trend_weekly"),
                          value:
                            (timeseries_callout.data[key].growth_wow.value > 0 ? "+" : "") +
                            `${numFormat(
                              timeseries_callout.data[key].growth_wow.value,
                              "standard",
                              [1, 1]
                            )}%`,
                        },
                        {
                          title: t("trend_monthly"),
                          value:
                            (timeseries_callout.data[key].growth_mom.value > 0 ? "+" : "") +
                            `${numFormat(
                              timeseries_callout.data[key].growth_mom.value,
                              "standard",
                              [1, 1]
                            )}%`,
                        },
                      ]}
                    />
                  ))}
                </div>
              </>
            )}
          </SliderProvider>
        </Section>
      </Container>
    </>
  );
};

export default PublicTransportation;
