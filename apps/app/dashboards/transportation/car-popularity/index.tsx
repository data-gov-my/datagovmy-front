import AgencyBadge from "@components/Badge/agency";
import { Button, Dropdown, Hero, Section } from "@components/index";
import { useTranslation } from "@hooks/useTranslation";
import { FunctionComponent, useContext, useMemo } from "react";
import Container from "@components/Container";
import { JPJIcon } from "@components/Icon/agency";
import Card from "@components/Card";
import { MagnifyingGlassIcon } from "@heroicons/react/20/solid";
import dynamic from "next/dynamic";
import { useData } from "@hooks/useData";
import { get } from "@lib/api";
import { OptionType } from "@components/types";
import { WindowContext, WindowProvider } from "@hooks/useWindow";
import { AKSARA_COLOR, BREAKPOINTS } from "@lib/constants";
import Spinner from "@components/Spinner";
import { toast } from "@components/Toast";

/**
 * CarPopularity Dashboard
 * @overview Status: In-development
 */

interface CarPopularityProps {
  last_updated: string;
  queryOptions: Record<string, any>;
  tableData: Record<string, any>;
}

const Timeseries = dynamic(() => import("@components/Chart/Timeseries"), { ssr: false });

const CarPopularity: FunctionComponent<CarPopularityProps> = ({
  last_updated,
  queryOptions,
  tableData,
}) => {
  const { t } = useTranslation(["dashboard-car-popularity", "common"]);
  const { breakpoint } = useContext(WindowContext);

  // query data
  const { data: query, setData: setQuery } = useData({
    maker: { label: Object.keys(queryOptions)[0], value: Object.keys(queryOptions)[0] },
    model: null,
    params: {},
    loading: false,
  });

  const yearOptions: OptionType[] = Object.keys(tableData.top_makers.data).map(val => {
    return { label: new Date(val).getFullYear().toString(), value: val };
  });

  // table & timeseries data
  const { data, setData } = useData({
    x: [],
    y: [],
    placeholderX: [
      631152000000, 662688000000, 694224000000, 725846400000, 757382400000, 788918400000,
      820454400000, 852076800000, 883612800000, 915148800000, 946684800000, 978307200000,
      1009843200000, 1041379200000, 1072915200000, 1104537600000, 1136073600000, 1167609600000,
      1199145600000, 1230768000000, 1262304000000, 1293840000000, 1325376000000, 1356998400000,
      1388534400000, 1420070400000, 1451606400000, 1483228800000, 1514764800000, 1546300800000,
      1577836800000, 1609459200000, 1640995200000,
    ],
    placeholderY: [
      70150, 29766, 48832, 87217, 22895, 16223, 76955, 73224, 94678, 47467, 6086, 16614, 75976,
      78252, 60954, 88490, 15135, 17795, 43085, 54941, 20484, 35517, 91158, 68620, 59882, 94217,
      3477, 45860, 82643, 6464, 554, 16730, 20919,
    ],

    // table data
    selectedYear: yearOptions.at(-1),
    topMakers: tableData.top_makers.data[yearOptions.at(-1)?.value || -1],
    topModels: tableData.top_models.data[yearOptions.at(-1)?.value || -1],
  });

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
      setQuery("model", _models[0]);
    }
    return _models;
  }, [query.maker]);

  const searchHandler = () => {
    setQuery("loading", true);

    const params = {
      maker: query.maker.value,
      model: query.model.value,
    };

    get("chart/", {
      dashboard: "car_popularity",
      chart_name: "timeseries",
      ...params,
    })
      .then(({ data }) => {
        setData("x", data.data?.x);
        setData("y", data.data?.cars);
        setData("data_as_of", data.data_as_of);
        setData("params", params); // for timeseries title
        setQuery("loading", false);
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
        agencyBadge={
          <AgencyBadge
            agency={t("agencies:jpj.full")}
            link="https://www.bnm.gov.my/publications/mhs"
            icon={<JPJIcon />}
          />
        }
      />
      <Container className="min-h-screen">
        {/* Best selling cars models and brands in {year} */}
        <Section>
          <div className="space-y-6">
            <div className="flex flex-col place-content-center place-items-center gap-3 sm:flex-row">
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
                <thead className="border-b-2">
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
                        className={"border-b".concat(
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
                <thead className="border-b-2">
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
                      className={"border-b".concat(
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
        <Section title={t("section_title")} date={data.data_as_of}>
          <div className="flex flex-col gap-8 lg:grid lg:grid-cols-3">
            <div className="w-full lg:col-span-1">
              <Card className="border-outline bg-background dark:border-washed-dark dark:bg-washed-dark/50 flex w-full flex-col justify-items-start gap-6	rounded-xl border p-6 shadow">
                <Dropdown
                  label={t("label_maker")}
                  placeholder={t("option_maker")}
                  width="w-full"
                  options={filterMakers}
                  selected={query.maker}
                  onChange={selected => setQuery("maker", selected)}
                  enableSearch
                />
                <Dropdown
                  label={t("label_model")}
                  placeholder={t("option_model")}
                  width="w-full"
                  options={filterModels}
                  selected={query.model}
                  onChange={selected => setQuery("model", selected)}
                  enableSearch
                />
                <div>
                  <Button
                    icon={<MagnifyingGlassIcon className=" h-4 w-4" />}
                    className="btn btn-primary"
                    onClick={searchHandler}
                  >
                    {t("search_button")}
                  </Button>
                </div>
              </Card>
            </div>
            <div className="lg:col-span-2">
              <WindowProvider>
                {data.x?.length > 0 ? (
                  <Timeseries
                    className="h-[300px]"
                    isLoading={query.loading}
                    precision={0}
                    suggestedMaxY={2}
                    title={
                      <div className="flex flex-col gap-3">
                        <p className="text-lg font-bold">
                          <span className="capitalize">
                            {t("timeseries_car_description", {
                              car: data.params.model,
                              maker: data.params.maker,
                            })}
                          </span>
                          <span>{t("timeseries_title")}</span>
                        </p>
                        <p className="text-dim text-sm">
                          <span>{t("timeseries_description")}</span>
                        </p>
                      </div>
                    }
                    interval={"year"}
                    data={{
                      labels: data.x,
                      datasets: [
                        {
                          type: "line",
                          data: data.y,
                          label: t("label"),
                          backgroundColor: AKSARA_COLOR.PRIMARY_H,
                          borderColor: AKSARA_COLOR.PRIMARY,
                          borderWidth:
                            breakpoint <= BREAKPOINTS.MD
                              ? 0.75
                              : breakpoint <= BREAKPOINTS.LG
                              ? 1.0
                              : 1.5,
                          fill: true,
                        },
                      ],
                    }}
                  />
                ) : (
                  <div className="relative hidden h-96 items-center justify-center lg:flex">
                    <Timeseries
                      className="absolute left-0 top-0 h-full w-full opacity-30"
                      data={{
                        labels: data.placeholderX,
                        datasets: [
                          {
                            type: "line",
                            data: data.placeholderY,
                            backgroundColor: AKSARA_COLOR.PRIMARY_H,
                            borderColor: AKSARA_COLOR.PRIMARY,
                            borderWidth:
                              breakpoint <= BREAKPOINTS.MD
                                ? 0.75
                                : breakpoint <= BREAKPOINTS.LG
                                ? 1.0
                                : 1.5,
                            fill: true,
                          },
                        ],
                      }}
                      enableGridX={false}
                      enableCrosshair={false}
                      interval={"year"}
                    />
                    <Card className="border-outline bg-outline dark:border-washed-dark dark:bg-washed-dark z-10 flex h-min w-fit flex-row items-center gap-2 rounded-md border px-3 py-1.5 md:mx-auto">
                      <MagnifyingGlassIcon className=" h-4 w-4" />
                      <p>{t("search_prompt")}</p>
                    </Card>
                  </div>
                )}
              </WindowProvider>
            </div>
          </div>
        </Section>
      </Container>
    </>
  );
};

export default CarPopularity;
