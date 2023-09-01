import { routes } from "@lib/routes";
import {
  AgencyBadge,
  Container,
  Dropdown,
  Hero,
  LeftRightCard,
  RankList,
  Section,
  Slider,
  StateDropdown,
} from "datagovmy-ui/components";
import { AKSARA_COLOR, CountryAndStates } from "datagovmy-ui/constants";
import { SliderProvider } from "datagovmy-ui/contexts/slider";
import { numFormat, toDate } from "datagovmy-ui/helpers";
import { useData, useSlice, useTranslation } from "datagovmy-ui/hooks";
import { MOTIcon } from "datagovmy-ui/icons/agency";
import { OptionType, WithData } from "datagovmy-ui/types";
import dynamic from "next/dynamic";
import { FunctionComponent } from "react";

/**
 * Household Income & Expenditure Dashboard
 * @overview Status: In-development
 */

const Choropleth = dynamic(() => import("datagovmy-ui/charts/choropleth"), { ssr: false });
const Timeseries = dynamic(() => import("datagovmy-ui/charts/timeseries"), { ssr: false });

type StatsKeys = "mean" | "median" | "gini";
type FilterKeys =
  | "income_mean"
  | "income_median"
  | "expenditure_mean"
  | "gini"
  | "poverty"
  | "poverty_relative"
  | "access_water"
  | "access_electricity";

interface HouseholdIncomeExpenditureProps {
  choropleth: Record<
    "state" | "district",
    WithData<{ x: string[]; y: Record<FilterKeys, number[]> }>
  >;
  last_updated: string;
  params: { state: string };
  timeseries: WithData<Record<"x" | StatsKeys, number[]>>;
  timeseries_callout: WithData<Record<StatsKeys, Record<"latest" | "cagr", number | null>>>;
}

