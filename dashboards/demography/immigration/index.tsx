import AgencyBadge from "@components/AgencyBadge";
import { Hero } from "@components/index";
import { useTranslation } from "@hooks/useTranslation";
import { FunctionComponent } from "react";
import Container from "@components/Container";

/**
 * Immigration Dashboard
 * @overview Status: In-development
 */

interface ImmigrationProps {}

const Immigration: FunctionComponent<ImmigrationProps> = ({}) => {
  const { t, i18n } = useTranslation();

  return (
    <>
      <Hero
        background="bg-gradient-radial border-b dark:border-zinc-800 from-white to-background dark:from-outlineHover-dark dark:to-black"
        category={["Demography"]}
        header={["Immigration"]}
        description={[
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
        ]}
        agencyBadge={
          <AgencyBadge
            agency={"Immigration Department of Malaysia"}
            link="https://www.bnm.gov.my/publications/mhs"
          />
        }
      />
      {/* Rest of page goes here */}
      <Container className="min-h-screen"></Container>
    </>
  );
};

export default Immigration;
