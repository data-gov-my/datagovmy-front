import Slider from "@components/Chart/Slider";
import { SliderProvider } from "@components/Chart/Slider/context";
import { MOTIcon } from "@components/Icon/agency";
import { toast } from "@components/Toast";
import { AgencyBadge, Container, Dropdown, Hero, Section, Tabs } from "@components/index";
import { OptionType } from "@components/types";
import { useData } from "@hooks/useData";
import { useSlice } from "@hooks/useSlice";
import { useTranslation } from "@hooks/useTranslation";
import { get } from "@lib/api";
import { AKSARA_COLOR } from "@lib/constants";
import { numFormat } from "@lib/helpers";
import dynamic from "next/dynamic";
import { FunctionComponent, useMemo } from "react";

/**
 * KTMB Explorer
 * @overview Status: In-development
 */

const Timeseries = dynamic(() => import("@components/Chart/Timeseries"), { ssr: false });

interface KTMBExplorerProps {
  dropdown: any;
  last_updated: any;
  origin_timeseries: any;
  origin_timeseries_callout: any;
  params: any;
  destination_timeseries: any;
  destination_timeseries_callout: any;
}

const KTMBExplorer: FunctionComponent<KTMBExplorerProps> = ({
  dropdown,
  last_updated,
  origin_timeseries,
  origin_timeseries_callout,
  params,
  destination_timeseries,
  destination_timeseries_callout,
}) => {
  const { t, i18n } = useTranslation(["dashboard-ktmb-explorer", "common"]);
  const { data, setData } = useData({
    tab_index: 0,
    minmax: [0, 360],
    service: null,
    origin: null,
    destination: null,
    origin_timeseries: origin_timeseries,
    origin_timeseries_callout: origin_timeseries_callout,
    destination_timeseries: destination_timeseries,
    destination_timeseries_callout: destination_timeseries_callout,
    station_A: params.station_A,
    station_B: params.station_B,
    loading: false,
  });
  const period: { [key: number]: "day" | "month" | "year" } = {
    0: "day",
    1: "month",
    2: "year",
  };
  const { coordinate: origin_coordinate } = useSlice(
    origin_timeseries.data[period[data.tab_index]],
    data.minmax
  );
  const { coordinate: destination_coordinate } = useSlice(
    destination_timeseries.data[period[data.tab_index]],
    data.minmax
  );

  const filterServices = useMemo<Array<OptionType>>(() => {
    const _services = Object.keys(dropdown).map(service => {
      return { label: service, value: service };
    });
    return _services;
  }, []);

  const filterOrigins = useMemo<Array<OptionType>>(() => {
    let _origins: Array<OptionType> = [];
    if (data.service) {
      _origins = Object.keys(dropdown[data.service.value]).map(origin => {
        return { label: origin, value: origin };
      });
    }
    return _origins;
  }, [data.service]);

  const filterDestinations = useMemo<Array<OptionType>>(() => {
    let _destinations: Array<OptionType> = [];
    if (data.service && data.origin) {
      _destinations = dropdown[data.service.value][data.origin.value].map((destination: string) => {
        return { label: destination, value: destination };
      });
    }
    return _destinations;
  }, [data.origin]);

  const validate = async (): Promise<{ service: string; origin: string; destination: string }> =>
    new Promise((resolve, reject) => {
      if (!data.service) {
        reject("Choose a service");
      } else if (!data.origin) {
        reject("Choose an origin");
      } else if (!data.destination) {
        reject("Choose a destination");
      } else {
        resolve({
          service: data.service.value,
          origin: data.origin.value,
          destination: data.destination.value,
        });
      }
    });

  const searchHandler = () => {
    setData("loading", true);

    const params = {
      service: data.service.value,
      origin: data.origin.value,
      destination: data.destination.value,
    };

    get("/dashboard", {
      dashboard: "ktmb",
      ...params,
    })
      .then(({ data }) => {
        setData("x", data.data?.x);
        setData("y", data.data?.cars);
        setData("params", params);
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
        agencyBadge={
          <AgencyBadge
            agency={"Keretapi Tanah Melayu Bhd."}
            link="https://www.ktmb.com.my/"
            icon={<MOTIcon />}
          />
        }
        last_updated={last_updated}
      />

      <Container className="min-h-fit">
        <Section
          title={t("title")}
          date={origin_timeseries.data_as_of}
          description={
            <div className="flex flex-col gap-2 lg:flex-row">
              <Dropdown
                placeholder={t("service")}
                anchor="left"
                width="w-full"
                options={filterServices}
                selected={data.service}
                onChange={selected => setData("service", selected)}
              />
              <div className="flex gap-2">
                <Dropdown
                  placeholder={t("select_origin")}
                  anchor="left"
                  width="w-full"
                  options={filterOrigins}
                  selected={data.origin}
                  disabled={!data.service}
                  onChange={selected => setData("origin", selected)}
                  // enableSearch
                />
                <Dropdown
                  placeholder={t("select_destination")}
                  anchor="left"
                  width="w-full"
                  options={filterDestinations}
                  selected={data.destination}
                  disabled={!data.service && !data.origin}
                  onChange={selected => setData("destination", selected)}
                  // enableSearch
                />
              </div>
            </div>
          }
          menu={
            <Tabs.List
              options={[t("day"), t("month"), t("year")]}
              current={data.tab_index}
              onChange={index => {
                setData("tab_index", index);
              }}
            />
          }
        >
          <SliderProvider>
            {play => (
              <>
                <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
                  <Timeseries
                    className="h-[300px] w-full"
                    title={t(`ridership_${period[data.tab_index]}`, {
                      station_A: data.station_A,
                      station_B: data.station_B,
                    })}
                    enableAnimation={!play}
                    interval={period[data.tab_index]}
                    round={period[data.tab_index]}
                    data={{
                      labels: origin_coordinate.x,
                      datasets: [
                        {
                          type: "line",
                          data: origin_coordinate.y,
                          label: t(period[data.tab_index]),
                          backgroundColor: AKSARA_COLOR.PRIMARY_H,
                          borderColor: AKSARA_COLOR.PRIMARY,
                          borderWidth: 1.5,
                          fill: true,
                        },
                      ],
                    }}
                    stats={[
                      {
                        title: t("daily"),
                        value: `+${numFormat(
                          origin_timeseries_callout.data.day.passengers,
                          "standard"
                        )}`,
                      },
                      {
                        title: t("past_month"),
                        value: `${numFormat(
                          origin_timeseries_callout.data.month.passengers,
                          "standard"
                        )}`,
                      },
                      {
                        title: t("past_year"),
                        value: `${numFormat(
                          origin_timeseries_callout.data.year.passengers,
                          "standard"
                        )}`,
                      },
                    ]}
                  />
                  <Timeseries
                    className="h-[300px] w-full"
                    title={t(`ridership_${period[data.tab_index]}`, {
                      station_A: data.station_A,
                      station_B: data.station_B,
                    })}
                    enableAnimation={!play}
                    interval={period[data.tab_index]}
                    round={period[data.tab_index]}
                    data={{
                      labels: destination_coordinate.x,
                      datasets: [
                        {
                          type: "line",
                          data: destination_coordinate.y,
                          label: t(period[data.tab_index]),
                          backgroundColor: AKSARA_COLOR.PRIMARY_H,
                          borderColor: AKSARA_COLOR.PRIMARY,
                          borderWidth: 1.5,
                          fill: true,
                        },
                      ],
                    }}
                    stats={[
                      {
                        title: t("daily"),
                        value: `+${numFormat(
                          destination_timeseries_callout.data.day.passengers,
                          "standard"
                        )}`,
                      },
                      {
                        title: t("past_month"),
                        value: `${numFormat(
                          destination_timeseries_callout.data.month.passengers,
                          "standard"
                        )}`,
                      },
                      {
                        title: t("past_year"),
                        value: `${numFormat(
                          destination_timeseries_callout.data.year.passengers,
                          "standard"
                        )}`,
                      },
                    ]}
                  />
                </div>
                <Slider
                  type="range"
                  period={period[data.tab_index]}
                  value={data.minmax}
                  data={origin_timeseries.data[period[data.tab_index]].x}
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

export default KTMBExplorer;
