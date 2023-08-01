import { Hero, Container, AgencyBadge } from "datagovmy-ui/components";
import { useTranslation } from "datagovmy-ui/hooks";
import { FunctionComponent } from "react";
import { MOHIcon } from "datagovmy-ui/icons/agency";

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
