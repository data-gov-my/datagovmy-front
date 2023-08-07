import { AgencyBadge, Container, Hero } from "datagovmy-ui/components";
import { useTranslation } from "datagovmy-ui/hooks";
import { FunctionComponent } from "react";

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
        agencyBadge={<AgencyBadge agency="kwap" />}
      />
      {/* Rest of page goes here */}
      <Container className="min-h-screen"></Container>
    </>
  );
};

export default PublicPension;
