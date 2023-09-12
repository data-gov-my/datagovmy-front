import { AgencyBadge, Container, Hero, Section } from "datagovmy-ui/components";
import { useTranslation } from "datagovmy-ui/hooks";
import { FunctionComponent } from "react";

/**
 * Emergency Response Dashboard
 * @overview Status: In-development
 */

interface EmergencyResponseProps {}

const EmergencyResponse: FunctionComponent<EmergencyResponseProps> = ({}) => {
  const { t, i18n } = useTranslation(["dashboard-emergency-response", "common"]);

  return (
    <>
      <Hero
        background="red"
        category={[t("common:categories.healthcare"), "text-danger"]}
        header={[t("header")]}
        description={[t("description")]}
        agencyBadge={<AgencyBadge agency="mers-999" />}
      />
      {/* Rest of page goes here */}
      <Container className="min-h-screen"></Container>
    </>
  );
};

export default EmergencyResponse;
