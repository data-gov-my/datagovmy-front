import { ChevronDownIcon, XMarkIcon } from "@heroicons/react/20/solid";
import { FaceFrownIcon } from "@heroicons/react/24/outline";
import { routes } from "@lib/routes";
import { Periods } from "datagovmy-ui/charts/timeseries";
import {
  AgencyBadge,
  Button,
  Card,
  Container,
  Dropdown,
  Hero,
  Label,
  Modal,
  Section,
  Slider,
  Spinner,
  Tabs,
} from "datagovmy-ui/components";
import { AKSARA_COLOR } from "datagovmy-ui/constants";
import { SliderProvider } from "datagovmy-ui/contexts/slider";
import { numFormat } from "datagovmy-ui/helpers";
import { useData, useSlice, useTranslation } from "datagovmy-ui/hooks";
import { DashboardPeriod, OptionType, WithData } from "datagovmy-ui/types";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { FunctionComponent, useMemo } from "react";
import RapidBusRailComingSoon from "@dashboards/transportation/rapid-bus-and-rail-explorer/coming_soon";

/**
 * Rapid Bus and Rail Explorer
 * @overview Status: Live
 */

const Timeseries = dynamic(() => import("datagovmy-ui/charts/timeseries"), { ssr: false });

interface RapidBusRailExplorerProps {
  A_to_B: WithData<Record<DashboardPeriod, Record<"x" | "passengers", number[]>>>;
  A_to_B_callout: Record<DashboardPeriod, number>;
  B_to_A?: Record<DashboardPeriod, Record<"x" | "passengers", number[]>>;
  B_to_A_callout?: Record<DashboardPeriod, number>;
  dropdown: Record<string, Record<string, string[]>>;
  last_updated: string;
  params: any;
}

