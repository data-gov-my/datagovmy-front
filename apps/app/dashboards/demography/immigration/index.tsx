import { AgencyBadge, Container, Hero } from "datagovmy-ui/components";
import { toDate } from "datagovmy-ui/helpers";
import { useTranslation } from "datagovmy-ui/hooks";
import { FunctionComponent } from "react";
import ArrivalsGrid from "./arrivals-grid";
import CountryArrivals, { CountryArrivalsProps } from "./country-arrivals";
import Flag from "./flag";
import TopNationalities, { TopNationalitiesProps } from "./top-nationalities";
import { CONTINENTS } from "./types";

/**
 * Immigration Dashboard
 * @overview Status: Live
 */

export interface ImmigrationProps extends TopNationalitiesProps, CountryArrivalsProps {
  last_updated: string;
  next_update: string;
  continents: Record<string, number[]>;
  key_sources: {
    start: string;
    end: string;
    countries: string[];
    timeseries: Record<string, number[]>;
  };
}

const Immigration: FunctionComponent<ImmigrationProps> = ({
  last_updated,
  next_update,
  data_as_of,
  top_countries,
  countries,
  x,
  timeseries,
  continents,
  key_sources,
}) => {
  const { t, i18n } = useTranslation(["dashboard-immigration", "countries", "common"]);

  return (
    <>
      <Hero
        background="purple"
        category={[t("common:categories.demography"), "text-purple"]}
        header={[t("header")]}
        description={[t("description")]}
        last_updated={last_updated}
        next_update={next_update}
        agencyBadge={<AgencyBadge agency="imigresen" />}
      />

      <Container className="min-h-screen">
        {/* Top 10 nationalities arriving in Malaysia */}
        <TopNationalities data_as_of={data_as_of} top_countries={top_countries} />

        {/* How many people from {{ country }} arrived in Malaysia? (?country=XX) */}
        <CountryArrivals
          countries={countries}
          data_as_of={data_as_of}
          x={x}
          timeseries={timeseries}
        />

        {/* Arrivals to Malaysia by continent */}
        <ArrivalsGrid
          title={t("section_3.title")}
          description={t("section_3.description")}
          data_as_of={data_as_of}
          keys={CONTINENTS}
          timeseries={continents}
          chartTitle={key => t(`continents.${key}`)}
        />

        {/* Arrivals to Malaysia from key tourism sources */}
        <ArrivalsGrid
          title={t("section_4.title")}
          description={t("section_4.description", {
            start: toDate(key_sources.start, "MMM yyyy", i18n.language),
            end: toDate(key_sources.end, "MMM yyyy", i18n.language),
          })}
          data_as_of={data_as_of}
          keys={key_sources.countries}
          timeseries={key_sources.timeseries}
          chartTitle={key => (
            <h5 className="flex items-center gap-2">
              <Flag country={key} />
              {/* Labels are country1..country9, rewritten by the pipeline whenever the top 9 changes */}
              {t(`section_4.country${key_sources.countries.indexOf(key) + 1}`)}
            </h5>
          )}
        />
      </Container>
    </>
  );
};

export default Immigration;
