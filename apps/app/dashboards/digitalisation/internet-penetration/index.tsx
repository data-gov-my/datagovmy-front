import AgencyBadge from "@components/Badge/agency";
import { Hero } from "@components/index";
import { useTranslation } from "@hooks/useTranslation";
import { FunctionComponent } from "react";
import Container from "@components/Container";

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
        agencyBadge={<AgencyBadge agency="MCMC" />}
      />
      {/* Rest of page goes here */}
      <Container className="min-h-screen"></Container>
    </>
  );
};

export default InternetPenetration;
