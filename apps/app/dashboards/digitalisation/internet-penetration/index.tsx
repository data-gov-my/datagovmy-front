import { AgencyBadge, Container, Hero, Section, Tabs } from "datagovmy-ui/components";
import { SliderProvider } from "datagovmy-ui/contexts/slider";
import { useData, useTranslation } from "datagovmy-ui/hooks";
import { WithData } from "datagovmy-ui/types";
import dynamic from "next/dynamic";
import { FunctionComponent } from "react";
import TrafficTimeseries from "./traffic-timeseries";
import PenetrationTimeseries from "./penetration-timeseries";

/**
 * Internet Penetration Dashboard
 * @overview Status: Live
 */

export interface TimeseriesChartData {
  title: string;
  label: string;
  data: number[];
  fill: boolean;
  stats: Array<{ title: string; value: string }>;
}

const TRAFFICDATA = ["x", "traffic_fbb", "traffic_mbb"] as const;
const PENETRATIONDATA = ["x", "fbb", "mbb", "mc", "ptv"] as const;

export type TrafficData = (typeof TRAFFICDATA)[number];
export type PenetrationData = (typeof PENETRATIONDATA)[number];
export type PenetrationOptions = "actual" | "rate";

interface InternetPenetrationProps {
  last_updated: string;
  traffic_timeseries: WithData<Record<TrafficData, number[]>>;
  traffic_timeseries_callout: WithData<Record<Exclude<TrafficData, "x">, { latest: number }>>;
  penetration_timeseries: WithData<Record<PenetrationOptions, Record<PenetrationData, number[]>>>;
  penetration_timeseries_callout: WithData<
    Record<Exclude<PenetrationData, "x">, { latest: number; rate: number }>
  >;
}

const InternetPenetration: FunctionComponent<InternetPenetrationProps> = ({
  last_updated,
  traffic_timeseries,
  traffic_timeseries_callout,
  penetration_timeseries,
  penetration_timeseries_callout,
}) => {
  const { t } = useTranslation(["dashboard-internet-penetration"]);
  return (
    <>
      <Hero
        background="purple"
        category={[t("common:categories.digitalisation"), "text-purple"]}
        header={[t("header")]}
        description={[t("description")]}
        last_updated={last_updated}
        agencyBadge={<AgencyBadge agency="mcmc" />}
      />
      <Container className="min-h-screen">
        <TrafficTimeseries
          timeseries={traffic_timeseries}
          timeseries_callout={traffic_timeseries_callout}
        />
        <PenetrationTimeseries
          timeseries={penetration_timeseries}
          timeseries_callout={penetration_timeseries_callout}
        />
      </Container>
    </>
  );
};

export default InternetPenetration;
