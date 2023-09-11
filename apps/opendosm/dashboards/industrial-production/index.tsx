import { ToolsIcon } from "@icons/division";
import { ChartDataset, ChartTypeRegistry } from "chart.js";
import { Container, Dropdown, Section, Slider, Hero, AgencyBadge } from "datagovmy-ui/components";
import { AKSARA_COLOR } from "datagovmy-ui/constants";
import { SliderProvider } from "datagovmy-ui/contexts/slider";
import { numFormat, toDate } from "datagovmy-ui/helpers";
import { useSlice, useData, useTranslation } from "datagovmy-ui/hooks";
import { OptionType, WithData } from "datagovmy-ui/types";
import dynamic from "next/dynamic";
import { FunctionComponent, useCallback, useMemo } from "react";
import { useTheme } from "next-themes";

/**
 * Industrial Production Dashboard
 * @overview Status: Live
 */

const Timeseries = dynamic(() => import("datagovmy-ui/charts/timeseries"), {
  ssr: false,
});

type IndustrialProductionKeys =
  | "electric"
  | "mfg_electric"
  | "mfg_food"
  | "mfg_metal"
  | "mfg_petroleum"
  | "mfg_textiles"
  | "mfg_transport"
  | "mfg_wood"
  | "mining"
  | "overall";

interface IndustrialProductionDashboardProps {
  last_updated: string;
  timeseries: WithData<{
    growth_momsa: Record<IndustrialProductionKeys | "x" | "recession", number[]>;
    growth_yoy: Record<IndustrialProductionKeys | "x" | "recession", number[]>;
    index: Record<IndustrialProductionKeys | "x" | "recession", number[]>;
    index_sa: Record<IndustrialProductionKeys | "x" | "recession", number[]>;
  }>;
  timeseries_callouts: WithData<Record<IndustrialProductionKeys, { callout: number }>>;
}

