import AgencyBadge from "@components/AgencyBadge";
import { Hero } from "@components/index";
import { useTranslation } from "@hooks/useTranslation";
import { FunctionComponent } from "react";
import Container from "@components/Container";
import { PDRMIcon } from "@components/Icon/agency";

/**
 * Crime Dashboard
 * @overview Status: In-development
 */

interface CrimeProps {}

const Crime: FunctionComponent<CrimeProps> = ({}) => {
  const { t, i18n } = useTranslation(["dashboard-crime", "common"]);

  return (
    <>
      <Hero
        background="gray"
        category={[t("common:nav.megamenu.categories.public_safety"), "text-black"]}
        header={[t("header")]}
        description={[t("description")]}
        agencyBadge={
          <AgencyBadge
            agency={"Royal Malaysian Police (PDRM)"}
            link="https://www.rmp.gov.my/"
            icon={<PDRMIcon />}
          />
        }
      />
      {/* Rest of page goes here */}
      <Container className="min-h-screen"></Container>
    </>
  );
};

export default Crime;
