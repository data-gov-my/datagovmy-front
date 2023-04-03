import AgencyBadge from "@components/AgencyBadge";
import { Hero } from "@components/index";
import { useTranslation } from "@hooks/useTranslation";
import { FunctionComponent } from "react";
import Container from "@components/Container";

/**
 * PekaB40 Dashboard
 * @overview Status: In-development
 */

interface PekaB40Props {}

const PekaB40: FunctionComponent<PekaB40Props> = ({}) => {
  const { t, i18n } = useTranslation();

  return (
    <>
      <Hero
        background="gray"
        category={["Healthcare"]}
        header={["Peka B40"]}
        description={[
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
        ]}
        agencyBadge={
          <AgencyBadge
            agency={"Ministry of Health"}
            link="https://www.bnm.gov.my/publications/mhs"
          />
        }
      />
      {/* Rest of page goes here */}
      <Container className="min-h-screen"></Container>
    </>
  );
};

export default PekaB40;
