import { Dialog, Transition } from "@headlessui/react";
import { ChevronDownIcon, ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/20/solid";
import { ArrowUpRightIcon, XMarkIcon } from "@heroicons/react/24/solid";
import { get } from "datagovmy-ui/api";
import {
  At,
  Button,
  Checkbox,
  ComboBox,
  Container,
  Dropdown,
  Label,
  Modal,
  Radio,
  Section,
  toast,
} from "datagovmy-ui/components";
import { body } from "datagovmy-ui/configs/font";
import { clx, numFormat, toDate } from "datagovmy-ui/helpers";
import { useCache, useData, useFilter, useTranslation } from "datagovmy-ui/hooks";
import { OptionType } from "datagovmy-ui/types";
import { Fragment, FunctionComponent, useState } from "react";

/**
 * Publications
 * @overview Status: In-development
 */

interface BrowsePublicationsProps {
  data: any;
  query: any;
}

const BrowsePublicationsDashboard: FunctionComponent<BrowsePublicationsProps> = ({ query }) => {
  const { t, i18n } = useTranslation(["publications", "catalogue", "common"]);
  const { cache } = useCache();

  const [show, setShow] = useState<boolean>(false);
  const ITEMS_PER_PAGE = 24;
  const { data, setData } = useData({
    new: true,
    index: 0,
    page: 0,
  });

  const PUBLICATION_OPTIONS: OptionType[] = [
    "[1Q 2023] Employee Wages Statistics (Formal Sector) Report",
    "[1Q 2023] Employee Wages Statistics (Formal Sector) Report",
    "[1Q 2023] Employee Wages Statistics (Formal Sector) Report",
    "[1Q 2023] Employee Wages Statistics (Formal Sector) Report",
    "[1Q 2023] Employee Wages Statistics (Formal Sector) Report",
  ].map((e: string) => ({
    label: e,
    value: e,
  }));

  type Publication = {
    publication_id: string;
    title: string;
    description: string;
    release_date: number;
  };

  const publication: Publication = {
    publication_id: "consumer-price-index",
    title: "[1Q 2023] Employee Wages Statistics (Formal Sector) Report",
    description:
      "Short explaination of what this dashboard can provide for user. Short explaination of what this dashboard can provide for user.",
    release_date: 0,
  };

  const publications: Publication[] = Array(120)
    .fill(publication)
    .map((pub: Publication, i) => ({
      publication_id: pub.publication_id,
      description: pub.description,
      title: pub.title + i,
      release_date: pub.release_date,
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
    frequency: query.frequency
      ? frequencies.find(item => item.value === query.frequency)
      : undefined,
    geography: query.geography
      ? geographies.filter(item => query.geography.split(",").includes(item.value))
      : [],
    demography: query.demography
      ? demographies.filter(item => query.demography.split(",").includes(item.value))
      : [],
    search: query.search ?? "",
  });

  const reset = () => {
    setFilter("search", "");
    setFilter("frequency", undefined);
    setFilter("geography", []);
    setFilter("demography", []);
  };

  type Resource = {
    resource_name: string;
    resource_link: string;
    resource_type: string;
  };

  const fetchResource = async (publication_id: string): Promise<Resource[]> => {
    const identifier = `${publication_id}`;
    return new Promise(resolve => {
      if (cache.has(identifier)) return resolve(cache.get(identifier));
      get("/publication-resource", {
        language: i18n.language,
      })
        .then(({ data }: { data: Resource[] }) => {
          setData("res", data);

          cache.set(identifier, data);
          resolve(data);
        })
        .catch(e => {
          toast.error(t("common:error.toast.request_failure"), t("common:error.toast.try_again"));
          console.error(e);
        });
    });
  };

  return (
    <Container>
      <Section>
        <h4 className="text-center">{t("browse_publications")}</h4>
        <div className="mx-auto w-full p-6 sm:w-[500px]">
          <ComboBox
            placeholder={t("select_publication")}
            options={PUBLICATION_OPTIONS}
            selected={
              data.publication_option
                ? PUBLICATION_OPTIONS.find(e => e.value === data.publication_option.value)
                : null
            }
            onChange={selected => {
              setData("publication_option", selected);
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
                    onChange={e => setFilter("frequency", e)}
                  />
                </div>
                <div className="py-3">
                  <Label label={t("catalogue:geography")} />
                  <Checkbox
                    className="flex flex-wrap gap-x-4.5 gap-y-2.5 py-2"
                    name="geography"
                    options={geographies}
                    value={filter.geography}
                    onChange={e => setFilter("geography", e)}
                  />
                </div>
                <div className="py-3">
                  <Label label={t("catalogue:demography")} />
                  <Checkbox
                    className="flex flex-wrap gap-x-4.5 gap-y-2.5 py-2"
                    name="demography"
                    options={demographies}
                    value={filter.demography}
                    onChange={e => setFilter("demography", e)}
                  />
                </div>
                <div className="fixed bottom-0 left-0 flex w-full flex-col gap-3 border-t p-3 dark:border-washed-dark">
                  <Button
                    className="btn-primary w-full justify-center"
                    disabled={!actives.length}
                    onClick={reset}
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
            selected={frequencies.find(e => e === filter.frequency) ?? undefined}
            onChange={e => setFilter("frequency", e)}
          />
          <Dropdown
            anchor="left"
            width="w-fit"
            multiple
            enableClear
            title={t("catalogue:geography")}
            options={geographies}
            selected={filter.geography}
            onChange={e => setFilter("geography", e)}
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
            onChange={e => setFilter("demography", e)}
          />
          {actives.length > 0 && (
            <Button
              className="btn-ghost group text-dim hover:text-black dark:hover:text-white"
              disabled={!actives.length}
              onClick={reset}
            >
              <XMarkIcon className="h-5 w-5 text-dim group-hover:text-black dark:group-hover:text-white" />
              {t("common:common.clear_all")}
            </Button>
          )}
        </div>

        <div className="grid grid-cols-1 gap-6 pt-12 lg:grid-cols-2 xl:grid-cols-3">
          {publications
            .slice(ITEMS_PER_PAGE * data.page, ITEMS_PER_PAGE * (data.page + 1))
            .map((item, i) => (
              <Button
                className="btn-border group flex h-full w-full flex-col space-y-3 rounded-xl border p-6 transition hover:bg-background dark:hover:bg-washed-dark/50"
                onClick={() => {
                  setShow(true);
                  setData("index", ITEMS_PER_PAGE * data.page + i);
                }}
              >
                <div className="relative flex w-full items-center justify-between">
                  <p className="text-sm uppercase text-dim">
                    {toDate(item.release_date, "dd MMM yyyy", i18n.language)}
                  </p>

                  {data.new && (
                    <div className="flex items-center gap-1.5 rounded-full bg-danger px-1.5 py-0.5 text-xs text-white group-hover:-translate-x-9">
                      <span className="h-2 w-2 rounded-full bg-white" />
                      {t("new")}!
                    </div>
                  )}
                  <ArrowUpRightIcon className="absolute right-0 h-5 w-5 text-dim opacity-0 transition-opacity duration-0 group-hover:opacity-100 group-hover:duration-300" />
                </div>
                <div className="flex grow flex-col gap-3 overflow-hidden text-start ">
                  <div className="grow flex-wrap space-y-3">
                    <p className="text-lg font-bold">{item.title}</p>
                    <p className="text-sm">{item.description}</p>
                  </div>
                  <div className="relative w-full">
                    <p className="text-dim transition-transform group-hover:translate-y-6">
                      {`${numFormat(50000, "compact")}${50000 % 10 !== 0 ? "+" : ""} ${t(
                        "common:common.views",
                        {
                          count: 50000,
                        }
                      )} • ${numFormat(100000, "compact")}${100000 % 10 !== 0 ? "+" : ""} ${t(
                        "common:common.downloads",
                        {
                          count: 100000,
                        }
                      )}`}
                    </p>
                    <p className="absolute -bottom-6 text-primary transition-transform group-hover:-translate-y-6 group-hover:duration-300 dark:text-primary-dark">
                      {t("common:components.click_to_explore")}
                    </p>
                  </div>
                </div>
              </Button>
            ))}
        </div>

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
                        {toDate(0, "dd MMM yyyy", i18n.language)}
                      </p>
                      <p className="text-lg font-bold text-black dark:text-white">
                        {publications[data.index].title}
                      </p>
                      <p className="text-sm text-black dark:text-white">
                        {publications[data.index].description}
                      </p>
                      <Button
                        className="absolute right-4 top-4 h-9 w-9 rounded-full hover:bg-washed dark:hover:bg-washed-dark"
                        onClick={() => setShow(false)}
                      >
                        <XMarkIcon className="mx-auto h-6 w-6 text-dim" />
                      </Button>
                    </Dialog.Title>

                    {publications.length > ITEMS_PER_PAGE && (
                      <div className="space-y-3">
                        <div className="font-bold text-black dark:text-white">
                          {t("download_list")}
                        </div>
                        <table className="w-full table-auto">
                          <thead>
                            <tr className="border-b-2 border-outline dark:border-washed-dark">
                              <th className="px-2 py-2.5 text-start text-sm font-medium text-black dark:text-white">
                                {t("subject")}
                              </th>
                              <th className="px-2 py-2.5 text-end text-sm font-medium text-black dark:text-white">
                                {t("file_download")}
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {[
                              {
                                resource_name:
                                  "Employee Wages Statistics (Formal Sector) Report, First Quarter 2023",
                                resource_link: "https://www.data.gov.my",
                              },
                              {
                                resource_name:
                                  "Table of Employee Wages Statistics (Formal Sector) Report, First Quarter 2023",
                                resource_link: "https://www.data.gov.my",
                              },
                              {
                                resource_name:
                                  "Table of Employee Wages Statistics (Formal Sector) Report, Second Quarter 2023",
                                resource_link: "https://www.data.gov.my",
                              },
                            ].map(
                              (
                                e: {
                                  resource_type: string;
                                  resource_name: string;
                                  resource_link: string;
                                },
                                i: number
                              ) => (
                                <tr key={i} className="border-b dark:border-washed-dark">
                                  <td className="flex-wrap break-words px-2 py-2.5 text-start text-sm font-normal capitalize  text-black dark:text-white">
                                    {e.resource_name}
                                  </td>
                                  <td className="link-primary px-2 py-2.5 text-end text-sm font-normal">
                                    <At external href={e.resource_link}>
                                      {t("download", { context: e.resource_type })}
                                    </At>
                                  </td>
                                </tr>
                              )
                            )}
                          </tbody>
                        </table>

                        {publications.length > ITEMS_PER_PAGE && (
                          <div className="flex items-center justify-center gap-4 text-sm font-medium">
                            <Button
                              className="btn-default btn-disabled"
                              onClick={() =>
                                fetchResource(publications[data.index - 1].publication_id).then(
                                  item => {
                                    if (!item) return;
                                    setData("index", data.index - 1);
                                    setData("result", item);
                                  }
                                )
                              }
                              disabled={data.index === 0}
                            >
                              <ChevronLeftIcon className="h-4.5 w-4.5" />
                              {t("common:common.previous")}
                            </Button>
                            <span className="flex items-center gap-1 text-center">
                              {t("common:common.page_of", {
                                current: data.index + 1,
                                total: publications.length,
                              })}
                            </span>
                            <Button
                              className="btn-default btn-disabled"
                              onClick={() =>
                                fetchResource(publications[data.index + 1].publication_id).then(
                                  item => {
                                    if (!item) return;
                                    setData("index", data.index + 1);
                                    setData("result", item);
                                  }
                                )
                              }
                              disabled={data.index === publications.length - 1}
                            >
                              {t("common:common.next")}
                              <ChevronRightIcon className="h-4.5 w-4.5" />
                            </Button>
                          </div>
                        )}
                      </div>
                    )}
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </div>
          </Dialog>
        </Transition>

        <div className="flex items-center justify-center gap-4 pt-8 text-sm font-medium">
          <Button
            className="btn-disabled btn-default"
            onClick={() => setData("page", data.page - 1)}
            disabled={data.page === 0}
          >
            <ChevronLeftIcon className="h-4.5 w-4.5" />
            {t("common:common.previous")}
          </Button>

          <span className="flex items-center gap-1 text-center">
            {t("common:common.page_of", {
              current: data.page + 1,
              total: Math.ceil(120 / ITEMS_PER_PAGE),
            })}
          </span>
          <Button
            className="btn-disabled btn-default"
            onClick={() => setData("page", data.page + 1)}
            disabled={data.page === Math.floor(120 / ITEMS_PER_PAGE) - 1}
          >
            {t("common:common.next")}
            <ChevronRightIcon className="h-4.5 w-4.5" />
          </Button>
        </div>
      </Section>
    </Container>
  );
};

export default BrowsePublicationsDashboard;