const RapidBusRailExplorer: FunctionComponent<RapidBusRailExplorerProps> = ({
  A_to_B,
  A_to_B_callout,
  B_to_A,
  B_to_A_callout,
  dropdown,
  last_updated,
  params,
}) => {
  const { t, i18n } = useTranslation(["dashboard-rapid-bus-and-rail-explorer", "common"]);
  // const { push } = useRouter();
  // const { data, setData } = useData({
  //   loading: false,
  //   minmax: [0, A_to_B.data.daily.x.length - 1],
  //   service: params.service,
  //   origin: params.origin,
  //   destination: params.destination,
  //   tab: 0,
  // });
  // const PERIODS: Array<DashboardPeriod> = ["daily_7d", "daily", "monthly", "yearly"];
  // const config = useMemo<{
  //   key: DashboardPeriod;
  //   period: Exclude<Periods, false | "millisecond" | "second" | "minute" | "week">;
  // }>(() => {
  //   const key = PERIODS[data.tab];
  //   setData("minmax", [0, A_to_B.data[key].x.length - 1]);
  //   switch (key) {
  //     case "daily":
  //     case "daily_7d":
  //       return { key: key, period: "day" };
  //     case "monthly":
  //       return { key: key, period: "month" };
  //     case "yearly":
  //       return { key: key, period: "year" };
  //   }
  // }, [data.tab]);

  // const { coordinate: A_to_B_coords } = useSlice(A_to_B.data[config.key], data.minmax);
  // const { coordinate: B_to_A_coords } = useSlice(
  //   B_to_A ? B_to_A[config.key] : A_to_B.data[config.key],
  //   data.minmax
  // );

  // const SERVICE_OPTIONS = useMemo<Array<OptionType>>(() => {
  //   const _services = Object.keys(dropdown).map(service => ({ label: t(service), value: service }));
  //   return _services;
  // }, []);

  // const ORIGIN_OPTIONS = useMemo<Array<OptionType>>(() => {
  //   let _origins: Array<OptionType> = [];
  //   if (data.service) {
  //     _origins = Object.keys(dropdown[data.service]).map(origin => ({
  //       label: origin,
  //       value: origin,
  //     }));
  //   }
  //   return _origins;
  // }, [data.service]);

  // const DESTINATION_OPTIONS = useMemo<Array<OptionType>>(() => {
  //   let _destinations: Array<OptionType> = [];
  //   if (data.service && data.origin) {
  //     _destinations = dropdown[data.service][data.origin].map((destination: string) => ({
  //       label: destination,
  //       value: destination,
  //     }));
  //   }
  //   return _destinations;
  // }, [data.origin]);

  // const navigateToService = (service?: string, origin?: string, destination?: string) => {
  //   if (!service || !origin || !destination) return;
  //   setData("loading", true);
  //   const route = `${routes.PRASARANA_EXPLORER}/${service}/${encodeURIComponent(
  //     origin
  //   )}/${encodeURIComponent(destination)}`;

  //   push(route, undefined, {
  //     scroll: false,
  //     locale: i18n.language,
  //   }).then(() => setData("loading", false));
  // };

  return (
    <>
      <Hero
        background="blue"
        category={[t("common:categories.transportation"), "text-primary dark:text-primary-dark"]}
        header={[t("header")]}
        description={[t("description")]}
        agencyBadge={<AgencyBadge agency="prasarana" />}
        last_updated={last_updated}
      />

      <Container>
        <RapidBusRailComingSoon />

        {/* <Section
          title={t("title")}
          date={A_to_B.data_as_of}
          description={
            <div className="w-full">
              <div className="flex sm:hidden">
                <Modal
                  trigger={open => (
                    <Button onClick={open} className="btn-default shadow-floating">
                      <span>{t("filters")}</span>
                      <span className="bg-primary dark:bg-primary-dark w-4.5 h-5 rounded-md text-center text-white">
                        3
                      </span>
                      <ChevronDownIcon className="-mx-[5px] h-5 w-5" />
                    </Button>
                  )}
                  title={<Label label={t("filters") + ":"} className="text-sm font-bold" />}
                >
                  {close => (
                    <div className="space-y-4 bg-white p-3 dark:bg-black">
                      <div className="space-y-2">
                        <Label label={t("service")} className="text-sm" />
                        <Dropdown
                          anchor="bottom"
                          width="w-full"
                          options={SERVICE_OPTIONS}
                          selected={SERVICE_OPTIONS.find(e => e.value === data.service)}
                          onChange={selected => {
                            setData("service", selected.value);
                            setData("origin", null);
                            setData("destination", null);
                          }}
                        />
                      </div>
                      <div className="dark:border-outlineHover-dark grid grid-cols-2 gap-x-3 gap-y-2 border-y py-4">
                        <Label label={t("origin")} className="text-sm" />
                        <Label label={t("destination")} className="text-sm" />
                        <Dropdown
                          anchor="bottom-10"
                          width="w-full"
                          options={ORIGIN_OPTIONS}
                          selected={ORIGIN_OPTIONS.find(e => e.value === data.origin)}
                          disabled={!data.service}
                          onChange={selected => {
                            setData("origin", selected.value);
                            setData("destination", null);
                          }}
                          enableSearch={ORIGIN_OPTIONS.length > 15 ? true : false}
                        />
                        <Dropdown
                          anchor="right-0 bottom-10"
                          width="w-full"
                          options={DESTINATION_OPTIONS}
                          selected={DESTINATION_OPTIONS.find(e => e.value === data.destination)}
                          disabled={!data.service || !data.origin}
                          onChange={selected => {
                            setData("destination", selected.value);
                          }}
                          enableSearch={DESTINATION_OPTIONS.length > 15 ? true : false}
                        />
                      </div>
                      <div className="space-y-2">
                        <Button
                          className="btn-primary w-full justify-center"
                          onClick={() =>
                            navigateToService(data.service, data.origin, data.destination)
                          }
                        >
                          {t("apply_filter")}
                        </Button>
                        <Button className="btn w-full justify-center px-3 py-1.5" onClick={close}>
                          <XMarkIcon className="h-5 w-5" />
                          {t("common:common.close")}
                        </Button>
                      </div>
                    </div>
                  )}
                </Modal>
              </div>
              <div className="hidden gap-2 sm:flex lg:gap-3">
                <Dropdown
                  placeholder={t("service")}
                  anchor="left"
                  width="w-auto"
                  options={SERVICE_OPTIONS}
                  selected={SERVICE_OPTIONS.find(e => e.value === data.service)}
                  onChange={selected => {
                    setData("service", selected.value);
                    setData("origin", null);
                    setData("destination", null);
                  }}
                />
                <Dropdown
                  placeholder={t("select_origin")}
                  anchor="left"
                  width="w-auto"
                  options={ORIGIN_OPTIONS}
                  selected={ORIGIN_OPTIONS.find(e => e.value === data.origin)}
                  disabled={!data.service}
                  onChange={selected => {
                    setData("origin", selected.value);
                    setData("destination", null);
                  }}
                  enableSearch={ORIGIN_OPTIONS.length > 15 ? true : false}
                />
                <Dropdown
                  placeholder={t("select_destination")}
                  anchor="left"
                  width="w-auto"
                  options={DESTINATION_OPTIONS}
                  selected={DESTINATION_OPTIONS.find(e => e.value === data.destination)}
                  disabled={!data.service || !data.origin}
                  onChange={selected => {
                    setData("destination", selected.value);
                    navigateToService(data.service, data.origin, selected.value);
                  }}
                  enableSearch={DESTINATION_OPTIONS.length > 15 ? true : false}
                />
              </div>
            </div>
          }
          menu={
            <Tabs.List
              options={[
                t("common:time.daily_7d"),
                t("common:time.daily"),
                t("common:time.monthly"),
                t("common:time.yearly"),
              ]}
              current={data.tab}
              onChange={index => setData("tab", index)}
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
                        title={t(`ridership_${config.period}`, {
                          from: params.origin ?? "JB SENTRAL",
                          to: params.destination ?? "WOODLANDS CIQ",
                        })}
                        enableAnimation={!play}
                        interval={config.period}
                        data={{
                          labels: A_to_B_coords.x,
                          datasets: [
                            {
                              type: A_to_B_coords.x.length === 1 ? "bar" : "line",
                              data: A_to_B_coords.passengers,
                              label: t(`common:time.${config.key}`),
                              fill: true,
                              backgroundColor: AKSARA_COLOR.PRIMARY_H,
                              borderColor: AKSARA_COLOR.PRIMARY,
                              borderWidth: 1.5,
                              barThickness: 12,
                            },
                          ],
                        }}
                        stats={[
                          {
                            title: t("common:time.daily"),
                            value: `+${numFormat(A_to_B_callout.daily, "standard")}`,
                          },
                          {
                            title: t("past_month"),
                            value: `${numFormat(A_to_B_callout.monthly, "standard")}`,
                          },
                          {
                            title: t("past_year"),
                            value: `${numFormat(A_to_B_callout.yearly, "standard")}`,
                          },
                        ]}
                      />
                      {B_to_A && B_to_A_callout ? (
                        <Timeseries
                          className="h-[300px] w-full"
                          title={t(`ridership_${config.period}`, {
                            from: params.destination ?? "WOODLANDS CIQ",
                            to: params.origin ?? "JB SENTRAL",
                          })}
                          enableAnimation={!play}
                          interval={config.period}
                          data={{
                            labels: B_to_A_coords.x,
                            datasets: [
                              {
                                type: B_to_A_coords.x.length === 1 ? "bar" : "line",
                                data: B_to_A_coords.passengers,
                                label: t(`common:time.${config.key}`),
                                fill: true,
                                backgroundColor: AKSARA_COLOR.PRIMARY_H,
                                borderColor: AKSARA_COLOR.PRIMARY,
                                borderWidth: 1.5,
                                barThickness: 12,
                              },
                            ],
                          }}
                          stats={[
                            {
                              title: t("common:time.daily"),
                              value: `+${numFormat(B_to_A_callout.daily, "standard")}`,
                            },
                            {
                              title: t("past_month"),
                              value: `${numFormat(B_to_A_callout.monthly, "standard")}`,
                            },
                            {
                              title: t("past_year"),
                              value: `${numFormat(B_to_A_callout.yearly, "standard")}`,
                            },
                          ]}
                        />
                      ) : (
                        <div className="relative flex h-full w-full flex-col">
                          <h5>
                            {t(`ridership_${config.period}`, {
                              from: params.destination,
                              to: params.origin,
                            })}
                          </h5>
                          <Timeseries
                            className="absolute bottom-0 h-[300px] w-full opacity-30"
                            enableCrosshair={false}
                            enableTooltip={false}
                            gridOffsetX={true}
                            data={{
                              labels: B_to_A_coords.x,
                              datasets: [
                                {
                                  type: B_to_A_coords.x.length === 1 ? "bar" : "line",
                                  data: B_to_A_coords.y,
                                  fill: true,
                                  borderWidth: 1,
                                  barThickness: 12,
                                },
                              ],
                            }}
                          />
                          <div className="z-10 flex h-full w-full flex-col items-center justify-center">
                            <Card className="bg-outline dark:bg-washed-dark flex flex-row items-center gap-2 rounded-md px-3 py-1.5">
                              <FaceFrownIcon className="h-6 w-6" />
                              {t("no_trips")}
                            </Card>
                          </div>
                        </div>
                      )}
                    </div>
                    <Slider
                      type="range"
                      period={config.period}
                      value={data.minmax}
                      data={A_to_B.data[config.key].x}
                      onChange={e => setData("minmax", e)}
                    />
                  </>
                )}
              </>
            )}
          </SliderProvider>
        </Section> */}
      </Container>
    </>
  );
};

export default RapidBusRailExplorer;
