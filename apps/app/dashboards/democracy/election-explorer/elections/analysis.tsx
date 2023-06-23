import { Tabs } from "@components/index";
import LeftRightCard from "@components/LeftRightCard";
import { List, Panel } from "@components/Tabs";
import { MapIcon, TableCellsIcon } from "@heroicons/react/24/solid";
import { useData } from "@hooks/useData";
import { useTranslation } from "@hooks/useTranslation";
import { numFormat } from "@lib/helpers";
import dynamic from "next/dynamic";
import { FunctionComponent, useContext } from "react";
import { OverallSeat } from "../types";
import { BREAKPOINTS } from "@lib/constants";
import { WindowContext } from "@hooks/useWindow";

/**
 * Election Explorer - Election Analysis
 * @overview Status: In-development
 */

const Table = dynamic(() => import("@components/Chart/Table"), {
  ssr: false,
});
const Choropleth = dynamic(() => import("@components/Chart/Choropleth"), { ssr: false });

type Analysis = {
  seat: string;
  state?: string;
  party: string;
  majority: {
    abs: string;
    perc: string;
  };
  voter_turnout: {
    abs: string;
    perc: string;
  };
  votes_rejected: {
    abs: string;
    perc: string;
  };
};

interface ElectionAnalysisProps {
  index: number;
  seats: OverallSeat[];
  state: string;
}

const ElectionAnalysis: FunctionComponent<ElectionAnalysisProps> = ({ index, seats, state }) => {
  const { t } = useTranslation(["dashboard-election-explorer", "common"]);
  const { breakpoint } = useContext(WindowContext);

  const cellSize = breakpoint >= BREAKPOINTS.SM ? 150 : (breakpoint - 24) / 2;
  const config = [
    {
      accessorKey: "seat",
      id: "constituency",
      header: t("constituency"),
      className: "text-left",
      size: cellSize,
    },
    {
      accessorKey: "state",
      id: "state",
      header: t("state"),
      className: "text-left",
      size: cellSize,
    },
    {
      accessorKey: "majority.abs",
      id: "majority.abs",
      header: t("majority"),
      sortingFn: "localeNumber",
      size: cellSize,
    },
    {
      accessorKey: "majority.perc",
      id: "majority.perc",
      header: t("majority_%"),
      size: cellSize,
    },
    {
      accessorKey: "voter_turnout.abs",
      id: "voter_turnout.abs",
      header: t("voter_turnout"),
      sortingFn: "localeNumber",
      size: cellSize,
    },
    {
      accessorKey: "voter_turnout.perc",
      id: "voter_turnout.perc",
      header: t("voter_turnout_%"),
      size: cellSize,
    },
    {
      accessorKey: "votes_rejected.abs",
      id: "votes_rejected.abs",
      header: t("rejected_votes"),
      sortingFn: "localeNumber",
      size: cellSize,
    },
    {
      accessorKey: "votes_rejected.perc",
      id: "votes_rejected.perc",
      header: t("rejected_votes_%"),
      size: cellSize,
    },
  ];

  const analysisData: Array<Analysis> = seats.map(seat => {
    const matches = seat.seat.split(", ");
    return {
      seat: matches[0],
      state: matches[1],
      party: seat.party,
      majority: {
        abs: numFormat(seat.majority.abs, "standard"),
        perc: numFormat(seat.majority.perc, "standard", [1, 1]),
      },
      voter_turnout: {
        abs: numFormat(seat.voter_turnout.abs, "standard"),
        perc: numFormat(seat.voter_turnout.perc, "standard", [1, 1]),
      },
      votes_rejected: {
        abs: numFormat(seat.votes_rejected.abs, "standard"),
        perc: numFormat(seat.votes_rejected.perc, "standard", [1, 1]),
      },
    };
  });

  const { data, setData } = useData({
    tab_index: 0,
    loading: false,
  });

  return (
    <div className="grid grid-cols-12 py-8 lg:py-12">
      <div className="col-span-full col-start-1 lg:col-span-10 lg:col-start-2">
        <h4 className="py-4 text-center">{t("header_3")}</h4>
        <div className="flex justify-end pb-3 lg:pb-6">
          <List
            options={[t("table"), t("map")]}
            icons={[
              <TableCellsIcon key="table_cell_icon" className="mr-1 h-5 w-5" />,
              <MapIcon key="map_icon" className="mr-1 h-5 w-5" />,
            ]}
            current={0} // current={data.tab_index}
            onChange={index => 0} //setData("tab_index", index)}
          />
        </div>
        <Tabs hidden current={data.tab_index} onChange={index => setData("tab_index", index)}>
          <Panel name={t("table")} icon={<TableCellsIcon className="mr-1 h-5 w-5" />}>
            <Table
              data={analysisData}
              enablePagination={10}
              config={state !== "mys" ? config.filter(col => col.id !== "state") : config}
              freeze={["constituency"]}
            />
          </Panel>
          <Panel name={t("map")} icon={<MapIcon className="mr-1 h-5 w-5" />}>
            <LeftRightCard
              left={
                <div className="flex h-full w-full flex-col space-y-6 p-8">
                  <div className="flex flex-col gap-2">
                    <h4>
                      {t("choro_header", {
                        stat: t(""),
                      })}
                    </h4>
                    <span className="text-dim text-sm">
                      {/* {t("common.data_of", { date: choropleth.data_as_of })} */}
                    </span>
                  </div>
                  <div className="flex grow flex-col justify-between space-y-6">
                    <div className="space-y-3 pt-6">
                      <p className="font-bold">{t("choro_rank")}</p>
                    </div>
                  </div>
                </div>
              }
              right={
                <Choropleth
                  className="h-[400px] w-auto lg:h-[500px]"
                  type={index === 1 ? "dun" : "parlimen"}
                />
              }
            />
          </Panel>
        </Tabs>
      </div>
    </div>
  );
};

export default ElectionAnalysis;
