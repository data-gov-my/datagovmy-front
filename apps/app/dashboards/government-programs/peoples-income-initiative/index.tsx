import { FunctionComponent, useRef } from "react";
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
import ArrowRightIcon from "@heroicons/react/20/solid/ArrowRightIcon";
import { useData } from "@hooks/useData";
import { useSlice } from "@hooks/useSlice";
import { useTranslation } from "@hooks/useTranslation";
import { AKSARA_COLOR, CountryAndStates } from "@lib/constants";
import { getTopIndices, numFormat, toDate } from "@lib/helpers";
import { routes } from "@lib/routes";

/**
 * PeoplesIncomeInitiative Dashboard
 * @overview Status: In-development
 */

const Choropleth = dynamic(() => import("@components/Chart/Choropleth"), { ssr: false });
const Timeseries = dynamic(() => import("@components/Chart/Timeseries"), { ssr: false });

interface PeoplesIncomeInitiativeProps {
  choropleth: any;
  last_updated: any;
  params: { state: string };
  timeseries: any;
  timeseries_callout: any;
}

const PeoplesIncomeInitiative: FunctionComponent<PeoplesIncomeInitiativeProps> = ({
  choropleth,
  last_updated,
  params,
  timeseries,
  timeseries_callout,
}) => {
  const { t, i18n } = useTranslation(["dashboard-peoples-income-initiative", "common"]);
  const currentState = params.state;
  const FILTER_OPTIONS: Array<OptionType> = [
    "absolute",
    "absolute_hardcore_poor",
    "per_capita",
    "per_capita_hardcore_poor",
  ].map((key: string) => ({
    label: t(key),
    value: key,
  }));
  const { data, setData } = useData({
    minmax: [0, timeseries.data.x.length],
    filter: FILTER_OPTIONS[0],
  });
  const { coordinate } = useSlice(timeseries.data, data.minmax);
  const INITIATIVE = ["intan", "insan", "ikhsan"];
  const topStateIndices = getTopIndices(choropleth.data[data.filter.value].y.value, 3, true);
  const choroRef = useRef(null);

  return (
    <>
      <Hero
        background="gray"
        category={[t("common:categories.government_programs"), "text-black dark:text-white"]}
        header={[t("header")]}
        description={
          <>
            <p className={"text-dim xl:w-2/3"}>{t("description")}</p>
            <div className="pt-3">
              <StateDropdown url={routes.PEKA_B40} currentState={currentState} />
            </div>
          </>
        }
        agencyBadge={
          <AgencyBadge
            agency={t("common:agency.EPU")}
            link="https://www.epu.gov.my/en"
            icon={<IPREPUIcon />}
          />
        }
        last_updated={last_updated}
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
                    state: CountryAndStates[currentState],
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
                        borderColor: AKSARA_COLOR.DIM,
                        borderWidth: 1.5,
                        backgroundColor: AKSARA_COLOR.DIM_H,
                        fill: true,
                      },
                    ],
                  }}
                  stats={[
                    {
                      title: t("daily"),
                      value: `+${numFormat(
                        timeseries_callout.data.data[currentState].overall.daily.value,
                        "standard"
                      )}`,
                    },
                    {
                      title: t("total"),
                      value: numFormat(
                        timeseries_callout.data.data[currentState].overall.cumul.value,
                        "standard"
                      ),
                    },
                  ]}
                />
                <Slider
                  type="range"
                  value={data.minmax}
                  data={timeseries.data.x}
                  onChange={e => setData("minmax", e)}
                />
              </>
            )}
          </SliderProvider>
          <div className="grid grid-cols-1 gap-12 pt-8 lg:grid-cols-3">
            {INITIATIVE.map((key: string) => (
              <Timeseries
                key={""}
                title={t(key)}
                className="h-[300px] w-full"
                interval={"day"}
                data={{
                  labels: coordinate.x,
                  datasets: [
                    {
                      type: "line",
                      data: coordinate[key],
                      label: t("daily"),
                      borderColor: AKSARA_COLOR.DIM,
                      borderWidth: 1.5,
                      backgroundColor: AKSARA_COLOR.DIM_H,
                      fill: true,
                    },
                  ],
                }}
                stats={[
                  {
                    title: t("daily"),
                    value: `+${numFormat(
                      timeseries_callout.data.data[currentState][key].daily.value,
                      "standard"
                    )}`,
                  },
                  {
                    title: t("total"),
                    value: numFormat(
                      timeseries_callout.data.data[currentState][key].cumul.value,
                      "standard"
                    ),
                  },
                ]}
              />
            ))}
          </div>
        </Section>

        <Section>
          <LeftRightCard
            left={
              <div className="flex h-full w-full flex-col space-y-6 p-8">
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
                  selected={FILTER_OPTIONS.find(e => e.value === data.filter.value)}
                  onChange={e => setData("filter", e)}
                />
                <div className="flex grow flex-col justify-between space-y-6">
                  <p className="text-dim whitespace-pre-line">{t("choro_description")}</p>
                  <div className="space-y-3 border-t pt-6">
                    <p className="font-bold">{t("choro_ranking")}</p>
                    {topStateIndices.map((pos, i) => {
                      return (
                        <div className="flex space-x-3" key={pos}>
                          <div className="text-dim font-medium">#{i + 1}</div>
                          <div className="grow">
                            {CountryAndStates[choropleth.data[data.filter.value].x[pos]]}
                          </div>
                          <div className="font-bold text-[#16A34A]">
                            {data.filter.value.startsWith("absolute")
                              ? `${numFormat(
                                  choropleth.data[data.filter.value].y.value[pos],
                                  "standard"
                                )}`
                              : `${numFormat(
                                  choropleth.data[data.filter.value].y.value[pos],
                                  "compact",
                                  [2, 2]
                                )}%`}
                          </div>
                          <ArrowRightIcon className="text-dim h-4 w-4 self-center stroke-[1.5px]" />
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            }
            right={
              <Choropleth
                _ref={choroRef}
                className="h-[400px] w-auto rounded-b lg:h-[500px] lg:w-full"
                color="greens"
                data={{
                  labels: choropleth.data[data.filter.value].x.map(
                    (state: string) => CountryAndStates[state]
                  ),
                  values: choropleth.data[data.filter.value].y.value,
                }}
                unit={data.filter.value.startsWith("absolute") ? "" : "%"}
                type="state"
              />
            }
          ></LeftRightCard>
        </Section>
      </Container>
    </>
  );
};

export default PeoplesIncomeInitiative;