const IndustrialProductionDashboard: FunctionComponent<IndustrialProductionDashboardProps> = ({
  last_updated,
  timeseries,
  timeseries_callouts,
}) => {
  const { t, i18n } = useTranslation(["dashboard-industrial-production", "common"]);
  const { theme } = useTheme();

  const INDICES = ["growth_yoy", "growth_momsa", "index_sa", "index"];
  const INDEX_OPTIONS: Array<OptionType> = INDICES.map((key: string) => ({
    label: t(`keys.${key}`),
    value: key,
  }));
  const SHADE_OPTIONS: Array<OptionType> = [
    { label: t("keys.no_shade"), value: "no_shade" },
    { label: t("keys.recession"), value: "recession" },
  ];

  const AXIS_Y = {
    y2: {
      display: false,
      grid: {
        drawTicks: false,
        drawBorder: false,
      },
      ticks: {
        display: false,
      },
    },
  };

  const { data, setData } = useData({
    index_type: INDEX_OPTIONS[0],
    shade_type: SHADE_OPTIONS[0],
    minmax: [0, timeseries.data[INDEX_OPTIONS[0].value].x.length - 1],
  });

  const LATEST_TIMESTAMP = useMemo(
    () =>
      timeseries.data[data.index_type.value].x[timeseries.data[data.index_type.value].x.length - 1],
    [data.index_type]
  );
  const { coordinate } = useSlice(timeseries.data[data.index_type.value], data.minmax);

  const shader = useCallback<(key: string) => ChartDataset<keyof ChartTypeRegistry, any[]>>(
    (key: string) => {
      if (key === "no_shade")
        return {
          data: [],
        };

      return {
        type: "line",
        data: coordinate[key],
        backgroundColor: theme === "light" ? AKSARA_COLOR.BLACK_H : AKSARA_COLOR.WASHED_DARK,
        borderWidth: 0,
        fill: true,
        yAxisID: "y2",
        stepped: true,
      };
    },
    [data, theme]
  );

  const configs = useCallback<(key: string) => { unit: string; callout: string; fill: boolean }>(
    (key: string) => {
      const unit = data.index_type.value.includes("growth") ? "%" : "";
      return {
        unit: unit,
        callout: [
          numFormat(timeseries_callouts.data[data.index_type.value][key].callout, "standard", 1),
          unit,
        ].join(""),
        fill: data.shade_type.value === "no_shade",
      };
    },
    [data.index_type, data.shade_type]
  );

  return (
    <>
      <Hero
        background="red"
        category={[t("common:categories.economy"), "text-danger"]}
        header={[t("header")]}
        description={[t("description")]}
        last_updated={last_updated}
        agencyBadge={
          <AgencyBadge name={t("division:bppib.full")} icon={<ToolsIcon />} isDivision />
        }
      />

      <Container className="min-h-screen">
        {/* How are the Malaysian Economic Indicators trending? */}
        <SliderProvider>
          {play => (
            <>
              <Section title={t("section_1.title")} date={timeseries.data_as_of}>
                <div className="space-y-8">
                  <div className="grid grid-cols-2 gap-4 lg:flex lg:flex-row">
                    <Dropdown
                      anchor="left"
                      selected={data.index_type}
                      options={INDEX_OPTIONS}
                      onChange={(e: any) => setData("index_type", e)}
                    />
                    <Dropdown
                      anchor="left"
                      options={SHADE_OPTIONS}
                      selected={data.shade_type}
                      onChange={(e: any) => setData("shade_type", e)}
                    />
                  </div>

                  <Timeseries
                    className="h-[300px] w-full"
                    title={t("keys.overall")}
                    interval="month"
                    enableAnimation={!play}
                    unitY={configs("overall").unit}
                    axisY={AXIS_Y}
                    data={{
                      labels: coordinate.x,
                      datasets: [
                        {
                          type: "line",
                          data: coordinate.overall,
                          label: t("keys.overall"),
                          borderColor: AKSARA_COLOR.DANGER,
                          borderWidth: 1.5,
                          backgroundColor: AKSARA_COLOR.DANGER_H,
                          fill: configs("overall").fill,
                        },
                        shader(data.shade_type.value),
                      ],
                    }}
                    stats={[
                      {
                        title: t("common:common.latest", {
                          date: toDate(LATEST_TIMESTAMP, "MMM yyyy", i18n.language),
                        }),
                        value: configs("overall").callout,
                      },
                    ]}
                  />

                  <Slider
                    className=""
                    type="range"
                    value={data.minmax}
                    data={timeseries.data[data.index_type.value].x}
                    period="month"
                    onChange={e => setData("minmax", e)}
                  />

                  <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
                    <Timeseries
                      title={t("keys.mining")}
                      className="h-[300px] w-full"
                      interval="month"
                      enableAnimation={!play}
                      unitY={configs("mining").unit}
                      axisY={AXIS_Y}
                      data={{
                        labels: coordinate.x,
                        datasets: [
                          {
                            type: "line",
                            label: t("keys.mining"),
                            data: coordinate.mining,
                            borderColor: AKSARA_COLOR.DANGER,
                            backgroundColor: AKSARA_COLOR.DANGER_H,
                            fill: configs("mining").fill,
                            borderWidth: 1.5,
                          },
                          shader(data.shade_type.value),
                        ],
                      }}
                      stats={[
                        {
                          title: t("common:common.latest", {
                            date: toDate(LATEST_TIMESTAMP, "MMM yyyy", i18n.language),
                          }),
                          value: configs("mining").callout,
                        },
                      ]}
                    />
                    <Timeseries
                      title={t("keys.mfg")}
                      className="h-[300px] w-full"
                      interval="month"
                      enableAnimation={!play}
                      unitY={configs("mfg").unit}
                      axisY={AXIS_Y}
                      data={{
                        labels: coordinate.x,
                        datasets: [
                          {
                            type: "line",
                            label: t("keys.mfg"),
                            data: coordinate.mfg,
                            borderColor: AKSARA_COLOR.DANGER,
                            backgroundColor: AKSARA_COLOR.DANGER_H,
                            fill: configs("mfg").fill,
                            borderWidth: 1.5,
                          },
                          shader(data.shade_type.value),
                        ],
                      }}
                      stats={[
                        {
                          title: t("common:common.latest", {
                            date: toDate(LATEST_TIMESTAMP, "MMM yyyy", i18n.language),
                          }),
                          value: configs("mfg").callout,
                        },
                      ]}
                    />
                    <Timeseries
                      title={t("keys.electric")}
                      className="h-[300px] w-full"
                      interval="month"
                      enableAnimation={!play}
                      unitY={configs("electric").unit}
                      axisY={AXIS_Y}
                      data={{
                        labels: coordinate.x,
                        datasets: [
                          {
                            type: "line",
                            label: t("keys.electric"),
                            data: coordinate.electric,
                            borderColor: AKSARA_COLOR.DANGER,
                            backgroundColor: AKSARA_COLOR.DANGER_H,
                            fill: configs("electric").fill,
                            borderWidth: 1.5,
                          },
                          shader(data.shade_type.value),
                        ],
                      }}
                      stats={[
                        {
                          title: t("common:common.latest", {
                            date: toDate(LATEST_TIMESTAMP, "MMM yyyy", i18n.language),
                          }),
                          value: configs("electric").callout,
                        },
                      ]}
                    />
                  </div>
                </div>
              </Section>

              {/* A deeper look at key manufacturing sub-sectors */}
              {!["growth_momsa", "index_sa"].includes(data.index_type.value) && (
                <Section title={t("section_2.title")} date={timeseries.data_as_of}>
                  <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
                    <Timeseries
                      title={t("keys.mfg_food")}
                      className="h-[300px] w-full"
                      interval="month"
                      enableAnimation={!play}
                      unitY={configs("mfg_food").unit}
                      axisY={AXIS_Y}
                      data={{
                        labels: coordinate.x,
                        datasets: [
                          {
                            type: "line",
                            label: t("keys.mfg_food"),
                            data: coordinate.mining,
                            borderColor: AKSARA_COLOR.DANGER,
                            backgroundColor: AKSARA_COLOR.DANGER_H,
                            fill: configs("mfg_food").fill,
                            borderWidth: 1.5,
                          },
                          shader(data.shade_type.value),
                        ],
                      }}
                      stats={[
                        {
                          title: t("common:common.latest", {
                            date: toDate(LATEST_TIMESTAMP, "MMM yyyy", i18n.language),
                          }),
                          value: configs("mfg_food").callout,
                        },
                      ]}
                    />
                    <Timeseries
                      title={t("keys.mfg_textiles")}
                      className="h-[300px] w-full"
                      interval="month"
                      enableAnimation={!play}
                      unitY={configs("mfg_textiles").unit}
                      axisY={AXIS_Y}
                      data={{
                        labels: coordinate.x,
                        datasets: [
                          {
                            type: "line",
                            label: t("keys.mfg_textiles"),
                            data: coordinate.mfg_textiles,
                            borderColor: AKSARA_COLOR.DANGER,
                            backgroundColor: AKSARA_COLOR.DANGER_H,
                            fill: configs("mfg_textiles").fill,
                            borderWidth: 1.5,
                          },
                          shader(data.shade_type.value),
                        ],
                      }}
                      stats={[
                        {
                          title: t("common:common.latest", {
                            date: toDate(LATEST_TIMESTAMP, "MMM yyyy", i18n.language),
                          }),
                          value: configs("mfg_textiles").callout,
                        },
                      ]}
                    />
                    <Timeseries
                      title={t("keys.mfg_wood")}
                      className="h-[300px] w-full"
                      interval="month"
                      enableAnimation={!play}
                      unitY={configs("mfg_wood").unit}
                      axisY={AXIS_Y}
                      data={{
                        labels: coordinate.x,
                        datasets: [
                          {
                            type: "line",
                            label: t("keys.mfg_wood"),
                            data: coordinate.mfg_wood,
                            borderColor: AKSARA_COLOR.DANGER,
                            backgroundColor: AKSARA_COLOR.DANGER_H,
                            fill: configs("mfg_wood").fill,
                            borderWidth: 1.5,
                          },
                          shader(data.shade_type.value),
                        ],
                      }}
                      stats={[
                        {
                          title: t("common:common.latest", {
                            date: toDate(LATEST_TIMESTAMP, "MMM yyyy", i18n.language),
                          }),
                          value: configs("mfg_wood").callout,
                        },
                      ]}
                    />
                    <Timeseries
                      title={t("keys.mfg_petroleum")}
                      className="h-[300px] w-full"
                      interval="month"
                      enableAnimation={!play}
                      unitY={configs("mfg_petroleum").unit}
                      axisY={AXIS_Y}
                      data={{
                        labels: coordinate.x,
                        datasets: [
                          {
                            type: "line",
                            label: t("keys.mfg_petroleum"),
                            data: coordinate.mfg_petroleum,
                            borderColor: AKSARA_COLOR.DANGER,
                            backgroundColor: AKSARA_COLOR.DANGER_H,
                            fill: configs("mfg_petroleum").fill,
                            borderWidth: 1.5,
                          },
                          shader(data.shade_type.value),
                        ],
                      }}
                      stats={[
                        {
                          title: t("common:common.latest", {
                            date: toDate(LATEST_TIMESTAMP, "MMM yyyy", i18n.language),
                          }),
                          value: configs("mfg_petroleum").callout,
                        },
                      ]}
                    />
                    <Timeseries
                      title={t("keys.mfg_electric")}
                      className="h-[300px] w-full"
                      interval="month"
                      enableAnimation={!play}
                      unitY={configs("mfg_electric").unit}
                      axisY={AXIS_Y}
                      data={{
                        labels: coordinate.x,
                        datasets: [
                          {
                            type: "line",
                            label: t("keys.mfg_electric"),
                            data: coordinate.mfg_electric,
                            borderColor: AKSARA_COLOR.DANGER,
                            backgroundColor: AKSARA_COLOR.DANGER_H,
                            fill: configs("mfg_petroleum").fill,
                            borderWidth: 1.5,
                          },
                          shader(data.shade_type.value),
                        ],
                      }}
                      stats={[
                        {
                          title: t("common:common.latest", {
                            date: toDate(LATEST_TIMESTAMP, "MMM yyyy", i18n.language),
                          }),
                          value: configs("mfg_electric").callout,
                        },
                      ]}
                    />
                    <Timeseries
                      title={t("keys.mfg_transport")}
                      className="h-[300px] w-full"
                      interval="month"
                      enableAnimation={!play}
                      unitY={configs("mfg_transport").unit}
                      axisY={AXIS_Y}
                      data={{
                        labels: coordinate.x,
                        datasets: [
                          {
                            type: "line",
                            label: t("keys.mfg_transport"),
                            data: coordinate.mfg_transport,
                            borderColor: AKSARA_COLOR.DANGER,
                            backgroundColor: AKSARA_COLOR.DANGER_H,
                            fill: configs("mfg_transport").fill,
                            borderWidth: 1.5,
                          },
                          shader(data.shade_type.value),
                        ],
                      }}
                      stats={[
                        {
                          title: t("common:common.latest", {
                            date: toDate(LATEST_TIMESTAMP, "MMM yyyy", i18n.language),
                          }),
                          value: configs("mfg_transport").callout,
                        },
                      ]}
                    />
                  </div>
                </Section>
              )}
            </>
          )}
        </SliderProvider>
      </Container>
    </>
  );
};

export default IndustrialProductionDashboard;
