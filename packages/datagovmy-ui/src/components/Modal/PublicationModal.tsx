import { ExcelIcon, PDFIcon, QuoteIcon } from "../../icons";
import { Dialog, Transition } from "@headlessui/react";
import { CheckCircleIcon } from "@heroicons/react/20/solid";
import { DocumentDuplicateIcon, ChevronLeftIcon } from "@heroicons/react/24/solid";
import { XMarkIcon } from "@heroicons/react/24/solid";
import Table, { TableConfig } from "datagovmy-ui/charts/table";
import { At, Button, Search, Spinner } from "datagovmy-ui/components";
import { body } from "datagovmy-ui/configs/font";
import { BREAKPOINTS } from "datagovmy-ui/constants";
import { WindowContext } from "datagovmy-ui/contexts/window";
import { clx, toDate } from "datagovmy-ui/helpers";
import { useData, useTranslation } from "datagovmy-ui/hooks";
import { matchSorter } from "match-sorter";
import { FC, Fragment, FunctionComponent, useContext, useMemo } from "react";
import { AnalyticsContext } from "../../contexts/analytics";
import { useRouter } from "next/router";
import { OptionType } from "../../../types";
import { DateTime } from "luxon";

export type PubResource = {
  description: string;
  release_date: string;
  resources: Resource[];
  title: string;
};

