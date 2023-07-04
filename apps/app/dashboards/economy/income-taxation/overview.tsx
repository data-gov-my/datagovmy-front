import { Section, Tabs } from "@components/index";
import { useTranslation } from "@hooks/useTranslation";
import { FunctionComponent } from "react";
import Container from "@components/Container";
import dynamic from "next/dynamic";
import { AKSARA_COLOR } from "@lib/constants";
import { useData } from "@hooks/useData";
import { OptionType } from "@components/types";
import { useTheme } from "next-themes";
/**
 * Income Taxation Dashboard
 * @overview Status: In-development
 */

interface IncomeTaxationProps {
  stacked_bar: any;
  last_updated: any;
}

const IncomeTaxation: FunctionComponent<IncomeTaxationProps> = ({ stacked_bar, last_updated }) => {
  const { t } = useTranslation(["dashboard-income-taxation", "common"]);
  const { theme } = useTheme();

  const Timeseries = dynamic(() => import("@components/Chart/Timeseries"), { ssr: false });

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
    <Container className="min-h-screen">
      <Section
        title={t("section2.title")}
        description={t("section2.description")}
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
                hidden: false,
              };
            });
          }}
          data={{
            labels: stacked_bar.data[data.tab_type.value].x,
            datasets: _datasets,
          }}
          prefixY={data.tab_index == 0 ? "RM" : ""}
          unitY={data.tab_index == 0 ? "bil" : "%"}
          maxY={data.tab_index == 0 ? undefined : 100}
          interval={"year"}
          tooltipItemSort={(a, b) => {
            return b.datasetIndex - a.datasetIndex;
          }}
        />
      </Section>
    </Container>
  );
};

export default IncomeTaxation;
