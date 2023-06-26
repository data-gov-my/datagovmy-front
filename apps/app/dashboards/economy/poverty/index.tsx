import AgencyBadge from "@components/Badge/agency";
import { Hero } from "@components/index";
import { useTranslation } from "@hooks/useTranslation";
import { FunctionComponent } from "react";
import Container from "@components/Container";
import { ICUJPMIcon } from "@components/Icon/agency";

/**
 * Poverty Dashboard
 * @overview Status: In-development
 */

interface PovertyProps {}

const Poverty: FunctionComponent<PovertyProps> = ({}) => {
  const { t, i18n } = useTranslation(["dashboard-poverty", "common"]);

  return (
    <>
      <Hero
        background="gray"
        category={[t("common:categories.economy"), "text-black"]}
        header={[t("header")]}
        description={[t("description")]}
        agencyBadge={
          <AgencyBadge
            agency={t("agencies:icu-jpm.full")}
            link="https://www.icu.gov.my/"
            icon={<ICUJPMIcon />}
          />
        }
      />
      {/* Rest of page goes here */}
      <Container className="min-h-screen"></Container>
    </>
  );
};

export default Poverty;
