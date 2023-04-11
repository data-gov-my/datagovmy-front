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
    x: [
      0, 2678400000, 5097600000, 7776000000, 10368000000, 13046400000, 15638400000, 18316800000,
      20995200000, 23587200000, 26265600000, 28857600000,
    ],
    y: [5547, 5234, 5834, 5621, 5705, 5398, 5998, 6057, 6423, 6159, 5325, 5404],
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

  useWatch(() => {
    setData("loading", true);

    // console.log("REQUEST: ", { dashboard: "car_popularity", ...data.params });

    // get("dashboard/", { dashboard: "car_popularity", ...data.params })
    //   .then(({ data }) => {
    //     setData("x", data.timeseries?.data.x);
    //     setData("y", data.timeseries?.data.cars);
    //   })
    //   .then(() => setData("loading", false));
  }, []);

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
        <Section title={t("dashboard-car-popularity:section_title")} date={Date.now()}>
          <div className="flex flex-col gap-8 lg:flex-row">
            <div className="w-full lg:w-fit">
              <Card className="flex w-full flex-col justify-items-start gap-6 rounded-xl border border-outline bg-background	p-6 shadow dark:border-washed-dark dark:bg-washed-dark/50 lg:w-[400px]">
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
                    onClick={() => {
                      setData("params", {
                        manufacturer: data.manufacturer.value,
                        model: data.model.value,
                        colour: data.colour.value,
                      });
                    }}
                  >
                    {t("dashboard-car-popularity:search_button")}
                  </Button>
                </div>
              </Card>
            </div>
            <div className="w-full">
              <div className="relative hidden h-[460px] w-full items-center justify-center">
                <Timeseries
                  className="absolute top-0 left-0 h-full w-full opacity-30"
                  data={{
                    labels: data.x,
                    datasets: [
                      {
                        type: "line",
                        data: data.y,
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
                />
                <Card className="z-10 flex h-min w-fit flex-row items-center gap-2 rounded-md border border-outline bg-outline py-1.5 px-3 dark:border-washed-dark dark:bg-washed-dark md:mx-auto">
                  <MagnifyingGlassIcon className=" h-4 w-4" />
                  <p>{t("dashboard-car-popularity:search_prompt")}</p>
                </Card>
              </div>

              <Timeseries
                className="h-[460px] w-full"
                title={
                  <>
                    <p className="text-lg font-bold">
                      <span>
                        {t("dashboard-car-popularity:timeseries_title", { car: "Toyota" })}
                      </span>
                    </p>
                    <p className="text-sm text-dim">
                      <span>{t("dashboard-car-popularity:timeseries_description")}</span>
                    </p>
                  </>
                }
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
            </div>
          </div>
        </Section>
      </Container>
    </>
  );
};

export default CarPopularity;
