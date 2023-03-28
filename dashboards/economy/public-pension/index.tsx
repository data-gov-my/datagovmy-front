import AgencyBadge from "@components/AgencyBadge";
import { Hero } from "@components/index";
import { useTranslation } from "@hooks/useTranslation";
import { FunctionComponent } from "react";
import Container from "@components/Container";

/**
 * PublicPension Dashboard
 * @overview Status: In-development
 */

interface PublicPensionProps {}

const PublicPension: FunctionComponent<PublicPensionProps> = ({}) => {
  const { t, i18n } = useTranslation();

  return (
    <>
      <Hero
        background="gray"
        category={["Economy"]}
        header={["Public Pension"]}
        description={[
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
        ]}
        agencyBadge={
          <AgencyBadge
            agency={"Retirement Fund Inc (KWAP)"}
            link="https://www.bnm.gov.my/publications/mhs"
          />
        }
      />
      {/* Rest of page goes here */}
      <Container className="min-h-screen"></Container>
    </>
  );
};

export default PublicPension;
