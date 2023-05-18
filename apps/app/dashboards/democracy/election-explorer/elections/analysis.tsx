import { FunctionComponent } from "react";
import dynamic from "next/dynamic";
import { Dropdown, Section, Tabs } from "@components/index";
import LeftRightCard from "@components/LeftRightCard";
import { List, Panel } from "@components/Tabs";
import { OptionType } from "@components/types";
import { useData } from "@hooks/useData";
import { useTranslation } from "@hooks/useTranslation";
import { MapIcon, TableCellsIcon } from "@heroicons/react/24/solid";
import { generateSchema } from "@lib/schema/election-explorer";
import BarPerc from "@components/Chart/BarMeter/BarPerc";

/**
 * Election Explorer Dashboard
 * @overview Status: In-development
 */

const ElectionTable = dynamic(() => import("@components/Chart/Table/ElectionTable"), {
  ssr: false,
});
const Choropleth = dynamic(() => import("@components/Chart/Choropleth"), { ssr: false });

type AnalysisPlaceholder = {
  seat: string;
  data: {
    perc: number;
  };
};

interface ElectionAnalysisProps {}

const ElectionAnalysis: FunctionComponent<ElectionAnalysisProps> = () => {
  const { t } = useTranslation(["dashboard-election-explorer", "common"]);

  const FILTER_OPTIONS: Array<OptionType> = [
    "voter_turnout",
    "majority_%",
    "rejected_votes",
    "%_PH",
    "num_voters",
  ].map((key: string) => ({
    label: t(`election.${key}`),
    value: key,
  }));

  const { data, setData } = useData({
    tab_index: 0,
    loading: false,
    analysis_type: FILTER_OPTIONS[0],
  });

  return (
    <Section>
      <div className="pb-8 lg:grid lg:grid-cols-12 lg:pb-12">
        <div className="lg:col-span-10 lg:col-start-2">
          <h4 className="py-4 text-center">{t("election.section_3")}</h4>
          <div className="flex flex-row justify-between gap-4 pb-6 sm:flex-row">
            <div className="flex flex-row items-baseline gap-2 lg:gap-4">
              <Dropdown
                anchor="left"
                width="w-fit"
                options={FILTER_OPTIONS}
                selected={FILTER_OPTIONS.find(e => e.value === data.analysis_type.value)}
                onChange={e => setData("analysis_type", e)}
              />
            </div>
            <List
              options={[t("election.map"), t("election.table")]}
              icons={[
                <MapIcon key="map_icon" className="mr-1 h-5 w-5" />,
                <TableCellsIcon key="table_cell_icon" className="mr-1 h-5 w-5" />,
              ]}
              current={data.tab_index}
              onChange={index => setData("tab_index", index)}
            />
          </div>
          <Tabs hidden current={data.tab_index} onChange={index => setData("tab_index", index)}>
            <Panel name={t("election.map")} icon={<MapIcon className="mr-1 h-5 w-5" />}>
              <LeftRightCard
                left={
                  <div className="flex h-full w-full flex-col space-y-6 p-8">
                    <div className="flex flex-col gap-2">
                      <h4>
                        {t("election.choro_header", {
                          stat: t(`election.${data.analysis_type.value}`),
                        })}
                      </h4>
                      <span className="text-dim text-sm">
                        {/* {t("common.data_of", { date: choropleth.data_as_of })} */}
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
                    enableOutline={false}
                    type={data.list_index === 1 ? "dun" : "parlimen"}
                  />
                }
              />
            </Panel>
            <Panel name={t("election.table")} icon={<TableCellsIcon className="mr-1 h-5 w-5" />}>
              <ElectionTable
                isLoading={data.loading}
                data={dummyData}
                columns={generateSchema<AnalysisPlaceholder>([
                  {
                    key: "seat",
                    id: "constituency",
                    header: t("constituency"),
                  },
                  {
                    key: "data",
                    id: "data",
                    header: t(`election.${data.analysis_type.value}`),
                    cell: ({ getValue }) => {
                      return (
                        <BarPerc
                          className="flex flex-row-reverse items-center gap-3"
                          value={getValue().perc}
                        />
                      );
                    },
                  },
                ])}
              />
            </Panel>
          </Tabs>
        </div>
      </div>
    </Section>
  );
};

export default ElectionAnalysis;

const dummyData = [
  { seat: "P.001 Padang Besar, Perlis", data: { perc: 78.9 } },
  { seat: "P.002 Kangar, Perlis", data: { perc: 45.6 } },
  { seat: "P.003 Arau, Perlis", data: { perc: 12.3 } },
];
