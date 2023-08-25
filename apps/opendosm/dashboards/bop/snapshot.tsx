import { FunctionComponent, useMemo } from "react";
import { MetaPage } from "datagovmy-ui/types";
import { Container, Section, Slider } from "datagovmy-ui/components";
import dynamic from "next/dynamic";
import { clx, numFormat } from "datagovmy-ui/helpers";
import { useData, useTranslation } from "datagovmy-ui/hooks";

/**
 * Balance Of Payments Snapshot Table
 * @overview Status: Live
 */

const Table = dynamic(() => import("datagovmy-ui/charts/table"), { ssr: false });

interface TableSummaryData {
  data: {
    net: number | "None";
    credit: number | "None";
    debit: number | "None";
  };
  variable: string;
  index: number;
}

interface BopSnaphot {
  data_as_of: string;
  data: Record<string, TableSummaryData[]>;
}

interface BOPProps {
  last_updated: string;
  bop_snapshot: BopSnaphot;
  meta: MetaPage;
}

const itemSorts = (variable: string, index: number) => {
  switch (variable) {
    case "reserves":
      return 17;
    case "bop_sdr":
      return 18;
    case "bop_imf":
      return 19;
    case "bop_forex":
      return 20;
    case "neo":
      return 21;
    case "bop":
      return 22;
    default:
      return index;
  }
};
const BalanceOfPaymentsSnapshot: FunctionComponent<BOPProps> = ({
  last_updated,
  bop_snapshot,
  meta,
}) => {
  const { t, i18n } = useTranslation(["dashboard-bop", "common"]);

  const xValues = Object.keys(bop_snapshot.data);
  const item = Object.values(bop_snapshot.data);

  const { data, setData } = useData({
    snapshot_index: xValues.length - 1,
  });

  const formatToMillions = (number: number, dp: number = 1) => {
    // if (number >= 1e9 || number <= -1e9) {
    return `${numFormat(number / 1e6, "standard", dp, "long", i18n.language, false)}`;
    // }
    // return numFormat(number, "compact", dp, "short", i18n.language, false);
  };

  const tableData = useMemo(
    () =>
      item[data.snapshot_index]
        .map(row => {
          if (row.variable === "bop") {
            return {
              index: itemSorts(row.variable, row.index),
              component: t(`keys.${row.variable}`),
              net: row.data.net !== "None" ? formatToMillions(row.data.net, 0) : "-",
              credit: row.data.credit !== "None" ? formatToMillions(row.data.credit, 0) : "-",
              debit: row.data.debit !== "None" ? formatToMillions(row.data.debit, 0) : "-",
              isSubHeader: row.variable.includes("_"),
            };
          }

          return {
            index: itemSorts(row.variable, row.index),
            component: t(`keys.${row.variable}`),
            net: row.data.net !== "None" ? formatToMillions(row.data.net, 1) : "-",
            credit: row.data.credit !== "None" ? formatToMillions(row.data.credit, 1) : "-",
            debit: row.data.debit !== "None" ? formatToMillions(row.data.debit, 1) : "-",
            isSubHeader: row.variable.includes("_"),
          };
        })
        .sort((a, b) => a.index - b.index),

    [data.snapshot_index]
  );

  return (
    <>
      <Container className="min-h-screen">
        <Section
          title={t("section_1.title")}
          description={t("section_1.description")}
          date={bop_snapshot.data_as_of}
        >
          <div className="mx-auto lg:max-w-screen-md">
            <div className="flex flex-col lg:grid lg:grid-cols-12">
              <table className="lg:col-start-0 lg:col-span-12">
                <thead className="dark:border-washed-dark">
                  <tr>
                    <th className="w-2/5 px-4 py-3 text-sm font-medium"></th>
                    <th colSpan={3} className="px-4 py-3 text-center text-sm font-medium">
                      {t("table.unit")}
                    </th>
                  </tr>
                </thead>
                <thead className="border-y-2 border-l-2 border-gray-300 dark:border-washed-dark">
                  <tr>
                    <th className="border-r-2 border-gray-300 px-4 py-3 text-sm font-medium"></th>
                    <th className="border-r-2 border-gray-300 px-4 py-3 text-center text-sm font-medium">
                      {t("keys.net")}
                    </th>
                    <th className="border-r-2 border-gray-300 px-4 py-3 text-center text-sm font-medium">
                      {t("keys.credit")}
                    </th>
                    <th className="border-r-2 border-gray-300 px-4 py-3 text-center text-sm font-medium">
                      {t("keys.debit")}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {tableData.map((item, i) => (
                    <tr
                      key={i}
                      className={clx(
                        "border-b border-l-2 border-gray-300 dark:border-washed-dark",
                        !item.isSubHeader && "bg-outline"
                      )}
                    >
                      <td
                        className={clx(
                          "w-2/5 border-r-2 border-gray-300 px-3 py-2 text-sm font-medium",
                          item.isSubHeader && "pl-10 font-normal"
                        )}
                      >
                        {item.component}
                      </td>
                      <td className="w-1/5 border-r-2 border-gray-300 px-3 py-2 text-end text-sm capitalize tabular-nums">
                        {item.net}
                      </td>
                      <td className="w-1/5 border-r-2 border-gray-300 px-3 py-2 text-end text-sm tabular-nums">
                        {item.credit}
                      </td>
                      <td className="w-1/5 border-r-2 border-gray-300 px-3 py-2 text-end text-sm tabular-nums">
                        {item.debit}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <Slider
            type="single"
            value={data.snapshot_index}
            data={xValues}
            period="quarter"
            onChange={e => setData("snapshot_index", e)}
          />
        </Section>
      </Container>
    </>
  );
};

export default BalanceOfPaymentsSnapshot;
