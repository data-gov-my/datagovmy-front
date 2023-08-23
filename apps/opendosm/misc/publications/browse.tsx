import PublicationCard from "@components/Publication/Card";
import PublicationModal from "@components/Publication/Modal";
import { ChevronDownIcon, ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/20/solid";
import { XMarkIcon } from "@heroicons/react/24/solid";
import { routes } from "@lib/routes";
import { get } from "datagovmy-ui/api";
import { TableConfig } from "datagovmy-ui/charts/table";
import {
  Button,
  Checkbox,
  ComboBox,
  Container,
  Dropdown,
  Label,
  Modal,
  Panel,
  Radio,
  Section,
  Spinner,
  Tabs,
  toast,
} from "datagovmy-ui/components";
import { toDate } from "datagovmy-ui/helpers";
import { useCache, useData, useFilter, useTranslation } from "datagovmy-ui/hooks";
import { OptionType } from "datagovmy-ui/types";
import { matchSorter } from "match-sorter";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { FunctionComponent, useEffect, useMemo, useState } from "react";

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

export type Resource = {
  resource_id: number;
  resource_name: string;
  resource_link: string;
  resource_type: string;
};

interface BrowsePublicationsProps {
  dropdown: Array<{ publication_type: string; publication_type_title: string }>;
  publications: Publication[];
  params: any;
  query: any;
  total_pubs: number;
}

const BrowsePublicationsDashboard: FunctionComponent<BrowsePublicationsProps> = ({
  dropdown,
  publications,
  params,
  query,
  total_pubs,
}) => {
  const { t, i18n } = useTranslation(["publications", "catalogue", "common"]);
  const { cache } = useCache();
  const { push, events } = useRouter();
  const [show, setShow] = useState<boolean>(false);
  const ITEMS_PER_PAGE = 15;
  const { data, setData } = useData({
    loading: false,
    pub: "",
    publication_option: query.pub_type,
  });

  const filteredRes = useMemo(
    () => matchSorter(data.pub ? data.pub.resources : [], data.query, { keys: ["resource_name"] }),
    [data.pub, data.query]
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
    pub_type: query.pub_type
      ? PUBLICATION_OPTIONS.find(item => item.value === query.pub_type)?.value
      : undefined,
  });

  const reset = () => {
    setFilter("demography", []);
    setFilter("frequency", undefined);
    setFilter("geography", []);
    setFilter("page", undefined);
    setFilter("pub_type", undefined);
    setData("publication_option", undefined);
  };

  const fetchResource = async (publication_id: string): Promise<Resource[]> => {
    const identifier = `${publication_id}_${i18n.language}`;
    return new Promise(resolve => {
      if (cache.has(identifier)) return resolve(cache.get(identifier));
      get(`/publication-resource/${publication_id}`, {
        language: i18n.language,
      })
        .then(({ data }: { data: Resource[] }) => {
          cache.set(identifier, data);
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
      header: t("table.title"),
      enableSorting: false,
      className: "max-sm:max-w-[300px]",
      cell: ({ row, getValue }) => {
        return (
          <Button
            className="link-primary font-normal"
            onClick={() => {
              setShow(true);
              push(routes.PUBLICATIONS.concat("/browse/", row.original.publication_id), undefined, {
                scroll: false,
              });
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
      header: t("table.desc"),
      enableSorting: false,
    },
    {
      accessorKey: "release_date",
      id: "release_date",
      header: t("table.release_date"),
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

  useEffect(() => {
    if (params.pub_id) {
      fetchResource(params.pub_id).then(data => setData("pub", data));
      setShow(true);
    }
    events.on("routeChangeComplete", () => setData("loading", false));
    return () => {
      events.off("routeChangeComplete", () => setData("loading", false));
    };
  }, [params.pub_id]);

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
              <div className="mb-[105px] flex h-max flex-col divide-y overflow-y-auto bg-white px-4.5 dark:divide-washed-dark dark:bg-black">
                <div className="py-3">
                  <Radio
                    name="frequency"
                    label={t("catalogue:frequency")}
                    options={frequencies}
                    value={filter.frequency}
                    onChange={e => {
                      setData("loading", true);
                      setFilter("frequency", e);
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
                    }}
                  />
                </div>
                <div className="fixed bottom-0 left-0 flex w-full flex-col gap-3 border-t bg-white p-3 dark:border-washed-dark dark:bg-black">
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
            actives.findIndex(active => !["page"].includes(active[0])) !== -1 && (
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
                {publications.map((item: Publication) => (
                  <PublicationCard
                    publication={item}
                    onClick={() => {
                      setShow(true);
                      push(
                        routes.PUBLICATIONS.concat(
                          "/browse/",
                          item.publication_id,
                          actives.length ? queries : ""
                        ),
                        undefined,
                        { scroll: false }
                      );
                      fetchResource(item.publication_id).then(data => setData("pub", data));
                    }}
                  />
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

        <PublicationModal
          type={"/browse/"}
          id={params.pub_id}
          publication={data.pub}
          show={show}
          hide={() => {
            setShow(false);
            push(routes.PUBLICATIONS.concat("/browse/", actives.length ? queries : ""), undefined, {
              scroll: false,
            });
          }}
        />

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