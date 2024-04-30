import { Container, Dropdown, LeftRightCard, RankList, Section } from "datagovmy-ui/components";
import { AKSARA_COLOR, CountryAndStates } from "datagovmy-ui/constants";
import { numFormat, toDate } from "datagovmy-ui/helpers";
import { useData, useTranslation } from "datagovmy-ui/hooks";
import { OptionType, WithData } from "datagovmy-ui/types";
import dynamic from "next/dynamic";
import { FunctionComponent } from "react";
import { DIGITAL_ECONOMY_SECTORS, DigitalEconomySector } from "./layout";

/**
 * Digital Economy - E-commerce
 * @overview Status: Live
 */

const Choropleth = dynamic(() => import("datagovmy-ui/charts/choropleth"), { ssr: false });
const Timeseries = dynamic(() => import("datagovmy-ui/charts/timeseries"), { ssr: false });

const ECOMMERCE = ["total", "domestic", "international", "b2b", "b2c", "b2g"] as const;
const FILTERS = [
  "income",
  "expenditure",
  "income_capita",
  "expenditure_capita",
  "population",
] as const;

type Ecommerce = (typeof ECOMMERCE)[number];
type EcommerceFilter = (typeof FILTERS)[number];
type Transaction = "income" | "expenditure";

type EcommerceProps = {
  choropleth: WithData<{ x: string[]; y: Record<EcommerceFilter, number[]> }>;
  timeseries: WithData<
    Record<Transaction, Record<DigitalEconomySector, Record<"x" | Ecommerce, number[]>>>
  >;
  timeseries_callout: WithData<
    Record<
      Transaction,
      Record<DigitalEconomySector, Record<"x" | Ecommerce, { cagr: number; latest: number }>>
    >
  >;
};

const DigitalEconomyEcommerce: FunctionComponent<EcommerceProps> = ({
  choropleth,
  timeseries,
  timeseries_callout,
}) => {
  const { t, i18n } = useTranslation("dashboard-digital-economy");

  const FILTER_OPTIONS: Array<OptionType> = FILTERS.map(filter => ({
    label: t(`ecommerce.${filter}`),
    value: filter,
  }));

  const SECTOR_OPTIONS: Array<OptionType> = DIGITAL_ECONOMY_SECTORS.map(key => ({
    label: t(`sector.${key}`),
    value: key,
  }));

  const TRANSACTION_OPTIONS: Array<OptionType> = ["income", "expenditure"].map(transaction => ({
    label: t(transaction),
    value: transaction,
  }));

  const { data, setData } = useData({
    filter: FILTER_OPTIONS[0].value,
    sector: SECTOR_OPTIONS[0].value,
    transaction: TRANSACTION_OPTIONS[0].value,
  });

  const filter = data.filter as EcommerceFilter;
  const sector = data.sector as DigitalEconomySector;
  const transaction = data.transaction as Transaction;

  const LATEST_TIMESTAMP =
    timeseries.data[transaction][sector].x[timeseries.data[transaction][sector].x.length - 1];

  return (
    <>
      <Container>
        {/* How is E-Commerce trending? */}
        <Section
          title={t("ecommerce.header")}
          description={
            <div className="flex w-full flex-col gap-3 sm:flex-row">
              <Dropdown
                anchor="left"
                options={TRANSACTION_OPTIONS}
                selected={TRANSACTION_OPTIONS.find(option => data.transaction === option.value)}
                onChange={e => setData("transaction", e.value)}
              />
              <Dropdown
                anchor="left"
                options={SECTOR_OPTIONS}
                selected={SECTOR_OPTIONS.find(option => data.sector === option.value)}
                onChange={e => setData("sector", e.value)}
              />
            </div>
          }
          date={timeseries.data_as_of}
        >
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-6">
            {ECOMMERCE.map(type => (
              <div
                className={
                  type === "total"
                    ? "lg:col-span-6"
                    : ["b2b", "b2c", "b2g"].includes(type)
                    ? "lg:col-span-2"
                    : "lg:col-span-3"
                }
              >
                <Timeseries
                  key={type}
                  title={t(type)}
                  className="h-[300px] w-full"
                  interval="year"
                  prefixY="RM "
                  tickSource="labels"
                  displayNumFormat={(value, _, precision) =>
                    numFormat(value, "compact", precision, "long", i18n.language)
                  }
                  data={{
                    labels: timeseries.data[transaction][sector].x,
                    datasets: [
                      {
                        type: "line",
                        label: t(type),
                        data: timeseries.data[transaction][sector][type],
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
                        "RM " +
                        numFormat(
                          timeseries_callout.data[transaction][sector][type].latest,
                          "compact",
                          1,
                          "long",
                          i18n.language
                        ),
                    },
                    {
                      title: "CAGR",
                      value:
                        numFormat(
                          timeseries_callout.data[transaction][sector][type].cagr,
                          "standard",
                          1
                        ) + "%",
                    },
                  ]}
                />
              </div>
            ))}
          </div>
        </Section>

        {/* How does e-commerce differ across states? */}
        <Section>
          <LeftRightCard
            left={
              <div className="flex h-[600px] w-full flex-col overflow-hidden p-6 lg:p-8">
                <div className="space-y-6 pb-6">
                  <div className="flex flex-col gap-2">
                    <h4>{t("ecommerce.by_state")}</h4>
                    <span className="text-sm text-dim">
                      {t("common:common.data_of", {
                        date: toDate(choropleth.data_as_of, "dd MMM yyyy, HH:mm", i18n.language),
                      })}
                    </span>
                  </div>
                  <Dropdown
                    anchor="left"
                    placeholder={t("common:common.select")}
                    options={FILTER_OPTIONS}
                    selected={FILTER_OPTIONS.find(e => e.value === filter)}
                    onChange={e => setData("filter", e.value)}
                  />
                  <p className="text-dim">{t("ecommerce.by_state_desc")}</p>
                </div>
                <RankList
                  id="ecommerce-by-state"
                  title={t("common:common.ranking", {
                    count: choropleth.data.x.length - 1,
                  })}
                  data={choropleth.data.y[filter]}
                  color="text-blue-600 dark:text-primary-dark"
                  threshold={choropleth.data.x.length}
                  format={(position: number) => {
                    const value = numFormat(
                      choropleth.data.y[filter][position],
                      filter == "population" ? "standard" : "compact",
                      filter == "population" ? 0 : 1
                    );

                    return {
                      label: CountryAndStates[choropleth.data.x[position]],
                      value: (filter === "population" ? "" : "RM ") + value,
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
                prefix={filter === "population" ? "" : "RM "}
                type="state"
              />
            }
          />
        </Section>
      </Container>
    </>
  );
};

export default DigitalEconomyEcommerce;
