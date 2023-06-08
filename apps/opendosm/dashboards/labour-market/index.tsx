import { Hero, Container, Tabs, Panel, Section, Dropdown } from "@components/index";
import Slider from "@components/Chart/Slider";
import { FunctionComponent, useEffect } from "react";
import dynamic from "next/dynamic";
import { default as Image } from "next/image";
import { useTranslation } from "@hooks/useTranslation";
import { useData } from "@hooks/useData";
import { useSlice } from "@hooks/useSlice";
import { AKSARA_COLOR, CountryAndStates } from "@lib/constants";
import type { OptionType } from "@components/types";
import { numFormat, smartNumFormat, toDate } from "@lib/helpers";
import { track } from "@lib/mixpanel";
import { routes } from "@lib/routes";

/**
 * Labour Market Dashboard
 * @overview Status: Live (Partially on-hold)
 */

const Timeseries = dynamic(() => import("@components/Chart/Timeseries"), { ssr: false });
// const Choropleth = dynamic(() => import("@components/Chart/Choropleth"), { ssr: false });
// const Table = dynamic(() => import("@components/Chart/Table"), { ssr: false });
// const BarMeter = dynamic(() => import("@components/Chart/BarMeter"), { ssr: false });

interface LabourMarketProps {
  last_updated: number;
  bar: any;
  timeseries: any;
  choropleth: any;
  timeseries_callouts: any;
}

