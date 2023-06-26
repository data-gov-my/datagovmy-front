import AgencyBadge from "@components/Badge/agency";
import { Hero, Section } from "@components/index";
import { useTranslation } from "@hooks/useTranslation";
import { FunctionComponent } from "react";
import Container from "@components/Container";

/**
 * Orang Asli Dashboard
 * @overview Status: In-development
 */

interface OrangAsliProps {}

const OrangAsli: FunctionComponent<OrangAsliProps> = ({}) => {
  const { t, i18n } = useTranslation(["dashboard-orang-asli", "common"]);

  return (
    <>
      <Hero
        background="green"
        category={[t("common:categories.demography"), "text-[#16A34A]"]}
        header={[t("header")]}
        description={[t("description")]}
        agencyBadge={<AgencyBadge agency="JAKOA" link="https://www.jakoa.gov.my/" />}
      />
      {/* Rest of page goes here */}
      <Container className="min-h-screen"></Container>
    </>
  );
};

export default OrangAsli;
