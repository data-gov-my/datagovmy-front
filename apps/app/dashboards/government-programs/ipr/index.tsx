import { FunctionComponent } from "react";
import dynamic from "next/dynamic";
import {
  AgencyBadge,
  Container,
  Dropdown,
  Hero,
  LeftRightCard,
  Section,
  StateDropdown,
} from "@components/index";
import { IPREPUIcon } from "@components/Icon/agency";
import Slider from "@components/Chart/Slider";
import { SliderProvider } from "@components/Chart/Slider/context";
import { OptionType } from "@components/types";
import { useData } from "@hooks/useData";
import { useSlice } from "@hooks/useSlice";
import { useTranslation } from "@hooks/useTranslation";
import { AKSARA_COLOR, CountryAndStates } from "@lib/constants";
import { getTopIndices, numFormat, toDate } from "@lib/helpers";
import { routes } from "@lib/routes";

/**
 * IPR (Inisiatif Pendapatan Rakyat) Dashboard
 * @overview Status: In-development
 */

const Choropleth = dynamic(() => import("@components/Chart/Choropleth"), { ssr: false });
const Timeseries = dynamic(() => import("@components/Chart/Timeseries"), { ssr: false });

interface IPRProps {
  choropleth: any;
  last_updated: string;
  params: { state: string };
  timeseries: any;
  timeseries_callout: any;
}

const IPR: FunctionComponent<IPRProps> = ({
  choropleth,
  last_updated,
  params,
  timeseries,
  timeseries_callout,
}) => {
  const { t, i18n } = useTranslation(["dashboard-ipr", "common"]);
  const FILTER_OPTIONS: Array<OptionType> = [
    "absolute",
    // "absolute_hardcore_poor",
    // "per_capita",
    // "per_capita_hardcore_poor",
  ].map((key: string) => ({
    label: t(key),
    value: key,
  }));
  const { data, setData } = useData({
    minmax: [0, timeseries.data.x.length - 1],
    filter: "absolute",
  });
  const { coordinate } = useSlice(timeseries.data, data.minmax);
  const topStateIndices = getTopIndices(
    choropleth.data[data.filter].y.value,
    choropleth.data[data.filter].y.length,
    true
  );

  return (
    <>
      <Hero
        background="gray"
        category={[t("common:categories.government_programs"), "text-black dark:text-white"]}
        header={[t("header")]}
        description={[t("description")]}
        action={<StateDropdown url={routes.IPR} currentState={params.state} />}
        last_updated={last_updated}
        agencyBadge={
          <AgencyBadge
            agency={t("agencies:epu.full")}
            link="https://www.epu.gov.my/en"
            icon={<IPREPUIcon />}
          />
        }
      />

      <Container className="min-h-screen">
        {/* How strong is the take-up of IPR among the rakyat? */}
        <Section title={t("takeup_header")} date={timeseries.data_as_of}>
          <SliderProvider>
            {play => (
              <>
                <Timeseries
                  className="h-[300px] w-full"
                  title={t("timeseries_title", {
                    state: CountryAndStates[params.state],
                  })}
                  enableAnimation={!play}
                  interval="day"
                  data={{
                    labels: coordinate.x,
                    datasets: [
                      {
                        type: "line",
                        data: coordinate.overall,
                        label: t("daily"),
                        fill: true,
                        backgroundColor: AKSARA_COLOR.DIM_H,
                        borderColor: AKSARA_COLOR.DIM,
                        borderWidth: 1.5,
                      },
                    ],
                  }}
                  stats={[
                    {
                      title: t("daily"),
                      value: `+${numFormat(timeseries_callout.overall.daily.value, "standard")}`,
                    },
                    {
                      title: t("total"),
                      value: numFormat(timeseries_callout.overall.cumul.value, "standard"),
                    },
                  ]}
                />
                <Slider
                  type="range"
                  value={data.minmax}
                  data={timeseries.data.x}
                  onChange={e => setData("minmax", e)}
                />
                <div className="grid grid-cols-1 gap-6 pt-12 lg:grid-cols-3 lg:gap-12">
                  {["intan", "insan", "ikhsan"].map((key: string) => (
                    <Timeseries
                      key={key}
                      title={t(key)}
                      className="h-[300px] w-full"
                      enableAnimation={!play}
                      interval={"day"}
                      data={{
                        labels: coordinate.x,
                        datasets: [
                          {
                            type: "line",
                            data: coordinate[key],
                            label: t("daily"),
                            fill: true,
                            backgroundColor: AKSARA_COLOR.DIM_H,
                            borderColor: AKSARA_COLOR.DIM,
                            borderWidth: 1.5,
                          },
                        ],
                      }}
                      stats={[
                        {
                          title: t("daily"),
                          value: `+${numFormat(timeseries_callout[key].daily.value, "standard")}`,
                        },
                        {
                          title: t("total"),
                          value: numFormat(timeseries_callout[key].cumul.value, "standard"),
                        },
                      ]}
                    />
                  ))}
                </div>
              </>
            )}
          </SliderProvider>
        </Section>

        <Section>
          <LeftRightCard
            left={
              <div className="flex h-[600px] w-full flex-col space-y-3 overflow-hidden p-6 lg:p-8">
                <div className="space-y-6">
                  <div className="flex flex-col gap-2">
                    <h4>{t("choro_header")}</h4>
                    <span className="text-dim text-sm">
                      {t("common:common.data_of", {
                        date: toDate(choropleth.data_as_of, "dd MMM yyyy, HH:mm", i18n.language),
                      })}
                    </span>
                  </div>
                  <Dropdown
                    anchor="left"
                    width="w-fit"
                    placeholder={t("common:common.select")}
                    options={FILTER_OPTIONS}
                    selected={FILTER_OPTIONS.find(e => e.value === data.filter)}
                    onChange={e => setData("filter", e.value)}
                  />
                  <p className="text-dim whitespace-pre-line">{t("choro_description")}</p>
                  <div className="border-outline dark:border-dim border-t pt-6">
                    <p className="font-bold">{t("choro_ranking")}</p>
                  </div>
                </div>
                <div className="space-y-3 overflow-auto">
                  {topStateIndices.map((pos, i) => {
                    return (
                      <div className="mr-4.5 flex space-x-3" key={pos}>
                        <div className="text-dim font-medium">#{i + 1}</div>
                        <div className="grow">
                          {CountryAndStates[choropleth.data[data.filter].x[pos]]}
                        </div>
                        <div className="font-bold">
                          {data.filter.startsWith("absolute")
                            ? `${numFormat(choropleth.data[data.filter].y.value[pos], "standard")}`
                            : `${numFormat(
                                choropleth.data[data.filter].y.value[pos],
                                "compact",
                                [2, 2]
                              )}%`}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            }
            right={
              <Choropleth
                className="h-[400px] w-auto rounded-b lg:h-[600px]"
                color="greys"
                data={{
                  labels: choropleth.data[data.filter].x.map(
                    (state: string) => CountryAndStates[state]
                  ),
                  values: choropleth.data[data.filter].y.value,
                }}
                unit={data.filter.startsWith("absolute") ? "" : "%"}
                type="state"
              />
            }
          ></LeftRightCard>
        </Section>
      </Container>
    </>
  );
};

export default IPR;
