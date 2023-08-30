import { ChevronDownIcon } from "@heroicons/react/20/solid";
import { XMarkIcon } from "@heroicons/react/24/solid";
import {
  At,
  Hero,
  Button,
  Checkbox,
  Container,
  Dropdown,
  Modal,
  Radio,
  Section,
  Sidebar,
  Label,
  Search,
} from "datagovmy-ui/components";
import { BREAKPOINTS } from "datagovmy-ui/constants";
import { WindowContext } from "datagovmy-ui/contexts/window";
import { useFilter, useTranslation } from "datagovmy-ui/hooks";
import { OptionType } from "datagovmy-ui/types";
import { FunctionComponent, useContext, useMemo, useRef } from "react";

/**
 * Catalogue Index
 * @overview Status: Live
 */

export type Catalogue = {
  id: string;
  catalog_name: string;
};

interface CatalogueIndexProps {
  query: Record<string, string>;
  collection: Record<string, any>;
  sources: string[];
}

const CatalogueIndex: FunctionComponent<CatalogueIndexProps> = ({ query, collection, sources }) => {
  const { t } = useTranslation(["catalogue", "opendosm-home", "common"]);
  const scrollRef = useRef<Record<string, HTMLElement | null>>({});
  const { size } = useContext(WindowContext);

  const _collection = useMemo<Array<[string, any]>>(() => {
    let resultCollection: Array<[string, Catalogue[]]> = [];
    Object.entries(collection).forEach(([category, subcategory]) => {
      Object.entries(subcategory).forEach(([subcategory_title, datasets]) => {
        resultCollection.push([`${category}: ${subcategory_title}`, datasets as Catalogue[]]);
      });
    });

    return resultCollection;
  }, [query]);

  return (
    <div>
      <Hero
        background="blue"
        category={[t("opendosm-home:category"), "text-primary dark:text-primary-dark"]}
        header={[`${query.source ? query.source.concat(":") : ""} ${t("header")}`]}
        description={[
          t("description", {
            agency: query.source ?? "",
            context: query.source ? "agency" : "",
          }),
        ]}
      />

      <Container className="min-h-screen lg:px-0">
        <Sidebar
          categories={Object.entries(collection).map(([category, subcategory]) => [
            category,
            Object.keys(subcategory),
          ])}
          onSelect={selected =>
            scrollRef.current[selected]?.scrollIntoView({
              behavior: "smooth",
              block: size.width <= BREAKPOINTS.LG ? "start" : "center",
              inline: "end",
            })
          }
        >
          <CatalogueFilter query={query} sources={sources} />

          {_collection.length > 0 ? (
            _collection.map(([title, datasets]) => {
              return (
                <Section
                  title={title}
                  key={title}
                  ref={ref => (scrollRef.current[title] = ref)}
                  className="p-2 pb-8 pt-14 lg:p-8"
                >
                  <ul className="columns-1 space-y-3 lg:columns-2 xl:columns-3">
                    {datasets.map((item: Catalogue, index: number) => (
                      <li key={index}>
                        <At
                          href={`/data-catalogue/${item.id}`}
                          className="text-primary underline hover:no-underline"
                        >
                          {item.catalog_name}
                        </At>
                      </li>
                    ))}
                  </ul>
                </Section>
              );
            })
          ) : (
            <p className="p-2 pt-16 text-dim lg:p-8">{t("common:common.no_entries")}.</p>
          )}
        </Sidebar>
      </Container>
    </div>
  );
};

/**
 * Catalogue Filter Component
 */
interface CatalogueFilterProps {
  query: Record<string, any>;
  sources: string[];
}

