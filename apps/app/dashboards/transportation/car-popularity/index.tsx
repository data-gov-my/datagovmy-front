import { get } from "datagovmy-ui/api";
import {
  AgencyBadge,
  Container,
  Dropdown,
  Hero,
  List,
  Section,
  Slider,
  toast,
} from "datagovmy-ui/components";
import { AKSARA_COLOR } from "datagovmy-ui/constants";
import { SliderProvider } from "datagovmy-ui/contexts/slider";
import { numFormat, toDate } from "datagovmy-ui/helpers";
import { useData, useSlice, useTranslation } from "datagovmy-ui/hooks";
import { OptionType, TimeseriesOption, WithData } from "datagovmy-ui/types";
import dynamic from "next/dynamic";
import { FunctionComponent, useMemo } from "react";

/**
 * Car Popularity Dashboard
 * @overview Status: Live
 */

type Vehicle = "bus" | "car" | "lorry" | "motorcycle" | "other" | "van";

interface CarPopularityProps {
  last_updated: string;
  model: WithData<Record<"x" | "cars", number[]>>;
  queryOptions: Record<string, any>;
  tableData: Record<string, any>;
  timeseries: WithData<Record<string, Record<Vehicle | "x", number[]>>>;
  timeseries_callout: WithData<Record<Vehicle | "x", Record<"latest" | "alltime", number>>>;
}

const Timeseries = dynamic(() => import("datagovmy-ui/charts/timeseries"), { ssr: false });

