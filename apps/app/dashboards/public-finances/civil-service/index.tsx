import AgencyBadge from "@components/AgencyBadge";
import { Hero } from "@components/index";
import { useTranslation } from "@hooks/useTranslation";
import { FunctionComponent } from "react";
import Container from "@components/Container";
import { JPAIcon } from "@components/Icon/agency";

/**
 * Civil Service Dashboard
 * @overview Status: In-development
 */

interface CivilServiceProps {}

const CivilService: FunctionComponent<CivilServiceProps> = ({}) => {
  const { t, i18n } = useTranslation(["dashboard-civil-service", "common"]);

  return (
    <>
      <Hero
        background="blue"
        category={[t("common:categories.public_finances"), "text-primary dark:text-primary-dark"]}
        header={[t("header")]}
        description={[t("description")]}
        agencyBadge={
          <AgencyBadge
            agency={"Public Service Department (JPA)"}
            link="https://www.jpa.gov.my"
            icon={<JPAIcon />}
          />
        }
      />
      {/* Rest of page goes here */}
      <Container className="min-h-screen"></Container>
    </>
  );
};

export default CivilService;
