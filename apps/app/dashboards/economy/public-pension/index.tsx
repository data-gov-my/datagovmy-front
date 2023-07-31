import AgencyBadge from "@components/Badge/agency";
import { Hero } from "@components/index";
import { useTranslation } from "@hooks/useTranslation";
import { FunctionComponent } from "react";
import Container from "@components/Container";

/**
 * PublicPension Dashboard
 * @overview Status: In-development
 */

interface PublicPensionProps {}

const PublicPension: FunctionComponent<PublicPensionProps> = ({}) => {
  const { t, i18n } = useTranslation(["dashboard-public-pension", "common"]);

  return (
    <>
      <Hero
        background="blue"
        category={[t("common:categories.economy"), "text-primary dark:text-primary-dark"]}
        header={[t("header")]}
        description={[t("description")]}
        agencyBadge={<AgencyBadge agency="KWAP" />}
      />
      {/* Rest of page goes here */}
      <Container className="min-h-screen"></Container>
    </>
  );
};

export default PublicPension;
