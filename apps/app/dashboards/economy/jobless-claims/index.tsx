import { routes } from "@lib/routes";
import { BarMeterData } from "datagovmy-ui/charts/bar-meter";
import { Periods } from "datagovmy-ui/charts/timeseries";
import {
  AgencyBadge,
  Container,
  Hero,
  List,
  Section,
  Slider,
  StateDropdown,
} from "datagovmy-ui/components";
import { AKSARA_COLOR, CountryAndStates } from "datagovmy-ui/constants";
import { SliderProvider } from "datagovmy-ui/contexts/slider";
import { numFormat } from "datagovmy-ui/helpers";
import { useData, useSlice, useTranslation } from "datagovmy-ui/hooks";
import { DashboardPeriod, WithData } from "datagovmy-ui/types";
import { useTheme } from "next-themes";
import dynamic from "next/dynamic";
import { FunctionComponent, useMemo } from "react";

/**
 * Jobless Claims Dashboard
 * @overview Status: In-development
 */

const BarMeter = dynamic(() => import("datagovmy-ui/charts/bar-meter"), { ssr: false });
const Pyramid = dynamic(() => import("datagovmy-ui/charts/pyramid"), { ssr: false });
const Timeseries = dynamic(() => import("datagovmy-ui/charts/timeseries"), { ssr: false });

type DemographyKeys = "educ" | "salary_range" | "sex";

interface JoblessClaimsProps {
  barmeter: Record<DemographyKeys, BarMeterData[]>;
  last_updated: string;
  params: { state: string };
  pyramid: WithData<Record<"x" | "female" | "male", number[]>>;
  timeseries: WithData<Record<DashboardPeriod, Record<"x" | "losses", number[]>>>;
  timeseries_callout: WithData<Record<"growth_mom" | "growth_yoy", number>>;
}

const JoblessClaims: FunctionComponent<JoblessClaimsProps> = ({
  barmeter,
  last_updated,
  params,
  pyramid,
  timeseries,
  timeseries_callout,
}) => {
  const { t } = useTranslation(["dashboard-jobless-claims", "common"]);
  const { theme } = useTheme();
  const { data, setData } = useData({
    minmax: [timeseries.data.daily.x.length - 366, timeseries.data.daily.x.length - 1],
    tab: 0,
  });

  const PERIODS: Array<DashboardPeriod> = ["daily", "monthly", "yearly"];
  const config = useMemo<{
    key: DashboardPeriod;
    period: Exclude<Periods, false | "millisecond" | "second" | "minute" | "week">;
  }>(() => {
    const key = PERIODS[data.tab];
    setData("minmax", [0, timeseries.data[key].x.length - 1]);
    switch (key) {
      case "daily":
      case "daily_7d":
        return { key, period: "day" };
      case "monthly":
        return { key, period: "month" };
      case "yearly":
        return { key, period: "year" };
    }
  }, [data.tab]);

  const DEMOGRAPHY = ["sex", "educ", "salary_range"] as DemographyKeys[];
  const { coordinate } = useSlice(timeseries.data[config.key], data.minmax);

  return (
    <>
      <Hero
        background="gray"
        category={[t("common:categories.economy"), "text-primary dark:text-primary-dark"]}
        header={[t("header")]}
        description={[t("description")]}
        last_updated={last_updated}
        action={<StateDropdown url={routes.JOBLESS_CLAIMS} currentState={params.state} />}
        agencyBadge={<AgencyBadge agency="perkeso" />}
      />
      <Container className="min-h-fit">
        <Section
          title={t("job_loss_trend")}
          description={t("job_loss_disclaimer")}
          date={timeseries.data_as_of}
          menu={
            <List
              current={data.tab}
              onChange={index => {
                setData("tab", index);
              }}
              options={[t("common:time.daily"), t("common:time.monthly"), t("common:time.yearly")]}
            />
          }
        >
          <SliderProvider>
            {play => (
              <>
                <Timeseries
                  className="h-[300px]"
                  enableAnimation={!play}
                  interval={config.period}
                  data={{
                    labels: coordinate.x,
                    datasets: [
                      {
                        type: "line",
                        data: coordinate.losses,
                        label: t(`common:time.${config.key}`),
                        fill: true,
                        backgroundColor: AKSARA_COLOR.DIM_H,
                        borderColor: AKSARA_COLOR.DIM,
                        borderWidth: coordinate.x.length > 200 ? 1.0 : 1.5,
                      },
                    ],
                  }}
                  stats={[
                    {
                      title: t("trend_monthly"),
                      value: `${numFormat(timeseries_callout.data.growth_mom, "standard", 1)}%`,
                    },
                    {
                      title: t("trend_yearly"),
                      value: `${numFormat(timeseries_callout.data.growth_yoy, "standard", 1)}%`,
                    },
                  ]}
                />
                <Slider
                  type="range"
                  period={config.period}
                  value={data.minmax}
                  onChange={e => setData("minmax", e)}
                  data={timeseries.data[config.key].x}
                />
              </>
            )}
          </SliderProvider>
        </Section>
        <Section
          title={t("job_loss_by_state", { state: CountryAndStates[params.state] })}
          date={pyramid.data_as_of}
        >
          <div className="flex flex-col gap-6 lg:flex-row">
            <div className="lg:w-1/3">
              <Pyramid
                title={t("job_loss_by_sex_age", { agency: data.agency })}
                className="h-[450px] pb-6"
                data={{
                  labels: pyramid.data.x,
                  datasets: [
                    {
                      label: t("female"),
                      data: pyramid.data.female,
                      backgroundColor: AKSARA_COLOR.DANGER,
                      barThickness: 12,
                      borderRadius: 12,
                    },
                    {
                      label: t("male"),
                      data: pyramid.data.male,
                      backgroundColor: theme === "light" ? "#18181B" : "#FFFFFF",
                      barThickness: 12,
                      borderRadius: 12,
                    },
                  ],
                }}
              />
            </div>
            <div className="grid grid-cols-1 gap-12 md:grid-cols-3 lg:w-2/3">
              {DEMOGRAPHY.map(k => {
                return (
                  <div className="flex flex-col space-y-6" key={k}>
                    <BarMeter
                      key={k}
                      title={t(k)}
                      layout="horizontal"
                      data={barmeter[k]}
                      formatX={key => t(key)}
                      relative
                      precision={0}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        </Section>
      </Container>
    </>
  );
};

export default JoblessClaims;
