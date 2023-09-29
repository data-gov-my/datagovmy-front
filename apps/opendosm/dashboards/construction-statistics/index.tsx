import { ToolsIcon } from "@icons/division";
import { ChartDataset, ChartTypeRegistry } from "chart.js";
import { AgencyBadge, Container, Dropdown, Hero, Section, Slider } from "datagovmy-ui/components";
import { AKSARA_COLOR } from "datagovmy-ui/constants";
import { SliderProvider } from "datagovmy-ui/contexts/slider";
import { numFormat, toDate } from "datagovmy-ui/helpers";
import { useData, useSlice, useTranslation } from "datagovmy-ui/hooks";
import { WithData } from "datagovmy-ui/types";
import dynamic from "next/dynamic";
import { FunctionComponent, useCallback } from "react";
import ProjectOwner, { ProjectOwnerProps } from "./project-owner";
import { useTheme } from "next-themes";

/**
 * Construction Statistics Dashboard
 * @overview Status: Live
 */
const Timeseries = dynamic(() => import("datagovmy-ui/charts/timeseries"), {
  ssr: false,
});

type StatKeys = "projects" | "value";
export type Callout = { latest: number };

interface ConstructionStatisticsDashboardProps
  extends Pick<ProjectOwnerProps, "project" | "project_callout"> {
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
}

const ConstructionStatisticsDashboard: FunctionComponent<ConstructionStatisticsDashboardProps> = ({
  last_updated,
  timeseries,
  timeseries_callout,
  project,
  project_callout,
}) => {
  const { t, i18n } = useTranslation(["dashboard-construction-statistics", "common"]);
  const { theme } = useTheme();

  const INDEX_OPTIONS = ["growth_yoy", "growth_qoq", "actual"].map((key: string) => ({
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
    shade: SHADE_OPTIONS[0].value,
    minmax: [0, timeseries.data.actual.x.length - 1],
    project_minmax: [0, project.data.government.value.x.length - 1],
    tab_index: 0,
  });

  const LATEST_TIMESTAMP = timeseries.data[data.index].x[timeseries.data[data.index].x.length - 1];
  const { coordinate } = useSlice(timeseries.data[data.index], data.minmax);

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

  const fill = data.shade === "no_shade";
  const isActual = data.index === "actual";
  const getCallout = (value: number, isActual: boolean) => {
    const prefix = isActual ? "RM " : "";
    const unit = isActual ? "" : "%";
    const callout = isActual
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
          <AgencyBadge icon={<ToolsIcon />} name={t(`division:bppib.full`)} isDivision />
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
                          date: toDate(
                            LATEST_TIMESTAMP,
                            `${i18n.language === "ms-MY" ? "'ST'" : ""}q${
                              i18n.language === "ms-MY" ? "" : "Q"
                            } yyyy`,
                            i18n.language
                          ),
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
                    displayNumFormat={(value, _, precision) =>
                      numFormat(value, "compact", precision, "long", i18n.language, true)
                    }
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
                          date: toDate(
                            LATEST_TIMESTAMP,
                            `${i18n.language === "ms-MY" ? "'ST'" : ""}q${
                              i18n.language === "ms-MY" ? "" : "Q"
                            } yyyy`,
                            i18n.language
                          ),
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
        <ProjectOwner
          axisY={AXIS_Y}
          getCallout={getCallout}
          project={project}
          project_callout={project_callout}
          shader={shader}
          shadeOptions={SHADE_OPTIONS}
        />
      </Container>
    </>
  );
};

export default ConstructionStatisticsDashboard;
