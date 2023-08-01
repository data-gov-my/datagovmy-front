import AgencyBadge from "@components/Badge/agency";
import { Hero } from "@components/index";
import { useTranslation } from "@hooks/useTranslation";
import { FunctionComponent } from "react";
import Container from "@components/Container";

/**
 * FloodWarning Dashboard
 * @overview Status: In-development
 */

interface FloodWarningProps {}

const FloodWarning: FunctionComponent<FloodWarningProps> = ({}) => {
  const { t, i18n } = useTranslation(["dashboard-flood-warning", "common"]);

  return (
    <>
      <Hero
        background="green"
        category={[t("common:categories.environment"), "text-[#16A34A]"]}
        header={[t("header")]}
        description={[t("description")]}
        agencyBadge={<AgencyBadge agency="jps" />}
      />
      {/* Rest of page goes here */}
      <Container className="min-h-screen"></Container>
    </>
  );
};

export default FloodWarning;
