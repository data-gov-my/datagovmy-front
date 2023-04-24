import AgencyBadge from "@components/AgencyBadge";
import { Hero } from "@components/index";
import { useTranslation } from "@hooks/useTranslation";
import { FunctionComponent } from "react";
import Container from "@components/Container";
import { LHDNIcon } from "@components/Icon/agency";

/**
 * Income Taxation Dashboard
 * @overview Status: In-development
 */

interface IncomeTaxationProps {}

const IncomeTaxation: FunctionComponent<IncomeTaxationProps> = ({}) => {
  const { t, i18n } = useTranslation(["dashboard-income-taxation", "common"]);

  return (
    <>
      <Hero
        background="orange"
        category={[t("common:nav.megamenu.categories.economy"), "text-[#FF820E]"]}
        header={[t("dashboard-income-taxation:header")]}
        description={[t("dashboard-income-taxation:description")]}
        agencyBadge={
          <AgencyBadge
            agency={"Internal Revenue Board"}
            link="https://www.hasil.gov.my"
            icon={<LHDNIcon />}
          />
        }
      />
      {/* Rest of page goes here */}
      <Container className="min-h-screen"></Container>
    </>
  );
};

export default IncomeTaxation;
