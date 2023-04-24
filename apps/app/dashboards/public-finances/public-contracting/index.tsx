import AgencyBadge from "@components/AgencyBadge";
import { Hero } from "@components/index";
import { useTranslation } from "@hooks/useTranslation";
import { FunctionComponent } from "react";
import Container from "@components/Container";
import { MOFIcon } from "@components/Icon/agency";

/**
 * PublicContracting Dashboard
 * @overview Status: In-development
 */

interface PublicContractingProps {}

const PublicContracting: FunctionComponent<PublicContractingProps> = ({}) => {
  const { t, i18n } = useTranslation(["common", "dashboard-public-contracting"]);

  return (
    <>
      <Hero
        background="blue"
        category={[
          t("common:nav.megamenu.categories.public_finances"),
          "text-primary dark:text-primary-dark",
        ]}
        header={[t("dashboard-public-contracting:header")]}
        description={[t("dashboard-public-contracting:description")]}
        agencyBadge={
          <AgencyBadge
            agency={"Ministry of Finance (MoF)"}
            link="https://www.mof.gov.my/portal/en"
            icon={<MOFIcon />}
          />
        }
      />
      {/* Rest of page goes here */}
      <Container className="min-h-screen"></Container>
    </>
  );
};

export default PublicContracting;
