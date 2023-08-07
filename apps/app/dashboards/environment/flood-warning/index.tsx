import { AgencyBadge, Container, Hero } from "datagovmy-ui/components";
import { useTranslation } from "datagovmy-ui/hooks";
import { FunctionComponent } from "react";

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
