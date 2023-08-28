import { FunctionComponent, useMemo } from "react";
import { WithData } from "datagovmy-ui/types";
import { Container, Section, Slider } from "datagovmy-ui/components";
import { clx, numFormat } from "datagovmy-ui/helpers";
import { useData, useTranslation } from "datagovmy-ui/hooks";

/**
 * Balance Of Payments Snapshot Table
 * @overview Status: Live
 */

interface TableSummaryData {
  data: {
    net: number | "None";
    credit: number | "None";
    debit: number | "None";
  };
  variable: string;
  index: number;
}

interface BOPProps {
  bop_snapshot: WithData<TableSummaryData>;
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
const BalanceOfPaymentsSnapshot: FunctionComponent<BOPProps> = ({ bop_snapshot }) => {
  const { t, i18n } = useTranslation(["dashboard-bop", "common"]);

  const xValues = Object.keys(bop_snapshot.data);
  const item = Object.values(bop_snapshot.data);

  const { data, setData } = useData({
    snapshot_index: xValues.length - 1,
  });

  const formatToMillions = (number: number, dp: number = 1) => {
    return (
      (number < 0 ? "(" : "") +
      numFormat(Math.abs(number) / 1e6, "standard", dp, "long", i18n.language, false) +
      (number < 0 ? ")" : "")
    );
  };

  const tableData = useMemo(
    () =>
      item[data.snapshot_index]
        .map(row => {
          if (row.variable === "bop") {
            return {
              index: itemSorts(row.variable, row.index),
              component: t(`table.${row.variable}`),
              net: row.data.net !== "None" ? formatToMillions(row.data.net, 0) : "-",
              credit: row.data.credit !== "None" ? formatToMillions(row.data.credit, 0) : "-",
              debit: row.data.debit !== "None" ? formatToMillions(row.data.debit, 0) : "-",
              isSubHeader: row.variable.includes("_"),
            };
          }

          return {
            index: itemSorts(row.variable, row.index),
            component: t(`table.${row.variable}`),
            net: row.data.net !== "None" ? formatToMillions(row.data.net, 1) : "-",
            credit: row.data.credit !== "None" ? formatToMillions(row.data.credit, 1) : "-",
            debit: row.data.debit !== "None" ? formatToMillions(row.data.debit, 1) : "-",
            isSubHeader: row.variable.includes("_"),
          };
        })
        .sort((a, b) => a.index - b.index),

    [data.snapshot_index]
  );

  const className = {
    td: "w-1/5 px-3 py-2 text-end tabular-nums text-black dark:text-white",
    th: "px-3 py-2 text-center text-sm font-medium text-black dark:text-white",
  };

  return (
    <>
      <Container className="min-h-screen">
        <Section
          title={t("section_snapshot.title")}
          description={t("section_snapshot.description")}
          date={bop_snapshot.data_as_of}
        >
          <div className="mx-auto overflow-auto lg:max-w-screen-md">
            <div className="flex flex-col">
              <table>
                <thead className="border-b border-outline dark:border-washed-dark">
                  <tr>
                    <th></th>
                    <th colSpan={3} className={className.th}>
                      {t("table.unit")}
                    </th>
                  </tr>
                </thead>
                <thead>
                  <tr>
                    <th></th>
                    <th className={className.th}>{t("keys.net")}</th>
                    <th className={className.th}>{t("keys.credit")}</th>
                    <th className={className.th}>{t("keys.debit")}</th>
                  </tr>
                </thead>
                <tbody>
                  {tableData.map((item, i: number) => (
                    <tr
                      key={i}
                      className={clx(
                        "border-b border-outline text-sm dark:border-washed-dark",
                        !item.isSubHeader && "border-none bg-outline dark:bg-washed-dark"
                      )}
                    >
                      <td
                        className={clx(
                          "w-2/5 px-3 py-2 font-medium",
                          item.isSubHeader && "pl-8 font-normal"
                        )}
                      >
                        {item.component}
                      </td>
                      <td className={className.td}>{item.net}</td>
                      <td className={className.td}>{item.credit}</td>
                      <td className={className.td}>{item.debit}</td>
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
