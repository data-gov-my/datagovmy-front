import AgencyBadge from "@components/Badge/agency";
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
        category={[t("common:categories.demography"), "text-primary dark:text-primary-dark"]}
        header={[t("header")]}
        description={[t("description")]}
        agencyBadge={
          <AgencyBadge
            agency={t("agencies:jpn.full")}
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
