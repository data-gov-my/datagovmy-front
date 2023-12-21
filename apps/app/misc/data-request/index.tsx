import {
  Button,
  Container,
  Input,
  Modal,
  NumberedPagination,
  Panel,
  Section,
  Spinner,
  Tabs,
} from "datagovmy-ui/components";
import { useData, useFilter, useTranslation, useWatch } from "datagovmy-ui/hooks";
import { DataRequestItem, DataRequestStatus } from "pages/data-request";
import { FunctionComponent, useCallback, useEffect } from "react";
import {
  TicketIcon,
  MagnifyingGlassIcon,
  ClockIcon,
  XCircleIcon,
  CheckCircleIcon,
  ArrowUpRightIcon,
  BellAlertIcon,
} from "@heroicons/react/20/solid";
import { OptionType } from "datagovmy-ui/types";
import Table, { TableConfig } from "datagovmy-ui/charts/table";
import { AKSARA_COLOR } from "datagovmy-ui/constants";
import { clx } from "datagovmy-ui/helpers";
import { PublishedDataModal, RequestDataModal } from "./modal";
import { useRouter } from "next/router";
import { debounce } from "lodash";
import { DateTime } from "luxon";

interface DataRequestDashboardProps {
  query: any;
  total_requests: number;
  items: Array<DataRequestItem>;
}

