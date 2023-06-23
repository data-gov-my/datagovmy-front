import {
  At,
  Button,
  Checkbox,
  Container,
  Dropdown,
  Hero,
  Input,
  Modal,
  Radio,
  Section,
} from "@components/index";
import { ArrowTrendingUpIcon, MagnifyingGlassIcon, XMarkIcon } from "@heroicons/react/24/solid";
import { FunctionComponent, useMemo, useRef } from "react";
import Label from "@components/Label";
import { useFilter } from "@hooks/useFilter";
import { useTranslation } from "@hooks/useTranslation";
import { OptionType } from "@components/types";
import Sidebar from "@components/Sidebar";
import { useWindowWidth } from "@hooks/useWindowWidth";
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
  const { t } = useTranslation();
  const scrollRef = useRef<Record<string, HTMLElement | null>>({});
  const windowWidth = useWindowWidth();

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
      <Hero background="data-catalogue-banner">
        <div className="space-y-4 xl:w-2/3">
          <h3 className="text-black">{t("catalogue.header")}</h3>
          <p className="text-dim">{t("catalogue.description")}</p>

          <p className="flex items-center gap-2 text-sm text-dim">
            <ArrowTrendingUpIcon className="h-4 w-4" />
            <span>{t("catalogue.dataset_count", { count: total })}</span>
          </p>
        </div>
      </Hero>

      <Container className="min-h-screen lg:px-0">
        <Sidebar
          categories={Object.entries(collection).map(([category, subcategory]) => [
            category,
            Object.keys(subcategory),
          ])}
          onSelect={selected =>
            scrollRef.current[selected]?.scrollIntoView({
              behavior: "smooth",
              block: windowWidth <= BREAKPOINTS.LG ? "start" : "center",
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
                  className="p-2 pt-14 pb-8 lg:p-8"
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
            <p className="p-2 pt-16 text-dim lg:p-8">{t("common.no_entries")}.</p>
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
  const { t } = useTranslation();
  const filterPeriods: Array<OptionType> = [
    { label: t("catalogue.index_filters.daily"), value: "DAILY" },
    { label: t("catalogue.index_filters.weekly"), value: "WEEKLY" },
    { label: t("catalogue.index_filters.monthly"), value: "MONTHLY" },
    { label: t("catalogue.index_filters.quarterly"), value: "QUARTERLY" },
    { label: t("catalogue.index_filters.yearly"), value: "YEARLY" },
  ];
  const filterGeographics: Array<OptionType> = [
    { label: t("catalogue.index_filters.state"), value: "STATE" },
    { label: t("catalogue.index_filters.district"), value: "DISTRICT" },
    { label: t("catalogue.index_filters.parlimen"), value: "PARLIMEN" },
    { label: t("catalogue.index_filters.dun"), value: "DUN" },
    { label: t("catalogue.index_filters.national"), value: "NATIONAL" },
  ];
  const filterSources: Array<OptionType> = sources.map(source => ({
    label: source,
    value: source,
  }));
  const startYear: number = 1982;
  const endYear: number = new Date().getFullYear();

  const filterYears = (start: number, end: number): Array<OptionType> =>
    Array(end - start + 1)
      .fill(start)
      .map((year, index) => ({ label: `${year + index}`, value: `${year + index}` }));

  const { filter, setFilter, actives } = useFilter({
    period: query.period ? filterPeriods.find(item => item.value === query.period) : undefined,
    geographic: query.geographic
      ? filterGeographics.filter(item => query.geographic.split(",").includes(item.value))
      : [],
    begin: query.begin
      ? filterYears(startYear, endYear).find(item => item.value === query.begin)
      : undefined,
    end: query.end
      ? filterYears(startYear, endYear).find(item => item.value === query.end)
      : undefined,
    source: query.source
      ? filterSources.filter(item => query.source.split(",").includes(item.value))
      : [],
    search: query.search ?? "",
  });

  const reset = () => {
    setFilter("search", "");
    setFilter("period", undefined);
    setFilter("geographic", []);
    setFilter("begin", undefined);
    setFilter("end", undefined);
    setFilter("source", []);
  };

  return (
    <div className="sticky top-14 z-10 flex items-center justify-between gap-2 border-b bg-white py-4 lg:pl-2">
      <div className="flex-grow">
        <Input
          className="border-0 pl-10"
          type="search"
          placeholder={t("catalogue.search_placeholder")}
          autoFocus
          value={filter.search}
          onChange={e => setFilter("search", e)}
          icon={<MagnifyingGlassIcon className="h-4 w-4 lg:h-5 lg:w-5" />}
        />
      </div>
      {/* Mobile */}
      <div className="block xl:hidden">
        <Modal
          trigger={open => (
            <Button
              onClick={open}
              className="mr-3 block self-center border border-outline px-3 py-1.5 shadow-sm"
            >
              <span>{t("catalogue.filter")}</span>
              <span className="rounded-md bg-black px-1 py-0.5 text-xs text-white">
                {actives.length}
              </span>
            </Button>
          )}
          title={
            <Label
              label={t("catalogue.filter") + ":"}
              className="block text-sm font-medium text-black"
            />
          }
          fullScreen
        >
          {close => (
            <div className="flex-grow space-y-4 divide-y overflow-y-auto pb-28">
              <Radio
                label={t("catalogue.period")}
                name="period"
                className="flex flex-wrap gap-4 px-1 pt-2"
                options={filterPeriods}
                value={filter.period}
                onChange={e => setFilter("period", e)}
              />
              <Checkbox
                label={t("catalogue.geographic")}
                className="flex flex-wrap gap-4 px-1 pt-2"
                name="geographic"
                options={filterGeographics}
                value={filter.geographic}
                onChange={e => setFilter("geographic", e)}
              />

              <div className="grid grid-cols-2 gap-4">
                <Dropdown
                  width="w-full"
                  label={t("catalogue.begin")}
                  sublabel={t("catalogue.begin") + ":"}
                  options={filterYears(startYear, endYear)}
                  selected={filter.begin}
                  placeholder={t("common.select")}
                  onChange={e => setFilter("begin", e)}
                />
                <Dropdown
                  label={t("catalogue.end")}
                  sublabel={t("catalogue.end") + ":"}
                  width="w-full"
                  disabled={!filter.begin}
                  options={filter.begin ? filterYears(+filter.begin.value, endYear) : []}
                  selected={filter.end}
                  placeholder={t("common.select")}
                  onChange={e => setFilter("end", e)}
                />
              </div>

              <Checkbox
                label={t("catalogue.source")}
                className="space-y-4 px-1 pt-4"
                name="source"
                options={filterSources}
                value={filter.source}
                onChange={e => setFilter("source", e)}
              />

              <div className="fixed bottom-0 left-0 w-full space-y-2 bg-white py-3 px-2">
                <Button
                  className="w-full justify-center bg-black text-white"
                  disabled={!actives.length}
                  onClick={reset}
                >
                  {t("common.reset")}
                </Button>
                <Button
                  className="w-full justify-center bg-outline py-1.5"
                  icon={<XMarkIcon className="h-4 w-4" />}
                  onClick={close}
                >
                  {t("common.close")}
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
              {t("common.clear_all")}
            </Button>
          </div>
        )}
        <Dropdown
          options={filterPeriods}
          placeholder={t("catalogue.period")}
          selected={filter.period}
          onChange={e => setFilter("period", e)}
        />
        <Dropdown
          multiple
          title={t("catalogue.geographic")}
          options={filterGeographics}
          selected={filter.geographic}
          onChange={e => setFilter("geographic", e)}
        />

        <Dropdown
          sublabel={t("catalogue.begin") + ":"}
          options={filterYears(startYear, endYear)}
          selected={filter.begin}
          placeholder={t("common.select")}
          onChange={e => setFilter("begin", e)}
        />
        <Dropdown
          disabled={!filter.begin}
          sublabel={t("catalogue.end") + ":"}
          options={filter.begin ? filterYears(+filter.begin.value, endYear) : []}
          selected={filter.end}
          placeholder={t("common.select")}
          onChange={e => setFilter("end", e)}
        />
        <Dropdown
          multiple
          title={t("catalogue.source")}
          options={filterSources}
          selected={filter.source}
          onChange={e => setFilter("source", e)}
        />
      </div>
    </div>
  );
};

export default CatalogueIndex;
