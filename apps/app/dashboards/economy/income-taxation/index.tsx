import IncomeRank from "./rank-me";
import IncomeOverview from "./overview";
import { AgencyBadge, Hero, Container } from "datagovmy-ui/components";
import { useTranslation } from "datagovmy-ui/hooks";
import { LHDNIcon } from "datagovmy-ui/icons/agency";
import { FunctionComponent } from "react";

/**
 * Income Tax Dashboard
 * @overview Status: Live
 */

interface IncomeTaxationProps {
  last_updated: string;
  stacked_bar: any;
}

const IncomeTaxation: FunctionComponent<IncomeTaxationProps> = ({ last_updated, stacked_bar }) => {
  const { t } = useTranslation("dashboard-income-taxation");

  return (
    <>
      <Hero
        background="gray"
        category={[t("common:categories.economy"), "text-dim"]}
        header={[t("header")]}
        description={[t("description")]}
        last_updated={last_updated}
        agencyBadge={<AgencyBadge agency="lhdn" icon={<LHDNIcon fillColor="#71717A" />} />}
      />

      <Container>
        {/* How do I compare to other taxpayers in Malaysia? */}
        <IncomeRank />

        {/* What proportion of income taxes come from individuals? */}
        <IncomeOverview stacked_bar={stacked_bar} />
      </Container>
    </>
  );
};

export default IncomeTaxation;
