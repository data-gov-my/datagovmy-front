import { Tabs } from "@components/index";
import LeftRightCard from "@components/LeftRightCard";
import { List, Panel } from "@components/Tabs";
import { MapIcon, TableCellsIcon } from "@heroicons/react/24/solid";
import { useData } from "@hooks/useData";
import { useTranslation } from "@hooks/useTranslation";
import { generateSchema } from "@lib/schema/election-explorer";
import dynamic from "next/dynamic";
import { FunctionComponent } from "react";
import { OverallSeat } from "../types";

/**
 * Election Explorer - Election Analysis
 * @overview Status: In-development
 */

const ElectionTable = dynamic(() => import("@components/Chart/Table/ElectionTable"), {
  ssr: false,
});
const Table = dynamic(() => import("@components/Chart/Table"), {
  ssr: false,
});
// const Choropleth = dynamic(() => import("@components/Chart/Choropleth"), { ssr: false });

type Analysis = {
  seat: string;
  state: string;
  party: string;
  majority: {
    abs: number;
    perc: number;
  };
  voter_turnout: {
    abs: number;
    perc: number;
  };
  votes_rejected: {
    abs: number;
    perc: number;
  };
};

interface ElectionAnalysisProps {
  index: number;
  seats: OverallSeat[];
}

const ElectionAnalysis: FunctionComponent<ElectionAnalysisProps> = ({ index, seats }) => {
  const { t } = useTranslation(["dashboard-election-explorer", "common"]);

  const analysisData: Array<Analysis> = seats.map(seat => {
    const matches = seat.seat.split(", ");
    return {
      seat: matches[0],
      state: matches[1],
      party: seat.party,
      majority: { abs: seat.majority.abs, perc: parseFloat(seat.majority.perc.toFixed(1)) },
      voter_turnout: {
        abs: seat.voter_turnout.abs,
        perc: parseFloat(seat.voter_turnout.perc.toFixed(1)),
      },
      votes_rejected: {
        abs: seat.votes_rejected.abs,
        perc: parseFloat(seat.votes_rejected.perc.toFixed(1)),
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
        <h4 className="py-4 text-center">{t("election.header_3")}</h4>
        {/* <div className="flex justify-end pb-6">
          <List
            options={[
              t("election.table"),
              t("election.map"),
            ]}
            icons={[
              <TableCellsIcon key="table_cell_icon" className="mr-1 h-5 w-5" />,
              <MapIcon key="map_icon" className="mr-1 h-5 w-5" />,
            ]}
            current={data.tab_index}
            onChange={index => setData("tab_index", index)}
          />
        </div> */}
        <Tabs hidden current={data.tab_index} onChange={index => setData("tab_index", index)}>
          <Panel name={t("election.table")} icon={<TableCellsIcon className="mr-1 h-5 w-5" />}>
            <Table
              // className="max-h-96 w-full overflow-y-auto"
              // isLoading={data.loading}
              // columns={generateSchema<Analysis>([
              data={analysisData}
              enablePagination={15}
              config={[
                {
                  accessorKey: "seat",
                  id: "constituency",
                  header: t("constituency"),
                  className: "text-left",
                },
                {
                  accessorKey: "state",
                  id: "state",
                  header: t("election.state"),
                  className: "text-left",
                },
                {
                  accessorKey: "majority.abs",
                  id: "majority.abs",
                  header: t("majority"),
                },
                {
                  accessorKey: "majority.perc",
                  id: "majority.perc",
                  header: t("majority_%"),
                },
                {
                  accessorKey: "voter_turnout.abs",
                  id: "voter_turnout.abs",
                  header: t("voter_turnout"),
                },
                {
                  accessorKey: "voter_turnout.perc",
                  id: "voter_turnout.perc",
                  header: t("voter_turnout_%"),
                },
                {
                  accessorKey: "votes_rejected.abs",
                  id: "votes_rejected.abs",
                  header: t("rejected_votes"),
                },
                {
                  accessorKey: "votes_rejected.perc",
                  id: "votes_rejected.perc",
                  header: t("rejected_votes_%"),
                },
              ]}
            />
          </Panel>
          {/* <Panel name={t("election.map")} icon={<MapIcon className="mr-1 h-5 w-5" />}>
            <LeftRightCard
              left={
                <div className="flex h-full w-full flex-col space-y-6 p-8">
                  <div className="flex flex-col gap-2">
                    <h4>
                      {t("election.choro_header", {
                        stat: t(data.analysis_type.value),
                      })}
                    </h4>
                    <span className="text-dim text-sm">
                      {t("common.data_of", { date: choropleth.data_as_of })}
                    </span>
                  </div>
                  <div className="flex grow flex-col justify-between space-y-6">
                    <div className="space-y-3 pt-6">
                      <p className="font-bold">{t("election.choro_rank")}</p>
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
          </Panel> */}
        </Tabs>
      </div>
    </div>
  );
};

export default ElectionAnalysis;

const dummyData = [
  { seat: "P.001 Padang Besar, Perlis", data: { perc: 78.9 } },
  { seat: "P.002 Kangar, Perlis", data: { perc: 45.6 } },
  { seat: "P.003 Arau, Perlis", data: { perc: 12.3 } },
];
