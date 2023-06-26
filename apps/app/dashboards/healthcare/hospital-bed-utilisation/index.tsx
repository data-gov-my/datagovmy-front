import AgencyBadge from "@components/Badge/agency";
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
        category={[t("common:categories.healthcare"), "text-danger"]}
        header={[t("header")]}
        description={[t("description")]}
        agencyBadge={
          <AgencyBadge
            agency={t("agencies:moh.full")}
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