const DataRequestDashboard: FunctionComponent<DataRequestDashboardProps> = ({
  query,
  total_requests,
  items,
}) => {
  const { t } = useTranslation(["data-request", "catalogue", "agencies"]);

  const STATUS_OPTIONS: OptionType[] = [
    {
      label: t("status.all"),
      value: "all",
    },
    {
      label: t("status.under_review"),
      value: "under_review",
    },
    {
      label: t("status.data_published"),
      value: "data_published",
    },
    {
      label: t("status.rejected"),
      value: "rejected",
    },
  ];

  const { events } = useRouter();
  const { data, setData } = useData({
    loading: false,
    modal_loading: false,
    show_request: false,
    show_published: false,
    published_data: [],
    search_query: query.ticket_id ? `id: ${query.ticket_id}` : query.query ? query.query : "",
    page: 1,
    tab: query.status ? STATUS_OPTIONS.findIndex(item => item.value === query.status) : 0,
  });
  const baseClass = "text-sm font-normal";

  useWatch(() => {
    data.show_request || data.show_published
      ? (document.body.style.overflow = "hidden")
      : (document.body.style.overflow = "unset");
  }, [data.show_request, data.show_published]);

  useEffect(() => {
    events.on("routeChangeComplete", () => {
      setData("loading", false);
      setData("modal_loading", false);
    });
    return () => {
      events.off("routeChangeComplete", () => {
        setData("loading", false);
        setData("modal_loading", false);
      });
    };
  }, []);

  const { filter, setFilter } = useFilter({
    status: query.status ? STATUS_OPTIONS.find(item => item.value === query.status) : undefined,
    query: query.query ? query.query : undefined,
    ticket_id: query.ticket_id ? query.ticket_id : undefined,
  });

  const tableConfig: TableConfig<DataRequestItem>[] = [
    {
      accessorKey: "status",
      id: "status",
      header: t("table.status"),
      cell: ({ row, getValue }) => <>{renderStatus(getValue(), row)}</>,
    },
    {
      accessorKey: "dataset_title",
      id: "dataset_title",
      header: t("table.title"),
      className: "max-sm:max-w-[300px] md:max-w-[150px] truncate",
      cell: ({ row, getValue }) => {
        return (
          <div className={clx("flex items-center gap-1")}>
            <p className={clx(baseClass, "max-w-[220px] truncate")}>{getValue()}</p>
          </div>
        );
      },
    },
    {
      accessorKey: "dataset_description",
      id: "dataset_description",
      enableSorting: false,
      className: "max-sm:max-w-[300px] md:max-w-[400px] truncate",
      header: t("table.description"),
    },
    {
      accessorKey: "agency",
      id: "agency",
      header: t("data-request:table.data_owner"),
      accessorFn({ agency }) {
        return t(`agencies:${agency.toLowerCase()}.abbr`);
      },
    },
    {
      accessorKey: "date_submitted",
      id: "date_submitted",
      header: t("data-request:table.date_created"),
      accessorFn({ date_submitted }) {
        return DateTime.fromISO(date_submitted, { locale: "en-MY" }).toFormat("D");
      },
    },
    {
      id: "subscribe",
      enableSorting: false,
      header: t("data-request:table.subscribe"),
      className: "flex flex-col items-center",
      cell: ({ row, getValue }) => {
        return (
          <>
            {row.original.status === "under_review" ? (
              <Button variant="primary" className={clx("flex w-fit items-center gap-1")}>
                <BellAlertIcon className="h-4 w-4" />
                <p>Follow</p>
              </Button>
            ) : (
              <Button
                variant="ghost"
                className={clx(
                  "flex items-center gap-1 hover:cursor-default hover:bg-transparent dark:hover:bg-transparent"
                )}
              >
                <BellAlertIcon className="h-4 w-4 text-transparent" />
              </Button>
            )}
          </>
        );
      },
    },
  ];

  const renderStatus = (status: DataRequestStatus, row: any) => {
    const base = (content: JSX.Element) => {
      return (
        <>
          <Modal
            className="max-w-screen-sm"
            title={t(`status.${status}`)}
            trigger={open => (
              <div
                className={clx("flex w-fit items-center gap-1", "hover:cursor-pointer", baseClass)}
                onClick={
                  status === "data_published"
                    ? () => {
                        setData("show_published", true);
                        if (row.original.published_data.length) {
                          setData("published_data", row.original.published_data);
                        } else {
                          setData("published_data", row.original.remark);
                        }
                      }
                    : () => open()
                }
              >
                {content}
              </div>
            )}
          >
            {close => (
              <div className=" bg-white p-3 dark:bg-black">
                {status === "rejected" && row.original.remark && (
                  <>
                    <p className="text-sm">{t(`status.${status}`, { context: "modal" })}:</p>
                    <p className="text-sm">{row.original.remark}</p>
                  </>
                )}
                {status === "under_review" && (
                  <div className="flex flex-col gap-3 text-sm">
                    <p>{t(`status.${status}`, { context: "modal" })}</p>
                    <div>
                      <p>Remark:</p>
                      <p>{row.original.remark}</p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </Modal>
        </>
      );
    };
    switch (status) {
      case "rejected":
        return base(
          <>
            <XCircleIcon className="text-danger h-5 w-5" />
            <p className={`text-danger`}>{t("status.rejected")}</p>
            <ArrowUpRightIcon className="text-danger h-5 w-5" />
          </>
        );
      case "under_review":
        return base(
          <>
            <ClockIcon className="text-outlineHover h-5 w-5" />
            <p className={`text-outlineHover`}>{t("status.under_review")}</p>
            <ArrowUpRightIcon className="text-outlineHover h-5 w-5" />
          </>
        );
      case "data_published":
        return base(
          <>
            <CheckCircleIcon color={AKSARA_COLOR.GREEN} className="h-5 w-5" />
            <p className={`text-[${AKSARA_COLOR.GREEN}]`}>{t("status.data_published")}</p>
            <ArrowUpRightIcon className={`h-5 w-5 text-[${AKSARA_COLOR.GREEN}]`} />
          </>
        );
      default:
        return null;
    }
  };

  const handleSearch = useCallback(
    debounce((query: string) => {
      // Checking whether the query contain ":"
      const containSeperator = query.includes(":");
      if (containSeperator) {
        // Split the query by the seperator and create trimmed array
        const splitSearch = query.split(":").map(str => str.trim());
        // Fallback: Not valid ticket_id search. Search query as is.
        if (splitSearch.length > 2) {
          setFilter("query", query.trim());
          setFilter("ticket_id", "");
        } else {
          // Checking whether the first seperator is 'id'
          if (splitSearch[0] === "id") {
            // Check whether the value is valid number
            const isValidId =
              typeof splitSearch[1] === "string" &&
              splitSearch[1].trim() !== "" &&
              splitSearch[1].trim().match(/^\d+$/) !== null;

            // Perform ticket_id query to the endpoint
            if (isValidId) {
              setFilter("ticket_id", splitSearch[1]);
              setFilter("query", "");
            } else {
              // Fallback: Not valid ticket_id search. Search query as is.
              setFilter("query", query.trim());
              setFilter("ticket_id", "");
            }
          } else {
            // Fallback: Not valid ticket_id search. Search query as is.
            setFilter("query", query.trim());
            setFilter("ticket_id", "");
          }
        }
      } else {
        setFilter("query", query.trim());
        setFilter("ticket_id", "");
      }
    }, 500),
    []
  );

  return (
    <>
      <Container
        background="bg-gradient-radial from-outline to-background dark:from-washed-dark dark:to-black"
        className="dark:border-outlineHover-dark border-b"
      >
        <div className="mx-auto flex flex-col items-center gap-3 py-12">
          <h2 className="text-center text-black">{t("header")}</h2>
          <div className="flex flex-col">
            <p className="text-dim text-center">{t("description_line1")}</p>
            <p className="text-dim text-center">{t("description_line2")}</p>
          </div>
          <Button
            onClick={() => setData("show_request", true)}
            variant="primary"
            className="mt-3 w-fit text-center"
          >
            {t("request_data")}
          </Button>
        </div>
      </Container>
      <Container>
        <Section
          title={
            <div className="flex items-center gap-3 text-black">
              <TicketIcon className="h-5 w-5" />
              <h4>{t("data_request_tickets")}</h4>
            </div>
          }
        >
          <Tabs
            className="items-center"
            title={
              <Input
                name="search_query"
                icon={<MagnifyingGlassIcon className="h-5 w-5" />}
                value={data.search_query}
                className="w-[300px] sm:w-[420px]"
                placeholder={t("search_query_placeholder")}
                onChange={query => {
                  setData("search_query", query);
                  handleSearch(query);
                }}
              />
            }
            current={data.tab}
            onChange={index => {
              setData("tab", index);
              setData("loading", true);
              if (STATUS_OPTIONS[index].value === "all") {
                setFilter("status", "");
              } else {
                setFilter("status", STATUS_OPTIONS[index].value);
              }
            }}
          >
            {STATUS_OPTIONS.map(option => (
              <Panel name={t(option.label)} key={option.value}>
                {data.loading ? (
                  <div className="flex h-60 w-full items-center justify-center">
                    <Spinner loading={true} />
                  </div>
                ) : (
                  <Table
                    className="mb-12 mt-8 md:mx-auto md:w-4/5 lg:w-full"
                    data={items}
                    enablePagination={10}
                    pagination={(currentPage, totalPage, setPage) => (
                      <NumberedPagination
                        currentPage={currentPage}
                        totalPage={totalPage}
                        setPage={newPage => setPage(newPage - 1)}
                      />
                    )}
                    config={tableConfig}
                  />
                )}
              </Panel>
            ))}
          </Tabs>
        </Section>
      </Container>

      <RequestDataModal show={data.show_request} hide={() => setData("show_request", false)} />

      <PublishedDataModal
        show={data.show_published}
        hide={() => setData("show_published", false)}
        items={data.published_data}
      />
    </>
  );
};

export default DataRequestDashboard;
