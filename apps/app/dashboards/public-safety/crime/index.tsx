import { AgencyBadge, Container, Hero } from "datagovmy-ui/components";
import { useTranslation } from "datagovmy-ui/hooks";
import { FunctionComponent } from "react";

/**
 * Crime Dashboard
 * @overview Status: In-development
 */

interface CrimeProps {}

const Crime: FunctionComponent<CrimeProps> = ({}) => {
  const { t, i18n } = useTranslation(["dashboard-crime", "common"]);

  return (
    <>
      <Hero
        background="gray"
        category={[t("common:categories.public_safety"), "text-black"]}
        header={[t("header")]}
        description={[t("description")]}
        agencyBadge={<AgencyBadge agency="pdrm" />}
      />
      {/* Rest of page goes here */}
      <Container className="min-h-screen"></Container>
    </>
  );
};

export default Crime;
