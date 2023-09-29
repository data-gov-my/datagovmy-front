import { FunctionComponent, useContext, useMemo } from "react";
import { WithData } from "datagovmy-ui/types";
import { Container, Section, Slider } from "datagovmy-ui/components";
import { clx, numFormat, toDate } from "datagovmy-ui/helpers";
import { useData, useTranslation } from "datagovmy-ui/hooks";
import { WindowContext } from "datagovmy-ui/contexts/window";

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
  const { size } = useContext(WindowContext);

  const xValues = Object.keys(bop_snapshot.data);
  const item = Object.values(bop_snapshot.data);
  const sliderRange = xValues.slice(4);

  const { data, setData } = useData({
    snapshot_index: sliderRange.length - 1,
  });

  const formatToMillions = (number: number, dp: number = 1) => {
    return (
      (number < 0 ? "(" : "") +
      numFormat(Math.abs(number) / 1e6, "standard", dp, "long", i18n.language, false) +
      (number < 0 ? ")" : "")
    );
  };

  const tableData = useMemo(() => {
    const datesData = {};
    for (let i = data.snapshot_index; i <= data.snapshot_index + 4; i++) {
      const date = toDate(
        xValues[i],
        `${i18n.language === "ms-MY" ? "'ST'" : ""}q${i18n.language === "ms-MY" ? "" : "Q"} yyyy`,
        i18n.language
      );
      datesData[date] = item[i];
    }
    const dates = size.width < 640 ? Object.keys(datesData).reverse() : Object.keys(datesData);
    return item[data.snapshot_index]
      .map(row => {
        const final = dates.map(date => {
          const netValue = datesData[date]?.find(el => el.variable === row.variable).data.net;
          return netValue !== "None" ? formatToMillions(netValue, 0) : "-";
        });
        if (row.variable === "bop") {
          return {
            index: itemSorts(row.variable, row.index),
            component: row.variable,
            dates: dates,
            net: final,

            isSubHeader: row.variable.includes("_"),
          };
        }

        return {
          index: itemSorts(row.variable, row.index),
          component: row.variable,
          dates: dates,
          net: final,
          isSubHeader: row.variable.includes("_"),
        };
      })
      .sort((a, b) => a.index - b.index);
  }, [data.snapshot_index, size]);

  const className = {
    td: "flex-1 px-3 py-2 text-end text-sm tabular-nums text-black dark:text-white",
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
                    <th colSpan={5} className={className.th}>
                      {t("table.unit")}
                    </th>
                  </tr>
                </thead>
                <thead>
                  <tr>
                    <th></th>
                    {tableData[0].dates.map(date => (
                      <th key={date} className={className.th}>
                        {date}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {tableData.map((item, i: number) => {
                    return (
                      <tr
                        key={i}
                        className={clx(
                          !item.isSubHeader
                            ? "bg-outline dark:bg-washed-dark"
                            : "border-b border-outline dark:border-washed-dark",
                          "last:border-t last:border-t-white last:dark:border-t-outlineHover-dark"
                        )}
                      >
                        <td
                          className={clx(
                            "w-1/3 px-3 py-2 text-sm font-medium",
                            item.isSubHeader && "pl-8 font-normal"
                          )}
                        >
                          {t(`table.${item.component}`)}
                        </td>

                        {item.net.map((net: number, index: number) => (
                          <td key={index} className={className.td}>
                            {net}
                          </td>
                        ))}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
          <Slider
            type="single"
            value={data.snapshot_index}
            data={sliderRange}
            period="quarter"
            onChange={e => {
              setData("snapshot_index", e[0][0]);
            }}
          />
        </Section>
      </Container>
    </>
  );
};

export default BalanceOfPaymentsSnapshot;
