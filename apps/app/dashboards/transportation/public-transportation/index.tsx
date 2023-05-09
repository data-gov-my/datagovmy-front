import AgencyBadge from "@components/AgencyBadge";
import { Hero } from "@components/index";
import { useTranslation } from "@hooks/useTranslation";
import { FunctionComponent } from "react";
import Container from "@components/Container";
import { MOTIcon } from "@components/Icon/agency";

/**
 * PublicTransportation Dashboard
 * @overview Status: In-development
 */

interface PublicTransportationProps {}

const PublicTransportation: FunctionComponent<PublicTransportationProps> = ({}) => {
  const { t, i18n } = useTranslation(["dashboard-public-transportation", "common"]);

  return (
    <>
      <Hero
        background="blue"
        category={[t("common:categories.transportation"), "text-primary dark:text-primary-dark"]}
        header={[t("header")]}
        description={[t("description")]}
        agencyBadge={
          <AgencyBadge
            agency={"Ministry of Transport (MoT)"}
            link="https://www.mot.gov.my/en/"
            icon={<MOTIcon />}
          />
        }
      />
      {/* Rest of page goes here */}
      <Container className="min-h-screen"></Container>
    </>
  );
};

export default PublicTransportation;
