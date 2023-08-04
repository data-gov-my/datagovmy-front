import { AgencyBadge, Container, Hero } from "datagovmy-ui/components";
import { useTranslation } from "datagovmy-ui/hooks";
import { FunctionComponent } from "react";

/**
 * Internet Penetration Dashboard
 * @overview Status: In-development
 */

interface InternetPenetrationProps {}

const InternetPenetration: FunctionComponent<InternetPenetrationProps> = ({}) => {
  const { t, i18n } = useTranslation(["dashboard-internet-penetration", "common"]);

  return (
    <>
      <Hero
        background="blue"
        category={[t("common:categories.digitalisation"), "text-primary dark:text-primary-dark"]}
        header={[t("header")]}
        description={[t("description")]}
        agencyBadge={<AgencyBadge agency="mcmc" />}
      />
      {/* Rest of page goes here */}
      <Container className="min-h-screen"></Container>
    </>
  );
};

export default InternetPenetration;
