import { LineChartIcon } from "@icons/division";
import { AKSARA_COLOR } from "datagovmy-ui/constants";
import { numFormat, toDate } from "datagovmy-ui/helpers";
import { ChartDataset, ChartTypeRegistry } from "chart.js";
import { Container, Dropdown, Section, Slider, Hero, AgencyBadge } from "datagovmy-ui/components";
import { useData, useSlice, useTranslation } from "datagovmy-ui/hooks";
import dynamic from "next/dynamic";
import { FunctionComponent, useCallback, useMemo } from "react";
import { SliderProvider } from "datagovmy-ui/contexts/slider";
import { WithData } from "datagovmy-ui/types";
import { useTheme } from "next-themes";

/**
 * Composite Index Dashboard
 * @overview Status: Live
 */
const Timeseries = dynamic(() => import("datagovmy-ui/charts/timeseries"), {
  ssr: false,
});

type CompositeIndexKeys =
  | "coincident"
  | "coincident_diffusion"
  | "lagging"
  | "leading"
  | "leading_diffusion";
type CompositeIndexValues = {
  callout1: number | null;
  callout2: number | null;
  callout3: number | null;
};

interface CompositeIndexDashboardProps {
  last_updated: string;
  timeseries: WithData<{
    growth_mom: Record<
      CompositeIndexKeys | "x" | "flag_recession_business" | "flag_recession_growth",
      number[]
    >;
    growth_yoy: Record<
      CompositeIndexKeys | "x" | "flag_recession_business" | "flag_recession_growth",
      number[]
    >;
    index: Record<
      CompositeIndexKeys | "x" | "flag_recession_business" | "flag_recession_growth",
      number[]
    >;
  }>;
  timeseries_callouts: WithData<Record<CompositeIndexKeys, CompositeIndexValues>>;
}

