import { Section } from "@components/index";
import { useTranslation } from "@hooks/useTranslation";
import dynamic from "next/dynamic";
import { FunctionComponent } from "react";

/**
 * Election Explorer Dashboard - Seats Tab
 * @overview Status: In-development
 */

const BorderlessTable = dynamic(() => import("@components/Chart/Table/BorderlessTable"), {
  ssr: false,
});

interface ElectionSeatsProps {}

const ElectionSeats: FunctionComponent<ElectionSeatsProps> = ({}) => {
  const { t, i18n } = useTranslation();
  return (
    <Section>
      <div className="grid grid-cols-12">
        <div className="col-span-10 col-start-2">
          <h4 className="py-4 text-center">{t("dashboard-election-explorer:seat.header")}</h4>
          <BorderlessTable />
        </div>
      </div>
    </Section>
  );
};

export default ElectionSeats;
