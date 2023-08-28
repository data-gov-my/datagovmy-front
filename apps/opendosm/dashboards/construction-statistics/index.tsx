import { ChartDataset, ChartTypeRegistry } from "chart.js";
import { AgencyBadge, Container, Dropdown, Hero, Section, Slider } from "datagovmy-ui/components";
import { AKSARA_COLOR } from "datagovmy-ui/constants";
import { SliderProvider } from "datagovmy-ui/contexts/slider";
import { numFormat, toDate } from "datagovmy-ui/helpers";
import { useData, useSlice, useTranslation } from "datagovmy-ui/hooks";
import { BOMBAIcon } from "datagovmy-ui/icons/agency";
import { WithData } from "datagovmy-ui/types";
import dynamic from "next/dynamic";
import { FunctionComponent, useCallback } from "react";

/**
 * Construction Statistics Dashboard
 * @overview Status: Live
 */
const Timeseries = dynamic(() => import("datagovmy-ui/charts/timeseries"), {
  ssr: false,
});

type StatKeys = "projects" | "value";
type SectorKeys = "government" | "private" | "publiccorp";
type ProjectKeys = "civileng" | "non_residential" | "residential" | "total";
type Callout = { latest: number };

interface ConstructionStatisticsDashboardProps {
  last_updated: string;
  timeseries: WithData<{
    actual: Record<StatKeys | "x" | "recession", number[]>;
    growth_qoq: Record<StatKeys | "x" | "recession", number[]>;
    growth_yoy: Record<StatKeys | "x" | "recession", number[]>;
  }>;
  timeseries_callout: WithData<{
    actual: Record<StatKeys, Callout>;
    growth_qoq: Record<StatKeys, Callout>;
    growth_yoy: Record<StatKeys, Callout>;
  }>;
  projowner: WithData<
    Record<
      SectorKeys,
      Record<"growth_qoq" | "growth_yoy" | "value", Record<ProjectKeys | "x", number[]>>
    >
  >;
  projowner_callout: WithData<
    Record<SectorKeys, Record<"growth_qoq" | "growth_yoy" | "value", Record<ProjectKeys, Callout>>>
  >;
}

