import AgencyBadge from "@components/Badge/agency";
import { Hero } from "@components/index";
import { useTranslation } from "@hooks/useTranslation";
import { FunctionComponent } from "react";
import Container from "@components/Container";

/**
 * RetirementReadiness Dashboard
 * @overview Status: In-development
 */

interface RetirementReadinessProps {}

const RetirementReadiness: FunctionComponent<RetirementReadinessProps> = ({}) => {
  const { t, i18n } = useTranslation(["dashboard-retirement-readiness", "common"]);

  return (
    <>
      <Hero
        background="orange"
        category={[t("common:categories.economy"), "text-[#FF820E]"]}
        header={[t("header")]}
        description={[t("description")]}
        agencyBadge={<AgencyBadge agency="epf" />}
      />
      {/* Rest of page goes here */}
      <Container className="min-h-screen"></Container>
    </>
  );
};

export default RetirementReadiness;
