import { FunctionComponent } from "react";
import { AgencyBadge, Container, Hero } from "datagovmy-ui/components";
import { useTranslation } from "datagovmy-ui/hooks";
import { PeopleIcon } from "@icons/division";
import { WithData } from "datagovmy-ui/types";
import LifeExpectancyTimeseries from "./timeseries";
import { HeatmapData } from "datagovmy-ui/charts/heatmap";
import LifeExpectancyHeatmap from "./heatmap";
import LifeExpectancyChoropleth from "./choropleth";

/**
 * Life Expectancy Dashboard
 * @overview Status: Live
 */

export const TIMESERIESDATA = [
  "x",
  "overall",
  "bumi",
  "bumi_malay",
  "bumi_other",
  "chinese",
  "indian",
  "noncitizen",
] as const;

export const TIMESERIESTYPE = ["overall", "male", "female"] as const;

export const CHOROPLETHAREA = ["state", "district"] as const;

export type TimeseriesData = (typeof TIMESERIESDATA)[number];
export type TimeseriesType = (typeof TIMESERIESTYPE)[number];

export type TimeseriesOptions = Record<TimeseriesData, number[]>;

export type ChoroplethArea = (typeof CHOROPLETHAREA)[number];

export type ChoroplethOptions = {
  x: Array<string>;
  y: Record<TimeseriesType, Array<number>>;
};

interface LifeExpectancyProps {
  last_updated: string;
  choropleth: Record<ChoroplethArea, WithData<ChoroplethOptions>>;
  heatmap: WithData<HeatmapData>;
  timeseries: WithData<Record<TimeseriesType, TimeseriesOptions>>;
  timeseries_callout: WithData<Record<TimeseriesData, Record<TimeseriesType, number>>>;
}

const LifeExpectancy: FunctionComponent<LifeExpectancyProps> = ({
  last_updated,
  timeseries,
  timeseries_callout,
  heatmap,
  choropleth,
}) => {
  const { t } = useTranslation(["dashboard-life-expectancy"]);

  return (
    <>
      <Hero
        background="blue"
        category={[t("common:categories.demography"), "text-primary"]}
        header={[t("header")]}
        description={[t("description")]}
        last_updated={last_updated}
        agencyBadge={
          <AgencyBadge name={t("division:bppd.full")} icon={<PeopleIcon />} isDivision />
        }
      />
      <Container className="min-h-screen">
        <LifeExpectancyTimeseries timeseries={timeseries} timeseries_callout={timeseries_callout} />
        <LifeExpectancyHeatmap heatmap={heatmap} />
        <LifeExpectancyChoropleth choropleth={choropleth} />
      </Container>
    </>
  );
};

export default LifeExpectancy;
