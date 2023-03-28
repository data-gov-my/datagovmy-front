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
import {
  FunctionComponent,
  useMemo,
  useRef,
  ForwardRefExoticComponent,
  forwardRef,
  useImperativeHandle,
  ReactNode,
  ForwardedRef,
} from "react";
import Label from "@components/Label";
import { useFilter } from "@hooks/useFilter";
import { useTranslation } from "@hooks/useTranslation";
import { OptionType } from "@components/types";
import Sidebar from "@components/Sidebar";
import { useWindowWidth } from "@hooks/useWindowWidth";
import { BREAKPOINTS } from "@lib/constants";
import Daterange from "@components/Dropdown/Daterange";
import { BuildingLibraryIcon } from "@heroicons/react/20/solid";

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
  const filterRef = useRef<CatalogueFilterRef>(null);
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
      <Hero
        background="bg-gradient-radial from-white to-primary/10 dark:from-outlineHover-dark dark:to-black border-b dark:border-b-washed-dark"
        header={[
          t("catalogue.header").concat(
            filterRef.current?.source ? `: ${filterRef.current?.source}` : ""
          ),
        ]}
        description={
          <div className="space-y-6">
            <p className="text-dim">{t("catalogue.description")}</p>
            {filterRef.current?.sourceFilter()}
          </div>
        }
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
              block: windowWidth <= BREAKPOINTS.LG ? "start" : "center",
              inline: "end",
            })
          }
        >
          <CatalogueFilter ref={filterRef} query={query} sources={sources} />

          {_collection.length > 0 ? (
            _collection.map(([title, datasets]) => {
              return (
                <Section
                  title={<p className="text-lg font-bold">{title}</p>}
                  key={title}
                  ref={ref => (scrollRef.current[title] = ref)}
                  className="p-2 pt-14 pb-8 lg:p-8"
                >
                  <ul className="columns-1 space-y-3 lg:columns-2 xl:columns-3">
                    {datasets.map((item: Catalogue, index: number) => (
                      <li key={index}>
                        <At
                          href={`/data-catalogue/${item.id}`}
                          className="text-primary no-underline hover:underline dark:text-primary-dark"
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
  ref?: ForwardedRef<CatalogueFilterRef>;
}

interface CatalogueFilterRef {
  source?: string;
  sourceFilter: () => ReactNode;
}

const CatalogueFilter: ForwardRefExoticComponent<CatalogueFilterProps> = forwardRef(
  ({ query, sources }, ref) => {
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
      geography: query.geography
        ? filterGeographics.filter(item => query.geography.split(",").includes(item.value))
        : [],
      begin: query.begin
        ? filterYears(startYear, endYear).find(item => item.value === query.begin)
        : undefined,
      end: query.end
        ? filterYears(startYear, endYear).find(item => item.value === query.end)
        : undefined,
      source: query.source ? filterSources.find(item => query.source === item.value) : [],
      search: query.search ?? "",
    });

    const reset = () => {
      setFilter("search", "");
      setFilter("period", undefined);
      setFilter("geography", []);
      setFilter("begin", undefined);
      setFilter("end", undefined);
    };

    useImperativeHandle(ref, () => {
      return {
        source: filter.source?.value ?? "",
        sourceFilter: () => (
          <Dropdown
            icon={<BuildingLibraryIcon className="h-4 w-4 text-dim" />}
            className="min-w-[250px]"
            placeholder={t("catalogue.source_placeholder")}
            anchor="left"
            options={filterSources}
            selected={filter.source}
            onChange={e => setFilter("source", e)}
            enableSearch
            enableClear
          />
        ),
      };
    });

    return (
      <div className="sticky top-14 z-10 flex items-center justify-between gap-2 border-b bg-white py-3 dark:border-washed-dark dark:bg-black lg:pl-2">
        <div className="flex-grow">
          <Input
            className="border-0"
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
                className="mr-3 block self-center border border-outline px-3 py-1.5 shadow-sm dark:border-washed-dark"
              >
                <span>{t("catalogue.filter")}</span>
                <span className="rounded-md bg-black px-1 py-0.5 text-xs text-white dark:bg-white dark:text-black">
                  {actives.length}
                </span>
              </Button>
            )}
            title={
              <Label
                label={t("catalogue.filter") + ":"}
                className="block text-sm font-medium text-black dark:text-white"
              />
            }
            fullScreen
          >
            {close => (
              <div className="flex-grow space-y-4 divide-y overflow-y-auto pb-28 dark:divide-outlineHover-dark">
                <Radio
                  label={t("catalogue.period")}
                  name="period"
                  className="flex flex-wrap gap-4 px-1 pt-2"
                  options={filterPeriods}
                  value={filter.period}
                  onChange={e => setFilter("period", e)}
                />
                <Checkbox
                  label={t("catalogue.geography")}
                  className="flex flex-wrap gap-4 px-1 pt-2"
                  name="geography"
                  options={filterGeographics}
                  value={filter.geography}
                  onChange={e => setFilter("geography", e)}
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

                <div className="fixed bottom-0 left-0 w-full space-y-2 bg-white py-3 px-2 dark:bg-black">
                  <Button
                    className="btn btn-primary w-full justify-center"
                    disabled={
                      actives.length === 0 ||
                      actives.findIndex(active => active[0] === "source") === -1
                    }
                    onClick={reset}
                  >
                    {t("common.reset")}
                  </Button>
                  <Button
                    className="btn w-full justify-center"
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
          {actives.length > 0 && actives.findIndex(active => active[0] !== "source") !== -1 && (
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
            enableClear
            title={t("catalogue.geography")}
            options={filterGeographics}
            selected={filter.geography}
            onChange={e => setFilter("geography", e)}
          />

          <Daterange
            beginOptions={filterYears(startYear, endYear)}
            endOptions={filterYears(startYear, endYear)}
            selected={[
              filterYears(startYear, endYear).find(item => item.value === query.begin),
              filterYears(startYear, endYear).find(item => item.value === query.end),
            ]}
            onChange={([begin, end]) => {
              if (begin) setFilter("begin", begin);
              if (end) setFilter("end", end);
            }}
            onReset={() => {
              setFilter("begin", undefined);
              setFilter("end", undefined);
            }}
          />
        </div>
      </div>
    );
  }
);

export default CatalogueIndex;
