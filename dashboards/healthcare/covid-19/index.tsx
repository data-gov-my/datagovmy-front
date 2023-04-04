import AgencyBadge from "@components/AgencyBadge";
import { Hero } from "@components/index";
import { useTranslation } from "@hooks/useTranslation";
import { FunctionComponent } from "react";
import Container from "@components/Container";
import { MOHIcon } from "@components/Icon/agency";

/**
 * COVID19 Dashboard
 * @overview Status: In-development
 */

interface COVID19Props {}

const COVID19: FunctionComponent<COVID19Props> = ({}) => {
  const { t, i18n } = useTranslation(["common", "dashboard-covid-19"]);

  return (
    <>
      <Hero
        background="red"
        category={[t("nav.megamenu.categories.healthcare"), "text-danger"]}
        header={[t("dashboard-covid-19:header")]}
        description={[t("dashboard-covid-19:description")]}
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

export default COVID19;
