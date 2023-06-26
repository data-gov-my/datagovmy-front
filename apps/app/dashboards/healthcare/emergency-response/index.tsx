import AgencyBadge from "@components/Badge/agency";
import { Hero, Section } from "@components/index";
import { useTranslation } from "@hooks/useTranslation";
import { FunctionComponent } from "react";
import Container from "@components/Container";

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
        background="gray"
        category={[t("category"), "text-black"]}
        header={[t("header")]}
        description={[t("description")]}
        agencyBadge={<AgencyBadge agency="KKM" link="https://www.moh.gov.my" />}
      />
      {/* Rest of page goes here */}
      <Container className="min-h-screen"></Container>
    </>
  );
};

export default EmergencyResponse;
