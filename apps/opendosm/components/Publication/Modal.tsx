import { ExcelIcon, PDFIcon } from "../../icons";
import { Dialog, Transition } from "@headlessui/react";
import { CheckCircleIcon } from "@heroicons/react/20/solid";
import { DocumentDuplicateIcon } from "@heroicons/react/24/solid";
import { XMarkIcon } from "@heroicons/react/24/solid";
import Table, { TableConfig } from "datagovmy-ui/charts/table";
import { At, Button, Search, Spinner } from "datagovmy-ui/components";
import { body } from "datagovmy-ui/configs/font";
import { clx, toDate } from "datagovmy-ui/helpers";
import { useData, useTranslation } from "datagovmy-ui/hooks";
import { matchSorter } from "match-sorter";
import { Resource } from "misc/publications/browse";
import { Fragment, FunctionComponent, useMemo } from "react";

type PubResource = {
  description: string;
  release_date: string;
  resources: Resource[];
  title: string;
};

interface PublicationModalProps {
  hide: () => void;
  loading: true;
  post: (resource_id: number) => void;
  pub_id: string;
  publication?: PubResource;
  show: boolean;
  type: "/" | "/technical-notes/";
}
const PublicationModal: FunctionComponent<PublicationModalProps> = ({
  hide,
  loading,
  post,
  pub_id,
  publication,
  show,
  type,
}) => {
  const { t, i18n } = useTranslation(["publications", "common"]);
  const { data, setData } = useData({
    copied: false,
    query: "",
  });

  const filteredRes = useMemo(
    () =>
      matchSorter(publication ? publication.resources : [], data.query, {
        baseSort: (a, b) => (a.index < b.index ? -1 : 1), // no sort
        keys: ["resource_name"],
      }),
    [publication, data.query]
  );

  const config: TableConfig[] = [
    {
      accessorKey: "resource_name",
      id: "resource_name",
      header: t("subject"),
      enableSorting: false,
    },
    {
      accessorKey: "resource_link",
      id: "download_link",
      header: t("file_download"),
      enableSorting: false,
      cell: ({ row, getValue }) => {
        return (
          <At
            external
            href={getValue()}
            className="link-primary font-normal"
            onClick={() => post(row.original.resource_id)}
          >
            {row.original.resource_type === "excel" ? (
              <ExcelIcon className="inline h-5 w-5 pr-1 text-black dark:text-white" />
            ) : (
              <PDFIcon className="inline h-5 w-5 pr-1 text-black dark:text-white" />
            )}
            {t("download", { context: row.original.resource_type })}
          </At>
        );
      },
    },
    {
      accessorKey: "downloads",
      id: "downloads",
      header: t("downloads"),
    },
  ];

  return (
    <>
      {publication && (
        <Transition show={show} as={Fragment}>
          <Dialog as="div" className="relative z-30" onClose={hide}>
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="fixed inset-0 bg-black bg-opacity-25" />
            </Transition.Child>

            <div className="fixed inset-0 overflow-y-auto">
              <div className="flex min-h-full items-center justify-center p-2 text-center">
                <Transition.Child
                  as={Fragment}
                  enter="ease-out duration-300"
                  enterFrom="opacity-0 scale-95"
                  enterTo="opacity-100 scale-100"
                  leave="ease-in duration-200"
                  leaveFrom="opacity-100 scale-100"
                  leaveTo="opacity-0 scale-95"
                >
                  <Dialog.Panel
                    className={clx(
                      body.variable,
                      "w-full max-w-4xl transform rounded-xl border border-outline bg-white p-6 text-left align-middle font-sans shadow-floating transition-all dark:border-outlineHover-dark dark:bg-black"
                    )}
                  >
                    {loading ? (
                      <div className="flex h-[300px] w-full items-center justify-center">
                        <Spinner loading={loading} />
                      </div>
                    ) : (
                      <>
                        <Dialog.Title
                          as="div"
                          className="flex flex-col gap-y-1.5 text-black dark:text-white"
                        >
                          <span className="pr-8 text-sm uppercase text-dim">
                            {toDate(publication.release_date, "dd MMM yyyy", i18n.language)}
                          </span>
                          <span className="text-lg font-bold">{publication.title}</span>
                          <p className="text-sm">{publication.description}</p>

                          <Button
                            variant="reset"
                            onClick={() => {
                              navigator.clipboard.writeText(
                                `https://open.dosm.gov.my/publications${type}${pub_id}`
                              );
                              setData("copied", true);
                              setTimeout(() => setData("copied", false), 1000);
                            }}
                            className={clx(
                              "flex items-center gap-1.5 pt-1.5 text-sm",
                              data.copied ? "text-success" : "text-primary dark:text-primary-dark"
                            )}
                          >
                            {data.copied ? (
                              <>
                                <CheckCircleIcon className="h-4.5 w-4.5" />
                                {t("common:common.copied")}
                              </>
                            ) : (
                              <>
                                <DocumentDuplicateIcon className="h-4.5 w-4.5" />
                                {t("copy_publication_link")}
                              </>
                            )}
                          </Button>
                          <Button
                            variant="reset"
                            className="group absolute right-4 top-4 h-9 w-9 rounded-full hover:bg-washed dark:hover:bg-washed-dark"
                            onClick={hide}
                          >
                            <XMarkIcon className="mx-auto h-6 w-6 text-dim group-hover:text-black group-hover:dark:text-white" />
                          </Button>
                        </Dialog.Title>
                        <div className="flex flex-col justify-between gap-3 pt-6 sm:flex-row sm:items-center">
                          <h5>{t("download_list")}</h5>
                          {filteredRes.length > 5 && (
                            <Search
                              className="w-full rounded-md border border-outline text-dim dark:border-outlineHover-dark sm:w-[300px]"
                              placeholder={t("search_subject")}
                              onChange={q => setData("query", q)}
                            />
                          )}
                        </div>
                        <Table
                          className="pt-3 md:w-full"
                          data={filteredRes}
                          enablePagination={filteredRes.length > 10 ? 10 : false}
                          config={config}
                          precision={0}
                        />
                      </>
                    )}
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </div>
          </Dialog>
        </Transition>
      )}
    </>
  );
};

export default PublicationModal;
