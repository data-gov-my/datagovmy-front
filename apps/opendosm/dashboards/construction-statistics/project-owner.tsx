import { ChartDataset, ChartTypeRegistry } from "chart.js";
import { Dropdown, Section, Slider } from "datagovmy-ui/components";
import { AKSARA_COLOR } from "datagovmy-ui/constants";
import { SliderProvider } from "datagovmy-ui/contexts/slider";
import { numFormat, toDate } from "datagovmy-ui/helpers";
import { useData, useSlice, useTranslation } from "datagovmy-ui/hooks";
import { OptionType, WithData } from "datagovmy-ui/types";
import dynamic from "next/dynamic";
import { FunctionComponent } from "react";
import { Callout } from ".";

/**
 * Construction Statistics Dashboard - Project Owner
 * @overview Status: Live
 */

const Timeseries = dynamic(() => import("datagovmy-ui/charts/timeseries"), {
  ssr: false,
});

type SectorKeys = "government" | "private" | "publiccorp";
type ProjectKeys = "civileng" | "non_residential" | "residential" | "total";

export interface ProjectOwnerProps {
  axisY: Record<string, any>;
  getCallout: (value: number, isActual: boolean) => string;
  project: WithData<
    Record<
      SectorKeys,
      Record<"growth_qoq" | "growth_yoy" | "value", Record<ProjectKeys | "x", number[]>>
    >
  >;
  project_callout: WithData<
    Record<SectorKeys, Record<"growth_qoq" | "growth_yoy" | "value", Record<ProjectKeys, Callout>>>
  >;
  shader: (key: string) => ChartDataset<keyof ChartTypeRegistry, any[]>;
  shadeOptions: Array<OptionType>;
}

const ProjectOwner: FunctionComponent<ProjectOwnerProps> = ({
  axisY,
  getCallout,
  project,
  project_callout,
  shader,
  shadeOptions,
}) => {
  const { t, i18n } = useTranslation(["dashboard-construction-statistics", "common"]);
  const SECTOR_OPTIONS = ["government", "private", "publiccorp"].map((key: string) => ({
    label: t(key) as string,
    value: key,
  }));
  const VALUE_OPTIONS = ["growth_yoy", "growth_qoq", "value"].map((key: string) => ({
    label: t(key) as string,
    value: key,
  }));

  const { data, setData } = useData({
    value: VALUE_OPTIONS[0].value,
    sector: SECTOR_OPTIONS[0].value,
    shade: shadeOptions[0].value,
    minmax: [0, project.data.government.value.x.length - 1],
  });

  const LATEST_TIMESTAMP =
    project.data[data.sector][data.value].x[project.data[data.sector][data.value].x.length - 1];
  const { coordinate } = useSlice(project.data[data.sector][data.value], data.minmax);
  const isValue = data.value === "value";

  return (
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
            selected={shadeOptions.find(e => e.value === data.shade)}
            options={shadeOptions}
            onChange={e => setData("shade", e.value)}
          />
        </div>
      }
      date={project.data_as_of}
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
              displayNumFormat={(value, _, precision) =>
                numFormat(value, "compact", precision, "long", i18n.language, true)
              }
              axisY={axisY}
              data={{
                labels: coordinate.x,
                datasets: [
                  {
                    type: "line",
                    data: coordinate.total,
                    label: t(`${data.value}`),
                    borderColor: AKSARA_COLOR.DANGER,
                    borderWidth: 1.5,
                    backgroundColor: AKSARA_COLOR.DANGER_H,
                    fill: data.shade === "no_shade",
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
                    project_callout.data[data.sector][data.value].total.latest,
                    isValue
                  ),
                },
              ]}
            />
            <Slider
              type="range"
              period="quarter"
              value={data.minmax}
              data={project.data[data.sector][data.value].x}
              onChange={e => setData("minmax", e)}
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
                  displayNumFormat={(value, _, precision) =>
                    numFormat(value, "compact", precision, "long", i18n.language, true)
                  }
                  axisY={axisY}
                  data={{
                    labels: coordinate.x,
                    datasets: [
                      {
                        type: "line",
                        data: coordinate[key],
                        label: t(`${data.value}`),
                        borderColor: AKSARA_COLOR.DANGER,
                        borderWidth: 1.5,
                        backgroundColor: AKSARA_COLOR.DANGER_H,
                        fill: data.shade === "no_shade",
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
                        project_callout.data[data.sector][data.value][key].latest,
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
  );
};

export default ProjectOwner;
