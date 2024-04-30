import {
  Container,
  Dropdown,
  LeftRightCard,
  RankList,
  Section,
  StateDropdown,
} from "datagovmy-ui/components";
import { AKSARA_COLOR, CountryAndStates } from "datagovmy-ui/constants";
import { numFormat, toDate } from "datagovmy-ui/helpers";
import { useData, useTranslation } from "datagovmy-ui/hooks";
import { OptionType, StateCode, WithData } from "datagovmy-ui/types";
import dynamic from "next/dynamic";
import { FunctionComponent } from "react";

/**
 * Digital Economy - Household
 * @overview Status: Live
 */

const Choropleth = dynamic(() => import("datagovmy-ui/charts/choropleth"), { ssr: false });
const Timeseries = dynamic(() => import("datagovmy-ui/charts/timeseries"), { ssr: false });

const ICT_ACCESS = ["mobile_phone", "computer", "internet"] as const;
type ICTAccess = (typeof ICT_ACCESS)[number];

type HouseholdProps = {
  choropleth: WithData<{ x: StateCode[]; y: Record<ICTAccess, number[]> }>;
  timeseries: WithData<Record<StateCode, Record<"x" | ICTAccess, number[]>>>;
  timeseries_callout: WithData<Record<StateCode, Record<"x" | ICTAccess, { latest: number }>>>;
};

const DigitalEconomyHousehold: FunctionComponent<HouseholdProps> = ({
  choropleth,
  timeseries,
  timeseries_callout,
}) => {
  const { t, i18n } = useTranslation("dashboard-digital-economy");

  const FILTER_OPTIONS: Array<OptionType> = ICT_ACCESS.map(tech => ({
    label: t(`access.${tech}`),
    value: tech,
  }));

  const { data, setData } = useData({
    filter: FILTER_OPTIONS[0].value,
    state: "mys",
  });

  const filter = data.filter as ICTAccess;
  const state = data.state as StateCode;

  const LATEST_TIMESTAMP = timeseries.data[state].x[timeseries.data[state].x.length - 1];

  return (
    <>
      <Container>
        {/* Are households getting greater access to ICT tools? */}
        <Section
          title={t("household.access")}
          description={
            <StateDropdown
              anchor="left"
              currentState={data.state}
              onChange={e => setData("state", e.value)}
            />
          }
          date={timeseries.data_as_of}
        >
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
            {ICT_ACCESS.map(tech => (
              <Timeseries
                key={tech}
                title={t(`access.${tech}`)}
                className="h-[300px] w-full"
                interval="year"
                precision={1}
                unitY="%"
                maxY={100}
                data={{
                  labels: timeseries.data[state].x,
                  datasets: [
                    {
                      type: "line",
                      label: t(`access.${tech}`),
                      data: timeseries.data[state][tech],
                      backgroundColor: AKSARA_COLOR.PRIMARY_H,
                      borderColor: AKSARA_COLOR.PRIMARY,
                      fill: true,
                      borderWidth: 1.5,
                    },
                  ],
                }}
                stats={[
                  {
                    title: t("common:common.latest", {
                      date: toDate(LATEST_TIMESTAMP, "yyyy", i18n.language),
                    }),
                    value:
                      numFormat(timeseries_callout.data[state][tech].latest, "standard", 1) + "%",
                  },
                ]}
              />
            ))}
          </div>
        </Section>

        {/* How does household access to ICT tools differ across states? */}
        <Section>
          <LeftRightCard
            left={
              <div className="flex h-[600px] w-full flex-col overflow-hidden p-6 lg:p-8">
                <div className="space-y-6 pb-6">
                  <div className="flex flex-col gap-2">
                    <h4>{t("household.access_by_state")}</h4>
                    <span className="text-sm text-dim">
                      {t("common:common.data_of", {
                        date: toDate(choropleth.data_as_of, "dd MMM yyyy, HH:mm", i18n.language),
                      })}
                    </span>
                  </div>
                  <Dropdown
                    anchor="left"
                    options={FILTER_OPTIONS}
                    selected={FILTER_OPTIONS.find(e => e.value === data.filter)}
                    onChange={e => setData("filter", e.value)}
                  />
                  <p className="text-dim">{t("household.access_by_state_desc")}</p>
                </div>
                <RankList
                  id="household-access-by-state"
                  title={t("common:common.ranking", {
                    count: choropleth.data.x.length - 1,
                  })}
                  data={choropleth.data.y[filter]}
                  color="text-blue-600 dark:text-primary-dark"
                  threshold={choropleth.data.x.length}
                  format={(position: number) => {
                    return {
                      label: CountryAndStates[choropleth.data.x[position]],
                      value: numFormat(choropleth.data.y[filter][position], "standard", 1) + "%",
                    };
                  }}
                  mysIndex={choropleth.data.x.findIndex(e => e === "mys")}
                />
              </div>
            }
            right={
              <Choropleth
                className="h-[400px] w-auto rounded-b lg:h-[600px] lg:w-full"
                color="blues"
                data={{
                  labels: choropleth.data.x.map((state: string) => CountryAndStates[state]),
                  values: choropleth.data.y[filter],
                }}
                type="state"
                unit="%"
              />
            }
          />
        </Section>
      </Container>
    </>
  );
};

export default DigitalEconomyHousehold;
