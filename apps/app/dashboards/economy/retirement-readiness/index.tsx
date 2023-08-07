import {
  AgencyBadge,
  Container,
  Dropdown,
  Hero,
  Section,
  Slider,
  Tabs,
} from "datagovmy-ui/components";
import { SliderProvider } from "datagovmy-ui/contexts/slider";
import { AKSARA_COLOR } from "datagovmy-ui/constants";
import { numFormat } from "datagovmy-ui/helpers";
import { useData, useSlice, useTranslation } from "datagovmy-ui/hooks";
import { OptionType } from "datagovmy-ui/types";
import dynamic from "next/dynamic";
import { FunctionComponent } from "react";

/**
 * RetirementReadiness Dashboard
 * @overview Status: In-development
 */

const Heatmap = dynamic(() => import("datagovmy-ui/charts/heatmap"), { ssr: false });
const Timeseries = dynamic(() => import("datagovmy-ui/charts/timeseries"), { ssr: false });

interface RetirementReadinessProps {}

const RetirementReadiness: FunctionComponent<RetirementReadinessProps> = ({}) => {
  const { t } = useTranslation(["dashboard-retirement-readiness", "common"]);
  const { data, setData } = useData({
    snapshot_tab_index: 0,
    tab_index: 0,
    period: "day",
    filter: "median",
    age: "all_ages",
    sex: "both_sexes",
    ethnicity: "all_ethnicities",
    minmax: [0, 1],
    loading: false,
  });
  const period: { [key: number]: "day" | "month" | "year" } = {
    0: "day",
    1: "month",
    2: "year",
  };
  const FILTER_OPTIONS: Array<OptionType> = ["median", "by_decile"].map(key => ({
    label: t(key),
    value: key,
  }));
  const AGE_OPTIONS: Array<OptionType> = ["all_ages"].map(key => ({ label: t(key), value: key }));
  const SEX_OPTIONS: Array<OptionType> = ["both_sexes", "male", "female"].map(key => ({
    label: t(key),
    value: key,
  }));
  const ETHNICITY_OPTIONS: Array<OptionType> = ["all_ethnicities"].map(key => ({
    label: t(key),
    value: key,
  }));
  // const { coordinate } = useSlice(data, data.minmax);

  return (
    <>
      <Hero
        background="orange"
        category={[t("common:categories.economy"), "text-[#FF820E]"]}
        header={[t("header")]}
        description={[t("description")]}
        agencyBadge={<AgencyBadge agency="epf" />}
      />

      <Container className="min-h-fit">
        {/* A snapshot of balances in active EPF accounts */}
        <Section
          title={t("title")}
          // date={}
          description={
            <Dropdown
              anchor="left"
              width="w-full"
              options={FILTER_OPTIONS}
              selected={FILTER_OPTIONS.find(e => e.value === data.filter)}
              onChange={selected => {
                setData("filter", selected.value);
              }}
            />
          }
          menu={
            <Tabs.List
              options={[t("absolute"), t("YoY_change"), t("MoM_change")]}
              current={data.snapshot_tab_index}
              onChange={index => {
                setData("snapshot_tab_index", index);
              }}
            />
          }
        >
          <Heatmap />
        </Section>
        {/* How are account balances, withdrawals, and contributions trending? */}
        <Section
          title={t("timeseries_header")}
          // date={}
          description={
            <div className="flex flex-row flex-wrap gap-3">
              <Dropdown
                anchor="left"
                width="w-fit"
                options={AGE_OPTIONS}
                selected={AGE_OPTIONS.find(e => e.value === data.age)}
                onChange={selected => {
                  setData("age", selected.value);
                }}
              />
              <Dropdown
                anchor="left"
                width="w-fit"
                options={SEX_OPTIONS}
                selected={SEX_OPTIONS.find(e => e.value === data.sex)}
                onChange={selected => {
                  setData("sex", selected.value);
                }}
              />
              <Dropdown
                anchor="left"
                width="w-fit"
                options={ETHNICITY_OPTIONS}
                selected={ETHNICITY_OPTIONS.find(e => e.value === data.ethnicity)}
                onChange={selected => {
                  setData("ethnicity", selected.value);
                }}
              />
            </div>
          }
          menu={
            <Tabs.List
              options={[t("day"), t("month"), t("year")]}
              current={data.tab_index}
              onChange={index => {
                setData("tab_index", index);
                setData("period", period[index]);
              }}
            />
          }
        >
          <SliderProvider>
            {play => (
              <>
                <Timeseries
                  title={t("timeseries_title")}
                  className="h-[300px] w-full"
                  enableAnimation={!play}
                  isLoading={data.loading}
                  // data={{
                  //   labels: coordinate.x,
                  //   datasets: [
                  //     {
                  //       type: "line",
                  //       data: coordinate.y,
                  //       label: t(""),
                  //       backgroundColor: AKSARA_COLOR.ORANGE_H,
                  //       borderColor: AKSARA_COLOR.ORANGE,
                  //       borderWidth: 1.5,
                  //       fill: true,
                  //     },
                  //   ],
                  // }}
                  stats={[
                    {
                      title: `${t("YoY_change")} (%)`,
                      value: `${numFormat(4.2, "compact", [1, 1])}%`,
                    },
                    {
                      title: `${t("MoM_change")} (%)`,
                      value: `${numFormat(3.1, "compact", [1, 1])}%`,
                    },
                  ]}
                />
                <div className="grid grid-cols-1 gap-6 pt-6 lg:grid-cols-2 lg:gap-12">
                  {["withdrawals", "contributions"].map(key => (
                    <Timeseries
                      key={key}
                      title={t(key)}
                      className="h-[300px] w-full"
                      enableAnimation={!play}
                      isLoading={data.loading}
                      // data={{
                      //   labels: coordinate.x,
                      //   datasets: [
                      //     {
                      //       type: "line",
                      //       data: coordinate.y,
                      //       label: t(""),
                      //       backgroundColor: AKSARA_COLOR.ORANGE_H,
                      //       borderColor: AKSARA_COLOR.ORANGE,
                      //       borderWidth: 1.5,
                      //       fill: true,
                      //     },
                      //   ],
                      // }}
                      stats={[
                        {
                          title: `${t("YoY_change")} (%)`,
                          value: `${numFormat(4.2, "compact", [1, 1])}%`,
                        },
                        {
                          title: `${t("MoM_change")} (%)`,
                          value: `${numFormat(3.1, "compact", [1, 1])}%`,
                        },
                      ]}
                    />
                  ))}
                </div>
                <Slider
                  type="range"
                  period={data.period}
                  value={data.minmax}
                  // data={}
                  onChange={e => setData("minmax", e)}
                />
              </>
            )}
            {/* </>
            )} */}
          </SliderProvider>
        </Section>
      </Container>
    </>
  );
};

export default RetirementReadiness;
