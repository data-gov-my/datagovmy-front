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
import { DataRequestItem } from "pages/data-request";
import { FunctionComponent } from "react";
import { TicketIcon, MagnifyingGlassIcon } from "@heroicons/react/20/solid";
import { OptionType } from "datagovmy-ui/types";
import Table, { TableConfig } from "datagovmy-ui/charts/table";

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
    show: false,
    search_query: "",
    status: "all",
    page: 1,
    tab: 0,
  });

  useWatch(() => {
    data.show
      ? (document.body.style.overflow = "hidden")
      : (document.body.style.overflow = "unset");
  }, [data.show]);

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
    },
    {
      accessorKey: "title",
      id: "title",
      header: t("table.title"),
    },
    {
      accessorKey: "description",
      id: "description",
      header: t("table.description"),
    },
    {
      accessorKey: "data_owner",
      id: "data_owner",
      header: t("table.data_owner"),
    },
  ];

  return (
    <>
      <Container
        background="bg-gradient-radial from-outline to-background dark:from-washed-dark dark:to-black"
        className="dark:border-outlineHover-dark border-b"
      >
        <div className="mx-auto flex flex-col items-center gap-3 py-12">
          <h2 className="text-center text-black">{t("header")}</h2>
          <p className="text-dim text-center">{t("description")}</p>
          <Button variant="primary" className="mt-3 w-fit text-center">
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
                className="w-[420px]"
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
                  className="mb-12 mt-8 md:mx-auto md:w-4/5 lg:w-3/4 xl:w-3/5"
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
    </>
  );
};

export default DataRequestDashboard;
