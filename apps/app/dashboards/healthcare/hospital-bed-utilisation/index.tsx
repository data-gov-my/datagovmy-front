import AgencyBadge from "@components/AgencyBadge";
import { Hero } from "@components/index";
import { useTranslation } from "@hooks/useTranslation";
import { FunctionComponent } from "react";
import Container from "@components/Container";
import { MOHIcon } from "@components/Icon/agency";

/**
 * HospitalBedUtilisation Dashboard
 * @overview Status: In-development
 */

interface HospitalBedUtilisationProps {}

const HospitalBedUtilisation: FunctionComponent<HospitalBedUtilisationProps> = ({}) => {
  const { t, i18n } = useTranslation(["dashboard-hospital-bed-utilisation", "common"]);

  return (
    <>
      <Hero
        background="red"
        category={[t("common:nav.megamenu.categories.healthcare"), "text-danger"]}
        header={[t("dashboard-hospital-bed-utilisation:header")]}
        description={[t("dashboard-hospital-bed-utilisation:description")]}
        agencyBadge={
          <AgencyBadge
            agency={"Ministry of Health (MoH)"}
            link="https://www.moh.gov.my"
            icon={<MOHIcon />}
          />
        }
      />
      {/* Rest of page goes here */}
      <Container className="min-h-screen"></Container>
    </>
  );
};

export default HospitalBedUtilisation;
