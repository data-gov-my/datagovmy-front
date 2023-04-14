import AgencyBadge from "@components/AgencyBadge";
import { Button, Dropdown, Hero, Section } from "@components/index";
import { useTranslation } from "@hooks/useTranslation";
import { FunctionComponent, useMemo } from "react";
import Container from "@components/Container";
import { JPJIcon } from "@components/Icon/agency";
import Card from "@components/Card";
import { MagnifyingGlassIcon } from "@heroicons/react/20/solid";
import dynamic from "next/dynamic";
import { useData } from "@hooks/useData";
import { useWatch } from "@hooks/useWatch";
import { get } from "@lib/api";
import { OptionType } from "@components/types";
import { useWindowWidth } from "@hooks/useWindowWidth";
import { AKSARA_COLOR, BREAKPOINTS } from "@lib/constants";
import { useTheme } from "next-themes";
import Spinner from "@components/Spinner";

/**
 * CarPopularity Dashboard
 * @overview Status: In-development
 */

interface CarPopularityProps {
  queryOptions: Record<string, any>;
}

const CarPopularity: FunctionComponent<CarPopularityProps> = ({ queryOptions }) => {
  const { t, i18n } = useTranslation(["common", "dashboard-car-popularity"]);
  const windowWidth = useWindowWidth();
  const { theme } = useTheme();
  const Timeseries = dynamic(() => import("@components/Chart/Timeseries"), { ssr: false });

  const { data, setData } = useData({
    // query data
    manufacturer: { label: Object.keys(queryOptions)[0], value: Object.keys(queryOptions)[0] },
    model: null,
    colour: null,
    params: {},
    loading: false,

    // timeseries data
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
  });

  const filterManufacturers = useMemo<Array<OptionType>>(() => {
    const _manufacturers = Object.keys(queryOptions).map(manufacturer => {
      return { label: manufacturer, value: manufacturer };
    });
    return _manufacturers;
  }, []);

  const filterModels = useMemo<Array<OptionType>>(() => {
    let _models: Array<OptionType> = [];
    if (data.manufacturer) {
      _models = Object.keys(queryOptions[data.manufacturer.value]).map(model => {
        return { label: model, value: model };
      });
      setData("model", _models[0]);
    }

    return _models;
  }, [data.manufacturer]);

  const filterColours = useMemo<Array<OptionType>>(() => {
    let _colours = [];
    if (data.manufacturer && data.model) {
      _colours = queryOptions[data.manufacturer.value][data.model.value].map((colour: string) => {
        return { label: colour, value: colour };
      });
      setData("colour", _colours[0]);
    }
    return _colours;
  }, [data.model]);

  const searchHandler = () => {
    setData("loading", true);

    const params = {
      manufacturer: data.manufacturer.value,
      model: data.model.value,
      colour: data.colour.value,
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
      })
      .then(() => setData("loading", false));
  };

  return (
    <>
      <Hero
        background="blue"
        category={[
          t("nav.megamenu.categories.transportation"),
          "text-primary dark:text-primary-dark",
        ]}
        header={[t("dashboard-car-popularity:header")]}
        description={[t("dashboard-car-popularity:description")]}
        agencyBadge={
          <AgencyBadge
            agency={"Road Transport Department (JPJ)"}
            link="https://www.bnm.gov.my/publications/mhs"
            icon={<JPJIcon />}
          />
        }
      />
      <Container className="min-h-screen">
        <Section title={t("dashboard-car-popularity:section_title")} date={data.data_as_of}>
          <div className="flex flex-col gap-8 lg:flex-row">
            <div className="w-full lg:w-fit">
              <Card className="flex w-full flex-col justify-items-start gap-6 rounded-xl border border-outline bg-background	p-6 shadow dark:border-washed-dark dark:bg-washed-dark/50 lg:w-96">
                <Dropdown
                  label={t("dashboard-car-popularity:label_manufacturer")}
                  width="w-full"
                  options={filterManufacturers}
                  selected={data.manufacturer}
                  onChange={selected => setData("manufacturer", selected)}
                  enableSearch
                />
                <Dropdown
                  label={t("dashboard-car-popularity:label_model")}
                  width="w-full"
                  options={filterModels}
                  selected={data.model}
                  onChange={selected => setData("model", selected)}
                  enableSearch
                />
                <Dropdown
                  label={t("dashboard-car-popularity:label_colour")}
                  width="w-full"
                  options={filterColours}
                  selected={data.colour}
                  onChange={selected => setData("colour", selected)}
                />
                <div>
                  <Button
                    icon={<MagnifyingGlassIcon className=" h-4 w-4" />}
                    className="btn btn-primary"
                    onClick={searchHandler}
                  >
                    {t("dashboard-car-popularity:search_button")}
                  </Button>
                </div>
              </Card>
            </div>
            <div className="w-full">
              {data.x?.length > 0 ? (
                data.loading ? (
                  <div className="flex h-96 items-center justify-center">
                    <Spinner loading={data.loading} />
                  </div>
                ) : (
                  <Timeseries
                    className="h-96 w-full pt-2"
                    title={
                      <div className="flex flex-col gap-3">
                        <p className="text-lg font-bold">
                          <span className="capitalize">
                            {t("dashboard-car-popularity:timeseries_car_description", {
                              car: data.params.model,
                              manufacturer: data.params.manufacturer,
                              colour: data.params.colour,
                            })}
                          </span>
                          <span>{t("dashboard-car-popularity:timeseries_title")}</span>
                        </p>
                        <p className="text-sm text-dim">
                          <span>{t("dashboard-car-popularity:timeseries_description")}</span>
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
                          label: t("dashboard-car-popularity:label"),
                          backgroundColor: AKSARA_COLOR.PRIMARY_H,
                          borderColor: AKSARA_COLOR.PRIMARY,
                          borderWidth:
                            windowWidth <= BREAKPOINTS.MD
                              ? 0.75
                              : windowWidth <= BREAKPOINTS.LG
                              ? 1.0
                              : 1.5,
                          fill: true,
                        },
                      ],
                    }}
                  />
                )
              ) : (
                <div className="relative hidden h-96 w-full items-center justify-center lg:flex">
                  <Timeseries
                    className="absolute top-0 left-0 h-full w-full opacity-30"
                    data={{
                      labels: data.placeholderX,
                      datasets: [
                        {
                          type: "line",
                          data: data.placeholderY,
                          backgroundColor: AKSARA_COLOR.PRIMARY_H,
                          borderColor: AKSARA_COLOR.PRIMARY,
                          borderWidth:
                            windowWidth <= BREAKPOINTS.MD
                              ? 0.75
                              : windowWidth <= BREAKPOINTS.LG
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
                  <Card className="z-10 flex h-min w-fit flex-row items-center gap-2 rounded-md border border-outline bg-outline py-1.5 px-3 dark:border-washed-dark dark:bg-washed-dark md:mx-auto">
                    <MagnifyingGlassIcon className=" h-4 w-4" />
                    <p>{t("dashboard-car-popularity:search_prompt")}</p>
                  </Card>
                </div>
              )}
            </div>
          </div>
        </Section>
      </Container>
    </>
  );
};

export default CarPopularity;
