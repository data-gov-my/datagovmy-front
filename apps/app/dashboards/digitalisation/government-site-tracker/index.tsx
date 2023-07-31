import AgencyBadge from "@components/Badge/agency";
import { Hero } from "@components/index";
import { useTranslation } from "@hooks/useTranslation";
import { FunctionComponent } from "react";
import Container from "@components/Container";

/**
 * Government Site Tracker Dashboard
 * @overview Status: In-development
 */

interface GovernmentSiteTrackerProps {}

const GovernmentSiteTracker: FunctionComponent<GovernmentSiteTrackerProps> = ({}) => {
  const { t, i18n } = useTranslation(["dashboard-government-site-tracker", "common"]);

  return (
    <>
      <Hero
        background="blue"
        category={[t("common:categories.digitalisation"), "text-primary dark:text-primary-dark"]}
        header={[t("header")]}
        description={[t("description")]}
        agencyBadge={<AgencyBadge agency="MAMPU" />}
      />
      {/* Rest of page goes here */}
      <Container className="min-h-screen"></Container>
    </>
  );
};

export default GovernmentSiteTracker;
