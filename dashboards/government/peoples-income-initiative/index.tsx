import AgencyBadge from "@components/AgencyBadge";
import { Hero } from "@components/index";
import { useTranslation } from "@hooks/useTranslation";
import { FunctionComponent } from "react";
import Container from "@components/Container";
import { MOFIcon } from "@components/Icon/agency";

/**
 * PeoplesIncomeInitiative Dashboard
 * @overview Status: In-development
 */

interface PeoplesIncomeInitiativeProps {}

const PeoplesIncomeInitiative: FunctionComponent<PeoplesIncomeInitiativeProps> = ({}) => {
  const { t, i18n } = useTranslation(["common", "dashboard-peoples-income-initiative"]);

  return (
    <>
      <Hero
        background="gray"
        category={[t("nav.megamenu.categories.government_programs"), "text-black"]}
        header={[t("dashboard-peoples-income-initiative:header")]}
        description={[t("dashboard-peoples-income-initiative:description")]}
        agencyBadge={
          <AgencyBadge
            agency={"Ministry of Finance"}
            link="https://www.mof.gov.my/portal/en"
            icon={<MOFIcon />}
          />
        }
      />
      {/* Rest of page goes here */}
      <Container className="min-h-screen"></Container>
    </>
  );
};

export default PeoplesIncomeInitiative;
