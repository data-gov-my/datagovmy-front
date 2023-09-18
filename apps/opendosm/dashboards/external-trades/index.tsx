import { ShippingIcon } from "@icons/division";
import { AgencyBadge, Container, Hero } from "datagovmy-ui/components";
import { useTranslation } from "datagovmy-ui/hooks";
import { OptionType, WithData } from "datagovmy-ui/types";
import { FunctionComponent } from "react";

import TradeBalanceTimeseries from "./balance-timeseries";
import IndicesTimeseries from "./indices-timeseries";

/**
 * External Trade Statistics Dashboard
 * @overview Status: Live
 */

export interface TimeseriesChartData {
  title: string;
  label: string;
  data: number[];
  fill: boolean;
  stats: Array<{ title: string; value: string }>;
  prefix: string;
}

export type TimeseriesData = "x" | "balance" | "exports" | "imports" | "total" | "recession";

export type IndicesTimeseriesData =
  | "x"
  | "overall"
  | "food"
  | "beverage_tobacco"
  | "crude"
  | "fuels"
  | "oils"
  | "chemicals"
  | "mfg"
  | "machinery"
  | "misc_mfg"
  | "misc_trnsc"
  | "recession";

export type TradeIndices =
  | "export_value"
  | "export_volume"
  | "import_value"
  | "import_volume"
  | "tot";

export interface TimeseriesOptions {
  value: Record<TimeseriesData, number[]>;
  growth_yoy: Record<TimeseriesData, number[]>;
}

export interface TimeseriesOptionsCallout {
  value: Record<Exclude<TimeseriesData, "x" | "recession">, { latest: number }>;
  growth_yoy: Record<Exclude<TimeseriesData, "x" | "recession">, { latest: number }>;
}

export interface IndicesTimeseriesOptions {
  index: Record<IndicesTimeseriesData, number[]>;
  growth_yoy: Record<IndicesTimeseriesData, number[]>;
}

export interface IndicesTimeseriesOptionsCallout {
  growth_yoy: number;
  index: number;
}

interface ExternalTradeDashboardProp {
  last_updated: string;
  timeseries: WithData<TimeseriesOptions>;
  timeseries_callout: WithData<TimeseriesOptionsCallout>;
  indices_timeseries: WithData<Record<TradeIndices, IndicesTimeseriesOptions>>;
  indices_timeseries_callout: WithData<
    Record<
      TradeIndices,
      Record<Exclude<IndicesTimeseriesData, "x" | "recession">, IndicesTimeseriesOptionsCallout>
    >
  >;
}

const ExternalTradeDashboard: FunctionComponent<ExternalTradeDashboardProp> = ({
  last_updated,
  timeseries,
  timeseries_callout,
  indices_timeseries,
  indices_timeseries_callout,
}) => {
  const { t } = useTranslation(["dashboard-external-trade"]);

  const INDEX_OPTIONS: Array<OptionType> = [
    { label: t("keys.growth_yoy"), value: "growth_yoy" },
    { label: t("keys.value"), value: "value" },
    { label: t("keys.index"), value: "index" },
  ];

  const SHADE_OPTIONS: Array<OptionType> = [
    { label: t("keys.no_shade"), value: "no_shade" },
    { label: t("keys.recession"), value: "recession" },
  ];

  return (
    <>
      <Hero
        background="blue"
        category={[t("common:categories.trade"), "text-primary"]}
        header={[t("header")]}
        description={[t("description")]}
        last_updated={last_updated}
        agencyBadge={
          <AgencyBadge name={t("division:bppa.full")} icon={<ShippingIcon />} isDivision={true} />
        }
      />
      <Container className="min-h-screen">
        <TradeBalanceTimeseries
          timeseries={timeseries}
          timeseries_callout={timeseries_callout}
          INDEX_OPTIONS={INDEX_OPTIONS.filter(el => el.value !== "index")}
          SHADE_OPTIONS={SHADE_OPTIONS}
        />
        <IndicesTimeseries
          timeseries={indices_timeseries}
          timeseries_callout={indices_timeseries_callout}
          INDEX_OPTIONS={INDEX_OPTIONS.filter(el => el.value !== "value")}
          SHADE_OPTIONS={SHADE_OPTIONS}
        />
      </Container>
    </>
  );
};

export default ExternalTradeDashboard;
