import AgencyBadge from "@components/Badge/agency";
import { Hero } from "@components/index";
import { useTranslation } from "@hooks/useTranslation";
import { FunctionComponent } from "react";
import Container from "@components/Container";

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
        agencyBadge={<AgencyBadge agency="jpa" />}
      />
      {/* Rest of page goes here */}
      <Container className="min-h-screen"></Container>
    </>
  );
};

export default CivilService;
