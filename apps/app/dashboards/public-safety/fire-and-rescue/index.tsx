import AgencyBadge from "@components/AgencyBadge";
import { Hero } from "@components/index";
import { useTranslation } from "@hooks/useTranslation";
import { FunctionComponent } from "react";
import Container from "@components/Container";
import { BOMBAIcon } from "@components/Icon/agency";

/**
 * FireandRescue Dashboard
 * @overview Status: In-development
 */

interface FireandRescueProps {}

const FireandRescue: FunctionComponent<FireandRescueProps> = ({}) => {
  const { t, i18n } = useTranslation(["dashboard-fire-and-rescue", "common"]);

  return (
    <>
      <Hero
        background="red"
        category={[t("common:nav.megamenu.categories.public_safety"), "text-danger"]}
        header={[t("dashboard-fire-and-rescue:header")]}
        description={[t("dashboard-fire-and-rescue:description")]}
        agencyBadge={
          <AgencyBadge
            agency={"Fire and Rescue Department (BOMBA)"}
            link="https://www.bomba.gov.my/"
            icon={<BOMBAIcon />}
          />
        }
      />
      {/* Rest of page goes here */}
      <Container className="min-h-screen"></Container>
    </>
  );
};

export default FireandRescue;
