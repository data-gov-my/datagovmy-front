import { CountryAndStates } from "@lib/constants";
import { useTranslation } from "next-i18next";
import Image from "next/image";

export const FACILTIES_TABLE_SCHEMA = () => {
  const { t } = useTranslation();
  return [
    {
      header: t("common.name"),
      sortDescFirst: true,
      accessorKey: "data.name",
      id: "name",
    },
    {
      header: t("common.state"),
      id: "state",
      accessorKey: "state",
      enableSorting: false,
      cell: (item: any) => {
        const state = item.getValue() as string;
        return (
          <div className="flex items-center gap-2">
            {/* <Image
              src={`/static/images/states/${state}.jpeg`}
              width={20}
              height={12}
              alt={CountryAndStates[state]}
            /> */}
            <span className="text-sm">{CountryAndStates[state]}</span>
          </div>
        );
      },
    },
    {
      header: t("common.district"),
      sortDescFirst: true,
      accessorKey: "data.district",
      id: "district",
      enableSorting: true,
    },
    {
      header: t("healthcare.table_sector"),
      sortDescFirst: true,
      accessorKey: "data.sector",
      accessorFn: (item: any) => t("healthcare.".concat(item.data.sector)),
      id: "sector",
      enableSorting: false,
    },
    {
      header: t("common.type"),
      sortDescFirst: true,
      accessorFn: (item: any) => t("healthcare.".concat(item.data.type)), /// "data.type",
      id: "type",
      enableSorting: false,
    },
    {
      header: t("healthcare.table_address"),
      sortDescFirst: true,
      accessorKey: "data.address",
      id: "address",
    },
    {
      header: t("healthcare.table_telephone"),
      sortDescFirst: true,
      accessorKey: "data.phone",
      id: "phone",
      enableSorting: false,
    },
  ];
};
