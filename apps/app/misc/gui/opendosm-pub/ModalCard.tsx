import { PubResource } from "datagovmy-ui/components";
import { useTranslation } from "datagovmy-ui/hooks";
import { useContext } from "react";
import { toDate } from "datagovmy-ui/helpers";
import Table, { TableConfig } from "datagovmy-ui/charts/table";
import { WindowContext } from "datagovmy-ui/contexts/window";
import { BREAKPOINTS } from "datagovmy-ui/constants";
import { ExcelIcon, PDFIcon } from "datagovmy-ui/icons";

const ModalAsCard = ({ publication }: { publication: PubResource }) => {
  const { t, i18n } = useTranslation(["publications"]);
  const { size } = useContext(WindowContext);

  const config: TableConfig[] = [
    {
      accessorKey: "resource_name",
      id: "resource_name",
      header: t("subject"),
      enableSorting: false,
      cell: ({ getValue }) => {
        return <p className="whitespace-normal">{getValue()}</p>;
      },
    },
    {
      accessorKey: "resource_link",
      id: "download_link",
      header: t("file_download"),
      enableSorting: false,
      cell: ({ row, getValue }) => {
        return (
          <div className="link-primary font-normal" onClick={() => {}}>
            {row.original.resource_type === "excel" ? (
              <ExcelIcon className="inline h-5 w-5 pr-1 text-black dark:text-white" />
            ) : (
              <PDFIcon className="inline h-5 w-5 pr-1 text-black dark:text-white" />
            )}
            {size.width <= BREAKPOINTS.SM
              ? t("download_mobile", { context: row.original.resource_type })
              : t("download", { context: row.original.resource_type })}
          </div>
        );
      },
    },
    {
      accessorKey: "downloads",
      id: "downloads",
      className: "w-20",
      header: t("downloads"),
    },
  ];

  return (
    <div className="border-outline shadow-floating dark:border-outlineHover-dark w-full rounded-xl border bg-white p-6">
      <div className="flex flex-col gap-y-1.5 text-black dark:text-white">
        <span className="text-dim pr-8 text-sm uppercase">
          {toDate(publication.release_date, "dd MMM yyyy", i18n.language)}
        </span>
        <span className="text-lg font-bold">{publication.title}</span>
        <p className="text-sm">{publication.description}</p>
      </div>
      <div className="flex flex-col justify-between gap-3 pt-6 sm:flex-row sm:items-center">
        <h5>{t("download_list")}</h5>
      </div>
      <Table
        className="pt-3 md:w-full"
        data={publication.resources}
        enablePagination={publication.resources.length > 10 ? 10 : false}
        config={config}
        precision={0}
      />
    </div>
  );
};

export default ModalAsCard;
