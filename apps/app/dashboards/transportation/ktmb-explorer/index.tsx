import Slider from "@components/Chart/Slider";
import { SliderProvider } from "@components/Chart/Slider/context";
import { MOTIcon } from "@components/Icon/agency";
import { AgencyBadge, Container, Dropdown, Hero, Section, Spinner, Tabs } from "@components/index";
import { OptionType } from "@components/types";
import { useData } from "@hooks/useData";
import { useSlice } from "@hooks/useSlice";
import { useTranslation } from "@hooks/useTranslation";
import { AKSARA_COLOR } from "@lib/constants";
import { numFormat } from "@lib/helpers";
import { routes } from "@lib/routes";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
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
  const { t, i18n } = useTranslation(["dashboard-ktmb-explorer", "common"]);
  const { push } = useRouter();
  const { data, setData } = useData({
    tab_index: 0,
    period: "day",
    minmax: [0, A_to_B.day.x.length - 1],
    service: null,
    origin: null,
    destination: null,
    loading: false,
  });
  const period: { [key: number]: "day" | "month" | "year" } = {
    0: "day",
    1: "month",
    2: "year",
  };
  const { coordinate: A_to_B_coords } = useSlice(A_to_B[data.period], data.minmax);
  const { coordinate: B_to_A_coords } = useSlice(B_to_A[data.period], data.minmax);

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

  const navigateToService = (service?: string, origin?: string, destination?: string) => {
    if (!service || !origin || !destination) return;
    setData("loading", true);
    const route = `${routes.KTMB_EXPLORER}/${encodeURIComponent(service)}/${encodeURIComponent(
      origin
    )}/${encodeURIComponent(destination)}`;

    push(route, undefined, {
      scroll: false,
      locale: i18n.language,
    }).then(() => setData("loading", false));
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
                    setData("destination", null);
                  }}
                  enableSearch={filterOrigins.length > 15 ? true : false}
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
                    navigateToService(data.service.value, data.origin.value, selected.value);
                  }}
                  enableSearch={filterDestinations.length > 15 ? true : false}
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
                          from: params.origin,
                          to: params.destination,
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
                            value: `+${numFormat(A_to_B_callout.day.passengers, "standard")}`,
                          },
                          {
                            title: t("past_month"),
                            value: `${numFormat(A_to_B_callout.month.passengers, "standard")}`,
                          },
                          {
                            title: t("past_year"),
                            value: `${numFormat(A_to_B_callout.year.passengers, "standard")}`,
                          },
                        ]}
                      />
                      <Timeseries
                        className="h-[300px] w-full"
                        title={t(`ridership_${data.period}`, {
                          from: params.destination,
                          to: params.origin,
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
                            value: `+${numFormat(B_to_A_callout.day.passengers, "standard")}`,
                          },
                          {
                            title: t("past_month"),
                            value: `${numFormat(B_to_A_callout.month.passengers, "standard")}`,
                          },
                          {
                            title: t("past_year"),
                            value: `${numFormat(B_to_A_callout.year.passengers, "standard")}`,
                          },
                        ]}
                      />
                    </div>
                    <Slider
                      type="range"
                      period={data.period}
                      value={data.minmax}
                      data={A_to_B[data.period].x}
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
