import AgencyBadge from "@components/AgencyBadge";
import Hero from "@components/Hero";
import { useTranslation } from "@hooks/useTranslation";
import { FunctionComponent } from "react";
import Container from "@components/Container";
import { SPRIcon } from "@components/Icon/agency";

/**
 * Election Explorer Dashboard
 * @overview Status: In-development
 */

interface ElectionExplorerProps {}

const ElectionExplorer: FunctionComponent<ElectionExplorerProps> = ({}) => {
  const { t, i18n } = useTranslation(["common", "dashboard-election-explorer"]);

  return (
    <>
      <Hero
        background="red"
        category={[t("nav.megamenu.categories.democracy"), "text-danger"]}
        header={[t("dashboard-election-explorer:header")]}
        description={[t("dashboard-election-explorer:description")]}
        agencyBadge={
          <AgencyBadge
            agency={"Election Comission (EC)"}
            link="https://www.spr.gov.my/"
            icon={<SPRIcon />}
          />
        }
      />
      {/* Rest of page goes here */}
      <Container className="min-h-screen"></Container>
    </>
  );
};

export default ElectionExplorer;
