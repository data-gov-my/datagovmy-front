import AgencyBadge from "@components/Badge/agency";
import { Hero, Section } from "@components/index";
import { useTranslation } from "@hooks/useTranslation";
import { FunctionComponent } from "react";
import Container from "@components/Container";
import { MERSIcon } from "@components/Icon/agency";

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
        agencyBadge={
          <AgencyBadge
            agency={t("agencies:mers-999.full")}
            link="https://999.gov.my/"
            icon={<MERSIcon />}
          />
        }
      />
      {/* Rest of page goes here */}
      <Container className="min-h-screen"></Container>
    </>
  );
};

export default EmergencyResponse;
