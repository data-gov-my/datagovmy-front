import { CountryAndStates } from "@lib/constants";
import { useTranslation } from "next-i18next";
import Image from "next/image";

export const VACCINE_TABLE_SCHEMA = () => {
  const { t } = useTranslation();

  const subcolumn = {
    state: {
      header: "",
      id: "state",
      accessorKey: "state",
      enableSorting: false,
      cell: (item: any) => {
        const state = item.getValue() as string;
        return (
          <div className="flex items-center gap-2">
            <Image
              src={`/static/images/states/${state}.jpeg`}
              width={20}
              height={12}
              alt={CountryAndStates[state]}
            />
            <span className="block text-sm">{CountryAndStates[state]}</span>
          </div>
        );
      },
    },
    total: [
      {
        id: "total.perc_dose1",
        header: t("vaccination.table_1dose"),
        accessorFn: (item: any) => item.total.perc_dose1.toFixed(1),
        unit: "%",
      },
      {
        id: "total.perc_dose2",
        header: t("vaccination.table_2dose"),
        accessorFn: (item: any) => item.total.perc_dose2.toFixed(1),
        unit: "%",
      },
      {
        id: "total.perc_booster1",
        header: t("vaccination.table_1boost"),
        accessorFn: (item: any) => item.total.perc_booster1.toFixed(1),
        unit: "%",
      },
      {
        id: "total.perc_booster2",
        header: t("vaccination.table_2boost"),
        accessorFn: (item: any) => item.total.perc_booster2.toFixed(1),
        unit: "%",
      },
    ],
    adult: [
      {
        id: "adult.perc_dose1",
        header: t("vaccination.table_1dose"),
        accessorFn: (item: any) => item.adult.perc_dose1.toFixed(1),
        unit: "%",
      },
      {
        id: "adult.perc_dose2",
        header: t("vaccination.table_2dose"),
        accessorFn: (item: any) => item.adult.perc_dose2.toFixed(1),
        unit: "%",
      },
      {
        id: "adult.perc_booster1",
        header: t("vaccination.table_1boost"),
        accessorFn: (item: any) => item.adult.perc_booster1.toFixed(1),
        unit: "%",
      },
      {
        id: "adult.perc_booster2",
        header: t("vaccination.table_2boost"),
        accessorFn: (item: any) => item.adult.perc_booster2.toFixed(1),
        unit: "%",
      },
    ],
    adolescent: [
      {
        id: "adol.perc_dose1",
        header: t("vaccination.table_1dose"),
        accessorFn: (item: any) => item.adol.perc_dose1.toFixed(1),
        unit: "%",
      },
      {
        id: "adol.perc_dose2",
        header: t("vaccination.table_2dose"),
        accessorFn: (item: any) => item.adol.perc_dose2.toFixed(1),
        unit: "%",
      },
      {
        id: "perc_booster1",
        header: t("vaccination.table_1boost"),
        accessorFn: (item: any) => item.adol.perc_booster1.toFixed(1),
        unit: "%",
      },
    ],
    children: [
      {
        id: "child.perc_dose1",
        header: t("vaccination.table_1dose"),
        accessorFn: (item: any) => item.child.perc_dose1.toFixed(1),
        unit: "%",
      },
      {
        id: "child.perc_dose2",
        header: t("vaccination.table_2dose"),
        accessorFn: (item: any) => item.child.perc_dose2.toFixed(1),
        unit: "%",
      },
      {
        id: "child.perc_booster1",
        header: t("vaccination.table_1boost"),
        accessorFn: (item: any) => item.child.perc_booster1.toFixed(1),
        unit: "%",
      },
    ],
  };

  return [
    {
      name: t("vaccination.tab_table1"),
      config: [
        subcolumn.state,
        {
          id: "total",
          header: t("vaccination.tab_table2"),
          columns: subcolumn.total,
        },
        {
          id: "adult",
          header: t("vaccination.tab_table3"),
          columns: subcolumn.adult,
        },
        {
          id: "adolescent",
          header: t("vaccination.tab_table4"),
          columns: subcolumn.adolescent,
        },
        {
          id: "children",
          header: t("vaccination.tab_table5"),
          columns: subcolumn.children,
        },
      ],
    },
    {
      name: t("vaccination.tab_table2"),
      config: [
        subcolumn.state,
        {
          id: "total",
          //   header: t("vaccination.tab_table2"),
          columns: subcolumn.total,
        },
      ],
    },
    {
      name: t("vaccination.tab_table3"),
      config: [
        subcolumn.state,
        {
          id: "adult",
          //   header: t("vaccination.tab_table3"),
          columns: subcolumn.adult,
        },
      ],
    },
    {
      name: t("vaccination.tab_table4"),
      config: [
        subcolumn.state,
        {
          id: "adolescent",
          //   header: "Adolescents",
          columns: subcolumn.adolescent,
        },
      ],
    },
    {
      name: t("vaccination.tab_table5"),
      config: [
        subcolumn.state,
        {
          id: "children",
          //   header: t("vaccination.tab_table5"),
          columns: subcolumn.children,
        },
      ],
    },
  ];
};
