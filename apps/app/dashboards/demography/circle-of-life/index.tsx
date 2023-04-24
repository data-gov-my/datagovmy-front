import AgencyBadge from "@components/AgencyBadge";
import { Hero } from "@components/index";
import { useTranslation } from "@hooks/useTranslation";
import { FunctionComponent } from "react";
import Container from "@components/Container";
import { JPNIcon } from "@components/Icon/agency";

/**
 * Election Explorer Dashboard
 * @overview Status: In-development
 */

interface CircleofLifeProps {}

const CircleofLife: FunctionComponent<CircleofLifeProps> = ({}) => {
  const { t, i18n } = useTranslation(["dashboard-circle-of-life", "common"]);

  return (
    <>
      <Hero
        background="blue"
        category={[
          t("common:nav.megamenu.categories.demography"),
          "text-primary dark:text-primary-dark",
        ]}
        header={[t("dashboard-circle-of-life:header")]}
        description={[t("dashboard-circle-of-life:description")]}
        agencyBadge={
          <AgencyBadge
            agency="Jabatan Pendaftaran Negara"
            link="https://www.jpn.gov.my/en/"
            icon={<JPNIcon />}
          />
        }
      />
      {/* Rest of page goes here */}
      <Container className="min-h-screen"></Container>
    </>
  );
};

export default CircleofLife;
