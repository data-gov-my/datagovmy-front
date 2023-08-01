import AgencyBadge from "@components/Badge/agency";
import { Hero } from "@components/index";
import { useTranslation } from "@hooks/useTranslation";
import { FunctionComponent } from "react";
import Container from "@components/Container";

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
