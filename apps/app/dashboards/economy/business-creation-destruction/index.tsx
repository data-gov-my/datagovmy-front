import {
  AgencyBadge,
  Container,
  Hero,
  Section,
  Slider,
  StateDropdown,
  Tabs,
} from "datagovmy-ui/components";
import { AKSARA_COLOR } from "datagovmy-ui/constants";
import { numFormat, toDate } from "datagovmy-ui/helpers";
import { useData, useSlice, useTranslation } from "datagovmy-ui/hooks";
import { DashboardPeriod, WithData } from "datagovmy-ui/types";
import dynamic from "next/dynamic";
import { FunctionComponent } from "react";
import { SliderProvider } from "datagovmy-ui/contexts/slider";
import { routes } from "@lib/routes";

/**
 * Business Creation Destruction Dashboard
 * @overview Status: Live
 */

export interface TimeseriesChartData {
  title: string;
  label: string;
  data: number[];
  fill: boolean;
  stats: Array<{ title: string; value: string }>;
  colors: {
    backgroundColor?: string;
    borderColor?: string;
  };
}

const Timeseries = dynamic(() => import("datagovmy-ui/charts/timeseries"), { ssr: false });

const TIMESERIESDATA = [
  "x",
  "reg_llp",
  "reg_roc",
  "reg_rob",
  "death_llp",
  "death_roc",
  "death_rob",
] as const;

type TimeseriesData = (typeof TIMESERIESDATA)[number];
type TimeseriesType = DashboardPeriod;

interface BusinessCreationDestructionProp {
  last_updated: string;
  params: { state: string };
  timeseries: WithData<Record<TimeseriesType, Record<TimeseriesData, number[]>>>;
  timeseries_callout: WithData<Record<Exclude<TimeseriesData, "x">, { this_year: number }>>;
}

const BusinessCreationDestructionDashboard: FunctionComponent<BusinessCreationDestructionProp> = ({
  last_updated,
  timeseries,
  timeseries_callout,
  params,
}) => {
  const { t, i18n } = useTranslation(["dashboard-business-creation-destruction"]);

  const period_tabs: { [key: number]: DashboardPeriod } = {
    0: "daily_7d",
    1: "daily",
    2: "monthly",
    3: "yearly",
  };

  const { data, setData } = useData({
    minmax: [0, 700],
    period_index: 0,
    period: period_tabs[0],
  });

  const period = data.period as DashboardPeriod;

  const LATEST_TIMESTAMP = timeseries.data[period].x[timeseries.data[period].x.length - 1];
  const { coordinate } = useSlice(timeseries.data[period], data.minmax);

  const getChartColor = (key: Exclude<TimeseriesData, "x">) => {
    switch (key) {
      case "reg_llp":
      case "reg_rob":
      case "reg_roc":
        return {
          backgroundColor: AKSARA_COLOR.PRIMARY_H,
          borderColor: AKSARA_COLOR.PRIMARY,
        };
      case "death_llp":
      case "death_rob":
      case "death_roc":
        return {
          backgroundColor: AKSARA_COLOR.DANGER_H,
          borderColor: AKSARA_COLOR.DANGER,
        };

      default:
        return {};
    }
  };

  const getCalloutUnit = (key: Exclude<TimeseriesData, "x">) => {
    switch (key) {
      case "reg_llp":
      case "reg_rob":
      case "reg_roc":
        return "new";
      case "death_llp":
      case "death_roc":
        return "dissolved";
      case "death_rob":
        return "terminated";

      default:
        return "";
    }
  };

  const plotTimeseries = (charts: Exclude<TimeseriesData, "x">[], play: boolean) => {
    return charts.map(name => {
      const {
        title,
        label,
        data: datum,
        fill,
        stats,
        colors,
      }: TimeseriesChartData = {
        title: t(`keys.${name}`),
        label: t(`keys.${name}`),
        data: coordinate[name],
        fill: true,
        colors: getChartColor(name),
        stats: [
          {
            title: t("common:common.latest", {
              date: toDate(LATEST_TIMESTAMP, "yyyy", i18n.language),
            }),
            value: [
              numFormat(
                Math.abs(timeseries_callout.data[name].this_year),
                "standard",
                0,
                "long",
                i18n.language,
                true
              ),
              ` ${t(`keys.${getCalloutUnit(name)}`)}`,
            ].join(""),
          },
        ],
      };
      return (
        <Timeseries
          key={title}
          title={title}
          className="h-[350px] w-full"
          interval={
            period === "daily" || period === "daily_7d"
              ? "day"
              : period === "monthly"
              ? "month"
              : "year"
          }
          enableAnimation={!play}
          displayNumFormat={value => {
            return [numFormat(Math.abs(value), "standard", 0, "long", i18n.language, true)].join(
              ""
            );
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
                fill: fill,
                borderWidth: 1.5,
                ...colors,
              },
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
        agencyBadge={<AgencyBadge agency="ssm" />}
        action={
          <StateDropdown url={routes.BUSINESS_CREATION_DESTRUCTION} currentState={params.state} />
        }
      />
      <Container className="min-h-screen">
        <Section
          title={t("section_1.title")}
          description={t("section_1.description")}
          date={timeseries.data_as_of}
          menu={
            <Tabs.List
              options={[
                t("common:time.daily_7d"),
                t("common:time.daily"),
                t("common:time.monthly"),
                t("common:time.yearly"),
              ]}
              current={data.period_index}
              onChange={index => {
                setData("minmax", [0, timeseries.data[period_tabs[index]].x.length - 1]);
                setData("period_index", index);
                setData("period", period_tabs[index]);
              }}
            />
          }
        >
          <SliderProvider>
            {play => (
              <>
                <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
                  {plotTimeseries(
                    [
                      "reg_roc",
                      "reg_rob",
                      "reg_llp",
                      // "death_roc", "death_rob", "death_llp"
                    ],
                    play
                  )}
                </div>
                <Slider
                  type="range"
                  period={
                    period === "daily" || period === "daily_7d"
                      ? "day"
                      : period === "monthly"
                      ? "month"
                      : "year"
                  }
                  value={data.minmax}
                  onChange={e => setData("minmax", e)}
                  data={timeseries.data[period].x}
                />
              </>
            )}
          </SliderProvider>
        </Section>
      </Container>
    </>
  );
};

export default BusinessCreationDestructionDashboard;
