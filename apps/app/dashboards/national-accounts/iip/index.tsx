import { AgencyBadge, Container, Hero, Section } from "datagovmy-ui/components";
import { useTranslation } from "datagovmy-ui/hooks";
import dynamic from "next/dynamic";
import { FunctionComponent } from "react";

/**
 * International Investment Position Dashboard
 * @overview Status: Live
 */

const Timeseries = dynamic(() => import("datagovmy-ui/charts/timeseries"), { ssr: false });

interface IIPProps {
  last_updated: string;
  timeseries: any;
  timeseries_callout: any;
}

const InternationalInvestmentPosition: FunctionComponent<IIPProps> = ({
  last_updated,
  timeseries,
  timeseries_callout,
}) => {
  const { t } = useTranslation("");

  return (
    <>
      <Hero
        background="blue"
        category={["National Accounts", "text-primary dark:text-primary-dark"]}
        header={["International Investment Position"]}
        description={[
          "How much money is the world investing in Malaysia? And how much money is Malaysia investing overseas? These are two critical questions for our policymakers, answered through data on what is called our International Investment Position (IIP). The IIP is one of 3 primary national accounts that convey Malaysia's economic performance, the other two being Gross Domestic Product (GDP) and the Balance of Payments (BOP). This dashboard gives you an easy way to explore key IIP trends and patterns. Enjoy!",
        ]}
        last_updated={last_updated}
        agencyBadge={<AgencyBadge agency="bnm" />}
      />

      <Container className="min-h-screen">
        <Section
          title={"How is Malaysia’s International Investment Position (IIP) trending?"}
          description={
            "Net figures are derived by subtracting liabilities from assets. A positive number indicates net assets, while a negative number indicates net liabilities."
          }
          date={timeseries.data_as_of}
        ></Section>
      </Container>
    </>
  );
};

export default InternationalInvestmentPosition;
