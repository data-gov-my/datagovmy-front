import Slider from "@components/Chart/Slider";
import { SliderProvider } from "@components/Chart/Slider/context";
import { MOTIcon } from "@components/Icon/agency";
import { toast } from "@components/Toast";
import { AgencyBadge, Container, Dropdown, Hero, Section, Spinner, Tabs } from "@components/index";
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
  A_to_B: any;
  A_to_B_callout: any;
  params: any;
  B_to_A: any;
  B_to_A_callout: any;
}

const KTMBExplorer: FunctionComponent<KTMBExplorerProps> = ({
  dropdown,
  last_updated,
  A_to_B,
  A_to_B_callout,
  params,
  B_to_A,
  B_to_A_callout,
}) => {
  const { t } = useTranslation(["dashboard-ktmb-explorer", "common"]);

  const { data, setData } = useData({
    tab_index: 0,
    period: "day",
    minmax: [0, A_to_B.day.x.length],
    service: null,
    origin: null,
    destination: null,
    A_to_B: A_to_B,
    A_to_B_callout: A_to_B_callout,
    B_to_A: B_to_A,
    B_to_A_callout: B_to_A_callout,
    station_A: params.station_A,
    station_B: params.station_B,
    loading: false,
  });
  const period: { [key: number]: "day" | "month" | "year" } = {
    0: "day",
    1: "month",
    2: "year",
  };
  const { coordinate: A_to_B_coords } = useSlice(data.A_to_B[data.period], data.minmax);
  const { coordinate: B_to_A_coords } = useSlice(data.B_to_A[data.period], data.minmax);

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

  const validate = async (props: { service?: string; origin?: string; destination?: string }) =>
    new Promise(resolve => {
      if (props.service && props.origin && props.destination) {
        resolve({
          service: props.service,
          origin: props.origin,
          destination: props.destination,
        });
      }
    });

  const fetchData = async (service: string, origin: string, destination: string) => {
    setData("loading", true);
    try {
      const [A_to_B, B_to_A] = await Promise.all([
        get("/dashboard", {
          dashboard: "ktmb",
          service,
          origin,
          destination,
        }),
        get("/dashboard", {
          dashboard: "ktmb",
          service,
          origin: destination,
          destination: origin,
        }),
      ]);
      setData("A_to_B", A_to_B.data.timeseries.data);
      setData("A_to_B_callout", A_to_B.data.timeseries_callout.data);
      setData("B_to_A", B_to_A.data.timeseries.data);
      setData("B_to_A_callout", B_to_A.data.timeseries_callout.data);
      setData("station_A", origin);
      setData("station_B", destination);
    } catch (e) {
      toast.error(t("common:error.toast.request_failure"), t("common:error.toast.try_again"));
      console.error(e);
    }
    setData("loading", false);
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
          date={A_to_B.data_as_of}
          description={
            <div className="flex flex-col gap-2 lg:flex-row">
              <Dropdown
                placeholder={t("service")}
                anchor="left"
                width="w-full"
                options={filterServices}
                selected={data.service}
                onChange={selected => {
                  setData("service", selected);
                  setData("origin", null);
                  setData("destination", null);
                }}
              />
              <div className="flex gap-2">
                <Dropdown
                  placeholder={t("select_origin")}
                  anchor="left"
                  width="w-full"
                  options={filterOrigins}
                  selected={data.origin}
                  disabled={!data.service}
                  onChange={selected => {
                    setData("origin", selected);
                    validate({
                      service: data.service.value,
                      origin: selected.value,
                      destination: data.destination ? data.destination.value : undefined,
                    }).then((resp: any) => fetchData(resp.service, resp.origin, resp.destination));
                  }}
                  enableSearch
                />
                <Dropdown
                  placeholder={t("select_destination")}
                  anchor="left"
                  width="w-full"
                  options={filterDestinations}
                  selected={data.destination}
                  disabled={!data.service || !data.origin}
                  onChange={selected => {
                    setData("destination", selected);
                    validate({
                      service: data.service.value,
                      origin: data.origin ? data.origin.value : undefined,
                      destination: selected.value,
                    }).then((resp: any) => fetchData(resp.service, resp.origin, resp.destination));
                  }}
                  enableSearch
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
                setData("period", period[index]);
              }}
            />
          }
        >
          <SliderProvider>
            {play => (
              <>
                {data.loading ? (
                  <div className="flex h-[452px] items-center justify-center">
                    <Spinner loading={data.loading} />
                  </div>
                ) : (
                  <>
                    <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
                      <Timeseries
                        className="h-[300px] w-full"
                        title={t(`ridership_${data.period}`, {
                          from: data.station_A,
                          to: data.station_B,
                        })}
                        enableAnimation={!play}
                        interval={data.period}
                        round={data.period}
                        data={{
                          labels: A_to_B_coords.x,
                          datasets: [
                            {
                              type: "line",
                              data: A_to_B_coords.y,
                              label: t(data.period),
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
                            value: `+${numFormat(data.A_to_B_callout.day.passengers, "standard")}`,
                          },
                          {
                            title: t("past_month"),
                            value: `${numFormat(data.A_to_B_callout.month.passengers, "standard")}`,
                          },
                          {
                            title: t("past_year"),
                            value: `${numFormat(data.A_to_B_callout.year.passengers, "standard")}`,
                          },
                        ]}
                      />
                      <Timeseries
                        className="h-[300px] w-full"
                        title={t(`ridership_${data.period}`, {
                          from: data.station_B,
                          to: data.station_A,
                        })}
                        enableAnimation={!play}
                        interval={data.period}
                        round={data.period}
                        data={{
                          labels: B_to_A_coords.x,
                          datasets: [
                            {
                              type: "line",
                              data: B_to_A_coords.y,
                              label: t(data.period),
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
                            value: `+${numFormat(data.B_to_A_callout.day.passengers, "standard")}`,
                          },
                          {
                            title: t("past_month"),
                            value: `${numFormat(data.B_to_A_callout.month.passengers, "standard")}`,
                          },
                          {
                            title: t("past_year"),
                            value: `${numFormat(data.B_to_A_callout.year.passengers, "standard")}`,
                          },
                        ]}
                      />
                    </div>
                    <Slider
                      type="range"
                      period={data.period}
                      value={data.minmax}
                      data={data.A_to_B[data.period].x}
                      onChange={e => setData("minmax", e)}
                    />
                  </>
                )}
              </>
            )}
          </SliderProvider>
        </Section>
      </Container>
    </>
  );
};

export default KTMBExplorer;
