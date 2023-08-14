import { Dialog, Transition } from "@headlessui/react";
import { ChevronDownIcon, ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/20/solid";
import { ArrowUpRightIcon, XMarkIcon } from "@heroicons/react/24/solid";
import { get } from "datagovmy-ui/api";
import { TableConfig } from "datagovmy-ui/charts/table";
import {
  At,
  Button,
  Checkbox,
  ComboBox,
  Container,
  Dropdown,
  Label,
  Modal,
  Panel,
  Radio,
  Search,
  Section,
  Spinner,
  Tabs,
  toast,
} from "datagovmy-ui/components";
import { body } from "datagovmy-ui/configs/font";
import { clx, numFormat, toDate } from "datagovmy-ui/helpers";
import { useCache, useData, useFilter, useTranslation } from "datagovmy-ui/hooks";
import { ExcelIcon, PDFIcon } from "datagovmy-ui/icons";
import { OptionType } from "datagovmy-ui/types";
import { matchSorter } from "match-sorter";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { Fragment, FunctionComponent, useEffect, useMemo, useState } from "react";

/**
 * Publications
 * @overview Status: In-development
 */

const Table = dynamic(() => import("datagovmy-ui/charts/table"), {
  ssr: false,
});

export type Publication = {
  description: string;
  publication_id: string;
  publication_type: string;
  release_date: string;
  title: string;
};

type Resource = {
  resource_id: number;
  resource_name: string;
  resource_link: string;
  resource_type: string;
};

interface BrowsePublicationsProps {
  dropdown: Array<{ publication_type: string; publication_type_title: string }>;
  publications: Publication[];
  query: any;
  total_pubs: number;
}

const BrowsePublicationsDashboard: FunctionComponent<BrowsePublicationsProps> = ({
  dropdown,
  publications,
  query,
  total_pubs,
}) => {
  const { t, i18n } = useTranslation(["publications", "catalogue", "common"]);
  const { cache } = useCache();
  const { events } = useRouter();
  const [show, setShow] = useState<boolean>(false);
  const ITEMS_PER_PAGE = 15;
  const { data, setData } = useData({
    loading: false,
    pub_idx: 0,
    publication_option: query.pub_type,
    query: "",
    res: [],
    table_page_idx: 0,
  });

  const filteredRes = useMemo(
    () => matchSorter(data.res, data.query, { keys: ["resource_name"] }),
    [data.res, data.query]
  );

  const PUBLICATION_OPTIONS: OptionType[] = dropdown.map(e => ({
    label: e.publication_type_title,
    value: e.publication_type,
  }));

  const frequencies: OptionType[] = [
    { label: t("catalogue:filter_options.daily"), value: "DAILY" },
    { label: t("catalogue:filter_options.weekly"), value: "WEEKLY" },
    { label: t("catalogue:filter_options.monthly"), value: "MONTHLY" },
    { label: t("catalogue:filter_options.quarterly"), value: "QUARTERLY" },
    { label: t("catalogue:filter_options.yearly"), value: "YEARLY" },
    { label: t("catalogue:filter_options.intraday"), value: "INTRADAY" },
    { label: t("catalogue:filter_options.infrequent"), value: "INFREQUENT" },
    { label: t("catalogue:filter_options.as_required"), value: "AS_REQUIRED" },
  ];
  const geographies: OptionType[] = [
    { label: t("catalogue:filter_options.national"), value: "NATIONAL" },
    { label: t("catalogue:filter_options.state"), value: "STATE" },
    { label: t("catalogue:filter_options.district"), value: "DISTRICT" },
    { label: t("catalogue:filter_options.parlimen"), value: "PARLIMEN" },
    { label: t("catalogue:filter_options.dun"), value: "DUN" },
  ];
  const demographies: OptionType[] = [
    { label: t("catalogue:filter_options.sex"), value: "SEX" },
    { label: t("catalogue:filter_options.ethnicity"), value: "ETHNICITY" },
    { label: t("catalogue:filter_options.age"), value: "AGE" },
    { label: t("catalogue:filter_options.religion"), value: "RELIGION" },
    { label: t("catalogue:filter_options.nationality"), value: "NATIONALITY" },
    { label: t("catalogue:filter_options.disability"), value: "DISABILITY" },
    { label: t("catalogue:filter_options.marital"), value: "MARITAL" },
  ];

  const { filter, setFilter, actives } = useFilter({
    demography: query.demography
      ? demographies.filter(item => query.demography.split(",").includes(item.value))
      : [],
    frequency: query.frequency
      ? frequencies.find(item => item.value === query.frequency)
      : undefined,
    geography: query.geography
      ? geographies.filter(item => query.geography.split(",").includes(item.value))
      : [],
    page: query.page ?? "1",
    // page_size: query.page_size ?? `${ITEMS_PER_PAGE}`,
    pub_type: query.pub_type
      ? PUBLICATION_OPTIONS.find(item => item.value === query.pub_type)?.value
      : undefined,
  });

  const reset = () => {
    setFilter("demography", []);
    setFilter("frequency", undefined);
    setFilter("geography", []);
    setFilter("pub_type", undefined);
    setData("publication_option", undefined);
  };

  const fetchResource = async (publication_id: string): Promise<Resource[]> => {
    return new Promise(resolve => {
      if (cache.has(publication_id)) return resolve(cache.get(publication_id));
      get(`/publication-resource/${publication_id}`, {
        language: i18n.language,
      })
        .then(({ data }: { data: Resource[] }) => {
          cache.set(publication_id, data);
          resolve(data);
        })
        .catch(e => {
          toast.error(t("common:error.toast.request_failure"), t("common:error.toast.try_again"));
          console.error(e);
        });
    });
  };

  const pubConfig: TableConfig[] = [
    {
      accessorKey: "title",
      id: "title",
      header: t("title"),
      enableSorting: false,
      className: "max-sm:max-w-[300px]",
      cell: ({ row, getValue }) => {
        return (
          <Button
            className="link-primary font-normal"
            onClick={() => {
              console.log(row.index);
              setShow(true);
              setData("pub_idx", row.index);
              fetchResource(row.original.publication_id).then(data => setData("res", data));
            }}
          >
            {getValue()}
          </Button>
        );
      },
    },
    {
      accessorKey: "description",
      id: "description",
      header: t("desc"),
      enableSorting: false,
    },
    {
      accessorKey: "release_date",
      id: "release_date",
      header: t("release_date"),
      cell: ({ getValue }) => {
        return <>{toDate(getValue(), "dd MMM yyyy", i18n.language)}</>;
      },
    },
    {
      accessorKey: "downloads",
      id: "downloads",
      header: t("downloads"),
    },
  ];

  const resConfig: TableConfig[] = [
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
          <At external href={getValue()} className="link-primary font-normal">
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

  useEffect(() => {
    events.on("routeChangeComplete", () => setData("loading", false));
    return () => {
      events.off("routeChangeComplete", () => setData("loading", false));
    };
  }, []);

  return (
    <Container>
      <Section>
        <h4 className="text-center">{t("browse_publications")}</h4>
        <div className="mx-auto w-full py-6 sm:w-[500px]">
          <ComboBox
            placeholder={t("select_publication")}
            options={PUBLICATION_OPTIONS}
            selected={
              data.publication_option
                ? PUBLICATION_OPTIONS.find(e => e.value === data.publication_option)
                : null
            }
            onChange={selected => {
              if (selected) {
                setData("loading", true);
                setFilter("pub_type", selected.value);
                setData("publication_option", selected.value);
              } else {
                setFilter("pub_type", null);
                setData("publication_option", null);
              }
            }}
          />
        </div>

        {/* Mobile */}
        <div className="flex w-full justify-end md:hidden">
          <Modal
            trigger={open => (
              <Button onClick={open} className="btn-default shadow-floating">
                <span>{t("catalogue:filter")}</span>
                <span className="h-5 w-4.5 rounded-md bg-primary text-center text-white dark:bg-primary-dark">
                  {actives.length}
                </span>
                <ChevronDownIcon className="-mx-[5px] h-5 w-5" />
              </Button>
            )}
            title={<Label label={t("catalogue:filter") + ":"} className="text-sm font-bold" />}
          >
            {close => (
              <div className="mb-[105px] flex h-[400px] flex-col divide-y overflow-y-auto px-4.5 pb-4.5 dark:divide-washed-dark">
                <div className="py-3">
                  <Label label={t("catalogue:frequency")} />
                  <Radio
                    name="frequency"
                    className="flex flex-wrap gap-x-4.5 gap-y-2.5 py-2"
                    options={frequencies}
                    value={filter.frequency}
                    onChange={e => {
                      setData("loading", true);
                      setFilter("frequency", e);
                    }}
                  />
                </div>
                <div className="py-3">
                  <Label label={t("catalogue:geography")} />
                  <Checkbox
                    className="flex flex-wrap gap-x-4.5 gap-y-2.5 py-2"
                    name="geography"
                    options={geographies}
                    value={filter.geography}
                    onChange={e => {
                      setData("loading", true);
                      setFilter("geography", e);
                    }}
                  />
                </div>
                <div className="py-3">
                  <Label label={t("catalogue:demography")} />
                  <Checkbox
                    className="flex flex-wrap gap-x-4.5 gap-y-2.5 py-2"
                    name="demography"
                    options={demographies}
                    value={filter.demography}
                    onChange={e => {
                      setData("loading", true);
                      setFilter("demography", e);
                    }}
                  />
                </div>
                <div className="fixed bottom-0 left-0 flex w-full flex-col gap-3 border-t p-3 dark:border-washed-dark">
                  <Button
                    className="btn-primary w-full justify-center"
                    disabled={!actives.length}
                    onClick={() => {
                      setData("loading", true);
                      reset();
                    }}
                  >
                    {t("common:common.reset")}
                  </Button>
                  <Button className="btn w-full justify-center px-3 py-1.5" onClick={close}>
                    <XMarkIcon className="h-5 w-5" />
                    {t("common:common.close")}
                  </Button>
                </div>
              </div>
            )}
          </Modal>
        </div>

        {/* Desktop */}
        <div className="hidden gap-x-2 md:flex md:items-center md:justify-center">
          <span className="text-dim">{t("filter_by")}:</span>
          <Dropdown
            anchor="left"
            width="w-fit"
            options={frequencies}
            placeholder={t("catalogue:frequency")}
            selected={frequencies.find(e => e.value === filter.frequency?.value) ?? undefined}
            onChange={e => {
              setData("loading", true);
              setFilter("frequency", e);
            }}
          />
          <Dropdown
            anchor="left"
            width="w-fit"
            multiple
            enableClear
            title={t("catalogue:geography")}
            options={geographies}
            selected={filter.geography}
            onChange={e => {
              setData("loading", true);
              setFilter("geography", e);
            }}
          />
          <Dropdown
            anchor="left"
            width="w-fit"
            multiple
            enableClear
            title={t("catalogue:demography")}
            description={t("catalogue:placeholder.demography") + ":"}
            options={demographies}
            selected={filter.demography}
            onChange={e => {
              setData("loading", true);
              setFilter("demography", e);
            }}
          />
          {actives.length > 0 &&
            actives.findIndex(active => !["page", "page_size"].includes(active[0])) !== -1 && (
              <Button
                className="btn-ghost group text-dim hover:text-black dark:hover:text-white"
                disabled={!actives.length}
                onClick={() => {
                  setData("loading", true);
                  reset();
                }}
              >
                <XMarkIcon className="h-5 w-5 text-dim group-hover:text-black dark:group-hover:text-white" />
                {t("common:common.clear_all")}
              </Button>
            )}
        </div>

        {data.loading ? (
          <div className="flex h-[300px] w-full items-center justify-center">
            <Spinner loading={data.loading} />
          </div>
        ) : publications.length === 0 ? (
          <p className="flex h-[300px] w-full items-center justify-center text-dim">
            {t("common:common.no_entries")}.
          </p>
        ) : (
          <Tabs className="pb-8 pt-8 lg:pt-12" title={<h4>{t("header")}</h4>}>
            <Panel name={t("cards_view")} key={"cards_view"}>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {publications.map((item: Publication, i: number) => (
                  <Button
                    key={item.publication_id}
                    className="btn-border group flex h-full w-full flex-col space-y-3 rounded-xl border p-6 transition hover:bg-background dark:hover:bg-washed-dark/50"
                    onClick={() => {
                      setShow(true);
                      setData("pub_idx", i);
                      fetchResource(item.publication_id).then(data => setData("res", data));
                    }}
                  >
                    <div className="relative flex w-full items-center justify-between">
                      <p className="text-sm uppercase text-dim">
                        {toDate(item.release_date, "dd MMM yyyy", i18n.language)}
                      </p>
                      {Date.now() - Date.parse(item.release_date) < 2529000000 && (
                        <div className="flex items-center gap-1.5 rounded-full bg-danger px-1.5 py-0.5 text-xs text-white transition-transform group-hover:-translate-x-7 group-hover:duration-300">
                          <span className="h-2 w-2 rounded-full bg-white" />
                          {t("new")}!
                        </div>
                      )}
                      <ArrowUpRightIcon className="absolute right-2 h-5 w-5 text-dim opacity-0 transition-[opacity_transform] duration-0 group-hover:translate-x-2 group-hover:opacity-100 group-hover:duration-300" />
                    </div>

                    <div className="flex grow flex-col gap-3 overflow-hidden text-start">
                      <div className="grow flex-wrap space-y-3">
                        <p className="text-lg font-bold">{item.title}</p>
                        <p className="text-sm">{item.description}</p>
                      </div>
                      <div className="relative w-full">
                        <p className="text-dim transition-transform group-hover:translate-y-6">
                          {numFormat(100000, "compact")}
                          {100000 % 10 !== 0 ? "+ " : " "}
                          {t("common:common.downloads", {
                            count: 100000,
                          })}
                        </p>
                        <p className="absolute -bottom-6 text-primary transition-transform group-hover:-translate-y-6 group-hover:duration-300 dark:text-primary-dark">
                          {t("common:components.click_to_explore")}
                        </p>
                      </div>
                    </div>
                  </Button>
                ))}
              </div>
            </Panel>
            <Panel name={t("list_view")} key={"list_view"}>
              <Table
                className="md:w-full"
                data={publications}
                enablePagination={filteredRes.length > ITEMS_PER_PAGE ? ITEMS_PER_PAGE : false}
                config={pubConfig}
              />
            </Panel>
          </Tabs>
        )}

        {publications.length !== 0 && (
          <Transition show={show} as={Fragment}>
            <Dialog as="div" className="relative z-30" onClose={() => setShow(false)}>
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
                        "w-full max-w-4xl transform space-y-6 rounded-xl border border-outline bg-white p-6 text-left align-middle font-sans shadow-floating transition-all dark:border-outlineHover-dark dark:bg-black"
                      )}
                    >
                      <Dialog.Title as="div" className="flex flex-col gap-y-1.5">
                        <p className="pr-8 text-sm uppercase text-dim">
                          {toDate(
                            publications[data.pub_idx].release_date,
                            "dd MMM yyyy",
                            i18n.language
                          )}
                        </p>
                        <p className="text-lg font-bold text-black dark:text-white">
                          {publications[data.pub_idx].title}
                        </p>
                        <p className="text-sm text-black dark:text-white">
                          {publications[data.pub_idx].description}
                        </p>
                        <Button
                          className="group absolute right-4 top-4 h-9 w-9 rounded-full hover:bg-washed dark:hover:bg-washed-dark"
                          onClick={() => setShow(false)}
                        >
                          <XMarkIcon className="mx-auto h-6 w-6 text-dim group-hover:text-black group-hover:dark:text-white" />
                        </Button>
                      </Dialog.Title>
                      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                        <h5>{t("download_list")}</h5>
                        <Search
                          className="w-full rounded-md border border-outline text-dim dark:border-outlineHover-dark sm:w-[300px]"
                          placeholder={t("search_subject")}
                          onChange={q => setData("query", q)}
                        />
                      </div>
                      {filteredRes && (
                        <Table
                          className="md:w-full"
                          data={filteredRes}
                          enablePagination={filteredRes.length > 10 ? 10 : false}
                          config={resConfig}
                          precision={0}
                        />
                      )}
                    </Dialog.Panel>
                  </Transition.Child>
                </div>
              </div>
            </Dialog>
          </Transition>
        )}

        {total_pubs > ITEMS_PER_PAGE && (
          <div className="flex items-center justify-center gap-4 pt-8 text-sm font-medium">
            <Button
              className="btn-disabled btn-default"
              onClick={() => setFilter("page", `${+filter.page - 1}`)}
              disabled={filter.page === "1"}
            >
              <ChevronLeftIcon className="h-4.5 w-4.5" />
              {t("common:common.previous")}
            </Button>

            <span className="flex items-center gap-1 text-center">
              {t("common:common.page_of", {
                current: filter.page,
                total: Math.ceil(total_pubs / ITEMS_PER_PAGE),
              })}
            </span>
            <Button
              className="btn-disabled btn-default"
              onClick={() => {
                setFilter("page", `${+filter.page + 1}`);
              }}
              disabled={filter.page === `${Math.ceil(total_pubs / ITEMS_PER_PAGE)}`}
            >
              {t("common:common.next")}
              <ChevronRightIcon className="h-4.5 w-4.5" />
            </Button>
          </div>
        )}
      </Section>
    </Container>
  );
};

export default BrowsePublicationsDashboard;
