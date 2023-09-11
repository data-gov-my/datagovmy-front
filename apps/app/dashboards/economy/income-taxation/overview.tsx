import { Section, Tabs } from "datagovmy-ui/components";
import { AKSARA_COLOR } from "datagovmy-ui/constants";
import { useData, useTranslation } from "datagovmy-ui/hooks";
import { OptionType } from "datagovmy-ui/types";
import { useTheme } from "next-themes";
import dynamic from "next/dynamic";
import { FunctionComponent } from "react";

/**
 * Income Taxation - Overview
 * @overview Status: In-development
 */

interface IncomeOverviewProps {
  stacked_bar: any;
}

const IncomeOverview: FunctionComponent<IncomeOverviewProps> = ({ stacked_bar }) => {
  const { t } = useTranslation(["dashboard-income-taxation", "common"]);
  const { theme } = useTheme();

  const Timeseries = dynamic(() => import("datagovmy-ui/charts/timeseries"), { ssr: false });

  const TABS: OptionType[] = [
    { label: t("absolute"), value: "abs" },
    { label: t("relative"), value: "relative" },
  ];
  const { data, setData } = useData({
    tab_index: 0,
    tab_type: TABS[0],
  });

  const _datasets: any = [
    {
      type: "bar",
      label: t("iita"),
      data: stacked_bar.data[data.tab_type.value].direct_iita,
      borderColor: AKSARA_COLOR.PRIMARY,
      backgroundColor: AKSARA_COLOR.PRIMARY_H,
      borderWidth: 1,
    },
    {
      type: "bar",
      label: t("pita"),
      data: stacked_bar.data[data.tab_type.value].direct_pita,
      borderColor: AKSARA_COLOR.GREY,
      backgroundColor: AKSARA_COLOR.GREY_H,
      borderWidth: 1,
    },
    {
      type: "bar",
      label: t("cita"),
      data: stacked_bar.data[data.tab_type.value].direct_cita,
      borderColor: AKSARA_COLOR.DANGER,
      backgroundColor: AKSARA_COLOR.DANGER_H,
      borderWidth: 1,
    },
    ...(data.tab_index === 0
      ? [
          {
            type: "line",
            label: t("total"),
            data: stacked_bar.data[data.tab_type.value].direct_subtotal,
            borderColor: theme === "dark" ? AKSARA_COLOR.WHITE : AKSARA_COLOR.BLACK,
            borderWidth: 1,
          },
        ]
      : []),
  ];
  return (
    <Section
      title={t("section3.title")}
      description={t("section3.description")}
      date={stacked_bar.data_as_of}
      menu={
        <Tabs.List
          options={[t("absolute"), t("relative")]}
          current={data.tab_index}
          onChange={index => {
            setData("tab_index", index);
            setData("tab_type", TABS[index]);
          }}
        />
      }
    >
      <Timeseries
        className="h-96"
        enableLegend={true}
        generateLabels={chart => {
          return chart.data.datasets.map((dataset: any, i: number) => {
            return {
              text: dataset.label,
              fillStyle: dataset.backgroundColor,
              strokeStyle: dataset.borderColor,
              pointStyle: dataset.type === "line" ? "line" : "rect",
              hidden: !chart.isDatasetVisible(i),
              datasetIndex: i,
            };
          });
        }}
        data={{
          labels: stacked_bar.data[data.tab_type.value].x,
          datasets: _datasets,
        }}
        prefixY={data.tab_index == 0 ? "RM " : ""}
        unitY={data.tab_index == 0 ? " bil" : "%"}
        maxY={data.tab_index == 0 ? undefined : 100}
        interval={"year"}
        tooltipItemSort={(a, b) => {
          return b.datasetIndex - a.datasetIndex;
        }}
      />
    </Section>
  );
};

export default IncomeOverview;
