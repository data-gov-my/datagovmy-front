import {
  PublicationModal,
  PublicationCard,
  PubResource,
  Resource,
  Publication,
  Input,
} from "datagovmy-ui/components";
import { ChevronDownIcon, ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/20/solid";
import { MagnifyingGlassIcon, XMarkIcon } from "@heroicons/react/24/solid";
import { routes } from "@lib/routes";
import { TableConfig } from "datagovmy-ui/charts/table";
import {
  Button,
  Checkbox,
  Container,
  Dropdown,
  Label,
  Modal,
  Panel,
  Radio,
  Section,
  Spinner,
  Tabs,
} from "datagovmy-ui/components";
import { toDate } from "datagovmy-ui/helpers";
import { useCache, useData, useFilter, useTranslation } from "datagovmy-ui/hooks";
import { OptionType } from "datagovmy-ui/types";
import { matchSorter } from "match-sorter";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { FunctionComponent, useContext, useEffect, useMemo, useState } from "react";
import { DateTime } from "luxon";
import { WindowContext } from "datagovmy-ui/contexts/window";
import { BREAKPOINTS } from "datagovmy-ui/constants";
import { AnalyticsContext } from "datagovmy-ui/contexts/analytics";

/**
 * Publications
 * @overview Status: Live
 */

const Table = dynamic(() => import("datagovmy-ui/charts/table"), {
  ssr: false,
});

interface BrowsePublicationsProps {
  params: any;
  pub: PubResource | null;
  publications: Publication[];
  query: any;
  total_pubs: number;
}

const BrowsePublicationsDashboard: FunctionComponent<BrowsePublicationsProps> = ({
  params,
  pub,
  publications,
  query,
  total_pubs,
}) => {
  const { send_new_analytics } = useContext(AnalyticsContext);
  const { t, i18n } = useTranslation(["publications", "catalogue", "common"]);
  const { cache } = useCache();
  const { size } = useContext(WindowContext);
  const { push, events } = useRouter();
  const [show, setShow] = useState<boolean>(false);
  const ITEMS_PER_PAGE = 15;
  const { data, setData } = useData({
    loading: false,
    modal_loading: false,
    pub: pub,
    tab: 0,
  });

  const filteredRes = useMemo(
    () => matchSorter(data.pub ? data.pub.resources : [], data.query, { keys: ["resource_name"] }),
    [data.pub, data.query]
  );

  const frequencies: OptionType[] = [
    { label: t("catalogue:filter_options.monthly"), value: "MONTHLY" },
    { label: t("catalogue:filter_options.quarterly"), value: "QUARTERLY" },
    { label: t("catalogue:filter_options.yearly"), value: "YEARLY" },
    { label: t("catalogue:filter_options.one_off"), value: "ONE_OFF" },
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

  const { filter, setFilter, actives, queries } = useFilter({
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
    search: query.search ?? "",
  });

  useEffect(() => {
    show ? (document.body.style.overflow = "hidden") : (document.body.style.overflow = "unset");
  }, [show]);

  useEffect(() => {
    if (size.width < BREAKPOINTS.SM) {
      if (cache.has("tab")) {
        setData("tab", cache.get("tab"));
      } else {
        setData("tab", 1);
      }
    } else {
      if (cache.has("tab")) {
        setData("tab", cache.get("tab"));
      } else {
        setData("tab", 0);
      }
    }
  }, [size.width]);

  const reset = () => {
    setFilter("demography", []);
    setFilter("frequency", undefined);
    setFilter("geography", []);
    setFilter("page", "1");
    setFilter("search", "");
  };

  const pubConfig: TableConfig<Publication>[] = [
    {
      accessorKey: "title",
      id: "title",
      header: t("table.title"),
      enableSorting: false,
      className: "max-sm:max-w-[300px]",
      cell: ({ row, getValue }) => {
        return (
          <Button
            className="link-primary p-0 font-normal"
            onClick={() => {
              setShow(true);
              push(
                routes.PUBLICATIONS.concat(
                  "/",
                  row.original.publication_id,
                  actives.length ? queries : ""
                ),
                routes.PUBLICATIONS.concat("/", row.original.publication_id),
                {
                  scroll: false,
                }
              );
            }}
          >
            {getValue()}
          </Button>
        );
      },
    },
    {
      id: "release_date",
      header: t("table.release_date"),
      className: "w-fit",
      accessorFn({ release_date }) {
        return toDate(release_date, "dd MMM yyyy", i18n.language);
      },
    },
    {
      accessorKey: "total_downloads",
      id: "downloads",
      header: t("downloads"),
      className: "w-fit",
    },
  ];

  useEffect(() => {
    if (pub) {
      setShow(true);
      setData("pub", pub);
    }
    if (cache.has("tab")) {
      setData("tab", cache.get("tab"));
    }
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
  }, [pub]);

  const postDownload = async (resource_id: number) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_TINYBIRD_URL}/events?name=dgmy_pub_dls`,
        {
          method: "POST",
          headers: {
            "Accept": "application/json, text/plain, */*",
            "Content-Type": "application/json",
            "Authorization": `Bearer ${process.env.NEXT_PUBLIC_TINYBIRD_TOKEN}`,
          },
          body: JSON.stringify({
            publication_id: params.pub_id,
            resource_id: resource_id,
            timestamp: DateTime.now().toSQL({ includeOffset: false }),
          }),
        }
      );

      setData("pub", {
        ...data.pub,
        resources: data.pub.resources.map((pub: Resource) => {
          if (pub.resource_id === resource_id) {
            return {
              ...pub,
              downloads: pub.downloads + 1,
            };
          } else return pub;
        }),
      });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Container>
      <Section>
        <h4 className="text-center">{t("browse_publications")}</h4>
        <div className="relative mx-auto my-6 w-full select-none overflow-hidden rounded-full border border-outline shadow-button hover:border-outlineHover focus:outline-none focus-visible:ring-0 dark:border-washed-dark dark:hover:border-outlineHover-dark sm:w-[500px]">
          <Input
            className="w-full truncate border-none bg-white py-3 pl-12 pr-10 text-base focus:outline-none focus:ring-0 dark:bg-black hover:dark:bg-washed-dark/50 focus:dark:bg-washed-dark"
            placeholder={t("search_publication")}
            value={filter.search}
            onChange={e => {
              setFilter("page", "1");
              setFilter("search", e);
              setData("loading", true);
            }}
          />
          <span className="absolute left-4 top-3.5">
            <MagnifyingGlassIcon className="h-5 w-5 text-black dark:text-dim" />
          </span>
        </div>

        {/* Mobile */}
        <div className="flex w-full justify-end md:hidden">
          <Modal
            trigger={open => (
              <Button onClick={open} variant="default" className="shadow-floating">
                <span>{t("catalogue:filter")}</span>
                <span className="h-5 w-4.5 rounded-md bg-primary text-center text-white dark:bg-primary-dark">
                  {actives.filter(e => !e.includes("page")).length}
                </span>
                <ChevronDownIcon className="-mx-[5px] h-5 w-5" />
              </Button>
            )}
            title={<Label label={t("catalogue:filter") + ":"} className="text-sm font-bold" />}
          >
            {close => (
              <div className="mb-[100px] flex h-max flex-col divide-y overflow-y-auto bg-white px-4.5 dark:divide-washed-dark dark:bg-black">
                <div className="py-3">
                  <Radio
                    name="frequency"
                    label={t("catalogue:frequency")}
                    options={frequencies}
                    value={filter.frequency}
                    onChange={e => {
                      setData("loading", true);
                      setFilter("frequency", e);
                      setFilter("page", "1");
                    }}
                  />
                </div>
                <div className="py-3">
                  <Checkbox
                    name="geography"
                    label={t("catalogue:geography")}
                    options={geographies}
                    value={filter.geography}
                    onChange={e => {
                      setData("loading", true);
                      setFilter("geography", e);
                      setFilter("page", "1");
                    }}
                  />
                </div>
                <div className="py-3">
                  <Checkbox
                    name="demography"
                    label={t("catalogue:demography")}
                    options={demographies}
                    value={filter.demography}
                    onChange={e => {
                      setData("loading", true);
                      setFilter("demography", e);
                      setFilter("page", "1");
                    }}
                  />
                </div>
                <div className="fixed bottom-0 left-0 flex w-full flex-col gap-3 border-t bg-white p-3 dark:border-washed-dark dark:bg-black">
                  <Button
                    variant="primary"
                    className="w-full justify-center"
                    disabled={!actives.filter(e => !e.includes("page")).length}
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
              setFilter("page", "1");
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
              setFilter("page", "1");
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
              setFilter("page", "1");
            }}
          />
          {actives.length > 0 &&
            actives.findIndex(active => !["page"].includes(active[0])) !== -1 && (
              <Button
                variant="ghost"
                className="group"
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
          <Tabs
            className="pb-8 pt-8 lg:pt-12"
            title={<h4>{t("header")}</h4>}
            current={data.tab}
            onChange={index => {
              setData("tab", index);
              cache.set("tab", index);
            }}
          >
            <Panel name={t("card_view")} key={"card_view"}>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {publications.map((item: Publication) => (
                  <PublicationCard
                    key={item.publication_id}
                    publication={item}
                    sendAnalytics={send_new_analytics}
                    onClick={() => {
                      setData("modal_loading", true);
                      setShow(true);
                      push(
                        routes.PUBLICATIONS.concat(
                          "/",
                          item.publication_id,
                          actives.length ? queries : ""
                        ),
                        routes.PUBLICATIONS.concat("/", item.publication_id),
                        { scroll: false }
                      );
                    }}
                  />
                ))}
              </div>
            </Panel>
            <Panel name={t("list_view")} key={"list_view"}>
              <Table
                className="md:mx-auto"
                data={publications}
                enablePagination={filteredRes.length > ITEMS_PER_PAGE ? ITEMS_PER_PAGE : false}
                config={pubConfig}
              />
            </Panel>
          </Tabs>
        )}

        <PublicationModal
          type="/"
          pub_id={params.pub_id}
          post={resource_id => postDownload(resource_id)}
          publication={data.pub}
          loading={data.modal_loading}
          show={show}
          hide={() => {
            setShow(false);
            push(routes.PUBLICATIONS.concat(actives.length ? queries : ""), undefined, {
              scroll: false,
            });
          }}
        />

        {total_pubs > ITEMS_PER_PAGE && (
          <div className="flex items-center justify-center gap-4 pt-8 text-sm font-medium">
            <Button
              className="btn-disabled"
              variant="default"
              onClick={() => {
                setData("loading", true);
                setFilter("page", `${+filter.page - 1}`);
              }}
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
              variant="default"
              className="btn-disabled"
              onClick={() => {
                setData("loading", true);
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
