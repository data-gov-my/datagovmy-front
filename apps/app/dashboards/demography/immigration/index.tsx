import { AgencyBadge, Container, Hero } from "datagovmy-ui/components";
import { useTranslation } from "datagovmy-ui/hooks";
import { FunctionComponent } from "react";
import EntranceAndDeparture, { EntranceAndDepartureProps } from "./entrance-and-departure";
import ForeignerDemography, { ForeignerDemographyProps } from "./foreigner-demography";

/**
 * Immigration Dashboard
 * @overview Status: In-development
 */

interface ImmigrationProps extends EntranceAndDepartureProps, ForeignerDemographyProps {
  last_updated: string;
  params?: {
    country: string;
  };
}

const Immigration: FunctionComponent<ImmigrationProps> = ({
  countries,
  last_updated,
  params,
  timeseries,
  timeseries_callout,
  demography,
  demography_callout,
}) => {
  const { t } = useTranslation(["dashboard-immigration", "countries", "common"]);
  return (
    <>
      <Hero
        background="purple"
        category={[t("common:categories.demography"), "text-purple"]}
        header={[t("header")]}
        description={[t("description")]}
        last_updated={last_updated}
        agencyBadge={<AgencyBadge agency="imigresen" />}
      />

      <Container className="min-h-screen">
        {/* How many people from {{ country }} are entering and leaving the country? */}
        <EntranceAndDeparture
          countries={countries}
          timeseries={timeseries}
          timeseries_callout={timeseries_callout}
          params={params}
          last_updated={last_updated}
        />

        {/* A breakdown of foreign arrivals by demographic group */}
        {/* <ForeignerDemography
          demography={demography}
          demography_callout={demography_callout}
          last_updated={last_updated}
        /> */}
      </Container>
    </>
  );
};

export default Immigration;
