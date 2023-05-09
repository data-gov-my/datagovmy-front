import AgencyBadge from "@components/AgencyBadge";
import { Hero } from "@components/index";
import { useTranslation } from "@hooks/useTranslation";
import { FunctionComponent } from "react";
import Container from "@components/Container";
import { MCMCIcon } from "@components/Icon/agency";

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
        agencyBadge={
          <AgencyBadge agency={"MCMC"} link="https://www.mcmc.gov.my/en/home" icon={<MCMCIcon />} />
        }
      />
      {/* Rest of page goes here */}
      <Container className="min-h-screen"></Container>
    </>
  );
};

export default InternetPenetration;
