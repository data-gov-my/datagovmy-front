import { Container, Dropdown, Hero, Panel, Section, StateDropdown, Tabs } from "@components/index";
import Image from "next/image";
import { FunctionComponent, useEffect } from "react";
import dynamic from "next/dynamic";
import { flip, numFormat, toDate } from "@lib/helpers";
import { useTranslation } from "@hooks/useTranslation";
import { useData } from "@hooks/useData";
import { AKSARA_COLOR, CountryAndStates } from "@lib/constants";
import { useRouter } from "next/router";
import type { OptionType } from "@components/types";
import { routes } from "@lib/routes";
import { track } from "@lib/mixpanel";

/**
 * Violent / Property Crime Dashboard
 * @overview Status: Live
 */

const Timeseries = dynamic(() => import("@components/Chart/Timeseries"), { ssr: false });
const Choropleth = dynamic(() => import("@components/Chart/Choropleth"), { ssr: false });
const Table = dynamic(() => import("@components/Chart/Table"), { ssr: false });

interface CrimeDashboardProps {
  last_updated: number;
  timeseries: any;
  choropleth: any;
}

const CrimeDashboard: FunctionComponent<CrimeDashboardProps> = ({
  last_updated,
  timeseries,
  choropleth,
}) => {
  const router = useRouter();
  const state = (router.query.state as string) ?? "mys";
  const { t, i18n } = useTranslation();
  const CRIME_OPTIONS: Array<OptionType> = Object.keys(choropleth.data).map((key: string) => ({
    label: t(`crime.keys.${key}`),
    value: key,
  }));

  const CHOROPLETH_DATA = Object.fromEntries(
    Object.entries(choropleth.data).map(([key, value]) => [
      key,
      (value as Array<Record<string, string | number>>).map(item => ({
        ...item,
        id: CountryAndStates[item.id],
      })),
    ])
  );

  const { data, setData } = useData({
    indicator: CRIME_OPTIONS[0],
  });

  useEffect(() => {
    track("page_view", {
      type: "dashboard",
      id: "crime.header",
      name_en: "Violent and Property Crime",
      name_bm: "Jenayah Kekerasan dan Harta Benda",
      route: routes.CRIME,
    });
  }, []);

  return (
    <>
      <Hero background="pdrm-banner">
        <div className="space-y-4 xl:w-2/3">
          <span className="text-sm font-bold uppercase tracking-widest text-danger">
            {t("nav.megamenu.categories.social")}
          </span>
          <h3 className="text-white">{t("crime.header")}</h3>
          <p className="whitespace-pre-line text-white">{t("crime.description")}</p>

          <StateDropdown url={routes.CRIME} currentState={state} exclude={["kvy", "pjy", "lbn"]} />

          <p className="text-sm text-white">
            {t("common.last_updated", {
              date: toDate(last_updated, "dd MMM yyyy, HH:mm", i18n.language),
            })}
          </p>
        </div>
      </Hero>

      <Container className="min-h-screen">
        {/* How are violent and property crimes trending? */}
        <Section
          title={t("crime.section_1.title")}
          description={t("crime.section_1.description")}
          date={timeseries.data_as_of}
        >
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
            <Timeseries
              state={state}
              className="h-[250px] w-full"
              title={t("crime.keys.violent")}
              interval="year"
              data={{
                labels: timeseries.data.x,
                datasets: [
                  {
                    type: "line",
                    data: timeseries.data.violent,
                    label: t("crime.keys.violent"),
                    borderColor: AKSARA_COLOR.DANGER,
                    backgroundColor: "#DC26261A",
                    fill: true,
                    borderWidth: 1.5,
                  },
                ],
              }}
            />
            <Timeseries
              state={state}
              className="h-[250px] w-full"
              title={t("crime.keys.property")}
              interval="year"
              data={{
                labels: timeseries.data.x,
                datasets: [
                  {
                    type: "line",
                    data: timeseries.data.property,
                    label: t("crime.keys.property"),
                    borderColor: AKSARA_COLOR.DANGER,
                    backgroundColor: "#DC26261A",
                    fill: true,
                    borderWidth: 1.5,
                  },
                ],
              }}
            />
          </div>
        </Section>

        {/* How does the incidence of crimes (per capita) vary across states? */}
        <Section title={t("crime.section_2.title")} date={choropleth.data_as_of}>
          <Tabs
            className="flex flex-wrap justify-end gap-2 pb-4"
            title={
              <Dropdown
                className="max-w-[50vw] lg:max-w-none"
                anchor="left"
                sublabel={t("crime.crime") + ":"}
                options={CRIME_OPTIONS}
                selected={data.indicator}
                onChange={e => setData("indicator", e)}
              />
            }
          >
            <Panel name={t("common.charts.heatmap")}>
              <Choropleth
                className="mx-auto h-[460px] max-w-screen-xl"
                data={CHOROPLETH_DATA[data.indicator.value]}
                colorScale="reds"
              />
            </Panel>
            <Panel name={t("common.charts.table")}>
              <div className="mx-auto w-full md:max-w-screen-md">
                <Table
                  className="table-stripe table-default"
                  data={CHOROPLETH_DATA[data.indicator.value]}
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
        </Section>

        {/*A deeper look at violent crimes */}
        <Section title={t("crime.section_3.title")} date={timeseries.data_as_of}>
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
            <Timeseries
              title={t("crime.keys.violent_murder")}
              className="h-[250px] w-full"
              state={state}
              interval="year"
              data={{
                labels: timeseries.data.x,
                datasets: [
                  {
                    type: "bar",
                    data: timeseries.data.violent_murder,
                    label: t("crime.keys.violent_murder"),
                    backgroundColor: AKSARA_COLOR.DANGER,
                    barPercentage: 0.5,
                  },
                ],
              }}
            />
            <Timeseries
              title={t("crime.keys.violent_rape")}
              className="h-[250px] w-full"
              state={state}
              interval="year"
              data={{
                labels: timeseries.data.x,
                datasets: [
                  {
                    type: "bar",
                    data: timeseries.data.violent_rape,
                    label: t("crime.keys.violent_rape"),
                    backgroundColor: AKSARA_COLOR.DANGER,
                    barPercentage: 0.5,
                  },
                ],
              }}
            />
            <Timeseries
              title={t("crime.keys.violent_robbery")}
              className="h-[250px] w-full"
              state={state}
              interval="year"
              data={{
                labels: timeseries.data.x,
                datasets: [
                  {
                    type: "bar",
                    data: timeseries.data.violent_robbery,
                    label: t("crime.keys.violent_robbery"),
                    backgroundColor: AKSARA_COLOR.DANGER,
                    barPercentage: 0.5,
                  },
                ],
              }}
            />
            <Timeseries
              title={t("crime.keys.violent_injury")}
              className="h-[250px] w-full"
              state={state}
              interval="year"
              data={{
                labels: timeseries.data.x,
                datasets: [
                  {
                    type: "bar",
                    data: timeseries.data.violent_injury,
                    label: t("crime.keys.violent_injury"),
                    backgroundColor: AKSARA_COLOR.DANGER,
                    barPercentage: 0.5,
                  },
                ],
              }}
            />
          </div>
        </Section>

        {/*A deeper look at property crimes */}
        <Section title={t("crime.section_4.title")} description={t("crime.section_4.description")}>
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
            <Timeseries
              title={t("crime.keys.property_break_in")}
              className="h-[250px] w-full"
              state={state}
              interval="year"
              data={{
                labels: timeseries.data.x,
                datasets: [
                  {
                    type: "bar",
                    data: timeseries.data.property_break_in,
                    label: t("crime.keys.property_break_in"),
                    backgroundColor: AKSARA_COLOR.BLACK,
                    barPercentage: 0.5,
                  },
                ],
              }}
            />
            <Timeseries
              title={t("crime.keys.property_snatch")}
              className="h-[250px] w-full"
              state={state}
              interval="year"
              data={{
                labels: timeseries.data.x,
                datasets: [
                  {
                    type: "bar",
                    data: timeseries.data.property_snatch,
                    label: t("crime.keys.property_snatch"),
                    backgroundColor: AKSARA_COLOR.BLACK,
                    barPercentage: 0.5,
                  },
                ],
              }}
            />
            <Timeseries
              title={t("crime.keys.property_vehicle_lorry")}
              className="h-[250px] w-full"
              state={state}
              interval="year"
              data={{
                labels: timeseries.data.x,
                datasets: [
                  {
                    type: "bar",
                    data: timeseries.data.property_vehicle_lorry,
                    label: t("crime.keys.property_vehicle_lorry"),
                    backgroundColor: AKSARA_COLOR.BLACK,
                    barPercentage: 0.5,
                  },
                ],
              }}
            />
            <Timeseries
              title={t("crime.keys.property_vehicle_motorcar")}
              className="h-[250px] w-full"
              state={state}
              interval="year"
              data={{
                labels: timeseries.data.x,
                datasets: [
                  {
                    type: "bar",
                    data: timeseries.data.property_vehicle_motorcar,
                    label: t("crime.keys.property_vehicle_motorcar"),
                    backgroundColor: AKSARA_COLOR.BLACK,
                    barPercentage: 0.5,
                  },
                ],
              }}
            />
            <Timeseries
              title={t("crime.keys.property_vehicle_motorcycle")}
              className="h-[250px] w-full"
              state={state}
              interval="year"
              data={{
                labels: timeseries.data.x,
                datasets: [
                  {
                    type: "bar",
                    data: timeseries.data.property_vehicle_motorcycle,
                    label: t("crime.keys.property_vehicle_motorcycle"),
                    backgroundColor: AKSARA_COLOR.BLACK,
                    barPercentage: 0.5,
                  },
                ],
              }}
            />
            <Timeseries
              title={t("crime.keys.property_other")}
              className="h-[250px] w-full"
              state={state}
              interval="year"
              data={{
                labels: timeseries.data.x,
                datasets: [
                  {
                    type: "bar",
                    data: timeseries.data.property_other,
                    label: t("crime.keys.property_other"),
                    backgroundColor: AKSARA_COLOR.BLACK,
                    barPercentage: 0.5,
                  },
                ],
              }}
            />
          </div>
        </Section>
      </Container>
    </>
  );
};

export default CrimeDashboard;