const CatalogueFilter: FunctionComponent<CatalogueFilterProps> = ({ query, sources }) => {
  const { t } = useTranslation(["catalogue", "common"]);
  const periods: OptionType[] = [
    { label: t("filter_options.daily"), value: "DAILY" },
    { label: t("filter_options.weekly"), value: "WEEKLY" },
    { label: t("filter_options.monthly"), value: "MONTHLY" },
    { label: t("filter_options.quarterly"), value: "QUARTERLY" },
    { label: t("filter_options.yearly"), value: "YEARLY" },
  ];
  const geographies: OptionType[] = [
    { label: t("filter_options.national"), value: "NATIONAL" },
    { label: t("filter_options.state"), value: "STATE" },
    { label: t("filter_options.district"), value: "DISTRICT" },
    { label: t("filter_options.parlimen"), value: "PARLIMEN" },
    { label: t("filter_options.dun"), value: "DUN" },
  ];
  // const filterSources: Array<OptionType> = sources.map(source => ({
  //   label: source,
  //   value: source,
  // }));
  const startYear: number = 1982;
  const endYear: number = new Date().getFullYear();

  const filterYears = (start: number, end: number): Array<OptionType> =>
    Array(end - start + 1)
      .fill(start)
      .map((year, index) => ({ label: `${year + index}`, value: `${year + index}` }));

  const { filter, setFilter, actives } = useFilter({
    period: query.period ? periods.find(item => item.value === query.period) : undefined,
    geography: query.geography
      ? geographies.filter(item => query.geography.split(",").includes(item.value))
      : [],
    begin: query.begin
      ? filterYears(startYear, endYear).find(item => item.value === query.begin)
      : undefined,
    end: query.end
      ? filterYears(startYear, endYear).find(item => item.value === query.end)
      : undefined,
    // source: query.source
    //   ? filterSources.filter(item => query.source.split(",").includes(item.value))
    //   : [],
    search: query.search ?? "",
  });

  const reset = () => {
    setFilter("search", "");
    setFilter("period", undefined);
    setFilter("geography", []);
    setFilter("begin", undefined);
    setFilter("end", undefined);
    // setFilter("source", []);
  };

  return (
    <div className="sticky top-14 z-10 flex items-center justify-between gap-2 border-b py-4 dark:border-outlineHover-dark lg:pl-2">
      <div className="flex-grow">
        <Search
          className="border-0"
          placeholder={t("placeholder.search")}
          query={filter.search}
          onChange={e => setFilter("search", e)}
        />
      </div>
      {/* Mobile */}
      <div className="block xl:hidden">
        <Modal
          trigger={open => (
            <Button onClick={open} variant="default" className="shadow-floating">
              <span>{t("catalogue:filter")}</span>
              <span className="h-5 w-4.5 rounded-md bg-primary text-center text-white dark:bg-primary-dark">
                {actives.length}
              </span>
              <ChevronDownIcon className="-mx-[5px] h-5 w-5" />
            </Button>
          )}
          title={<Label label={t("filter") + ":"} className="text-sm font-bold" />}
        >
          {close => (
            <div className="mb-[105px] flex h-max flex-col divide-y overflow-y-auto bg-white px-4.5 pb-4.5 dark:divide-washed-dark dark:bg-black">
              <div className="py-3">
                <Radio
                  label={t("period")}
                  name="period"
                  options={periods}
                  value={filter.period}
                  onChange={e => setFilter("period", e)}
                />
              </div>
              <div className="py-3">
                <Checkbox
                  label={t("geography")}
                  name="geography"
                  options={geographies}
                  value={filter.geography}
                  onChange={e => setFilter("geography", e)}
                />
              </div>
              <div className="grid grid-cols-2 gap-3 pt-3">
                <Dropdown
                  width="w-full"
                  anchor="left-0 bottom-10"
                  label={t("begin")}
                  options={filterYears(startYear, endYear)}
                  selected={filter.begin}
                  placeholder={t("common:common.select")}
                  onChange={e => setFilter("begin", e)}
                />
                <Dropdown
                  label={t("end")}
                  width="w-full"
                  anchor="right-0 bottom-10"
                  disabled={!filter.begin}
                  options={filter.begin ? filterYears(+filter.begin.value, endYear) : []}
                  selected={filter.end}
                  placeholder={t("common:common.select")}
                  onChange={e => setFilter("end", e)}
                />
              </div>
              <div className="fixed bottom-0 left-0 flex w-full flex-col border-t bg-white p-3 dark:border-washed-dark dark:bg-black">
                <Button
                  variant="primary"
                  className="w-full justify-center"
                  disabled={!actives.length}
                  onClick={reset}
                >
                  {t("common:common.reset")}
                </Button>
                <Button variant="reset" className="w-full justify-center p-0" onClick={close}>
                  <XMarkIcon className="h-5 w-5" />
                  {t("common:common.close")}
                </Button>
              </div>
            </div>
          )}
        </Modal>
      </div>

      {/* Desktop */}
      <div className="hidden gap-2 pr-6 xl:flex">
        {actives.length > 0 && (
          <Button
            variant="ghost"
            icon={<XMarkIcon className="h-4 w-4" />}
            disabled={!actives.length}
            onClick={reset}
          >
            {t("common:common.clear_all")}
          </Button>
        )}
        <Dropdown
          options={periods}
          placeholder={t("period")}
          selected={filter.period}
          onChange={e => setFilter("period", e)}
        />
        <Dropdown
          multiple
          title={t("geography")}
          options={geographies}
          selected={filter.geography}
          onChange={e => setFilter("geography", e)}
        />

        <Dropdown
          sublabel={t("begin") + ":"}
          options={filterYears(startYear, endYear)}
          selected={filter.begin}
          placeholder={t("common:common.select")}
          onChange={e => setFilter("begin", e)}
        />
        <Dropdown
          disabled={!filter.begin}
          sublabel={t("end") + ":"}
          options={filter.begin ? filterYears(+filter.begin.value, endYear) : []}
          selected={filter.end}
          placeholder={t("common:common.select")}
          onChange={e => setFilter("end", e)}
        />
        {/* <Dropdown
          multiple
          title={t("source")}
          options={filterSources}
          selected={filter.source}
          onChange={e => setFilter("source", e)}
        /> */}
      </div>
    </div>
  );
};

export default CatalogueIndex;
