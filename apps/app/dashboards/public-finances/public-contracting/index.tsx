import { AgencyBadge, Container, Hero } from "datagovmy-ui/components";
import { useTranslation } from "datagovmy-ui/hooks";
import { FunctionComponent } from "react";

/**
 * PublicContracting Dashboard
 * @overview Status: In-development
 */

interface PublicContractingProps {}

const PublicContracting: FunctionComponent<PublicContractingProps> = ({}) => {
  const { t, i18n } = useTranslation(["dashboard-public-contracting", "common"]);

  return (
    <>
      <Hero
        background="blue"
        category={[t("common:categories.public_finances"), "text-primary dark:text-primary-dark"]}
        header={[t("header")]}
        description={[t("description")]}
        agencyBadge={<AgencyBadge agency="mof" />}
      />
      {/* Rest of page goes here */}
      <Container className="min-h-screen"></Container>
    </>
  );
};

export default PublicContracting;