const CompositeIndexDashboard: FunctionComponent<CompositeIndexDashboardProps> = ({
  last_updated,
  timeseries,
  timeseries_callouts,
}) => {
  const { t, i18n } = useTranslation(["dashboard-composite-index", "common"]);
  const { theme } = useTheme();

  const INDEX_OPTIONS = ["growth_yoy", "growth_mom", "index"].map((key: string) => ({
    label: t(`keys.${key}`) as string,
    value: key,
  }));
  const SHADE_OPTIONS = [
    { label: t("keys.no_shade"), value: "no_shade" },
    { label: t("keys.recession_growth"), value: "flag_recession_growth" },
    { label: t("keys.recession_business"), value: "flag_recession_business" },
  ];

  const AXIS_Y = {
    y2: {
      display: false,
      grid: {
        drawTicks: false,
        drawBorder: false,
        lineWidth: 0.5,
      },
      ticks: {
        display: false,
      },
    },
  };

  const { data, setData } = useData({
    index_type: INDEX_OPTIONS[0],
    shade_type: SHADE_OPTIONS[0],
    minmax: [
      timeseries.data[INDEX_OPTIONS[0].value].x.length - 120,
      timeseries.data[INDEX_OPTIONS[0].value].x.length - 1,
    ],
  });
  const LATEST_TIMESTAMP =
    timeseries.data[data.index_type.value].x[timeseries.data[data.index_type.value].x.length - 1];
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

  const configs = useMemo<{ unit: string; fill: boolean }>(() => {
    const unit = data.index_type.value.includes("growth") ? "%" : "";
    return {
      unit: unit,
      fill: data.shade_type.value === "no_shade",
    };
  }, [data.index_type, data.shade_type]);

  return (
    <>
      <Hero
        background="gray"
        category={[t("common:categories.economy"), "text-black dark:text-white"]}
        header={[t("header")]}
        description={[t("description")]}
        last_updated={last_updated}
        agencyBadge={
          <AgencyBadge name={t("division:bpe.full")} icon={<LineChartIcon />} isDivision />
        }
      />

      <Container className="min-h-screen">
        <SliderProvider>
          {play => (
            <>
              {/* How are the Malaysian Economic Indicators trending? */}
              <Section
                title={t("section_1.title")}
                description={
                  <p className="whitespace-pre-line text-dim">{t("section_1.description")}</p>
                }
                date={timeseries.data_as_of}
              >
                <div className="space-y-8">
                  <div className="grid grid-cols-2 gap-4 lg:flex lg:flex-row">
                    <Dropdown
                      anchor="left"
                      selected={data.index_type}
                      options={INDEX_OPTIONS}
                      onChange={(e: any) => setData("index_type", e)}
                    />
                    <Dropdown
                      options={SHADE_OPTIONS}
                      selected={data.shade_type}
                      onChange={(e: any) => setData("shade_type", e)}
                    />
                  </div>

                  <Timeseries
                    className="h-[300px] w-full"
                    title={t("keys.leading")}
                    interval="month"
                    enableAnimation={!play}
                    unitY={data.index_type.value === "index" ? "" : "%"}
                    axisY={AXIS_Y}
                    data={{
                      labels: coordinate.x,
                      datasets: [
                        {
                          type: "line",
                          data: coordinate.leading,
                          label: t("keys.leading"),
                          borderColor: AKSARA_COLOR.PRIMARY,
                          borderWidth: 1.5,
                          backgroundColor: AKSARA_COLOR.PRIMARY_H,
                          fill: configs.fill,
                        },
                        shader(data.shade_type.value),
                      ],
                    }}
                    stats={[
                      {
                        title: t("common:common.latest", {
                          date: toDate(LATEST_TIMESTAMP, "MMM yyyy", i18n.language),
                        }),
                        value: numFormat(timeseries_callouts.data.leading.callout1, "standard", 1),
                      },
                      {
                        title: t("mom_growth"),
                        value: `${numFormat(
                          timeseries_callouts.data.leading.callout2,
                          "standard",
                          1
                        )}%`,
                      },
                      {
                        title: t("yoy_growth"),
                        value: `${numFormat(
                          timeseries_callouts.data.leading.callout3,
                          "standard",
                          1
                        )}%`,
                      },
                    ]}
                  />

                  <Timeseries
                    title={t("keys.coincident")}
                    className="h-[300px] w-full"
                    interval="month"
                    unitY={data.index_type.value === "index" ? "" : "%"}
                    enableAnimation={!play}
                    axisY={AXIS_Y}
                    data={{
                      labels: coordinate.x,
                      datasets: [
                        {
                          type: "line",
                          data: coordinate.coincident,
                          label: t("keys.coincident"),
                          borderColor: AKSARA_COLOR.PRIMARY,
                          borderWidth: 1.5,
                          backgroundColor: AKSARA_COLOR.PRIMARY_H,
                          fill: configs.fill,
                        },
                        shader(data.shade_type.value),
                      ],
                    }}
                    stats={[
                      {
                        title: t("common:common.latest", {
                          date: toDate(LATEST_TIMESTAMP, "MMM yyyy", i18n.language),
                        }),
                        value: numFormat(
                          timeseries_callouts.data.coincident.callout1,
                          "standard",
                          1
                        ),
                      },
                      {
                        title: t("mom_growth"),
                        value: `${numFormat(
                          timeseries_callouts.data.coincident.callout2,
                          "standard",
                          1
                        )}%`,
                      },
                      {
                        title: t("yoy_growth"),
                        value: `${numFormat(
                          timeseries_callouts.data.coincident.callout3,
                          "standard",
                          1
                        )}%`,
                      },
                    ]}
                  />
                  <Timeseries
                    title={t("keys.lagging")}
                    className="h-[300px] w-full"
                    interval="month"
                    enableAnimation={!play}
                    unitY={data.index_type.value === "index" ? "" : "%"}
                    axisY={AXIS_Y}
                    data={{
                      labels: coordinate.x,
                      datasets: [
                        {
                          type: "line",
                          data: coordinate.lagging,
                          label: t("keys.lagging"),
                          borderColor: AKSARA_COLOR.DANGER,
                          borderWidth: 1.5,
                          backgroundColor: AKSARA_COLOR.DANGER_H,
                          fill: configs.fill,
                        },
                        shader(data.shade_type.value),
                      ],
                    }}
                    stats={[
                      {
                        title: t("common:common.latest", {
                          date: toDate(LATEST_TIMESTAMP, "MMM yyyy", i18n.language),
                        }),
                        value: numFormat(timeseries_callouts.data.lagging.callout1, "standard", 1),
                      },
                      {
                        title: t("mom_growth"),
                        value: `${numFormat(
                          timeseries_callouts.data.lagging.callout2,
                          "standard",
                          1
                        )}%`,
                      },
                      {
                        title: t("yoy_growth"),
                        value: `${numFormat(
                          timeseries_callouts.data.lagging.callout3,
                          "standard",
                          1
                        )}%`,
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
                </div>
              </Section>

              {/*Diffusion indices: A different perspective on the Malaysian Economic Indicators */}
              <Section
                title={t("section_2.title")}
                description={t("section_2.description")}
                date={timeseries.data_as_of}
              >
                <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
                  <Timeseries
                    title={t("keys.leading_diffusion")}
                    className="h-[300px] w-full"
                    interval="month"
                    enableAnimation={!play}
                    unitY="%"
                    axisY={AXIS_Y}
                    data={{
                      labels: coordinate.x,
                      datasets: [
                        {
                          type: "line",
                          label: t("keys.leading_diffusion"),
                          data: coordinate.leading_diffusion,
                          borderColor: AKSARA_COLOR.PRIMARY,
                          backgroundColor: AKSARA_COLOR.PRIMARY_H,
                          fill: configs.fill,
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
                        value: `${timeseries_callouts.data.leading_diffusion.callout1.toLocaleString()}%`,
                      },
                    ]}
                  />
                  <Timeseries
                    title={t("keys.coincident_diffusion")}
                    className="h-[300px] w-full"
                    interval="month"
                    enableAnimation={!play}
                    unitY="%"
                    axisY={AXIS_Y}
                    data={{
                      labels: coordinate.x,
                      datasets: [
                        {
                          type: "line",
                          label: t("keys.coincident_diffusion"),
                          data: coordinate.coincident_diffusion,
                          borderColor: AKSARA_COLOR.DANGER,
                          backgroundColor: AKSARA_COLOR.DANGER_H,
                          fill: configs.fill,
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
                        value: `${timeseries_callouts.data.coincident_diffusion.callout1.toLocaleString()}%`,
                      },
                    ]}
                  />
                </div>
              </Section>
            </>
          )}
        </SliderProvider>
      </Container>
    </>
  );
};

export default CompositeIndexDashboard;