const CarPopularity: FunctionComponent<CarPopularityProps> = ({
  last_updated,
  model,
  queryOptions,
  tableData,
  timeseries,
  timeseries_callout,
}) => {
  const { t, i18n } = useTranslation(["dashboard-car-popularity", "common"]);
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

  // query data
  const { data: query, setData: setQuery } = useData({
    maker: "",
    model: "",
    params: {},
  });

  const yearOptions: OptionType[] = Object.keys(tableData.top_makers.data).map(val => {
    return { label: new Date(val).getFullYear().toString(), value: val };
  });

  const { data, setData } = useData({
    // timeseries data
    index: 0,
    loading: false,
    minmax: [0, timeseries.data.daily.x.length - 1],
    period: "auto",
    periodly: "daily_7d",

    data_as_of: model.data_as_of,
    x: model.data.x,
    y: model.data.cars,

    // table data
    selectedYear: yearOptions.at(-1),
    topMakers: tableData.top_makers.data[yearOptions.at(-1)?.value || -1],
    topModels: tableData.top_models.data[yearOptions.at(-1)?.value || -1],
  });

  const { coordinate } = useSlice(timeseries.data[data.periodly], data.minmax);
  const LATEST_TIMESTAMP =
    timeseries.data[data.periodly].x[timeseries.data[data.periodly].x.length - 1];

  const past_5yrs = useMemo<number>(() => {
    return data.y.slice(data.y.length - 5, data.y.length).reduce((a: number, b: number) => a + b);
  }, [data.y]);

  const since_2000 = useMemo<number>(() => {
    return data.y.reduce((a: number, b: number) => a + b);
  }, [data.y]);

  const VEHICLES: Vehicle[] = ["car", "motorcycle", "lorry", "van", "bus", "other"];

  const filterMakers = useMemo<Array<OptionType>>(() => {
    const _makers = Object.keys(queryOptions).map(maker => {
      return { label: maker, value: maker };
    });
    return _makers;
  }, []);

  const filterModels = useMemo<Array<OptionType>>(() => {
    let _models: Array<OptionType> = [];
    if (query.maker) {
      _models = queryOptions[query.maker.value].map((model: string) => {
        return { label: model, value: model };
      });
    }
    return _models;
  }, [query.maker]);

  const searchModel = (maker: string, model: string) => {
    setData("loading", true);
    get("chart/", {
      dashboard: "car_popularity",
      chart_name: "timeseries",
      maker,
      model,
    })
      .then(({ data }) => {
        setData("x", data.data?.x);
        setData("y", data.data?.cars);
        setData("data_as_of", data.data_as_of);
        setQuery("params", { maker, model }); // for timeseries title
        setData("loading", false);
      })
      .catch(e => {
        toast.error(t("common:error.toast.request_failure"), t("common:error.toast.try_again"));
        console.error(e);
      });
  };
  return (
    <>
      <Hero
        background="blue"
        category={[t("common:categories.transportation"), "text-primary dark:text-primary-dark"]}
        header={[t("header")]}
        description={[t("description")]}
        last_updated={last_updated}
        agencyBadge={<AgencyBadge agency="jpj" />}
      />
      <Container className="min-h-screen">
        {/* Best selling cars models and brands in {year} */}
        <Section>
          <div className="space-y-6">
            <div className="flex w-full flex-col place-content-center place-items-center gap-3 sm:flex-row">
              <h4 className="text-center">{t("table_title")}</h4>
              <Dropdown
                width="w-fit"
                selected={data.selectedYear}
                onChange={e => {
                  setData("selectedYear", e);
                  setData("topMakers", tableData.top_makers.data[e.value]);
                  setData("topModels", tableData.top_models.data[e.value]);
                }}
                options={yearOptions}
              />
            </div>

            <div className="flex flex-col gap-12 lg:grid lg:grid-cols-12">
              <table className="lg:col-span-4 lg:col-start-3">
                <thead className="dark:border-washed-dark border-b-2">
                  <tr>
                    <th className="px-1 py-2 text-center text-sm font-medium">#</th>
                    <th className="px-1 py-2 text-start text-sm font-medium">
                      {t("column_model")}
                    </th>
                    <th className="px-1 py-2 text-end text-sm font-medium">
                      {t("column_vehicles")}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {data.topModels.map(
                    (item: { maker: string; model: string; vehicles: number }, i: number) => (
                      <tr
                        key={i}
                        className={"dark:border-washed-dark border-b".concat(
                          i < 3 ? " bg-background dark:bg-background-dark" : ""
                        )}
                      >
                        <td
                          className={"px-1 py-2 text-center text-sm font-medium".concat(
                            i < 3 ? " text-primary dark:text-primary-dark" : ""
                          )}
                        >
                          {i + 1}
                        </td>
                        <td className="w-1/2 px-1 py-2 text-start text-sm font-medium capitalize">
                          {`${item.maker} ${item.model}`.toLocaleLowerCase()}
                        </td>
                        <td className="px-1 py-2 text-end text-sm font-medium">
                          {item.vehicles.toLocaleString()}
                        </td>
                      </tr>
                    )
                  )}
                </tbody>
              </table>

              <table className="lg:col-span-4 lg:col-start-7">
                <thead className="dark:border-washed-dark border-b-2">
                  <tr>
                    <th className="px-1 py-2 text-center text-sm font-medium">#</th>
                    <th className="px-1 py-2 text-start text-sm font-medium">
                      {t("column_maker")}
                    </th>
                    <th className="px-1 py-2 text-end text-sm font-medium">
                      {t("column_vehicles")}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {data.topMakers.map((item: { maker: string; vehicles: number }, i: number) => (
                    <tr
                      key={i}
                      className={"dark:border-washed-dark border-b".concat(
                        i < 3 ? " bg-background dark:bg-background-dark" : ""
                      )}
                    >
                      <td
                        className={"px-1 py-2 text-center text-sm font-medium".concat(
                          i < 3 ? " text-primary dark:text-primary-dark" : ""
                        )}
                      >
                        {i + 1}
                      </td>
                      <td className="w-1/2 px-1 py-2 text-start text-sm font-medium capitalize">
                        {item.maker.toLocaleLowerCase()}
                      </td>
                      <td className="px-1 py-2 text-end text-sm font-medium">
                        {item.vehicles.toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </Section>

        {/* How popular is your car? */}
        <section className="py-8 lg:py-12">
          <div className="flex flex-col gap-y-6">
            <h4 className="text-center">{t("section_title")}</h4>
            <div className="flex items-center justify-center gap-x-3">
              <Dropdown
                placeholder={t("manufacturer")}
                width="w-full sm:w-[200px]"
                options={filterMakers}
                selected={query.maker}
                onChange={selected => setQuery("maker", selected)}
                enableSearch
              />
              <Dropdown
                placeholder={t("model")}
                disabled={!query.maker}
                width="w-full sm:w-[200px]"
                options={filterModels}
                selected={query.model}
                onChange={selected => {
                  setQuery("model", selected);
                  searchModel(query.maker.value, selected.value);
                }}
                enableSearch={filterModels.length > 10}
              />
            </div>
          </div>

          {/* {Model}: Popularity over the Years */}
          <Section
            className="mx-auto pt-8 lg:w-2/3"
            title={
              <h5>
                {t("popularity_over_the_years", {
                  manufacturer: query.params.maker ?? "Perodua",
                  model: query.params.model ?? "Myvi",
                })}
              </h5>
            }
            description={t("popularity_disclaimer")}
            date={data.data_as_of}
          >
            <Timeseries
              className="h-[300px]"
              isLoading={data.loading}
              precision={0}
              suggestedMaxY={2}
              interval="year"
              data={{
                labels: data.x,
                datasets: [
                  {
                    type: "line",
                    data: data.y,
                    label: t("cars"),
                    backgroundColor: AKSARA_COLOR.PRIMARY_H,
                    borderColor: AKSARA_COLOR.PRIMARY,
                    borderWidth: 1.5,
                    fill: true,
                  },
                ],
              }}
              stats={[
                {
                  title: t("this_year"),
                  value: numFormat(data.y[data.y.length - 1], "standard"),
                },
                {
                  title: t("past_5yrs"),
                  value: numFormat(past_5yrs, "standard"),
                },
                {
                  title: t("since_2000"),
                  value: numFormat(since_2000, "standard"),
                },
              ]}
            />
          </Section>
        </section>

        {/* How are vehicle registrations trending? */}
        <Section
          title={t("registration_trend")}
          description={t("registration_disclaimer")}
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
                <div className="grid grid-cols-1 gap-12 md:grid-cols-2 xl:grid-cols-3">
                  {VEHICLES.map(vehicle => (
                    <Timeseries
                      key={vehicle}
                      title={t(vehicle)}
                      className="h-[300px] w-full"
                      enableAnimation={!play}
                      interval={data.period}
                      data={{
                        labels: coordinate.x,
                        datasets: [
                          {
                            type: "line",
                            data: coordinate[vehicle],
                            label: t(`common:time.${data.periodly}`),
                            fill: true,
                            backgroundColor: AKSARA_COLOR.PRIMARY_H,
                            borderColor: AKSARA_COLOR.PRIMARY,
                            borderWidth: 1.5,
                          },
                        ],
                      }}
                      stats={[
                        {
                          title: t("this_year", {
                            date: toDate(LATEST_TIMESTAMP, "MMM yyyy", i18n.language),
                          }),
                          value: `+${numFormat(
                            timeseries_callout.data[vehicle].latest,
                            "standard"
                          )}`,
                        },
                        {
                          title: t("alltime"),
                          value: numFormat(timeseries_callout.data[vehicle].alltime, "standard"),
                        },
                      ]}
                    />
                  ))}
                </div>
                <Slider
                  type="range"
                  period={data.period}
                  value={data.minmax}
                  data={timeseries.data[data.periodly].x}
                  onChange={e => setData("minmax", e)}
                />
              </>
            )}
          </SliderProvider>
        </Section>
      </Container>
    </>
  );
};

export default CarPopularity;
