import { routes } from "@lib/routes";
import { BarMeterData } from "datagovmy-ui/charts/bar-meter";
import {
  AgencyBadge,
  Container,
  Hero,
  Section,
  Slider,
  StateDropdown,
} from "datagovmy-ui/components";
import { AKSARA_COLOR, CountryAndStates } from "datagovmy-ui/constants";
import { SliderProvider } from "datagovmy-ui/contexts/slider";
import { useData, useSlice, useTranslation } from "datagovmy-ui/hooks";
import { NTRCIcon } from "datagovmy-ui/icons/agency";
import dynamic from "next/dynamic";
import { FunctionComponent } from "react";

/**
 * Drug Addiction Dashboard
 * @overview Status: Live
 */

const Timeseries = dynamic(() => import("datagovmy-ui/charts/timeseries"), { ssr: false });
const BarMeter = dynamic(() => import("datagovmy-ui/charts/bar-meter"), { ssr: false });

type DemographyKeys = "male" | "female" | "total";
type BarMeterKeys = "age" | "drug" | "ethnicity" | "job" | "schooling" | "sex";

interface DrugAddictionDashboardProps {
  barmeter: Record<BarMeterKeys, BarMeterData[]>;
  barmeter_data_as_of: string;
  last_updated: string;
  params: { state: string };
  timeseries: Record<"x" | DemographyKeys, number[]>;
  timeseries_data_as_of: string;
}

const DrugAddictionDashboard: FunctionComponent<DrugAddictionDashboardProps> = ({
  barmeter,
  barmeter_data_as_of,
  last_updated,
  params,
  timeseries,
  timeseries_data_as_of,
}) => {
  const { t } = useTranslation("dashboard-drug-addiction");
  const { data, setData } = useData({
    minmax: [0, timeseries.x.length - 1],
  });
  const { coordinate } = useSlice(timeseries, data.minmax);

  return (
    <>
      <Hero
        background="red"
        category={[t("common:categories.public_safety"), "text-danger"]}
        header={[t("header")]}
        description={[t("description")]}
        last_updated={last_updated}
        action={<StateDropdown url={routes.DRUG_ADDICTION} currentState={params.state} />}
        agencyBadge={
          <AgencyBadge agency="aadk" icon={<NTRCIcon fillColor={AKSARA_COLOR.DANGER} />} />
        }
      />

      <Container className="min-h-screen">
        {/* How has drug addiction in { state } changed over time? */}
        <Section
          title={t("section_1.title", { state: CountryAndStates[params.state] })}
          description={t("section_1.description")}
          date={timeseries_data_as_of}
        >
          <SliderProvider>
            {play => (
              <>
                <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
                  {(["male", "female", "total"] as DemographyKeys[]).map(key => (
                    <Timeseries
                      className="h-[300px]"
                      key={key}
                      title={t(key)}
                      interval="year"
                      enableAnimation={!play}
                      data={{
                        labels: coordinate.x,
                        datasets: [
                          {
                            type: "line",
                            data: coordinate[key],
                            label: t(key),
                            borderColor: AKSARA_COLOR.DANGER,
                            backgroundColor: AKSARA_COLOR.DANGER_H,
                            fill: true,
                            borderWidth: 1.5,
                          },
                        ],
                      }}
                    />
                  ))}
                </div>

                <Slider
                  type="range"
                  period="year"
                  value={data.minmax}
                  onChange={e => setData("minmax", e)}
                  data={timeseries.x}
                />
              </>
            )}
          </SliderProvider>
        </Section>

        {/* A deeper look at drug addiction in {state} */}
        <Section
          title={t("section_2.title", { state: CountryAndStates[params.state] })}
          date={barmeter_data_as_of}
        >
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
            <BarMeter
              title={t("age")}
              layout="horizontal"
              data={barmeter.age}
              sort={(a, b) => a.x.localeCompare(b.x)}
              precision={0}
              relative
            />
            {(["sex", "ethnicity", "drug", "schooling", "job"] as BarMeterKeys[]).map(key => (
              <BarMeter
                key={key}
                title={t(key)}
                layout="horizontal"
                data={barmeter[key]}
                formatX={x => t(x)}
                precision={0}
                sort="desc"
                relative
              />
            ))}
          </div>
        </Section>
      </Container>
    </>
  );
};

export default DrugAddictionDashboard;
