import Card from "@components/Card";
import Slider from "@components/Chart/Slider";
import { SliderProvider } from "@components/Chart/Slider/context";
import { MOTIcon } from "@components/Icon/agency";
import Label from "@components/Label";
import Progress from "@components/Progress";
import {
  AgencyBadge,
  Button,
  Container,
  Dropdown,
  Hero,
  Modal,
  Section,
  Spinner,
  Tabs,
} from "@components/index";
import { OptionType } from "@components/types";
import { ChevronDownIcon, XMarkIcon } from "@heroicons/react/20/solid";
import { FaceFrownIcon } from "@heroicons/react/24/outline";
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
  A_to_B: any;
  A_to_B_callout: any;
  B_to_A?: any;
  B_to_A_callout?: any;
  dropdown: any;
  last_updated: string;
  params: any;
}

const KTMBExplorer: FunctionComponent<KTMBExplorerProps> = ({
  A_to_B,
  A_to_B_callout,
  B_to_A,
  B_to_A_callout,
  dropdown,
  last_updated,
  params,
}) => {
  const { t, i18n } = useTranslation(["dashboard-ktmb-explorer", "common"]);
  const { push } = useRouter();
  const { data, setData } = useData({
    tab_index: 0,
    period: "day",
    minmax: [0, A_to_B.day.x.length - 1],
    service: params.service,
    origin: params.origin,
    destination: params.destination,
    loading: false,
  });
  const period: { [key: number]: "day" | "month" | "year" } = {
    0: "day",
    1: "month",
    2: "year",
  };
  const { coordinate: A_to_B_coords } = useSlice(A_to_B[data.period], data.minmax);
  const { coordinate: B_to_A_coords } = useSlice(
    B_to_A ? B_to_A[data.period] : A_to_B[data.period],
    data.minmax
  );

  const SERVICE_OPTIONS = useMemo<Array<OptionType>>(() => {
    const _services = Object.keys(dropdown).map(service => ({ label: t(service), value: service }));
    return _services;
  }, []);

  const ORIGIN_OPTIONS = useMemo<Array<OptionType>>(() => {
    let _origins: Array<OptionType> = [];
    if (data.service) {
      _origins = Object.keys(dropdown[data.service]).map(origin => ({
        label: origin,
        value: origin,
      }));
    }
    return _origins;
  }, [data.service]);

  const DESTINATION_OPTIONS = useMemo<Array<OptionType>>(() => {
    let _destinations: Array<OptionType> = [];
    if (data.service && data.origin) {
      _destinations = dropdown[data.service][data.origin].map((destination: string) => ({
        label: destination,
        value: destination,
      }));
    }
    return _destinations;
  }, [data.origin]);

  const navigateToService = (service?: string, origin?: string, destination?: string) => {
    if (!service || !origin || !destination) return;
    setData("loading", true);
    const route = `${routes.KTMB_EXPLORER}/${service}/${encodeURIComponent(
      origin
    )}/${encodeURIComponent(destination)}`;

    push(route, undefined, {
      scroll: false,
      locale: i18n.language,
    }).then(() => setData("loading", false));
  };

  return (
    <>
      <Progress />
      <Hero
        background="blue"
        category={[t("common:categories.transportation"), "text-primary dark:text-primary-dark"]}
        header={[t("header")]}
        description={[t("description")]}
        agencyBadge={
          <AgencyBadge
            agency={t("agencies:ktmb.full")}
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
            <div className="w-full">
              <div className="flex sm:hidden">
                <Modal
                  trigger={open => (
                    <button onClick={open} className="btn-default btn-disabled shadow-floating">
                      <span>{t("filters")}</span>
                      <span className="bg-primary dark:bg-primary-dark w-4.5 h-5 rounded-md text-center text-white">
                        3
                      </span>
                      <ChevronDownIcon className="-mx-[5px] h-5 w-5" />
                    </button>
                  )}
                  title={<Label label={t("filters") + ":"} className="text-sm font-bold" />}
                >
                  {close => (
                    <div className="space-y-4 p-3">
                      <div className="space-y-2">
                        <Label label={t("service")} className="text-sm" />
                        <Dropdown
                          anchor="left"
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
                          anchor="left-0 bottom-10"
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
              className="grow"
              options={[t("common:time.daily"), t("common:time.monthly"), t("common:time.yearly")]}
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
                          from: params.origin ?? "JB SENTRAL",
                          to: params.destination ?? "WOODLANDS CIQ",
                        })}
                        enableAnimation={!play}
                        interval={data.period === "day" ? "auto" : data.period}
                        data={{
                          labels: A_to_B_coords.x,
                          datasets: [
                            {
                              type: A_to_B_coords.x.length === 1 ? "bar" : "line",
                              data: A_to_B_coords.y,
                              label: t(data.period),
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
                      {B_to_A ? (
                        <Timeseries
                          className="h-[300px] w-full"
                          title={t(`ridership_${data.period}`, {
                            from: params.destination ?? "WOODLANDS CIQ",
                            to: params.origin ?? "JB SENTRAL",
                          })}
                          enableAnimation={!play}
                          interval={data.period === "day" ? "auto" : data.period}
                          data={{
                            labels: B_to_A_coords.x,
                            datasets: [
                              {
                                type: B_to_A_coords.x.length === 1 ? "bar" : "line",
                                data: B_to_A_coords.y,
                                label: t(data.period),
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
                      ) : (
                        <div className="relative flex h-full w-full flex-col">
                          <h5>
                            {t(`ridership_${data.period}`, {
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
