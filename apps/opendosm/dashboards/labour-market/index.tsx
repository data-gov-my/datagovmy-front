import { Container, Section, Slider, Hero, AgencyBadge } from "datagovmy-ui/components";

import { useData, useSlice, useTranslation } from "datagovmy-ui/hooks";
import { FunctionComponent, useEffect } from "react";
import { AKSARA_COLOR, CountryAndStates } from "@lib/constants";
import type { OptionType } from "@components/types";
import { numFormat, smartNumFormat, toDate } from "datagovmy-ui/helpers";
import dynamic from "next/dynamic";
import { DOSMIcon } from "datagovmy-ui/icons/agency";

/**
 * Labour Market Dashboard
 * @overview Status: Live (Partially on-hold)
 */

const Timeseries = dynamic(() => import("datagovmy-ui/charts/timeseries"), {
  ssr: false,
});

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
  const { t, i18n } = useTranslation(["dashboard-labour-market", "common"]);
  // const INDICATOR_OPTIONS: Array<OptionType> = Object.keys(choropleth.data).map((key: string) => ({
  //   label: t(`keys.${key}`),
  //   value: key,
  // }));
  // const { data, setData } = useData({
  //   minmax: [timeseries.data.x.length - 24, timeseries.data.x.length - 1], // [2 years ago, today]
  //   indicator: INDICATOR_OPTIONS[0],
  //   indicators: Object.fromEntries(
  //     Object.entries(choropleth.data).map(([key, value]) => [
  //       key,
  //       (value as Array<Record<string, string | number>>).map(item => ({
  //         ...item,
  //         id: CountryAndStates[item.id],
  //       })),
  //     ])
  //   ),
  // });
  // const LATEST_TIMESTAMP = timeseries.data.x[timeseries.data.x.length - 1];
  // const { coordinate } = useSlice(timeseries.data, data.minmax);

  return (
    <>
      <Hero
        background="orange"
        category={[t("common:categories.economy"), "text-orange-700"]}
        header={[t("header")]}
        description={[t("description"), "dark:text-white"]}
        last_updated={last_updated}
        agencyBadge={
          <AgencyBadge
            agency={t("agencies:dosm.full")}
            link="https://open.dosm.gov.my/"
            icon={<DOSMIcon />}
          />
        }
      />

      <Container className="min-h-screen">
        {/* How is unemployment trending? */}
        {/* <Section
          title={t("section_1.title")}
          description={t("section_1.description")}
          date={timeseries.data_as_of}
        >
          <div className="space-y-4">
            <Timeseries
              className="h-[350px] w-full"
              title={t("keys.unemployment_rate")}
              interval="month"
              unitY="%"
              data={{
                labels: coordinate.x,
                datasets: [
                  {
                    type: "line",
                    data: coordinate.unemployment_rate,
                    label: t("keys.unemployment_rate"),
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
        </Section> */}

        {/* How are other key labour market indicators trending? */}
        {/* <Section title={t("section_2.title")} date={timeseries.data_as_of}>
          <div className="grid grid-cols-1 gap-12 pb-6 lg:grid-cols-2 xl:grid-cols-3">
            <Timeseries
              title={t("keys.labour_force_participation")}
              className="h-[350px] w-full"
              interval="month"
              unitY="%"
              data={{
                labels: coordinate.x,
                datasets: [
                  {
                    type: "line",
                    data: coordinate.labour_force_participation,
                    label: t("keys.labour_force_participation"),
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
              title={t("keys.under_employment_rate")}
              className="h-[350px] w-full"
              interval="month"
              unitY="%"
              data={{
                labels: coordinate.x,
                datasets: [
                  {
                    type: "line",
                    data: coordinate.under_employment_rate,
                    label: t("keys.under_employment_rate"),
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
            /> 
            <Timeseries
              title={t("keys.employment_population_ratio")}
              className="h-[350px] w-full"
              interval="month"
              data={{
                labels: coordinate.x,
                datasets: [
                  {
                    type: "line",
                    data: coordinate.employment_population_ratio,
                    label: t("keys.employment_population_ratio"),
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
              title={t("keys.unemployed_persons")}
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
                    label: t("keys.unemployed_persons"),
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
              title={t("keys.own_account_workers")}
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
                    label: t("keys.own_account_workers"),
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
              title={t("keys.outside_labour_force")}
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
                    label: t("keys.outside_labour_force"),
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
        </Section> */}

        {/* A deeper look at the latest labour market snapshot */}
        {/* <Section title={t("section_3.title")} date={bar.data_as_of}>
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
            <BarMeter
              title={t("section_3.bar1_header")}
              data={bar.data.employed_status.map((item: any) => ({
                ...item,
                x: t(`keys.${item.x}`),
              }))}
              layout="horizontal"
              unit="%"
              className="flex-col"
            />
            <BarMeter
              title={t("section_3.bar2_header")}
              layout="horizontal"
              unit="%"
              data={bar.data.unemployed_status.map((item: any) => ({
                ...item,
                x: t(`keys.${item.x}`),
              }))}
              className="flex-col"
            />
            <BarMeter
              title={t("section_3.bar3_header")}
              layout="horizontal"
              unit="%"
              data={bar.data.out_reason.map((item: any) => ({
                ...item,
                x: t(`keys.${item.x}`),
              }))}
              className="flex-col"
            />
          </div>
        </Section> */}

        {/* How do key labour market indicators vary across states? */}
        {/* <Section title={t("section_4.title")} date={choropleth.data_as_of}>
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
