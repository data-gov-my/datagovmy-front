import { Dropdown, LeftRightCard, RankList, Section } from "datagovmy-ui/components";
import { CountryAndStates } from "datagovmy-ui/constants";
import { numFormat, toDate } from "datagovmy-ui/helpers";
import { useTranslation } from "datagovmy-ui/hooks";
import { OptionType, StateCode, WithData } from "datagovmy-ui/types";
import dynamic from "next/dynamic";
import { FunctionComponent, useState } from "react";
import { TIMESERIES_KEYS, TimeseriesType } from ".";

const Choropleth = dynamic(() => import("datagovmy-ui/charts/choropleth"), { ssr: false });

type ChoroplethOptions = {
  x: Array<StateCode>;
  y: Record<TimeseriesType, Array<number>>;
};

export interface WellbeingChoroplethProps {
  choropleth: WithData<ChoroplethOptions>;
}

/**
 * Wellbeing Dashboard - Choropleth
 * @overview Status: Live
 */

const WellbeingChoropleth: FunctionComponent<WellbeingChoroplethProps> = ({ choropleth }) => {
  const { t, i18n } = useTranslation("dashboard-wellbeing");
  const [filter, setFilter] = useState("overall");

  const FILTER_OPTIONS: Array<OptionType> = TIMESERIES_KEYS.filter(e => e !== "x").map(type => ({
    label: t(`keys.${type}`),
    value: type,
  }));

  return (
    <Section>
      <LeftRightCard
        left={
          <div className="flex h-[600px] w-full flex-col overflow-hidden p-6 lg:p-8">
            <div className="space-y-6 pb-6">
              <div className="flex flex-col gap-2">
                <h4>{t("wellbeing.by_state")}</h4>
                <span className="text-sm text-dim">
                  {t("common:common.data_of", {
                    date: toDate(choropleth.data_as_of, "dd MMM yyyy, HH:mm", i18n.language),
                  })}
                </span>
              </div>
              <p className="whitespace-pre-line text-dim">{t("wellbeing.by_state_desc")}</p>
              <div className="flex space-x-3">
                <Dropdown
                  width="w-full lg:max-w-[200px]"
                  anchor="left"
                  placeholder={t("common:common.select")}
                  options={FILTER_OPTIONS}
                  selected={FILTER_OPTIONS.find(e => e.value === filter)}
                  onChange={e => setFilter(e.value)}
                />
              </div>
            </div>
            <RankList
              id="wellbeing-by-state"
              title={t("common:common.ranking", { count: choropleth.data.x.length })}
              data={choropleth.data.y[filter]}
              color="text-primary"
              threshold={choropleth.data.y[filter].length}
              format={pos => {
                return {
                  label: CountryAndStates[choropleth.data.x[pos]],
                  value: `${numFormat(choropleth.data.y[filter][pos], "standard", [1, 1])}`,
                };
              }}
            />
          </div>
        }
        right={
          <Choropleth
            id="choropleth"
            className="h-[400px] w-auto lg:h-[600px]"
            color="blues"
            data={{
              labels: choropleth.data.x.map(state => CountryAndStates[state]),
              values: choropleth.data.y[filter],
            }}
            type="state"
          />
        }
      />
    </Section>
  );
};

export default WellbeingChoropleth;
