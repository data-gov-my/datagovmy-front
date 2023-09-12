import { routes } from "@lib/routes";
import {
  AgencyBadge,
  Container,
  Hero,
  Section,
  StateDropdown,
  Tabs,
  Slider,
  LeftRightCard,
} from "datagovmy-ui/components";
import { AKSARA_COLOR, CountryAndStates } from "datagovmy-ui/constants";
import { SliderProvider } from "datagovmy-ui/contexts/slider";
import { getTopIndices, numFormat, toDate } from "datagovmy-ui/helpers";
import { useTranslation, useData, useSlice } from "datagovmy-ui/hooks";
import { TimeseriesOption } from "datagovmy-ui/types";
import dynamic from "next/dynamic";
import { FunctionComponent } from "react";

/**
 * PekaB40 Dashboard
 * @overview Status: In-development
 */

const Timeseries = dynamic(() => import("datagovmy-ui/charts/timeseries"), { ssr: false });
const Choropleth = dynamic(() => import("datagovmy-ui/charts/choropleth"), { ssr: false });

interface PekaB40Props {
  last_updated: string;
  params: { state: string };
  timeseries: any;
  choropleth: any;
}

const PekaB40: FunctionComponent<PekaB40Props> = ({
  params,
  last_updated,
  timeseries,
  choropleth,
}) => {
  const { t, i18n } = useTranslation(["dashboard-peka-b40", "common"]);
  const currentState = params.state;
  const { data, setData } = useData({
    minmax: [timeseries.data.daily.x.length - 366, timeseries.data.daily.x.length - 1],
    period: "auto",
    periodly: "daily_7d",
    tab_index: 0,
  });

  const config: { [key: string]: TimeseriesOption } = {
    0: {
      period: "auto",
      periodly: "daily_7d",
    },
    1: {
      period: "auto",
      periodly: "daily",
    },
    2: {
      period: "month",
      periodly: "monthly",
    },
    3: {
      period: "year",
      periodly: "yearly",
    },
  };

  const { coordinate } = useSlice(timeseries.data[data.periodly], data.minmax);
  const topStateIndices = getTopIndices(choropleth.data.y.perc, choropleth.data.y.length, true);

  return (
    <>
      <Hero
        background="purple"
        category={[t("common:categories.healthcare"), "text-purple"]}
        header={[t("header")]}
        description={[t("description")]}
        action={<StateDropdown url={routes.PEKA_B40} currentState={currentState} />}
        last_updated={last_updated}
        agencyBadge={<AgencyBadge agency="phcorp" />}
      />

      <Container className="min-h-screen">
        {/* What are the latest screening trends in Malaysia? */}
        <Section
          title={t("screening_header", {
            state: CountryAndStates[currentState],
          })}
          description={t("screening_description")}
          date={timeseries.data_as_of}
        >
          <SliderProvider>
            {play => (
              <>
                <Timeseries
                  className="h-[300px]"
                  title={t("timeseries_title", {
                    state: CountryAndStates[currentState],
                    context: data.periodly,
                  })}
                  menu={
                    <Tabs.List
                      options={[
                        t("common:time.daily_7d"),
                        t("common:time.daily"),
                        t("common:time.monthly"),
                        t("common:time.yearly"),
                      ]}
                      current={data.tab_index}
                      onChange={index => {
                        setData("tab_index", index);
                        setData("minmax", [
                          0,
                          timeseries.data[config[index].periodly].x.length - 1,
                        ]);
                        setData("period", config[index].period);
                        setData("periodly", config[index].periodly);
                      }}
                    />
                  }
                  interval={data.period}
                  enableAnimation={!play}
                  data={{
                    labels: coordinate.x,
                    datasets: [
                      {
                        type: "line",
                        data: coordinate.y,
                        label: t(`common:time.${data.periodly}`),
                        borderColor: AKSARA_COLOR.PURPLE,
                        borderWidth: 1.5,
                        backgroundColor: AKSARA_COLOR.PURPLE_H,
                        fill: true,
                      },
                    ],
                  }}
                />
                <Slider
                  type="range"
                  period={data.period}
                  value={data.minmax}
                  data={timeseries.data[data.periodly].x}
                  onChange={e => setData("minmax", e)}
                />
              </>
            )}
          </SliderProvider>
        </Section>

        {/* How do screening rates differ across the country? */}
        <Section>
          <LeftRightCard
            left={
              <div className="flex h-[600px] w-full flex-col overflow-hidden p-6 lg:p-8">
                <div className="space-y-6">
                  <div className="flex flex-col gap-2">
                    <h4>{t("choro_header")}</h4>
                    <span className="text-dim text-sm">
                      {t("common:common.data_of", {
                        date: toDate(choropleth.data_as_of, "dd MMM yyyy, HH:mm", i18n.language),
                      })}
                    </span>
                  </div>
                  <p className="text-dim whitespace-pre-line">{t("choro_desc")}</p>
                  <p className="border-outline dark:border-washed-dark border-t pb-3 pt-6 font-bold">
                    {t("choro_ranking")}
                  </p>
                </div>
                <div className="space-y-3 overflow-auto">
                  {topStateIndices.map((pos, i) => {
                    return (
                      <div className="mr-4.5 flex space-x-3" key={pos}>
                        <div className="text-dim font-medium">#{i + 1}</div>
                        <div className="grow">{CountryAndStates[choropleth.data.x[pos]]}</div>
                        <div className="text-purple font-bold">
                          {`${numFormat(choropleth.data.y.perc[pos], "standard", [2, 2])}%`}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            }
            right={
              <Choropleth
                className="h-[400px] w-auto rounded-b lg:h-[600px] lg:w-full"
                color="purples"
                data={{
                  labels: choropleth.data.x.map((state: string) => CountryAndStates[state]),
                  values: choropleth.data.y.perc,
                }}
                unit="%"
                type="state"
              />
            }
          />
        </Section>
      </Container>
    </>
  );
};

export default PekaB40;
