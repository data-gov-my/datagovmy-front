import AgencyBadge from "@components/AgencyBadge";
import { Hero } from "@components/index";
import { useTranslation } from "@hooks/useTranslation";
import { FunctionComponent } from "react";
import Container from "@components/Container";
import { PHCorpIcon } from "@components/Icon/agency";

/**
 * PekaB40 Dashboard
 * @overview Status: In-development
 */

interface PekaB40Props {}

const PekaB40: FunctionComponent<PekaB40Props> = ({}) => {
  const { t, i18n } = useTranslation(["common", "dashboard-peka-b40"]);

  return (
    <>
      <Hero
        background="purple"
        category={[t("nav.megamenu.categories.healthcare"), "text-[#7C3AED]"]}
        header={[t("dashboard-peka-b40:header")]}
        description={[t("dashboard-peka-b40:description")]}
        agencyBadge={
          <AgencyBadge
            agency={"ProtectHealth Corporation"}
            link="https://protecthealth.com.my"
            icon={<PHCorpIcon />}
          />
        }
      />
      {/* Rest of page goes here */}
      <Container className="min-h-screen"></Container>
    </>
  );
};

export default PekaB40;
