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
import { ArrowTrendingUpIcon, XMarkIcon } from "@heroicons/react/24/solid";
import { FunctionComponent, useContext, useMemo, useRef } from "react";
import { useFilter, useTranslation } from "datagovmy-ui/hooks";
import { WindowContext } from "datagovmy-ui/contexts/window";
import type { OptionType } from "datagovmy-ui/types";
import { body } from "@config/font";
import { BREAKPOINTS } from "@lib/constants";

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
  total: number;
  sources: string[];
}

const CatalogueIndex: FunctionComponent<CatalogueIndexProps> = ({
  query,
  collection,
  total,
  sources,
}) => {
  const { t } = useTranslation(["catalogue", "common"]);
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
        category={[t("common:home.category"), "text-primary dark:text-primary-dark"]}
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
    <div className="sticky top-14 z-10 flex items-center justify-between gap-2 border-b bg-white py-4 lg:pl-2">
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
          fontFamily={body.variable}
          trigger={open => (
            <Button
              onClick={open}
              className="mr-3 block self-center border border-outline px-3 py-1.5 shadow-button"
            >
              <span>{t("filter")}</span>
              <span className="rounded-md bg-black px-1 py-0.5 text-xs text-white">
                {actives.length}
              </span>
            </Button>
          )}
          title={
            <Label label={t("filter") + ":"} className="block text-sm font-medium text-black" />
          }
        >
          {close => (
            <div className="flex-grow space-y-4 overflow-y-auto pb-20 pt-4 font-sans">
              <Radio
                label={t("period")}
                name="period"
                className="flex flex-wrap gap-4 px-1 pt-2"
                options={periods}
                value={filter.period}
                onChange={e => setFilter("period", e)}
              />
              <Checkbox
                label={t("geography")}
                className="flex flex-wrap gap-4 px-1 pt-2"
                name="geography"
                options={geographies}
                value={filter.geography}
                onChange={e => setFilter("geography", e)}
              />

              <div className="grid grid-cols-2 gap-4">
                <Dropdown
                  width="w-full"
                  label={t("begin")}
                  sublabel={t("begin") + ":"}
                  options={filterYears(startYear, endYear)}
                  selected={filter.begin}
                  placeholder={t("common:common.select")}
                  onChange={e => setFilter("begin", e)}
                />
                <Dropdown
                  label={t("end")}
                  sublabel={t("end") + ":"}
                  width="w-full"
                  disabled={!filter.begin}
                  options={filter.begin ? filterYears(+filter.begin.value, endYear) : []}
                  selected={filter.end}
                  placeholder={t("common:common.select")}
                  onChange={e => setFilter("end", e)}
                />
              </div>

              {/* <Checkbox
                label={t("source")}
                className="space-y-4 px-1 pt-4"
                name="source"
                options={filterSources}
                value={filter.source}
                onChange={e => setFilter("source", e)}
              /> */}

              <div className="fixed bottom-0 left-0 flex w-full gap-2 bg-white px-2 py-3">
                <Button
                  className="w-full justify-center bg-black text-white"
                  disabled={!actives.length}
                  onClick={reset}
                >
                  {t("common:common.reset")}
                </Button>
                <Button
                  className="w-full justify-center bg-outline py-1.5"
                  icon={<XMarkIcon className="h-4 w-4" />}
                  onClick={close}
                >
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
          <div>
            <Button
              icon={<XMarkIcon className="h-4 w-4" />}
              disabled={!actives.length}
              onClick={reset}
            >
              {t("common:common.clear_all")}
            </Button>
          </div>
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