const LabourMarketDashboard: FunctionComponent<LabourMarketProps> = ({
  last_updated,
  bar,
  timeseries,
  choropleth,
  timeseries_callouts,
}) => {
  const { t, i18n } = useTranslation();
  const INDICATOR_OPTIONS: Array<OptionType> = Object.keys(choropleth.data).map((key: string) => ({
    label: t(`labour.keys.${key}`),
    value: key,
  }));
  const { data, setData } = useData({
    minmax: [timeseries.data.x.length - 24, timeseries.data.x.length - 1], // [2 years ago, today]
    indicator: INDICATOR_OPTIONS[0],
    indicators: Object.fromEntries(
      Object.entries(choropleth.data).map(([key, value]) => [
        key,
        (value as Array<Record<string, string | number>>).map(item => ({
          ...item,
          id: CountryAndStates[item.id],
        })),
      ])
    ),
  });
  const LATEST_TIMESTAMP = timeseries.data.x[timeseries.data.x.length - 1];
  const { coordinate } = useSlice(timeseries.data, data.minmax);

  useEffect(() => {
    track("page_view", {
      type: "dashboard",
      id: "labour.header",
      name_en: "Labour Market",
      name_bm: "Pasaran Buruh",
      route: routes.LABOUR_MARKET,
    });
  }, []);

  return (
    <>
      <Hero background="labour-market-banner">
        <div className="space-y-4 xl:w-2/3">
          <span className="text-sm font-bold uppercase tracking-widest text-[#FF8328]">
            {t("nav.megamenu.categories.economy")}
          </span>
          <h3 className="text-black">{t("labour.header")}</h3>
          <p className="text-dim">{t("labour.description")}</p>

          <p className="text-sm text-dim">
            {t("common.last_updated", {
              date: toDate(last_updated, "dd MMM yyyy, HH:mm", i18n.language),
            })}
          </p>
        </div>
      </Hero>

      <Container className="min-h-screen">
        {/* How is unemployment trending? */}
        <Section
          title={t("labour.section_1.title")}
          description={t("labour.section_1.description")}
          date={timeseries.data_as_of}
        >
          <div className="space-y-4">
            <Timeseries
              className="h-[350px] w-full"
              title={t("labour.keys.unemployment_rate")}
              interval="month"
              unitY="%"
              data={{
                labels: coordinate.x,
                datasets: [
                  {
                    type: "line",
                    data: coordinate.unemployment_rate,
                    label: t("labour.keys.unemployment_rate"),
                    borderColor: AKSARA_COLOR.LABOUR,
                    backgroundColor: AKSARA_COLOR.LABOUR_H,
                    borderWidth: 1.5,
                    fill: true,
                  },
                ],
              }}
              stats={[
                {
                  title: t("common.latest", {
                    date: toDate(LATEST_TIMESTAMP, "MMM yyyy", i18n.language),
                  }),
                  value: `${numFormat(timeseries_callouts.data.u_rate.callout1, "standard", 1)}%`,
                },
              ]}
            />
            <Slider
              className="pt-7"
              type="range"
              value={data.minmax}
              data={timeseries.data.x}
              period="month"
              onChange={e => setData("minmax", e)}
            />
          </div>
        </Section>

        {/* How are other key labour market indicators trending? */}
        <Section title={t("labour.section_2.title")} date={timeseries.data_as_of}>
          <div className="grid grid-cols-1 gap-12 pb-6 lg:grid-cols-2 xl:grid-cols-3">
            <Timeseries
              title={t("labour.keys.labour_force_participation")}
              className="h-[350px] w-full"
              interval="month"
              unitY="%"
              data={{
                labels: coordinate.x,
                datasets: [
                  {
                    type: "line",
                    data: coordinate.labour_force_participation,
                    label: t("labour.keys.labour_force_participation"),
                    borderColor: AKSARA_COLOR.LABOUR,
                    backgroundColor: AKSARA_COLOR.LABOUR_H,
                    borderWidth: 1.5,
                    fill: true,
                  },
                ],
              }}
              stats={[
                {
                  title: t("common.latest", {
                    date: toDate(LATEST_TIMESTAMP, "MMM yyyy", i18n.language),
                  }),
                  value: `${numFormat(timeseries_callouts.data.p_rate.callout1, "standard", 1)}%`,
                },
              ]}
            />
            {/* <Timeseries
              title={t("labour.keys.under_employment_rate")}
              className="h-[350px] w-full"
              interval="month"
              unitY="%"
              data={{
                labels: coordinate.x,
                datasets: [
                  {
                    type: "line",
                    data: coordinate.under_employment_rate,
                    label: t("labour.keys.under_employment_rate"),
                    borderColor: AKSARA_COLOR.LABOUR,
                    backgroundColor: AKSARA_COLOR.LABOUR_H,
                    borderWidth: 1.5,
                    fill: true,
                  },
                ],
              }}
              stats={[
                {
                  title: t("common.latest", {
                    date: toDate(LATEST_TIMESTAMP, "MMM yyyy", i18n.language),
                  }),
                  value: `${numFormat(timeseries_callouts.data.under_rate.callout1, "standard")}%`,
                },
              ]}
            /> */}
            <Timeseries
              title={t("labour.keys.employment_population_ratio")}
              className="h-[350px] w-full"
              interval="month"
              data={{
                labels: coordinate.x,
                datasets: [
                  {
                    type: "line",
                    data: coordinate.employment_population_ratio,
                    label: t("labour.keys.employment_population_ratio"),
                    borderColor: AKSARA_COLOR.LABOUR,
                    backgroundColor: AKSARA_COLOR.LABOUR_H,
                    borderWidth: 1.5,
                    fill: true,
                  },
                ],
              }}
              stats={[
                {
                  title: t("common.latest", {
                    date: toDate(LATEST_TIMESTAMP, "MMM yyyy", i18n.language),
                  }),
                  value: `${numFormat(timeseries_callouts.data.ep_ratio.callout1, "standard")}`,
                },
              ]}
            />
            <Timeseries
              title={t("labour.keys.unemployed_persons")}
              className="h-[350px] w-full"
              interval="month"
              displayNumFormat={(value, type, precision) =>
                smartNumFormat({ value, type, precision, locale: i18n.language })
              }
              data={{
                labels: coordinate.x,
                datasets: [
                  {
                    type: "line",
                    data: coordinate.unemployed_persons,
                    label: t("labour.keys.unemployed_persons"),
                    borderColor: AKSARA_COLOR.LABOUR,
                    backgroundColor: AKSARA_COLOR.LABOUR_H,
                    borderWidth: 1.5,
                    fill: true,
                  },
                ],
              }}
              stats={[
                {
                  title: t("common.latest", {
                    date: toDate(LATEST_TIMESTAMP, "MMM yyyy", i18n.language),
                  }),
                  value: numFormat(timeseries_callouts.data.unemployed.callout1, "standard"),
                },
              ]}
            />
            <Timeseries
              title={t("labour.keys.own_account_workers")}
              className="h-[350px] w-full"
              interval="month"
              displayNumFormat={(value, type, precision) =>
                smartNumFormat({ value, type, precision, locale: i18n.language })
              }
              data={{
                labels: coordinate.x,
                datasets: [
                  {
                    type: "line",
                    data: coordinate.own_account_workers,
                    label: t("labour.keys.own_account_workers"),
                    borderColor: AKSARA_COLOR.LABOUR,
                    backgroundColor: AKSARA_COLOR.LABOUR_H,
                    borderWidth: 1.5,
                    fill: true,
                  },
                ],
              }}
              stats={[
                {
                  title: t("common.latest", {
                    date: toDate(LATEST_TIMESTAMP, "MMM yyyy", i18n.language),
                  }),
                  value: numFormat(timeseries_callouts.data.own_account.callout1, "standard"),
                },
              ]}
            />
            <Timeseries
              title={t("labour.keys.outside_labour_force")}
              className="h-[350px] w-full"
              interval="month"
              displayNumFormat={(value, type, precision) =>
                smartNumFormat({ value, type, precision, locale: i18n.language })
              }
              data={{
                labels: coordinate.x,
                datasets: [
                  {
                    type: "line",
                    data: coordinate.outside_labour_force,
                    label: t("labour.keys.outside_labour_force"),
                    borderColor: AKSARA_COLOR.LABOUR,
                    backgroundColor: AKSARA_COLOR.LABOUR_H,
                    borderWidth: 1.5,
                    fill: true,
                  },
                ],
              }}
              stats={[
                {
                  title: t("common.latest", {
                    date: toDate(LATEST_TIMESTAMP, "MMM yyyy", i18n.language),
                  }),
                  value: numFormat(timeseries_callouts.data.outside.callout1, "standard"),
                },
              ]}
            />
          </div>
        </Section>

        {/* A deeper look at the latest labour market snapshot */}
        {/* <Section title={t("labour.section_3.title")} date={bar.data_as_of}>
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
            <BarMeter
              title={t("labour.section_3.bar1_header")}
              data={bar.data.employed_status.map((item: any) => ({
                ...item,
                x: t(`labour.keys.${item.x}`),
              }))}
              layout="horizontal"
              unit="%"
              className="flex-col"
            />
            <BarMeter
              title={t("labour.section_3.bar2_header")}
              layout="horizontal"
              unit="%"
              data={bar.data.unemployed_status.map((item: any) => ({
                ...item,
                x: t(`labour.keys.${item.x}`),
              }))}
              className="flex-col"
            />
            <BarMeter
              title={t("labour.section_3.bar3_header")}
              layout="horizontal"
              unit="%"
              data={bar.data.out_reason.map((item: any) => ({
                ...item,
                x: t(`labour.keys.${item.x}`),
              }))}
              className="flex-col"
            />
          </div>
        </Section> */}

        {/* How do key labour market indicators vary across states? */}
        {/* <Section title={t("labour.section_4.title")} date={choropleth.data_as_of}>
          <div>
            <Tabs
              className="flex flex-wrap justify-end gap-2 pb-4"
              title={
                <Dropdown
                  anchor="left"
                  sublabel={t("common.indicator") + ":"}
                  options={INDICATOR_OPTIONS}
                  selected={data.indicator}
                  onChange={e => setData("indicator", e)}
                />
              }
            >
              <Panel name={t("common.charts.heatmap")}>
                <Choropleth
                  className="mx-auto h-[460px] max-w-screen-xl"
                  data={data.indicators[data.indicator.value]}
                  colorScale="blues"
                  enableScale
                />
              </Panel>
              <Panel name={t("common.charts.table")}>
                <div className="mx-auto w-full md:max-w-screen-md">
                  <Table
                    className="table-stripe table-default"
                    data={data.indicators[data.indicator.value]}
                    config={[
                      {
                        header: t("common.state"),
                        id: "id",
                        accessorKey: "id",
                        enableSorting: false,
                        cell: (item: any) => {
                          const state = item.getValue() as string;
                          return (
                            <div className="flex items-center gap-2">
                              <Image
                                src={`/static/images/states/${flip(CountryAndStates)[state]}.jpeg`}
                                width={20}
                                height={12}
                                alt={flip(CountryAndStates)[state]}
                              />
                              <span className="text-sm">{state}</span>
                            </div>
                          );
                        },
                      },
                      {
                        header: data.indicator.label,
                        accessorFn: ({ value }: any) => numFormat(value, "standard"),
                        id: "value",
                        sortingFn: "localeNumber",
                        sortDescFirst: true,
                      },
                    ]}
                  />
                </div>
              </Panel>
            </Tabs>
          </div>
        </Section> */}
      </Container>
    </>
  );
};

export default LabourMarketDashboard;
