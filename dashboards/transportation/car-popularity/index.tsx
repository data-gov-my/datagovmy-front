import AgencyBadge from "@components/AgencyBadge";
import { Hero } from "@components/index";
import { useTranslation } from "@hooks/useTranslation";
import { FunctionComponent } from "react";
import Container from "@components/Container";
import { JPJIcon } from "@components/Icon/agency";

/**
 * CarPopularity Dashboard
 * @overview Status: In-development
 */

interface CarPopularityProps {}

const CarPopularity: FunctionComponent<CarPopularityProps> = ({}) => {
  const { t, i18n } = useTranslation(["common", "dashboard-car-popularity"]);

  return (
    <>
      <Hero
        background="blue"
        category={[
          t("nav.megamenu.categories.transportation"),
          "text-primary dark:text-primary-dark",
        ]}
        header={[t("dashboard-car-popularity:header")]}
        description={[t("dashboard-car-popularity:description")]}
        agencyBadge={
          <AgencyBadge
            agency={"Road Transport Department (JPJ)"}
            link="https://www.bnm.gov.my/publications/mhs"
            icon={<JPJIcon />}
          />
        }
      />
      {/* Rest of page goes here */}
      <Container className="min-h-screen"></Container>
    </>
  );
};

export default CarPopularity;
