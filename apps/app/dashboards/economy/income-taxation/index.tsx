import IncomeRank from "./rank-me";
import IncomeOverview from "./overview";
import { AgencyBadge, Hero, Container } from "datagovmy-ui/components";
import { useTranslation } from "datagovmy-ui/hooks";
import { LHDNIcon } from "datagovmy-ui/icons/agency";
import { FunctionComponent } from "react";
import Taxpayers, { TaxpayersProps } from "./taxpayers";

/**
 * Income Tax Dashboard
 * @overview Status: Live
 */

interface IncomeTaxationProps extends TaxpayersProps {
  last_updated: string;
  next_update: string;
  stacked_bar: any;
  year: number;
}

const IncomeTaxation: FunctionComponent<IncomeTaxationProps> = ({
  last_updated,
  next_update,
  stacked_bar,
  timeseries,
  timeseries_callout,
  year,
}) => {
  const { t } = useTranslation("dashboard-income-taxation");

  return (
    <>
      <Hero
        background="gray"
        category={[t("common:categories.economy"), "text-dim"]}
        header={[t("header")]}
        description={[t("description")]}
        last_updated={last_updated}
        next_update={next_update}
        agencyBadge={<AgencyBadge agency="lhdn" icon={<LHDNIcon fillColor="#71717A" />} />}
      />

      <Container>
        {/* How do I compare to other taxpayers in Malaysia? */}
        <IncomeRank year={year} />

        {/* How many people pay tax each year? */}
        <Taxpayers timeseries={timeseries} timeseries_callout={timeseries_callout} />

        {/* What proportion of income taxes come from individuals? */}
        <IncomeOverview stacked_bar={stacked_bar} />
      </Container>
    </>
  );
};

export default IncomeTaxation;
