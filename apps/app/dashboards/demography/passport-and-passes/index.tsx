import {
  AgencyBadge,
  Container,
  Dropdown,
  Hero,
  LeftRightCard,
  RankList,
  Section,
  Slider,
  Tabs,
} from "datagovmy-ui/components";
import { AKSARA_COLOR, CountryAndStates } from "datagovmy-ui/constants";
import { SliderProvider } from "datagovmy-ui/contexts/slider";
import { numFormat, toDate, snakeCase } from "datagovmy-ui/helpers";
import { useData, useSlice, useTranslation } from "datagovmy-ui/hooks";
import { OptionType, WithData } from "datagovmy-ui/types";
import dynamic from "next/dynamic";
import { FunctionComponent } from "react";
import { Periods } from "datagovmy-ui/charts/timeseries";

type PassportKeys = "x" | "passport" | "expatriate" | "visit" | "entry";

interface PassportAndPassesProps {
  last_updated: string;
  choropleth: WithData<{
    absolute: {
      x: string[];
      y: { value: number[] };
    };
  }>;
  timeseries: WithData<Record<"day" | "month" | "year", Record<PassportKeys, number[]>>>;
  timeseries_callout: WithData<
    Record<Exclude<PassportKeys, "x">, Record<"active" | "daily" | "year", { value: number }>>
  >;
}

const Choropleth = dynamic(() => import("datagovmy-ui/charts/choropleth"), { ssr: false });
const Timeseries = dynamic(() => import("datagovmy-ui/charts/timeseries"), { ssr: false });

const PassportAndPasses: FunctionComponent<PassportAndPassesProps> = ({
  last_updated,
  choropleth,
  timeseries,
  timeseries_callout,
}) => {
  const { t, i18n } = useTranslation(["dashboard-passport-and-passes", "common"]);
  const CHORO_OPTIIONS: OptionType[] = Object.keys(choropleth.data).map(key => {
    return { label: t(`keys.${key}`), value: key };
  });
  const PERIODS = ["day", "month", "year"];

  const { data, setData } = useData({
    tab: 0,
    filter: CHORO_OPTIIONS[0].value,
    minmax: [0, timeseries.data.day.x.length - 1],
  });

  const { coordinate } = useSlice(
    timeseries.data[PERIODS[data.tab] as keyof typeof timeseries.data],
    data.minmax
  );

  const plotTimeseries = (charts: Exclude<PassportKeys, "x">[], play: boolean) => {
    return charts.map(name => {
      const {
        title,
        label,
        data: datum,
        stats,
      } = {
        title: t(`keys.${name}`),
        label: t(`keys.${name}`),
        data: coordinate[name],
        stats: [
          {
            title: t("keys.daily"),
            value: `${timeseries_callout.data[name].daily.value > 0 ? "+" : ""}${numFormat(
              timeseries_callout.data[name].daily.value,
              "standard"
            )}`,
          },
          {
            title: t("keys.yearly"),
            value: numFormat(timeseries_callout.data[name].year.value, "standard"),
          },
          {
            title: t("keys.active"),
            value: numFormat(timeseries_callout.data[name].active.value, "standard"),
          },
        ],
      };

      return (
        <Timeseries
          id={snakeCase(title)}
          key={title}
          title={title}
          className="h-[300px]"
          isLoading={data.loading}
          enableAnimation={!play}
          enableMajorTick
          displayType="standard"
          precision={[1, 0]}
          interval={PERIODS[data.tab] as Periods}
          data={{
            labels: coordinate.x,
            datasets: [
              {
                type: "line",
                label,
                data: datum,
                backgroundColor: AKSARA_COLOR.PURPLE_H,
                borderColor: AKSARA_COLOR.PURPLE,
                fill: true,
                borderWidth: coordinate.x.length > 500 ? 1 : 1.5,
              },
            ],
          }}
          stats={stats}
        />
      );
    });
  };

  return (
    <>
      <Hero
        background="purple"
        category={[t("common:categories.public_administration"), "text-purple"]}
        header={[t("header")]}
        description={[t("description")]}
        last_updated={last_updated}
        agencyBadge={<AgencyBadge agency="imigresen" />}
      />

      <Container className="min-h-screen">
        {/* How many Malaysians have an active passport? */}
        <Section>
          <LeftRightCard
            left={
              <div className="flex h-[600px] w-full flex-col overflow-hidden p-6 lg:p-8">
                <div className="space-y-6 pb-6">
                  <div className="flex flex-col gap-2">
                    <h4>{t("section_1.title")}</h4>
                    <span className="text-dim text-sm">
                      {t("common:common.data_of", {
                        date: toDate(choropleth.data_as_of, "dd MMM yyyy, HH:mm", i18n.language),
                      })}
                    </span>
                  </div>
                  <Dropdown
                    anchor="left"
                    className="w-fit"
                    options={CHORO_OPTIIONS}
                    selected={CHORO_OPTIIONS.find(e => e.value === data.filter)}
                    onChange={e => setData("filter", e.value)}
                  />
                  <p className="text-dim">{t("section_1.description")}</p>
                </div>
                <RankList
                  id="active-passport-by-state"
                  title={t("common:common.ranking", {
                    count: choropleth.data[data.filter as keyof typeof choropleth.data].x.length,
                  })}
                  data={choropleth.data[data.filter as keyof typeof choropleth.data].y.value}
                  color="text-purple"
                  threshold={choropleth.data[data.filter as keyof typeof choropleth.data].x.length}
                  format={(position: number) => {
                    return {
                      label:
                        CountryAndStates[
                          choropleth.data[data.filter as keyof typeof choropleth.data].x[position]
                        ],
                      value: numFormat(
                        choropleth.data[data.filter as keyof typeof choropleth.data].y.value[
                          position
                        ],
                        "standard"
                      ),
                    };
                  }}
                />
              </div>
            }
            right={
              <Choropleth
                id="active-passport"
                className="h-[400px] w-auto rounded-b lg:h-[600px]"
                data={{
                  labels: choropleth.data[data.filter as keyof typeof choropleth.data].x.map(
                    (state: string) => CountryAndStates[state]
                  ),
                  values: choropleth.data[data.filter as keyof typeof choropleth.data].y.value,
                }}
                type="state"
                color="purples"
              />
            }
          />
        </Section>

        {/* How are the Immigration Department’s counter operations trending? */}
        <Section
          title={t("section_2.title")}
          description={t("section_2.description")}
          date={timeseries.data_as_of}
          menu={
            <Tabs.List
              options={[t("common:time.daily"), t("common:time.monthly"), t("common:time.yearly")]}
              current={data.tab}
              onChange={index => setData("tab", index)}
            />
          }
        >
          <SliderProvider>
            {play => (
              <div className="space-y-8">
                <div>{plotTimeseries(["passport"], play)}</div>
                <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                  {plotTimeseries(["expatriate", "visit", "entry"], play)}
                </div>
                <Slider
                  className="pt-0"
                  type="range"
                  period={PERIODS[data.tab] as keyof typeof timeseries.data}
                  value={data.minmax}
                  data={timeseries.data[PERIODS[data.tab] as keyof typeof timeseries.data].x}
                  onChange={e => setData("minmax", e)}
                />
              </div>
            )}
          </SliderProvider>
        </Section>
      </Container>
    </>
  );
};

export default PassportAndPasses;