const ConstructionStatisticsDashboard: FunctionComponent<ConstructionStatisticsDashboardProps> = ({
  last_updated,
  timeseries,
  timeseries_callout,
  projowner,
  projowner_callout,
}) => {
  const { t, i18n } = useTranslation(["dashboard-construction-statistics", "common"]);

  const INDEX_OPTIONS = ["actual", "growth_qoq", "growth_yoy"].map((key: string) => ({
    label: t(key) as string,
    value: key,
  }));
  const SECTOR_OPTIONS = ["government", "private", "publiccorp"].map((key: string) => ({
    label: t(key) as string,
    value: key,
  }));
  const VALUE_OPTIONS = ["value", "growth_qoq", "growth_yoy"].map((key: string) => ({
    label: t(key) as string,
    value: key,
  }));
  const SHADE_OPTIONS = [
    { label: t("no_shade"), value: "no_shade" },
    { label: t("recession"), value: "recession" },
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
    index: INDEX_OPTIONS[0].value,
    value: VALUE_OPTIONS[0].value,
    sector: SECTOR_OPTIONS[0].value,
    shade: SHADE_OPTIONS[0].value,
    minmax: [0, timeseries.data.actual.x.length - 1],
    projowner_minmax: [0, projowner.data.government.value.x.length - 1],
    tab_index: 0,
  });

  const LATEST_TIMESTAMP = timeseries.data[data.index].x[timeseries.data[data.index].x.length - 1];
  const PROJOWNER_LATEST_TIMESTAMP =
    projowner.data[data.sector][data.value].x[projowner.data[data.sector][data.value].x.length - 1];
  const { coordinate } = useSlice(timeseries.data[data.index], data.minmax);
  const { coordinate: projowner_coords } = useSlice(
    projowner.data.government[data.value],
    data.minmax
  );

  const shader = useCallback<(key: string) => ChartDataset<keyof ChartTypeRegistry, any[]>>(
    (key: string) => {
      if (key === "no_shade")
        return {
          data: [],
        };

      return {
        type: "line",
        data: coordinate[key],
        backgroundColor: AKSARA_COLOR.DANGER_H,
        borderWidth: 0,
        fill: true,
        yAxisID: "y2",
        stepped: true,
      };
    },
    [data]
  );

  const fill = data.shade === "no_shade";
  const isActual = data.index === "actual";
  const isValue = data.value === "value";
  const displayNumFormat = (value: number) =>
    numFormat(value, "compact", 1, "long", i18n.language, true);

  const getCallout = (value: number, isNotGrowth: boolean) => {
    const prefix = isNotGrowth ? "RM " : "";
    const unit = isNotGrowth ? "" : "%";
    const callout = isNotGrowth
      ? `${prefix} ${numFormat(value, "compact", 1, "long", i18n.language, false)}${unit}`
      : `${prefix} ${numFormat(value, "standard", 1)}${unit}`;
    return callout;
  };

  return (
    <>
      <Hero
        background="red"
        category={[t("common:categories.construction"), "text-danger"]}
        header={[t("header")]}
        description={[t("description")]}
        last_updated={last_updated}
        agencyBadge={
          <AgencyBadge icon={<BOMBAIcon />} name={t(`agencies:bppib.full`)} prefix={true} />
        }
      />

      <Container className="min-h-screen">
        {/* How are key construction statistics trending? */}
        <Section
          title={t("section_1.title")}
          description={
            <div className="flex gap-3">
              <Dropdown
                anchor="left"
                selected={INDEX_OPTIONS.find(e => e.value === data.index)}
                options={INDEX_OPTIONS}
                onChange={e => setData("index", e.value)}
              />
              <Dropdown
                anchor="left"
                selected={SHADE_OPTIONS.find(e => e.value === data.shade)}
                options={SHADE_OPTIONS}
                onChange={e => setData("shade", e.value)}
              />
            </div>
          }
          date={timeseries.data_as_of}
        >
          <SliderProvider>
            {play => (
              <>
                <div className="grid grid-cols-1 gap-12 sm:grid-cols-2">
                  {/* Number of Projects */}
                  <Timeseries
                    title={t("num_projects")}
                    className="h-[300px] w-full"
                    interval="quarter"
                    enableAnimation={!play}
                    unitY={isActual ? "" : "%"}
                    precision={isActual ? 0 : 1}
                    axisY={AXIS_Y}
                    data={{
                      labels: coordinate.x,
                      datasets: [
                        {
                          type: "line",
                          label: t("num_projects"),
                          data: coordinate.projects,
                          borderColor: AKSARA_COLOR.DANGER,
                          backgroundColor: AKSARA_COLOR.DANGER_H,
                          fill: fill,
                          borderWidth: 1.5,
                        },
                        shader(data.shade),
                      ],
                    }}
                    stats={[
                      {
                        title: t("common:common.latest", {
                          date: toDate(LATEST_TIMESTAMP, "qQ yyyy", i18n.language),
                        }),
                        value: `${numFormat(
                          timeseries_callout.data[data.index].projects.latest,
                          "standard",
                          isActual ? 0 : 1
                        )}${isActual ? ` ${t("projects")}` : "%"}`,
                      },
                    ]}
                  />
                  {/* Value of Work Done */}
                  <Timeseries
                    title={t("value")}
                    className="h-[300px] w-full"
                    interval="quarter"
                    enableAnimation={!play}
                    prefixY={isActual ? "RM " : ""}
                    unitY={isActual ? "" : "%"}
                    displayNumFormat={value => displayNumFormat(value)}
                    axisY={AXIS_Y}
                    data={{
                      labels: coordinate.x,
                      datasets: [
                        {
                          type: "line",
                          label: t("value"),
                          data: coordinate.value,
                          borderColor: AKSARA_COLOR.DANGER,
                          backgroundColor: AKSARA_COLOR.DANGER_H,
                          fill: fill,
                          borderWidth: 1.5,
                        },
                        shader(data.shade),
                      ],
                    }}
                    stats={[
                      {
                        title: t("common:common.latest", {
                          date: toDate(LATEST_TIMESTAMP, "qQ yyyy", i18n.language),
                        }),
                        value: getCallout(
                          timeseries_callout.data[data.index].value.latest,
                          isActual
                        ),
                      },
                    ]}
                  />
                </div>
                <Slider
                  type="range"
                  value={data.minmax}
                  data={timeseries.data[data.index].x}
                  period="quarter"
                  onChange={e => setData("minmax", e)}
                />
              </>
            )}
          </SliderProvider>
        </Section>

        {/* A deeper look at construction activity by project owner and sub-sector */}
        <Section
          title={t("section_2.title")}
          description={
            <div className="flex flex-wrap gap-2 sm:gap-3">
              <Dropdown
                width="w-fit"
                anchor="left"
                selected={SECTOR_OPTIONS.find(e => e.value === data.sector)}
                options={SECTOR_OPTIONS}
                onChange={e => setData("sector", e.value)}
              />
              <Dropdown
                width="w-fit"
                anchor="left"
                selected={VALUE_OPTIONS.find(e => e.value === data.value)}
                options={VALUE_OPTIONS}
                onChange={e => setData("value", e.value)}
              />
              <Dropdown
                width="w-fit"
                anchor="right"
                selected={SHADE_OPTIONS.find(e => e.value === data.shade)}
                options={SHADE_OPTIONS}
                onChange={e => setData("shade", e.value)}
              />
            </div>
          }
          date={timeseries.data_as_of}
        >
          <SliderProvider>
            {play => (
              <>
                {/* All Construction Activity */}
                <Timeseries
                  className="h-[300px]"
                  title={t("section_2.total")}
                  enableAnimation={!play}
                  interval="quarter"
                  prefixY={isValue ? "RM " : ""}
                  unitY={isValue ? "" : "%"}
                  displayNumFormat={value => displayNumFormat(value)}
                  axisY={AXIS_Y}
                  data={{
                    labels: projowner_coords.x,
                    datasets: [
                      {
                        type: "line",
                        data: projowner_coords.total,
                        label: t(`${data.value}`),
                        borderColor: AKSARA_COLOR.DANGER,
                        borderWidth: 1.5,
                        backgroundColor: AKSARA_COLOR.DANGER_H,
                        fill: fill,
                      },
                      shader(data.shade),
                    ],
                  }}
                  stats={[
                    {
                      title: t("common:common.latest", {
                        date: toDate(PROJOWNER_LATEST_TIMESTAMP, "qQ yyyy", i18n.language),
                      }),
                      value: getCallout(
                        projowner_callout.data[data.sector][data.value].total.latest,
                        isValue
                      ),
                    },
                  ]}
                />
                <Slider
                  type="range"
                  period="quarter"
                  value={data.projowner_minmax}
                  data={projowner.data[data.sector][data.value].x}
                  onChange={e => setData("projowner_minmax", e)}
                />
                <div className="grid grid-cols-1 gap-12 pt-12 sm:grid-cols-2 lg:grid-cols-3">
                  {["residential", "non_residential", "civileng"].map((key: string) => (
                    <Timeseries
                      key={key}
                      title={t(`section_2.${key}`)}
                      className="h-[300px]"
                      enableAnimation={!play}
                      interval="quarter"
                      prefixY={isValue ? "RM " : ""}
                      unitY={isValue ? "" : "%"}
                      displayNumFormat={value => displayNumFormat(value)}
                      axisY={AXIS_Y}
                      data={{
                        labels: projowner_coords.x,
                        datasets: [
                          {
                            type: "line",
                            data: projowner_coords[key],
                            label: t(`${data.value}`),
                            borderColor: AKSARA_COLOR.DANGER,
                            borderWidth: 1.5,
                            backgroundColor: AKSARA_COLOR.DANGER_H,
                            fill: fill,
                          },
                          shader(data.shade),
                        ],
                      }}
                      stats={[
                        {
                          title: t("common:common.latest", {
                            date: toDate(PROJOWNER_LATEST_TIMESTAMP, "qQ yyyy", i18n.language),
                          }),
                          value: getCallout(
                            projowner_callout.data[data.sector][data.value][key].latest,
                            isValue
                          ),
                        },
                      ]}
                    />
                  ))}
                </div>
              </>
            )}
          </SliderProvider>
        </Section>
      </Container>
    </>
  );
};

export default ConstructionStatisticsDashboard;