const HouseholdIncomeExpenditure: FunctionComponent<HouseholdIncomeExpenditureProps> = ({
  choropleth,
  last_updated,
  params,
  timeseries,
  timeseries_callout,
}) => {
  const { t, i18n } = useTranslation(["dashboard-household-income-expenditure", "common"]);
  const { data, setData } = useData({
    area: "state",
    filter: "income_mean",
    minmax: [timeseries.data.x.length - 366, timeseries.data.x.length - 1],
    tab: 0,
  });

  const FILTER_OPTIONS: Array<OptionType> = [
    "income_mean",
    "income_median",
    "expenditure_mean",
    "gini",
    "poverty",
    "poverty_relative",
    "access_water",
    "access_electricity",
  ].map((key: string) => ({
    label: t(`keys.${key}`),
    value: key,
  }));

  const AREA_OPTIONS: Array<OptionType> = ["state", "district"].map((key: string) => ({
    label: t(key),
    value: key,
  }));

  const STATS = ["mean", "median", "gini"] as StatsKeys[];
  const { coordinate } = useSlice(timeseries.data, data.minmax);

  return (
    <>
      <Hero
        background="blue"
        category={[t("common:categories.households"), "text-primary dark:text-primary-dark"]}
        header={[t("header")]}
        description={[t("description")]}
        last_updated={last_updated}
        action={
          <StateDropdown url={routes.HOUSEHOLD_INCOME_EXPENDITURE} currentState={params.state} />
        }
        agencyBadge={<AgencyBadge icon={<MOTIcon />} name={t("agencies:piesd.full")} isDivision />}
      />
      <Container>
        {/* How is key income and expenditure indicators distributed? */}
        <Section>
          <LeftRightCard
            left={
              <div className="flex h-[600px] w-full flex-col overflow-hidden p-6 lg:p-8">
                <div className="space-y-6 pb-6">
                  <div className="flex flex-col gap-2">
                    <h4>{t("choro_header")}</h4>
                    <span className="text-sm text-dim">
                      {t("common:common.data_of", {
                        date: toDate(
                          choropleth.state.data_as_of,
                          "dd MMM yyyy, HH:mm",
                          i18n.language
                        ),
                      })}
                    </span>
                  </div>
                  <div className="flex space-x-3">
                    <Dropdown
                      width="w-full"
                      anchor="left"
                      placeholder={t("common:common.select")}
                      options={FILTER_OPTIONS}
                      selected={FILTER_OPTIONS.find(e => e.value === data.filter)}
                      onChange={e => setData("filter", e.value)}
                    />
                    <Dropdown
                      width="w-fit"
                      anchor="left"
                      placeholder={t("common:common.select")}
                      options={AREA_OPTIONS}
                      selected={AREA_OPTIONS.find(e => e.value === data.area)}
                      onChange={e => {
                        setData("area", e.value);
                      }}
                    />
                  </div>
                  <p className="whitespace-pre-line text-dim">{t("choro_desc")}</p>
                </div>
                <RankList
                  id="household-indicators-by-area"
                  title={t("common:common.ranking", { count: choropleth[data.area].data.x.length })}
                  data={choropleth[data.area].data.y[data.filter]}
                  color="text-primary dark:text-primary-dark"
                  threshold={choropleth[data.area].data.x.length}
                  format={(position: number) => {
                    const area = choropleth[data.area].data.x[position];
                    const value = choropleth[data.area].data.y[data.filter][position];
                    return {
                      label: data.area === "state" ? CountryAndStates[area] : area,
                      value:
                        data.filter === "gini"
                          ? numFormat(value, "standard", 3)
                          : ["income_mean", "income_median", "expenditure_mean"].includes(
                              data.filter
                            )
                          ? `RM ${numFormat(value, "standard", 0)}`
                          : `${numFormat(value, "standard", 1)}%`,
                    };
                  }}
                />
              </div>
            }
            right={
              <Choropleth
                className="h-[400px] w-auto rounded-b lg:h-[600px] lg:w-full"
                color="blues"
                data={{
                  labels: choropleth[data.area].data.x.map((area: string) =>
                    data.area === "state" ? CountryAndStates[area] : area
                  ),
                  values: choropleth[data.area].data.y[data.filter],
                }}
                precision={
                  data.filter === "gini"
                    ? 3
                    : ["income_mean", "income_median", "expenditure_mean"].includes(data.filter)
                    ? 0
                    : 1
                }
                prefix={
                  ["income_mean", "income_median", "expenditure_mean"].includes(data.filter)
                    ? "RM "
                    : ""
                }
                unit={
                  ["poverty", "poverty_relative", "access_water", "access_electricity"].includes(
                    data.filter
                  )
                    ? "%"
                    : ""
                }
                type={data.area === "state" ? "state" : "district"}
              />
            }
          />
        </Section>

        {/* How are key household income indicators trending? */}
        <Section title={t("timeseries_header")} date={timeseries.data_as_of}>
          <SliderProvider>
            {play => (
              <>
                <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
                  {STATS.map((key: StatsKeys) => (
                    <Timeseries
                      key={key}
                      className="h-[300px]"
                      title={t(`${key}_title`)}
                      enableAnimation={!play}
                      interval="year"
                      precision={key === "gini" ? 3 : 0}
                      data={{
                        labels: coordinate.x,
                        datasets: [
                          {
                            type: "line",
                            data: coordinate[key],
                            label: t(key),
                            fill: true,
                            backgroundColor: AKSARA_COLOR.PRIMARY_H,
                            borderColor: AKSARA_COLOR.PRIMARY,
                            borderWidth: coordinate.x.length > 200 ? 1.0 : 1.5,
                          },
                        ],
                      }}
                      stats={[
                        {
                          title: t("common:common.latest", {
                            date: toDate(
                              timeseries.data.x[timeseries.data.x.length - 1],
                              "yyyy",
                              i18n.language
                            ),
                          }),
                          value:
                            key !== "gini"
                              ? `RM ${numFormat(
                                  timeseries_callout.data[key].latest,
                                  "standard",
                                  0
                                )} / ${t("month")}`
                              : numFormat(timeseries_callout.data[key].latest, "standard", 3),
                        },
                        {
                          title: key !== "gini" && t("cagr"),
                          value:
                            key !== "gini" &&
                            `${numFormat(timeseries_callout.data[key].cagr, "standard", 2)}%`,
                        },
                      ]}
                    />
                  ))}
                </div>
                <Slider
                  type="range"
                  period="year"
                  value={data.minmax}
                  onChange={e => setData("minmax", e)}
                  data={timeseries.data.x}
                />
              </>
            )}
          </SliderProvider>
        </Section>
      </Container>
    </>
  );
};

export default HouseholdIncomeExpenditure;
