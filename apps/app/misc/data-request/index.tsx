import {
  Button,
  Container,
  Input,
  NumberedPagination,
  Panel,
  Section,
  Tabs,
} from "datagovmy-ui/components";
import { useData, useTranslation, useWatch } from "datagovmy-ui/hooks";
import { DataRequestItem, DataRequestStatus } from "pages/data-request";
import { FunctionComponent } from "react";
import {
  TicketIcon,
  MagnifyingGlassIcon,
  ClockIcon,
  XCircleIcon,
  CheckCircleIcon,
  ArrowUpRightIcon,
} from "@heroicons/react/20/solid";
import { OptionType } from "datagovmy-ui/types";
import Table, { TableConfig } from "datagovmy-ui/charts/table";
import { AKSARA_COLOR } from "datagovmy-ui/constants";
import { clx } from "datagovmy-ui/helpers";
import { PublishedDataModal, RequestDataModal } from "./modal";

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
  const { t, i18n } = useTranslation(["data-request, catalogue"]);
  const { data, setData } = useData({
    loading: false,
    modal_loading: false,
    show_request: false,
    show_published: false,
    published_data: [], // TODO: add them later. using dummy for now.
    search_query: "",
    status: "all",
    page: 1,
    tab: 0,
  });
  const baseClass = "text-sm font-normal";

  useWatch(() => {
    data.show_request || data.show_published
      ? (document.body.style.overflow = "hidden")
      : (document.body.style.overflow = "unset");
  }, [data.show_request, data.show_published]);

  const STATUS_OPTIONS: OptionType[] = [
    {
      label: t("all"),
      value: "all",
    },
    {
      label: t("under_review"),
      value: "under_review",
    },
    {
      label: t("in_progress"),
      value: "in_progress",
    },
    {
      label: t("published"),
      value: "published",
    },
    {
      label: t("rejected"),
      value: "rejected",
    },
  ];

  const tableConfig: TableConfig<DataRequestItem>[] = [
    {
      accessorKey: "status",
      id: "status",
      header: t("table.status"),
      cell: ({ row, getValue }) => <>{renderStatus(getValue())}</>,
    },
    {
      accessorKey: "title",
      id: "title",
      header: t("table.title"),
      cell: ({ row, getValue }) => {
        const underline = "underline underline-offset-4";

        return (
          <div
            className={clx(
              "group flex items-center gap-1",
              row.original.status === "published" && "hover:cursor-pointer"
            )}
            onClick={
              row.original.status === "published"
                ? () => setData("show_published", true)
                : () => null
            }
          >
            <p className={clx(baseClass, row.original.status === "published" && underline)}>
              {getValue()}
            </p>
            {row.original.status === "published" && (
              <ArrowUpRightIcon className="h-5 w-5 opacity-0 transition-all group-hover:translate-x-1 group-hover:opacity-100 motion-reduce:transition-none" />
            )}
          </div>
        );
      },
    },
    {
      accessorKey: "description",
      id: "description",
      className: "max-sm:max-w-[300px] md:max-w-[500px] truncate",
      header: t("table.description"),
    },
    {
      accessorKey: "data_owner",
      id: "data_owner",
      header: t("table.data_owner"),
    },
  ];

  const renderStatus = (status: DataRequestStatus) => {
    const base = (content: JSX.Element) => {
      return <div className={clx("flex items-center gap-1", baseClass)}>{content}</div>;
    };
    switch (status) {
      case "in_progress":
        return base(
          <>
            <ClockIcon color={AKSARA_COLOR.ORANGE} className="h-5 w-5" />
            <p className={`text-[${AKSARA_COLOR.ORANGE}]`}>{t("status.in_progress")}</p>
          </>
        );
      case "rejected":
        return base(
          <>
            <XCircleIcon className="text-danger h-5 w-5" />
            <p className={`text-danger`}>{t("status.rejected")}</p>
          </>
        );
      case "under_review":
        return base(
          <>
            <ClockIcon className="text-outlineHover h-5 w-5" />
            <p className={`text-outlineHover`}>{t("status.under_review")}</p>
          </>
        );
      case "published":
        return base(
          <>
            <CheckCircleIcon color={AKSARA_COLOR.GREEN} className="h-5 w-5" />
            <p className={`text-[${AKSARA_COLOR.GREEN}]`}>{t("status.published")}</p>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <>
      <Container
        background="bg-gradient-radial from-outline to-background dark:from-washed-dark dark:to-black"
        className="dark:border-outlineHover-dark border-b"
      >
        <div className="mx-auto flex flex-col items-center gap-3 py-12">
          <h2 className="text-center text-black">{t("header")}</h2>
          <p className="text-dim text-center">{t("description")}</p>
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
                placeholder="Has your request been made before?"
                onChange={value => {
                  setData("search_query", value);
                }}
              />
            }
            current={data.tab}
            onChange={index => {
              setData("tab", index);
            }}
          >
            {STATUS_OPTIONS.map(option => (
              <Panel name={t(option.value)} key={option.value}>
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
              </Panel>
            ))}
          </Tabs>
        </Section>
      </Container>

      <RequestDataModal show={data.show_request} hide={() => setData("show_request", false)} />

      <PublishedDataModal
        show={data.show_published}
        hide={() => setData("show_published", false)}
      />
    </>
  );
};

export default DataRequestDashboard;
