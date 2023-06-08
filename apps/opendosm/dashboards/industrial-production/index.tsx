import { Container, Dropdown, Hero, Section } from "@components/index";
import Slider from "@components/Chart/Slider";
import { FunctionComponent, useCallback, useEffect, useMemo } from "react";
import dynamic from "next/dynamic";
import { numFormat, toDate } from "@lib/helpers";
import { useTranslation } from "@hooks/useTranslation";
import { useSlice } from "@hooks/useSlice";
import { useData } from "@hooks/useData";
import type { OptionType } from "@components/types";
import { AKSARA_COLOR } from "@lib/constants";
import type { ChartDatasetProperties, ChartTypeRegistry } from "chart.js";
import { track } from "@lib/mixpanel";
import { routes } from "@lib/routes";
import { useWatch } from "@hooks/useWatch";

/**
 * Industrial Production Dashboard
 * @overview Status: Live
 */

const Timeseries = dynamic(() => import("@components/Chart/Timeseries"), { ssr: false });

interface IndustrialProductionDashboardProps {
  last_updated: number;
  timeseries: any;
  timeseries_callouts: any;
}

const IndustrialProductionDashboard: FunctionComponent<IndustrialProductionDashboardProps> = ({
  last_updated,
  timeseries,
  timeseries_callouts,
}) => {
  const { t, i18n } = useTranslation();
  const sortedIndices = ["growth_yoy", "growth_momsa", "index_sa", "index"];
  const INDEX_OPTIONS: Array<OptionType> = sortedIndices.map((key: string) => ({
    label: t(`industry.keys.${key}`),
    value: key,
  }));
  const SHADE_OPTIONS: Array<OptionType> = [
    { label: t("industry.keys.no_shade"), value: "no_shade" },
    { label: t("industry.keys.recession"), value: "recession" },
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

  const shader = useCallback<
    (key: string) => ChartDatasetProperties<keyof ChartTypeRegistry, any[]>
  >(
    (key: string) => {
      if (key === "no_shade")
        return {
          data: [],
        };

      return {
        type: "line",
        data: coordinate[key],
        backgroundColor: AKSARA_COLOR.BLACK_H,
        borderWidth: 0,
        fill: true,
        yAxisID: "y2",
        stepped: true,
      };
    },
    [data]
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

  useEffect(() => {
    track("page_view", {
      type: "dashboard",
      id: "industry.header",
      name_en: "Industrial Production",
      name_bm: "Pengeluaran Perindustrian",
      route: routes.INDUSTRIAL_PRODUCTION,
    });
  }, []);

  useWatch(() => {
    setData("minmax", [0, timeseries.data[data.index_type.value].x.length - 1]);
  }, [data.index_type]);

  return (
    <>
      <Hero background="industrial-production-banner">
        <div className="space-y-4 xl:w-2/3">
          <span className="text-sm font-bold uppercase tracking-widest text-primary">
            {t("nav.megamenu.categories.economy")}
          </span>
          <h3>{t("industry.header")}</h3>
          <p className="text-dim">{t("industry.description")}</p>

          <p className="text-sm text-dim">
            {t("common.last_updated", {
              date: toDate(last_updated, "dd MMM yyyy, HH:mm", i18n.language),
            })}
          </p>
        </div>
      </Hero>

      <Container className="min-h-screen">
        {/* How are the Malaysian Economic Indicators trending? */}
        <Section title={t("industry.section_1.title")} date={timeseries.data_as_of}>
          <div className="space-y-8">
            <div className="grid grid-cols-2 gap-4 lg:flex lg:flex-row">
              <Dropdown
                anchor="left"
                selected={data.index_type}
                options={INDEX_OPTIONS}
                onChange={e => setData("index_type", e)}
              />
              <Dropdown
                anchor="left"
                options={SHADE_OPTIONS}
                selected={data.shade_type}
                onChange={e => setData("shade_type", e)}
              />
            </div>

            <Slider
              type="range"
              value={data.minmax}
              data={timeseries.data[data.index_type.value].x}
              period="month"
              onChange={e => setData("minmax", e)}
            />
            <Timeseries
              className="h-[350px] w-full"
              title={t("industry.keys.overall")}
              interval="month"
              unitY={configs("overall").unit}
              axisY={AXIS_Y}
              data={{
                labels: coordinate.x,
                datasets: [
                  {
                    type: "line",
                    data: coordinate.overall,
                    label: t("industry.keys.overall"),
                    borderColor: AKSARA_COLOR.PRIMARY,
                    borderWidth: 1.5,
                    backgroundColor: AKSARA_COLOR.PRIMARY_H,
                    fill: configs("overall").fill,
                  },
                  shader(data.shade_type.value),
                ],
              }}
              stats={[
                {
                  title: t("common.latest", {
                    date: toDate(LATEST_TIMESTAMP, "MMM yyyy", i18n.language),
                  }),
                  value: configs("overall").callout,
                },
              ]}
            />

            <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
              <Timeseries
                title={t("industry.keys.mining")}
                className="h-[350px] w-full"
                interval="month"
                unitY={configs("mining").unit}
                axisY={AXIS_Y}
                data={{
                  labels: coordinate.x,
                  datasets: [
                    {
                      type: "line",
                      label: t("industry.keys.mining"),
                      data: coordinate.mining,
                      borderColor: AKSARA_COLOR.PRIMARY,
                      backgroundColor: AKSARA_COLOR.PRIMARY_H,
                      fill: configs("mining").fill,
                      borderWidth: 1.5,
                    },
                    shader(data.shade_type.value),
                  ],
                }}
                stats={[
                  {
                    title: t("common.latest", {
                      date: toDate(LATEST_TIMESTAMP, "MMM yyyy", i18n.language),
                    }),
                    value: configs("mining").callout,
                  },
                ]}
              />
              <Timeseries
                title={t("industry.keys.mfg")}
                className="h-[350px] w-full"
                interval="month"
                unitY={configs("mfg").unit}
                axisY={AXIS_Y}
                data={{
                  labels: coordinate.x,
                  datasets: [
                    {
                      type: "line",
                      label: t("industry.keys.mfg"),
                      data: coordinate.mfg,
                      borderColor: AKSARA_COLOR.PRIMARY,
                      backgroundColor: AKSARA_COLOR.PRIMARY_H,
                      fill: configs("mfg").fill,
                      borderWidth: 1.5,
                    },
                    shader(data.shade_type.value),
                  ],
                }}
                stats={[
                  {
                    title: t("common.latest", {
                      date: toDate(LATEST_TIMESTAMP, "MMM yyyy", i18n.language),
                    }),
                    value: configs("mfg").callout,
                  },
                ]}
              />
              <Timeseries
                title={t("industry.keys.electric")}
                className="h-[350px] w-full"
                interval="month"
                unitY={configs("electric").unit}
                axisY={AXIS_Y}
                data={{
                  labels: coordinate.x,
                  datasets: [
                    {
                      type: "line",
                      label: t("industry.keys.electric"),
                      data: coordinate.electric,
                      borderColor: AKSARA_COLOR.PRIMARY,
                      backgroundColor: AKSARA_COLOR.PRIMARY_H,
                      fill: configs("electric").fill,
                      borderWidth: 1.5,
                    },
                    shader(data.shade_type.value),
                  ],
                }}
                stats={[
                  {
                    title: t("common.latest", {
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
          <Section title={t("industry.section_2.title")} date={timeseries.data_as_of}>
            <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
              <Timeseries
                title={t("industry.keys.mfg_food")}
                className="h-[350px] w-full"
                interval="month"
                unitY={configs("mfg_food").unit}
                axisY={AXIS_Y}
                data={{
                  labels: coordinate.x,
                  datasets: [
                    {
                      type: "line",
                      label: t("industry.keys.mfg_food"),
                      data: coordinate.mining,
                      borderColor: AKSARA_COLOR.DIM,
                      backgroundColor: AKSARA_COLOR.DIM_H,
                      fill: configs("mfg_food").fill,
                      borderWidth: 1.5,
                    },
                    shader(data.shade_type.value),
                  ],
                }}
                stats={[
                  {
                    title: t("common.latest", {
                      date: toDate(LATEST_TIMESTAMP, "MMM yyyy", i18n.language),
                    }),
                    value: configs("mfg_food").callout,
                  },
                ]}
              />
              <Timeseries
                title={t("industry.keys.mfg_textiles")}
                className="h-[350px] w-full"
                interval="month"
                unitY={configs("mfg_textiles").unit}
                axisY={AXIS_Y}
                data={{
                  labels: coordinate.x,
                  datasets: [
                    {
                      type: "line",
                      label: t("industry.keys.mfg_textiles"),
                      data: coordinate.mfg_textiles,
                      borderColor: AKSARA_COLOR.DIM,
                      backgroundColor: AKSARA_COLOR.DIM_H,
                      fill: configs("mfg_textiles").fill,
                      borderWidth: 1.5,
                    },
                    shader(data.shade_type.value),
                  ],
                }}
                stats={[
                  {
                    title: t("common.latest", {
                      date: toDate(LATEST_TIMESTAMP, "MMM yyyy", i18n.language),
                    }),
                    value: configs("mfg_textiles").callout,
                  },
                ]}
              />
              <Timeseries
                title={t("industry.keys.mfg_wood")}
                className="h-[350px] w-full"
                interval="month"
                unitY={configs("mfg_wood").unit}
                axisY={AXIS_Y}
                data={{
                  labels: coordinate.x,
                  datasets: [
                    {
                      type: "line",
                      label: t("industry.keys.mfg_wood"),
                      data: coordinate.mfg_wood,
                      borderColor: AKSARA_COLOR.DIM,
                      backgroundColor: AKSARA_COLOR.DIM_H,
                      fill: configs("mfg_wood").fill,
                      borderWidth: 1.5,
                    },
                    shader(data.shade_type.value),
                  ],
                }}
                stats={[
                  {
                    title: t("common.latest", {
                      date: toDate(LATEST_TIMESTAMP, "MMM yyyy", i18n.language),
                    }),
                    value: configs("mfg_wood").callout,
                  },
                ]}
              />
              <Timeseries
                title={t("industry.keys.mfg_petroleum")}
                className="h-[350px] w-full"
                interval="month"
                unitY={configs("mfg_petroleum").unit}
                axisY={AXIS_Y}
                data={{
                  labels: coordinate.x,
                  datasets: [
                    {
                      type: "line",
                      label: t("industry.keys.mfg_petroleum"),
                      data: coordinate.mfg_petroleum,
                      borderColor: AKSARA_COLOR.DIM,
                      backgroundColor: AKSARA_COLOR.DIM_H,
                      fill: configs("mfg_petroleum").fill,
                      borderWidth: 1.5,
                    },
                    shader(data.shade_type.value),
                  ],
                }}
                stats={[
                  {
                    title: t("common.latest", {
                      date: toDate(LATEST_TIMESTAMP, "MMM yyyy", i18n.language),
                    }),
                    value: configs("mfg_petroleum").callout,
                  },
                ]}
              />
              <Timeseries
                title={t("industry.keys.mfg_electric")}
                className="h-[350px] w-full"
                interval="month"
                unitY={configs("mfg_electric").unit}
                axisY={AXIS_Y}
                data={{
                  labels: coordinate.x,
                  datasets: [
                    {
                      type: "line",
                      label: t("industry.keys.mfg_electric"),
                      data: coordinate.mfg_electric,
                      borderColor: AKSARA_COLOR.DIM,
                      backgroundColor: AKSARA_COLOR.DIM_H,
                      fill: configs("mfg_petroleum").fill,
                      borderWidth: 1.5,
                    },
                    shader(data.shade_type.value),
                  ],
                }}
                stats={[
                  {
                    title: t("common.latest", {
                      date: toDate(LATEST_TIMESTAMP, "MMM yyyy", i18n.language),
                    }),
                    value: configs("mfg_electric").callout,
                  },
                ]}
              />
              <Timeseries
                title={t("industry.keys.mfg_transport")}
                className="h-[350px] w-full"
                interval="month"
                unitY={configs("mfg_transport").unit}
                axisY={AXIS_Y}
                data={{
                  labels: coordinate.x,
                  datasets: [
                    {
                      type: "line",
                      label: t("industry.keys.mfg_transport"),
                      data: coordinate.mfg_transport,
                      borderColor: AKSARA_COLOR.DIM,
                      backgroundColor: AKSARA_COLOR.DIM_H,
                      fill: configs("mfg_transport").fill,
                      borderWidth: 1.5,
                    },
                    shader(data.shade_type.value),
                  ],
                }}
                stats={[
                  {
                    title: t("common.latest", {
                      date: toDate(LATEST_TIMESTAMP, "MMM yyyy", i18n.language),
                    }),
                    value: configs("mfg_transport").callout,
                  },
                ]}
              />
            </div>
          </Section>
        )}
      </Container>
    </>
  );
};

export default IndustrialProductionDashboard;
