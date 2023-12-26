import { Panel, Section, Tabs } from "datagovmy-ui/components";
import { CountryAndStates } from "datagovmy-ui/constants";
import { useTranslation } from "datagovmy-ui/hooks";
import dynamic from "next/dynamic";
import Image from "next/image";
import { FunctionComponent } from "react";

/**
 * COVID Vaccination Trends
 * @overview Status: In-development
 */

interface COVIDVaccinationTrendsProps {
  table: Record<string, any>;
}

const Table = dynamic(() => import("datagovmy-ui/charts/table"), { ssr: false });

const COVIDVaccinationTrends: FunctionComponent<COVIDVaccinationTrendsProps> = ({ table }) => {
  const { t } = useTranslation(["dashboard-covid-vaccination", "common"]);

  const VACCINE_TABLE_SCHEMA = () => {
    const subcolumn = {
      state: {
        header: "",
        id: "state",
        accessorKey: "state",
        enableSorting: false,
        cell: (item: any) => {
          const state = item.getValue() as string;
          return (
            <div className="flex items-center gap-2 w-36">
              <Image
                src={`/static/images/states/${state}.jpeg`}
                width={20}
                height={12}
                alt={CountryAndStates[state]}
              />
              <span>{CountryAndStates[state]}</span>
            </div>
          );
        },
      },
      total: [
        {
          id: "total.perc_dose1",
          header: t("table_1dose"),
          accessorFn: (item: any) => item.total.perc_dose1.toFixed(1),
          unit: "%",
        },
        {
          id: "total.perc_dose2",
          header: t("table_2dose"),
          accessorFn: (item: any) => item.total.perc_dose2.toFixed(1),
          unit: "%",
        },
        {
          id: "total.perc_booster1",
          header: t("table_1boost"),
          accessorFn: (item: any) => item.total.perc_booster1.toFixed(1),
          unit: "%",
        },
        {
          id: "total.perc_booster2",
          header: t("table_2boost"),
          accessorFn: (item: any) => item.total.perc_booster2.toFixed(1),
          unit: "%",
        },
      ],
      adult: [
        {
          id: "adult.perc_dose1",
          header: t("table_1dose"),
          accessorFn: (item: any) => item.adult.perc_dose1.toFixed(1),
          unit: "%",
        },
        {
          id: "adult.perc_dose2",
          header: t("table_2dose"),
          accessorFn: (item: any) => item.adult.perc_dose2.toFixed(1),
          unit: "%",
        },
        {
          id: "adult.perc_booster1",
          header: t("table_1boost"),
          accessorFn: (item: any) => item.adult.perc_booster1.toFixed(1),
          unit: "%",
        },
        {
          id: "adult.perc_booster2",
          header: t("table_2boost"),
          accessorFn: (item: any) => item.adult.perc_booster2.toFixed(1),
          unit: "%",
        },
      ],
      adolescent: [
        {
          id: "adol.perc_dose1",
          header: t("table_1dose"),
          accessorFn: (item: any) => item.adol.perc_dose1.toFixed(1),
          unit: "%",
        },
        {
          id: "adol.perc_dose2",
          header: t("table_2dose"),
          accessorFn: (item: any) => item.adol.perc_dose2.toFixed(1),
          unit: "%",
        },
        {
          id: "perc_booster1",
          header: t("table_1boost"),
          accessorFn: (item: any) => item.adol.perc_booster1.toFixed(1),
          unit: "%",
        },
      ],
      children: [
        {
          id: "child.perc_dose1",
          header: t("table_1dose"),
          accessorFn: (item: any) => item.child.perc_dose1.toFixed(1),
          unit: "%",
        },
        {
          id: "child.perc_dose2",
          header: t("table_2dose"),
          accessorFn: (item: any) => item.child.perc_dose2.toFixed(1),
          unit: "%",
        },
        {
          id: "child.perc_booster1",
          header: t("table_1boost"),
          accessorFn: (item: any) => item.child.perc_booster1.toFixed(1),
          unit: "%",
        },
      ],
    };

    return [
      {
        name: t("tab_table1"),
        config: [
          subcolumn.state,
          {
            id: "total",
            header: t("tab_table2"),
            columns: subcolumn.total,
          },
          {
            id: "adult",
            header: t("tab_table3"),
            columns: subcolumn.adult,
          },
          {
            id: "adolescent",
            header: t("tab_table4"),
            columns: subcolumn.adolescent,
          },
          {
            id: "children",
            header: t("tab_table5"),
            columns: subcolumn.children,
          },
        ],
      },
      {
        name: t("tab_table2"),
        config: [
          subcolumn.state,
          {
            id: "total",
            columns: subcolumn.total,
          },
        ],
      },
      {
        name: t("tab_table3"),
        config: [
          subcolumn.state,
          {
            id: "adult",
            columns: subcolumn.adult,
          },
        ],
      },
      {
        name: t("tab_table4"),
        config: [
          subcolumn.state,
          {
            id: "adolescent",
            columns: subcolumn.adolescent,
          },
        ],
      },
      {
        name: t("tab_table5"),
        config: [
          subcolumn.state,
          {
            id: "children",
            columns: subcolumn.children,
          },
        ],
      },
    ];
  };

  return (
    <>
      <Section title={t("table_header")} date={table.data_as_of}>
        <div>
          <Tabs className="flex flex-wrap gap-2 pb-4" title={t("table_subheader")}>
            {VACCINE_TABLE_SCHEMA().map((menu, index) => {
              return (
                <Panel key={index} name={menu.name}>
                  <Table
                    className="text-sm text-right table-sticky-first"
                    data={table.data}
                    config={menu.config}
                    enableRowPin={true}
                    defaultRowPin={{
                      top: ["0"],
                    }}
                    freeze={["state"]}
                  />
                </Panel>
              );
            })}
          </Tabs>
        </div>
      </Section>
    </>
  );
};

export default COVIDVaccinationTrends;
