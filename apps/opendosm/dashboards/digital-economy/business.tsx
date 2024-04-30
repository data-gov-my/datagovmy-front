import { Container, Dropdown, LeftRightCard, RankList, Section } from "datagovmy-ui/components";
import { AKSARA_COLOR, CountryAndStates } from "datagovmy-ui/constants";
import { numFormat, toDate } from "datagovmy-ui/helpers";
import { useData, useTranslation } from "datagovmy-ui/hooks";
import { OptionType, WithData } from "datagovmy-ui/types";
import dynamic from "next/dynamic";
import { FunctionComponent } from "react";
import { DIGITAL_ECONOMY_SECTORS, DigitalEconomySector } from "./layout";

/**
 * Digital Economy - Business
 * @overview Status: Live
 */

const Choropleth = dynamic(() => import("datagovmy-ui/charts/choropleth"), { ssr: false });
const Timeseries = dynamic(() => import("datagovmy-ui/charts/timeseries"), { ssr: false });

const ICT_USAGE = ["computer", "internet", "web_presence"] as const;
type ICTUsage = (typeof ICT_USAGE)[number];

type BusinessProps = {
  choropleth: WithData<{ x: string[]; y: Record<ICTUsage, number[]> }>;
  timeseries: WithData<Record<DigitalEconomySector, Record<"x" | ICTUsage, number[]>>>;
};

const DigitalEconomyBusiness: FunctionComponent<BusinessProps> = ({ choropleth, timeseries }) => {
  const { t, i18n } = useTranslation("dashboard-digital-economy");

  const FILTER_OPTIONS: Array<OptionType> = ICT_USAGE.map(tech => ({
    label:
      tech === "web_presence" ? (
        <p className={i18n.language === "ms-MY" && "italic"}>Web Presence</p>
      ) : (
        t(tech)
      ),
    value: tech,
  }));

  const SECTOR_OPTIONS: Array<OptionType> = DIGITAL_ECONOMY_SECTORS.map(key => ({
    label: t(`sector.${key}`),
    value: key,
  }));

  const { data, setData } = useData({
    filter: FILTER_OPTIONS[0].value,
    sector: SECTOR_OPTIONS[0].value,
  });

  const filter = data.filter as ICTUsage;
  const sector = data.sector as DigitalEconomySector;

  const LATEST_TIMESTAMP = timeseries.data[sector].x[timeseries.data[sector].x.length - 1];

  return (
    <>
      <Container>
        {/* Are business increasing their use of ICT tools? */}
        <Section
          title={t("businesses.usage")}
          description={
            <Dropdown
              anchor="left"
              options={SECTOR_OPTIONS}
              selected={SECTOR_OPTIONS.find(option => data.sector === option.value)}
              onChange={e => setData("sector", e.value)}
            />
          }
          date={timeseries.data_as_of}
        >
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
            {ICT_USAGE.map(tech => (
              <Timeseries
                key={tech}
                title={
                  tech === "web_presence" ? (
                    <h5 className={i18n.language === "ms-MY" ? "italic" : ""}>Web Presence</h5>
                  ) : (
                    t(tech)
                  )
                }
                className="h-[300px] w-full"
                interval="year"
                precision={1}
                unitY="%"
                maxY={100}
                tickSource="labels"
                tooltipFontStyle={
                  tech === "web_presence" && i18n.language === "ms-MY" ? "italic" : "normal"
                }
                data={{
                  labels: timeseries.data[sector].x,
                  datasets: [
                    {
                      type: "line",
                      label: tech === "web_presence" ? "Web Presence" : t(tech),
                      data: timeseries.data[sector][tech],
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
                    value: numFormat(timeseries.data[sector][tech].at(-1), "standard", 1) + "%",
                  },
                ]}
              />
            ))}
          </div>
        </Section>

        {/* How does the use of ICT tools differ across states? */}
        <Section>
          <LeftRightCard
            left={
              <div className="flex h-[600px] w-full flex-col overflow-hidden p-6 lg:p-8">
                <div className="space-y-6 pb-6">
                  <div className="flex flex-col gap-2">
                    <h4>{t("businesses.usage_by_state")}</h4>
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
                  <p className="text-dim">{t("businesses.usage_by_state_desc")}</p>
                </div>
                <RankList
                  id="business-usage-by-state"
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

export default DigitalEconomyBusiness;
