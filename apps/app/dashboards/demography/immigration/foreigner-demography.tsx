import { Section, Slider, Tabs } from "datagovmy-ui/components";
import { AKSARA_COLOR } from "datagovmy-ui/constants";
import { SliderProvider } from "datagovmy-ui/contexts/slider";
import { numFormat } from "datagovmy-ui/helpers";
import { useData, useSlice, useTranslation } from "datagovmy-ui/hooks";
import { DashboardPeriod, WithData } from "datagovmy-ui/types";
import { FunctionComponent, useMemo } from "react";
import { Periods } from "datagovmy-ui/charts/timeseries";
import dynamic from "next/dynamic";

type DemographyKeys =
  | "x"
  | "male"
  | "female"
  | "baby"
  | "child"
  | "teenager"
  | "adult_young"
  | "adult"
  | "elderly";

export interface ForeignerDemographyProps {
  demography: WithData<Record<DashboardPeriod, Record<DemographyKeys, number[]>>>;
  demography_callout: WithData<
    Record<Exclude<DemographyKeys, "x">, { daily: number; yearly: number }>
  >;
  last_updated: string;
}

const Timeseries = dynamic(() => import("datagovmy-ui/charts/timeseries"), { ssr: false });

const ForeignerDemography: FunctionComponent<ForeignerDemographyProps> = ({
  demography,
  demography_callout,
  last_updated,
}) => {
  const { t } = useTranslation(["dashboard-immigration", "common"]);
  const PERIODS: Array<DashboardPeriod> = ["daily_7d", "daily", "monthly", "yearly"];

  const { data, setData } = useData({
    tab: 0,
    minmax: [0, demography.data.daily_7d.x.length - 1],
    loading: false,
  });

  const config = useMemo<{
    key: DashboardPeriod;
    period: Exclude<Periods, false | "millisecond" | "second" | "minute" | "week">;
  }>(() => {
    switch (PERIODS[data.tab]) {
      case "daily":
      case "daily_7d":
        return { key: PERIODS[data.tab], period: "day" };
      case "monthly":
        return { key: PERIODS[data.tab], period: "month" };
      case "yearly":
        return { key: PERIODS[data.tab], period: "year" };
    }
  }, [data.tab]);

  const { coordinate } = useSlice(demography.data[config.key], data.minmax);

  const plotTimeseries = (charts: Exclude<DemographyKeys, "x">[], play: boolean) => {
    return charts.map(name => {
      const {
        title,
        label,
        data: datum,
        stats,
      } = {
        title: t(`keys.${name}`),
        label: t(`keys.${name}`),
        data: coordinate[name],
        stats: [
          {
            title: t("common:time.daily"),
            value: `${demography_callout.data[name].daily > 0 ? "+" : ""}${numFormat(
              demography_callout.data[name].daily,
              "standard"
            )}`,
          },
          {
            title: t("common:time.yearly"),
            value: numFormat(demography_callout.data[name].yearly, "standard"),
          },
        ],
      };

      return (
        <Timeseries
          key={title}
          title={title}
          className="h-[300px]"
          isLoading={data.loading}
          enableAnimation={!play}
          enableMajorTick
          displayType="standard"
          precision={[1, 0]}
          interval={config.period}
          data={{
            labels: coordinate.x,
            datasets: [
              {
                type: "line",
                label,
                data: datum,
                backgroundColor: AKSARA_COLOR.PURPLE_H,
                borderColor: AKSARA_COLOR.PURPLE,
                fill: true,
                borderWidth: 1.5,
              },
            ],
          }}
          stats={stats}
        />
      );
    });
  };

  return (
    <Section
      title={t("section_2.title")}
      description={t("section_2.description")}
      date={last_updated}
      menu={
        <Tabs.List
          options={[
            t("common:time.daily_7d"),
            t("common:time.daily"),
            t("common:time.monthly"),
            t("common:time.yearly"),
          ]}
          current={data.tab}
          onChange={index => setData("tab", index)}
        />
      }
    >
      <SliderProvider>
        {play => (
          <div className="space-y-8">
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
              {plotTimeseries(["male", "female"], play)}
            </div>

            <Slider
              className="pt-0"
              type="range"
              period={config.period}
              value={data.minmax}
              data={demography.data[config.key].x}
              onChange={e => setData("minmax", e)}
            />

            <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
              {plotTimeseries(
                ["baby", "child", "teenager", "adult_young", "adult", "elderly"],
                play
              )}
            </div>
          </div>
        )}
      </SliderProvider>
    </Section>
  );
};

export default ForeignerDemography;
