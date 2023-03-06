import { Container, Dropdown, Hero, Section } from "@components/index";
import { FunctionComponent, useCallback, useEffect, useMemo } from "react";
import dynamic from "next/dynamic";
import { numFormat, toDate } from "@lib/helpers";
import { useTranslation } from "@hooks/useTranslation";
import { useSlice } from "@hooks/useSlice";
import { useData } from "@hooks/useData";
import type { OptionType } from "@components/types";
import { AKSARA_COLOR } from "@lib/constants";
import type { ChartDatasetProperties, ChartTypeRegistry } from "chart.js";
import Slider from "@components/Chart/Slider";
import { track } from "@lib/mixpanel";
import { routes } from "@lib/routes";
import { useWatch } from "@hooks/useWatch";

/**
 * Composite Index Dashboard
 * @overview Status: Live
 */
const Timeseries = dynamic(() => import("@components/Chart/Timeseries"), { ssr: false });

interface CompositeIndexDashboardProps {
  last_updated: number;
  timeseries: any;
  timeseries_callouts: any;
}

const CompositeIndexDashboard: FunctionComponent<CompositeIndexDashboardProps> = ({
  last_updated,
  timeseries,
  timeseries_callouts,
}) => {
  const { t, i18n } = useTranslation();
  const INDEX_OPTIONS: Array<OptionType> = ["growth_yoy", "growth_mom", "index"].map(
    (key: string) => ({
      label: t(`compositeindex.keys.${key}`),
      value: key,
    })
  );
  const SHADE_OPTIONS: Array<OptionType> = [
    { label: t("compositeindex.keys.no_shade"), value: "no_shade" },
    { label: t("compositeindex.keys.recession_growth"), value: "flag_recession_growth" },
    { label: t("compositeindex.keys.recession_business"), value: "flag_recession_business" },
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

  useEffect(() => {
    track("page_view", {
      type: "dashboard",
      id: "compositeindex.header",
      name_en: "Composite Index",
      name_bm: "Indeks Komposit",
      route: routes.COMPOSITE_INDEX,
    });
  }, []);

  useWatch(() => {
    setData("minmax", [0, timeseries.data[data.index_type.value].x.length - 1]);
  }, [data.index_type]);

  const configs = useMemo<{ unit: string; fill: boolean }>(() => {
    const unit = data.index_type.value.includes("growth") ? "%" : "";
    return {
      unit: unit,
      fill: data.shade_type.value === "no_shade",
    };
  }, [data.index_type, data.shade_type]);

  return (
    <>
      <Hero background="composite-index-banner">
        <div className="space-y-4 xl:w-2/3">
          <span className="text-sm font-bold uppercase tracking-widest text-blue-300">
            {t("nav.megamenu.categories.economy")}
          </span>
          <h3 className="text-white">{t("compositeindex.header")}</h3>
          <p className="text-white">{t("compositeindex.description")}</p>

          <p className="text-sm text-white">
            {t("common.last_updated", {
              date: toDate(last_updated, "dd MMM yyyy, HH:mm", i18n.language),
            })}
          </p>
        </div>
      </Hero>

      <Container className="min-h-screen">
        {/* How are the Malaysian Economic Indicators trending? */}
        <Section
          title={t("compositeindex.section_1.title")}
          description={
            <p className="whitespace-pre-line text-dim">
              {t("compositeindex.section_1.description")}
            </p>
          }
          date={timeseries.data_as_of}
        >
          <div className="space-y-8">
            <div className="grid grid-cols-2 gap-4 lg:flex lg:flex-row">
              <Dropdown
                anchor="left"
                selected={data.index_type}
                options={INDEX_OPTIONS}
                onChange={e => setData("index_type", e)}
              />
              <Dropdown
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
              onChange={(e: [number, number]) => setData("minmax", e)}
            />
            <Timeseries
              className="h-[350px] w-full"
              title={t("compositeindex.keys.leading")}
              interval="month"
              unitY={data.index_type.value === "index" ? "" : "%"}
              axisY={AXIS_Y}
              data={{
                labels: coordinate.x,
                datasets: [
                  {
                    type: "line",
                    data: coordinate.leading,
                    label: t("compositeindex.keys.leading"),
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
                  title: t("common.latest", {
                    date: toDate(LATEST_TIMESTAMP, "MMM yyyy", i18n.language),
                  }),
                  value: numFormat(timeseries_callouts.data.leading.callout1, "standard"),
                },
                {
                  title: t("compositeindex.mom_growth"),
                  value: `${numFormat(timeseries_callouts.data.leading.callout2, "standard")}%`,
                },
                {
                  title: t("compositeindex.yoy_growth"),
                  value: `${numFormat(timeseries_callouts.data.leading.callout3, "standard")}%`,
                },
              ]}
            />

            <Timeseries
              title={t("compositeindex.keys.coincident")}
              className="h-[350px] w-full"
              interval="month"
              unitY={data.index_type.value === "index" ? "" : "%"}
              axisY={AXIS_Y}
              data={{
                labels: coordinate.x,
                datasets: [
                  {
                    type: "line",
                    data: coordinate.coincident,
                    label: t("compositeindex.keys.coincident"),
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
                  title: t("common.latest", {
                    date: toDate(LATEST_TIMESTAMP, "MMM yyyy", i18n.language),
                  }),
                  value: numFormat(timeseries_callouts.data.coincident.callout1, "standard"),
                },
                {
                  title: t("compositeindex.mom_growth"),
                  value: `${numFormat(timeseries_callouts.data.coincident.callout2, "standard")}%`,
                },
                {
                  title: t("compositeindex.yoy_growth"),
                  value: `${numFormat(timeseries_callouts.data.coincident.callout3, "standard")}%`,
                },
              ]}
            />
            <Timeseries
              title={t("compositeindex.keys.lagging")}
              className="h-[350px] w-full"
              interval="month"
              unitY={data.index_type.value === "index" ? "" : "%"}
              axisY={AXIS_Y}
              data={{
                labels: coordinate.x,
                datasets: [
                  {
                    type: "line",
                    data: coordinate.lagging,
                    label: t("compositeindex.keys.lagging"),
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
                  title: t("common.latest", {
                    date: toDate(LATEST_TIMESTAMP, "MMM yyyy", i18n.language),
                  }),
                  value: numFormat(timeseries_callouts.data.lagging.callout1, "standard"),
                },
                {
                  title: t("compositeindex.mom_growth"),
                  value: `${numFormat(timeseries_callouts.data.lagging.callout2, "standard")}%`,
                },
                {
                  title: t("compositeindex.yoy_growth"),
                  value: `${numFormat(timeseries_callouts.data.lagging.callout3, "standard")}%`,
                },
              ]}
            />
          </div>
        </Section>

        {/*Diffusion indices: A different perspective on the Malaysian Economic Indicators */}
        <Section
          title={t("compositeindex.section_2.title")}
          description={t("compositeindex.section_2.description")}
          date={timeseries.data_as_of}
        >
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
            <Timeseries
              title={t("compositeindex.keys.leading_diffusion")}
              className="h-[350px] w-full"
              interval="month"
              unitY="%"
              axisY={AXIS_Y}
              data={{
                labels: coordinate.x,
                datasets: [
                  {
                    type: "line",
                    label: t("compositeindex.keys.leading_diffusion"),
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
                  title: t("common.latest", {
                    date: toDate(LATEST_TIMESTAMP, "MMM yyyy", i18n.language),
                  }),
                  value: `${timeseries_callouts.data.leading_diffusion.callout1.toLocaleString()}%`,
                },
              ]}
            />
            <Timeseries
              title={t("compositeindex.keys.coincident_diffusion")}
              className="h-[350px] w-full"
              interval="month"
              unitY="%"
              axisY={AXIS_Y}
              data={{
                labels: coordinate.x,
                datasets: [
                  {
                    type: "line",
                    label: t("compositeindex.keys.coincident_diffusion"),
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
                  title: t("common.latest", {
                    date: toDate(LATEST_TIMESTAMP, "MMM yyyy", i18n.language),
                  }),
                  value: `${timeseries_callouts.data.coincident_diffusion.callout1.toLocaleString()}%`,
                },
              ]}
            />
          </div>
        </Section>
      </Container>
    </>
  );
};

export default CompositeIndexDashboard;
