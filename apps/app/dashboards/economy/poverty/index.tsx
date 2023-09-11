import { HeatmapData, HeatmapDatum } from "datagovmy-ui/charts/heatmap";
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
import { numFormat, toDate } from "datagovmy-ui/helpers";
import { useData, useSlice, useTranslation } from "datagovmy-ui/hooks";
import { OptionType } from "datagovmy-ui/types";
import dynamic from "next/dynamic";
import { FunctionComponent, useMemo } from "react";

/**
 * Poverty Dashboard
 * @overview Status: Live
 */

const Choropleth = dynamic(() => import("datagovmy-ui/charts/choropleth"), { ssr: false });
const Heatmap = dynamic(() => import("datagovmy-ui/charts/heatmap"), { ssr: false });
const Timeseries = dynamic(() => import("datagovmy-ui/charts/timeseries"), { ssr: false });

interface PovertyProps {
  choropleth: any;
  heatmap: any;
  last_updated: string;
  timeseries: any;
  timeseries_callout: any;
}

const Poverty: FunctionComponent<PovertyProps> = ({
  choropleth,
  heatmap,
  last_updated,
  timeseries,
  timeseries_callout,
}) => {
  const { t, i18n } = useTranslation(["dashboard-poverty", "common"]);

  const AREA_OPTIONS: Array<OptionType> = ["state", "district"].map((key: string) => ({
    label: t(key),
    value: key,
  }));
  const FILTER_OPTIONS: Array<OptionType> = [
    { label: t("poverty_rate"), value: "poor_capita" },
    { label: t("hardcore_poverty_rate"), value: "hardcore_poor_capita" },
    { label: t("num_poor"), value: "poor" },
    { label: t("num_hardcore_poor"), value: "hardcore_poor" },
  ];

  const { data, setData } = useData({
    area: "state",
    filter: "poor",
    minmax: [0, timeseries.data.x.length - 1],
    tab_index: 0,
  });
  const { coordinate } = useSlice(timeseries.data, data.minmax);

  const _data = useMemo<HeatmapData>(() => {
    return heatmap.data[data.tab_index === 0 ? "capita" : "absolute"].map((item: HeatmapDatum) => ({
      x: t(`${item.x}`),
      y: CountryAndStates[item.y],
      z: item.z && data.tab_index === 0 ? numFormat(item.z, "standard", [1, 1]) : item.z,
    }));
  }, [data.tab_index]);

  return (
    <>
      <Hero
        background="gray"
        category={[t("common:categories.economy"), "text-black dark:text-white"]}
        header={[t("header")]}
        description={[t("description")]}
        agencyBadge={<AgencyBadge agency="icu-jpm" />}
      />

      <Container className="min-h-screen">
        <Section title={t("poverty_changes")} date={last_updated}>
          <SliderProvider>
            {play => (
              <>
                <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
                  <Timeseries
                    id="timeseries-poverty"
                    className="h-[300px]"
                    title={t("<RM1000/month")}
                    enableAnimation={!play}
                    interval={"auto"}
                    data={{
                      labels: coordinate.x,
                      datasets: [
                        {
                          type: "line",
                          data: coordinate.poor,
                          label: t("total"),
                          borderColor: AKSARA_COLOR.DIM,
                          borderWidth: 1.5,
                          backgroundColor: AKSARA_COLOR.DIM_H,
                          fill: true,
                        },
                      ],
                    }}
                    stats={[
                      {
                        title: t("common:common.latest", {
                          date: toDate(timeseries.data_as_of, "MMM yyyy", i18n.language),
                        }),
                        value: numFormat(timeseries_callout.data.poor.total.value, "standard"),
                      },
                      {
                        title: t("poverty_rate"),
                        value: `${numFormat(
                          timeseries_callout.data.poor.rate.value,
                          "standard",
                          [1, 1]
                        )}%`,
                      },
                    ]}
                  />
                  <Timeseries
                    id="timeseries-hardcore-poverty"
                    className="h-[300px]"
                    title={t("<RM560/month")}
                    enableAnimation={!play}
                    interval={"auto"}
                    data={{
                      labels: coordinate.x,
                      datasets: [
                        {
                          type: "line",
                          data: coordinate.hardcore_poor,
                          label: t("total"),
                          borderColor: AKSARA_COLOR.DIM,
                          borderWidth: 1.5,
                          backgroundColor: AKSARA_COLOR.DIM_H,
                          fill: true,
                        },
                      ],
                    }}
                    stats={[
                      {
                        title: t("common:common.latest", {
                          date: toDate(timeseries.data_as_of, "MMM yyyy", i18n.language),
                        }),
                        value: numFormat(
                          timeseries_callout.data.hardcore_poor.total.value,
                          "standard"
                        ),
                      },
                      {
                        title: t("hardcore_poverty_rate"),
                        value: `${numFormat(
                          timeseries_callout.data.hardcore_poor.rate.value,
                          "standard",
                          [1, 1]
                        )}%`,
                      },
                    ]}
                  />
                </div>
                <Slider
                  type="range"
                  value={data.minmax}
                  data={timeseries.data.x}
                  onChange={e => setData("minmax", e)}
                />
              </>
            )}
          </SliderProvider>
        </Section>

        <Section>
          <LeftRightCard
            left={
              <div className="flex h-[600px] w-full flex-col overflow-hidden p-6 lg:p-8">
                <div className="space-y-6 pb-6">
                  <div className="flex flex-col gap-2">
                    <h4>{t("poverty_by_state")}</h4>
                    <span className="text-dim text-sm">
                      {t("common:common.data_of", {
                        date: toDate(
                          choropleth.state.data_as_of,
                          "dd MMM yyyy, HH:mm",
                          i18n.language
                        ),
                      })}
                    </span>
                  </div>
                  <p className="text-dim whitespace-pre-line">{t("based_on_address")}</p>
                  <div className="flex space-x-3">
                    <Dropdown
                      width="w-full"
                      anchor="left"
                      placeholder={t("common:common.select")}
                      options={AREA_OPTIONS}
                      selected={AREA_OPTIONS.find(e => e.value === data.area)}
                      onChange={e => {
                        setData("area", e.value);
                      }}
                    />
                    <Dropdown
                      width="w-full"
                      anchor="left"
                      placeholder={t("common:common.select")}
                      options={FILTER_OPTIONS}
                      selected={FILTER_OPTIONS.find(e => e.value === data.filter)}
                      onChange={e => setData("filter", e.value)}
                    />
                  </div>
                </div>
                <RankList
                  id="poverty-by-area"
                  title={t("common:common.ranking", { count: choropleth[data.area].data.x.length })}
                  data={choropleth[data.area].data.y[data.filter]}
                  color="text-danger"
                  threshold={choropleth[data.area].data.y[data.filter].length}
                  format={(position: number) => {
                    return {
                      label:
                        data.area === "state"
                          ? CountryAndStates[choropleth[data.area].data.x[position]]
                          : choropleth[data.area].data.x[position],
                      value:
                        `${numFormat(
                          choropleth[data.area].data.y[data.filter][position],
                          "standard",
                          data.filter.endsWith("capita") ? [1, 1] : [0, 0]
                        )}` + (data.filter.endsWith("capita") ? "%" : ""),
                    };
                  }}
                />
              </div>
            }
            right={
              <Choropleth
                id="choropleth-rate"
                className="h-[400px] w-auto lg:h-[600px]"
                color="reds"
                data={{
                  labels: choropleth[data.area].data.x.map((area: string) =>
                    data.area === "state" ? CountryAndStates[area] : area
                  ),
                  values: choropleth[data.area].data.y[data.filter],
                }}
                unit={data.filter.endsWith("capita") ? "%" : ""}
                type={data.area === "state" ? "state" : "district"}
              />
            }
          />
        </Section>
        <Section
          title={t("poverty_by_ethnic")}
          description={t("based_on_household")}
          date={heatmap.data_as_of}
          menu={
            <Tabs.List
              options={[t("per_capita"), t("absolute")]}
              current={data.tab_index}
              onChange={index => {
                setData("tab_index", index);
              }}
            />
          }
        >
          <Heatmap
            className="flex h-full lg:justify-center"
            height={600}
            color="reds"
            data={_data}
            precision={data.tab_index === 0 ? [1, 1] : [0, 0]}
          />
        </Section>
      </Container>
    </>
  );
};

export default Poverty;
