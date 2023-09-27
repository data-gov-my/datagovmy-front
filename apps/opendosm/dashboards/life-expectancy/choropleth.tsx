import { FunctionComponent } from "react";
import { Dropdown, LeftRightCard, RankList, Section } from "datagovmy-ui/components";
import { OptionType, WithData } from "datagovmy-ui/types";
import { CHOROPLETHAREA, ChoroplethArea, ChoroplethOptions, TIMESERIESTYPE } from ".";
import { useData, useTranslation } from "datagovmy-ui/hooks";
import { numFormat, toDate } from "datagovmy-ui/helpers";
import { CountryAndStates } from "datagovmy-ui/constants";
import dynamic from "next/dynamic";

const Choropleth = dynamic(() => import("datagovmy-ui/charts/choropleth"), { ssr: false });

interface LifeExpectancyChoroplethProps {
  choropleth: Record<ChoroplethArea, WithData<ChoroplethOptions>>;
}

const LifeExpectancyChoropleth: FunctionComponent<LifeExpectancyChoroplethProps> = ({
  choropleth,
}) => {
  const { t, i18n } = useTranslation(["dashboard-life-expectancy"]);

  const AREA_OPTIONS: Array<OptionType> = CHOROPLETHAREA.map((key: string) => ({
    label: t(`keys.${key}`),
    value: key,
  }));

  const FILTER_OPTIONS: Array<OptionType> = [...TIMESERIESTYPE, "gap_sex"].map(type => ({
    label: t(`keys.${type}`),
    value: type,
  }));

  const { data, setData } = useData({
    area: "state",
    filter: "overall",
  });

  const area = data.area as ChoroplethArea;

  return (
    <Section>
      <LeftRightCard
        left={
          <div className="flex h-[600px] w-full flex-col overflow-hidden p-6 lg:p-8">
            <div className="space-y-6 pb-6">
              <div className="flex flex-col gap-2">
                <h4>{t("section_choropleth.title")}</h4>
                <span className="text-sm text-dim">
                  {t("common:common.data_of", {
                    date: toDate(choropleth[area].data_as_of, "dd MMM yyyy, HH:mm", i18n.language),
                  })}
                </span>
              </div>
              <p className="whitespace-pre-line text-dim">{t("section_choropleth.description")}</p>
              <div className="flex space-x-3">
                <Dropdown
                  width="w-full"
                  anchor="left"
                  placeholder={t("common:common.select")}
                  options={AREA_OPTIONS}
                  selected={AREA_OPTIONS.find(e => e.value === area)}
                  onChange={e => {
                    setData("area", e.value);
                  }}
                />
                <Dropdown
                  width="w-full lg:max-w-[200px]"
                  anchor="left"
                  placeholder={t("common:common.select")}
                  options={FILTER_OPTIONS}
                  selected={FILTER_OPTIONS.find(e => e.value === data.filter)}
                  onChange={e => setData("filter", e.value)}
                />
              </div>
            </div>
            <RankList
              id="life-expectancy-by-area"
              title={t("common:common.ranking", { count: choropleth[area].data.x.length })}
              data={choropleth[area].data.y[data.filter]}
              color={data.filter === "gap_sex" ? "text-danger" : "text-primary"}
              threshold={choropleth[area].data.y[data.filter].length}
              format={(position: number) => {
                return {
                  label:
                    area === "state"
                      ? CountryAndStates[choropleth[area].data.x[position]]
                      : choropleth[area].data.x[position],
                  value: `${numFormat(
                    choropleth[area].data.y[data.filter][position],
                    "standard",
                    [1, 1]
                  )}`,
                };
              }}
            />
          </div>
        }
        right={
          <Choropleth
            id="choropleth"
            className="h-[400px] w-auto lg:h-[600px]"
            color={data.filter === "gap_sex" ? "reds" : "blues"}
            data={{
              labels: choropleth[area].data.x.map((_area: string) =>
                area === "state" ? CountryAndStates[_area] : _area
              ),
              values: choropleth[area].data.y[data.filter],
            }}
            type={area === "state" ? "state" : "district"}
          />
        }
      />
    </Section>
  );
};

export default LifeExpectancyChoropleth;
