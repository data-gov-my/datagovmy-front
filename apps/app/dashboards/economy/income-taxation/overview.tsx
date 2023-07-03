import { Section, Tabs } from "@components/index";
import { useTranslation } from "@hooks/useTranslation";
import { FunctionComponent } from "react";
import Container from "@components/Container";
import dynamic from "next/dynamic";
import { AKSARA_COLOR } from "@lib/constants";
import { useData } from "@hooks/useData";
import { OptionType } from "@components/types";

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
      type: "line",
      label: t("total"),
      data: stacked_bar.data[data.tab_type.value].direct_subtotal,
      borderColor: AKSARA_COLOR.BLACK,
      borderWidth: 1,
    },
    {
      type: "bar",
      label: t("iita"),
      data: stacked_bar.data[data.tab_type.value].direct_iita,
      borderColor: AKSARA_COLOR.DARK_BLUE,
      backgroundColor: AKSARA_COLOR.DARK_BLUE.concat("1A"),
      borderWidth: 1,
    },
    {
      type: "bar",
      label: t("pita"),
      data: stacked_bar.data[data.tab_type.value].direct_pita,
      borderColor: AKSARA_COLOR.PRIMARY,
      backgroundColor: AKSARA_COLOR.PRIMARY.concat("1A"),
      borderWidth: 1,
    },
    {
      type: "bar",
      label: t("cita"),
      data: stacked_bar.data[data.tab_type.value].direct_cita,
      borderColor: AKSARA_COLOR.DANGER,
      backgroundColor: AKSARA_COLOR.DANGER.concat("1A"),
      borderWidth: 1,
    },
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
          data={{
            labels: stacked_bar.data[data.tab_type.value].x,
            datasets: _datasets,
          }}
          prefixY={data.tab_index == 0 ? "RM" : ""}
          unitY={data.tab_index == 0 ? "bil" : "%"}
          maxY={data.tab_index == 0 ? undefined : 100}
          interval={"year"}
        />
      </Section>
    </Container>
  );
};

export default IncomeTaxation;
