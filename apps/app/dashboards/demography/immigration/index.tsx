import AgencyBadge from "@components/AgencyBadge";
import { Hero } from "@components/index";
import { useTranslation } from "@hooks/useTranslation";
import { FunctionComponent } from "react";
import Container from "@components/Container";
import { JIMIcon } from "@components/Icon/agency";

/**
 * Immigration Dashboard
 * @overview Status: In-development
 */

interface ImmigrationProps {}

const Immigration: FunctionComponent<ImmigrationProps> = ({}) => {
  const { t, i18n } = useTranslation(["dashboard-immigration", "common"]);

  return (
    <>
      <Hero
        background="purple"
        category={[t("common:categories.demography"), "text-[#7C3AED]"]}
        header={[t("header")]}
        description={[t("description")]}
        agencyBadge={
          <AgencyBadge
            agency={"Immigration Department of Malaysia"}
            link="https://www.jpn.gov.my/en/"
            icon={<JIMIcon />}
          />
        }
      />
      {/* Rest of page goes here */}
      <Container className="min-h-screen"></Container>
    </>
  );
};

export default Immigration;
