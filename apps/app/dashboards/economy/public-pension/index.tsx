import AgencyBadge from "@components/AgencyBadge";
import { Hero } from "@components/index";
import { useTranslation } from "@hooks/useTranslation";
import { FunctionComponent } from "react";
import Container from "@components/Container";
import { KWAPIcon } from "@components/Icon/agency";

/**
 * PublicPension Dashboard
 * @overview Status: In-development
 */

interface PublicPensionProps {}

const PublicPension: FunctionComponent<PublicPensionProps> = ({}) => {
  const { t, i18n } = useTranslation(["dashboard-public-pension", "common"]);

  return (
    <>
      <Hero
        background="blue"
        category={[
          t("common:nav.megamenu.categories.economy"),
          "text-primary dark:text-primary-dark",
        ]}
        header={[t("dashboard-public-pension:header")]}
        description={[t("dashboard-public-pension:description")]}
        agencyBadge={
          <AgencyBadge
            agency={"Retirement Fund Inc (KWAP)"}
            link="https://www.kwap.gov.my"
            icon={<KWAPIcon />}
          />
        }
      />
      {/* Rest of page goes here */}
      <Container className="min-h-screen"></Container>
    </>
  );
};

export default PublicPension;