export type Resource = {
  resource_id: number;
  resource_name: string;
  resource_link: string;
  resource_type: string;
  downloads: number;
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
  const { send_new_analytics } = useContext(AnalyticsContext);
  const { t, i18n } = useTranslation(["publications", "common"]);
  const { size } = useContext(WindowContext);

  const TAB_OPTIONS: Array<OptionType> = [
    {
      label: t("citation.copy_citation"),
      value: "citation",
    },
    {
      label: t("citation.copy_bibtex"),
      value: "bibtex",
    },
  ];

  const { data, setData } = useData({
    copied: false,
    query: "",
    tab_index: TAB_OPTIONS[0].value,
    cite: false,
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
        const handleDownload = () => {
          send_new_analytics(pub_id, "publication", "file_download", {
            format: row.original.resource_type,
            publication_id: pub_id,
            resource_id: row.original.resource_id,
          });
          post(row.original.resource_id);
        };
        return (
          <At
            external
            href={getValue()}
            className="link-primary font-normal"
            onClick={e => {
              e.preventDefault();
              handleDownload();
              window.open(getValue(), "_blank");
            }}
          >
            {row.original.resource_type === "excel" ? (
              <ExcelIcon className="inline h-5 w-5 pr-1 text-black dark:text-white" />
            ) : (
              <PDFIcon className="inline h-5 w-5 pr-1 text-black dark:text-white" />
            )}
            {size.width <= BREAKPOINTS.SM
              ? t("download_mobile", { context: row.original.resource_type })
              : t("download", { context: row.original.resource_type })}
          </At>
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
    <>
      {publication && (
        <Transition show={show} as={Fragment}>
          <Dialog
            as="div"
            className="relative z-30"
            onClose={() => {
              hide();
              setData("query", "");
              setData("cite", false);
            }}
          >
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
                      "border-outline shadow-floating dark:border-outlineHover-dark w-full max-w-4xl transform rounded-xl border bg-white p-6 text-left align-middle font-sans transition-all dark:bg-black"
                    )}
                  >
                    {loading ? (
                      <div className="flex h-[300px] w-full items-center justify-center">
                        <Spinner loading={loading} />
                      </div>
                    ) : !data.cite ? (
                      <>
                        <Dialog.Title
                          as="div"
                          className="flex flex-col gap-y-1.5 text-black dark:text-white"
                        >
                          <span className="text-dim pr-8 text-sm uppercase">
                            {toDate(publication.release_date, "dd MMM yyyy", i18n.language)}
                          </span>
                          <span className="text-lg font-bold">{publication.title}</span>
                          <p className="text-sm">{publication.description}</p>
                          <div className="flex items-center gap-4">
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
                              className={clx(
                                "flex items-center gap-1.5 pt-1.5 text-sm",
                                "text-primary dark:text-primary-dark"
                              )}
                              onClick={() => {
                                setData("cite", true);
                              }}
                            >
                              <QuoteIcon className="size-4.5" />
                              {t("cite_button")}
                            </Button>
                          </div>
                          <Button
                            variant="reset"
                            className="hover:bg-washed dark:hover:bg-washed-dark group absolute right-4 top-4 h-9 w-9 rounded-full"
                            onClick={() => {
                              hide();
                              setData("query", "");
                            }}
                          >
                            <XMarkIcon className="text-dim mx-auto h-6 w-6 group-hover:text-black group-hover:dark:text-white" />
                          </Button>
                        </Dialog.Title>
                        <div className="flex flex-col justify-between gap-3 pt-6 sm:flex-row sm:items-center">
                          <h5>{t("download_list")}</h5>
                          {publication.resources.length > 5 && (
                            <Search
                              className="border-outline text-dim dark:border-outlineHover-dark w-full rounded-md border sm:w-[300px]"
                              placeholder={t("search_subject")}
                              onChange={q => setData("query", q)}
                              query={data.query}
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
                    ) : (
                      <>
                        <Dialog.Title
                          as="div"
                          className="flex flex-col gap-y-1.5 text-black dark:text-white"
                        >
                          <div className="flex gap-3">
                            <Button
                              variant="reset"
                              className={clx(
                                "flex gap-1.5 pt-1 text-sm text-dim hover:bg-background h-fit"
                              )}
                              onClick={() => {
                                setData("cite", false);
                              }}
                            >
                              <ChevronLeftIcon className="size-6" />
                            </Button>
                            <div>
                              <span className="text-lg font-bold">{t("citation.title")}</span>

                              <p className="text-sm">{t("citation.description")}</p>
                            </div>
                          </div>
                        </Dialog.Title>
                        <nav className="flex overflow-hidden border-b border-b-outline bg-white dark:border-b-washed-dark dark:bg-black pt-6">
                          <div className="hide-scrollbar max-[420px]:justify-start, flex snap-x snap-mandatory scroll-px-9 flex-nowrap overflow-x-auto max-sm:justify-start">
                            {TAB_OPTIONS.map(tab => (
                              <div key={tab.value} className="snap-start">
                                <div
                                  className="flex h-full min-w-[56px] cursor-pointer items-center justify-center outline-none"
                                  onClick={() => setData("tab_index", tab.value)}
                                >
                                  <div className="relative flex h-full flex-col items-center justify-center px-2 py-4">
                                    <div
                                      className={clx(
                                        "flex items-center gap-2",
                                        data.tab_index === tab.value
                                          ? "text-black dark:text-white"
                                          : "text-dim"
                                      )}
                                    >
                                      <span className="whitespace-nowrap text-sm font-medium">
                                        {tab.label}
                                      </span>
                                    </div>
                                    {data.tab_index === tab.value && (
                                      <div className="absolute bottom-0 inline-flex h-[2px] w-full min-w-[56px] rounded-full bg-primary dark:bg-primary-dark" />
                                    )}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </nav>

                        {data.tab_index === "citation" && (
                          <CitationBlock type="citation" resource={publication} />
                        )}
                        {data.tab_index === "bibtex" && (
                          <CitationBlock type="bibtex" resource={publication} />
                        )}
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

interface CitationBlockProps {
  type: "citation" | "bibtex";
  resource: PubResource;
}
const CitationBlock: FC<CitationBlockProps> = ({ type, resource }) => {
  const { t, i18n } = useTranslation(["publications", "common", "agencies"]);
  const { asPath, query } = useRouter();

  const citationList = ["harvard", "chicago", "mla", "apa", "vancouver"] as const;
  const bibtexList = ["bibtex"] as const;

  const siteName = "OpenDOSM";
  const path = asPath.split("?")[0];

  const getCitationData = (type: (typeof citationList)[number] | (typeof bibtexList)[number]) => {
    switch (type) {
      case "harvard":
        return {
          name: "Harvard",
          citation: (
            <>
              {t("agencies:dosm.full")}, {DateTime.now().year}.{" "}
              <span className="italic">{resource.title}</span>. {siteName}.{" "}
              {t("common:common.available_at")}:{" "}
              <span className="link-primary underline">{`${process.env.NEXT_PUBLIC_APP_URL}${path}`}</span>{" "}
              [{t("common:common.accessed")} {DateTime.now().toFormat("d MMMM yyyy")}].
            </>
          ),
        };
      case "chicago":
        return {
          name: "Chicago",
          citation: (
            <>
              {t("agencies:dosm.full")}. "{resource.title}."{" "}
              <span className="italic">{siteName}.</span> {t("common:common.last_modified")}{" "}
              {DateTime.fromISO(resource.release_date).toFormat("MMMM d, yyyy")}.{" "}
              <span className="link-primary underline">{`${process.env.NEXT_PUBLIC_APP_URL}${path}`}</span>
              .
            </>
          ),
        };
      case "mla":
        return {
          name: "MLA",
          citation: (
            <>
              {t("agencies:dosm.full")}. "{resource.title}."{" "}
              <span className="italic">{siteName}</span>,{" "}
              {DateTime.fromISO(resource.release_date).toFormat("d MMM yyyy")}.{" "}
              <span className="link-primary underline">{`${process.env.NEXT_PUBLIC_APP_URL}${path}`}</span>
              .
            </>
          ),
        };
      case "apa":
        return {
          name: "APA",
          citation: (
            <>
              {t("agencies:dosm.full")}. (
              {DateTime.fromISO(resource.release_date).toFormat("yyyy, MMMM d")}).{" "}
              <span className="italic">{resource.title}</span>. {siteName}.{" "}
              <span className="link-primary underline">{`${process.env.NEXT_PUBLIC_APP_URL}${path}`}</span>
              .
            </>
          ),
        };
      case "vancouver":
        return {
          name: "Vancouver",
          citation: (
            <>
              {t("agencies:dosm.full")}. {resource.title} [Internet]. {t("agencies:dosm.full")};{" "}
              {DateTime.fromISO(resource.release_date).toFormat("yyyy MMM d")} [
              {t("common:common.cited")} {DateTime.now().toFormat("yyyy MMM d")}]{" "}
              {t("common:common.available_from")}:{" "}
              <span className="link-primary underline">{`${process.env.NEXT_PUBLIC_APP_URL}${path}`}</span>
              .
            </>
          ),
        };
      case "bibtex":
        return {
          name: "BibTeX",
          citation: (
            <>
              @misc{"{"}
              {query.pub_id && query.pub_id[0]},
              <br />
              &nbsp;&nbsp;author = {"{{"}
              {t("agencies:dosm.full")}
              {"}}"},
              <br />
              &nbsp;&nbsp;title = {"{"}
              {resource.title}
              {"}"},
              <br />
              &nbsp;&nbsp;year = {"{"}
              {DateTime.now().year}
              {"}"},
              <br />
              &nbsp;&nbsp;url = {"{"}
              {`${process.env.NEXT_PUBLIC_APP_URL}${path}`}
              {"}"},
              <br />
              &nbsp;&nbsp;urldate = {"{"}
              {DateTime.now().toISODate()}
              {"}"},
              <br />
              &nbsp;&nbsp;publisher = {"{"}
              {siteName}
              {"}"}
              <br />
              {"}"}
            </>
          ),
        };

      default:
        return {};
    }
  };

  if (type === "citation") {
    return (
      <div className="flex flex-col">
        {citationList.map((list, index, arr) => {
          const { data, setData } = useData({
            copied: false,
          });
          const meta = getCitationData(list);
          return (
            <div
              className={clx(
                "py-5 flex flex-col gap-2 relative",
                arr.length - 1 !== index && "border-b border-outline"
              )}
            >
              <p className="text-sm font-medium">{meta.name}</p>
              <p id={`citation-${list}`} className="text-sm text-dim break-words">
                {meta?.citation}
              </p>
              <Button
                variant="reset"
                onClick={async () => {
                  const str = document.getElementById(`citation-${list}`)?.innerText || "";
                  navigator.clipboard.writeText(str);
                  setData("copied", true);
                  setTimeout(() => setData("copied", false), 1000);
                }}
                className={clx(
                  "flex items-center text-sm absolute right-0",
                  data.copied ? "text-success" : "text-primary dark:text-primary-dark"
                )}
              >
                {data.copied ? (
                  <>
                    <CheckCircleIcon className="size-5" />
                  </>
                ) : (
                  <>
                    <DocumentDuplicateIcon className="size-5" />
                  </>
                )}
              </Button>
            </div>
          );
        })}
      </div>
    );
  }

  if (type === "bibtex") {
    return (
      <div className="flex flex-col">
        {bibtexList.map((list, index, arr) => {
          const { data, setData } = useData({
            copied: false,
          });
          const meta = getCitationData(list);
          return (
            <div
              className={clx(
                "py-5 flex flex-col gap-2 relative",
                arr.length - 1 !== index && "border-b border-outline"
              )}
            >
              <p className="text-sm font-medium">{meta.name}</p>
              <p id={`citation-${list}`} className="text-sm text-dim break-words">
                {meta?.citation}
              </p>
              <Button
                variant="reset"
                onClick={async () => {
                  const str = document.getElementById(`citation-${list}`)?.innerText || "";
                  navigator.clipboard.writeText(str);
                  setData("copied", true);
                  setTimeout(() => setData("copied", false), 1000);
                }}
                className={clx(
                  "flex items-center text-sm absolute right-0",
                  data.copied ? "text-success" : "text-primary dark:text-primary-dark"
                )}
              >
                {data.copied ? (
                  <>
                    <CheckCircleIcon className="size-5" />
                  </>
                ) : (
                  <>
                    <DocumentDuplicateIcon className="size-5" />
                  </>
                )}
              </Button>
            </div>
          );
        })}
      </div>
    );
  }

  return null;
};
