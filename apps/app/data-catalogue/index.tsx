import { BuildingLibraryIcon, ChevronDownIcon, XMarkIcon } from "@heroicons/react/20/solid";
import {
  AgencyBadge,
  At,
  Button,
  Checkbox,
  Container,
  Daterange,
  Dropdown,
  Hero,
  Label,
  Modal,
  Radio,
  Search,
  Section,
  Sidebar,
} from "datagovmy-ui/components";
import { BREAKPOINTS } from "datagovmy-ui/constants";
import { WindowContext } from "datagovmy-ui/contexts/window";
import { useFilter, useTranslation } from "datagovmy-ui/hooks";
import { Agency, OptionType } from "datagovmy-ui/types";
import {
  FunctionComponent,
  useMemo,
  useRef,
  ForwardRefExoticComponent,
  forwardRef,
  useImperativeHandle,
  ForwardedRef,
  useContext,
} from "react";

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
  const { t } = useTranslation(["catalogue", "common"]);
  const scrollRef = useRef<Record<string, HTMLElement | null>>({});
  const filterRef = useRef<CatalogueFilterRef>(null);
  const { size } = useContext(WindowContext);
  const sourceOptions = sources.map(source => ({
    label: source,
    value: source,
  }));

  const _collection = useMemo<Array<[string, any]>>(() => {
    const resultCollection: Array<[string, Catalogue[]]> = [];
    Object.entries(collection).forEach(([category, subcategory]) => {
      Object.entries(subcategory).forEach(([subcategory_title, datasets]) => {
        resultCollection.push([`${category}: ${subcategory_title}`, datasets as Catalogue[]]);
      });
    });

    return resultCollection;
  }, [collection]);

  return (
    <>
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
        action={
          <Dropdown
            icon={<BuildingLibraryIcon className="text-dim h-4 w-4" />}
            width="w-64"
            placeholder={t("placeholder.source")}
            anchor="left"
            options={sourceOptions}
            selected={query.source ? { label: query.source, value: query.source } : undefined}
            onChange={e => filterRef.current?.setFilter("source", e)}
            enableSearch
            enableClear
          />
        }
        agencyBadge={
          <AgencyBadge agency={query.source ? (query.source.toLowerCase() as Agency) : "govt"} />
        }
      />

      <Container className="min-h-screen">
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
          <CatalogueFilter ref={filterRef} query={query} sources={sourceOptions} />

          {_collection.length > 0 ? (
            _collection.map(([title, datasets]) => {
              return (
                <Section
                  title={title}
                  key={title}
                  ref={ref => (scrollRef.current[title] = ref)}
                  className="p-2 pb-8 pt-14 lg:p-8"
                >
                  <ul className="columns-1 space-y-3 sm:columns-3">
                    {datasets.map((item: Catalogue, index: number) => (
                      <li key={index}>
                        <At
                          href={`/data-catalogue/${item.id}`}
                          className="text-primary dark:text-primary-dark no-underline [text-underline-position:from-font] hover:underline"
                          prefetch={false}
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
            <p className="text-dim p-2 pt-16 lg:p-8">{t("common:common.no_entries")}.</p>
          )}
        </Sidebar>
      </Container>
    </>
  );
};

/**
 * Catalogue Filter Component
 */
interface CatalogueFilterProps {
  query: Record<string, any>;
  sources: OptionType[];
  ref?: ForwardedRef<CatalogueFilterRef>;
}

interface CatalogueFilterRef {
  setFilter: (key: string, value: any) => void;
}

const CatalogueFilter: ForwardRefExoticComponent<CatalogueFilterProps> = forwardRef(
  ({ query, sources }, ref) => {
    const { t } = useTranslation(["catalogue", "common"]);
    const periods: OptionType[] = [
      { label: t("filter_options.daily"), value: "DAILY" },
      { label: t("filter_options.weekly"), value: "WEEKLY" },
      { label: t("filter_options.monthly"), value: "MONTHLY" },
      { label: t("filter_options.quarterly"), value: "QUARTERLY" },
      { label: t("filter_options.yearly"), value: "YEARLY" },
      { label: t("filter_options.intraday"), value: "INTRADAY" },
      { label: t("filter_options.infrequent"), value: "INFREQUENT" },
      { label: t("filter_options.as_required"), value: "AS_REQUIRED" },
    ];
    const geographies: OptionType[] = [
      { label: t("filter_options.national"), value: "NATIONAL" },
      { label: t("filter_options.state"), value: "STATE" },
      { label: t("filter_options.district"), value: "DISTRICT" },
      { label: t("filter_options.parlimen"), value: "PARLIMEN" },
      { label: t("filter_options.dun"), value: "DUN" },
    ];
    const demographies: OptionType[] = [
      { label: t("filter_options.sex"), value: "SEX" },
      { label: t("filter_options.ethnicity"), value: "ETHNICITY" },
      { label: t("filter_options.age"), value: "AGE" },
      { label: t("filter_options.religion"), value: "RELIGION" },
      { label: t("filter_options.nationality"), value: "NATIONALITY" },
      { label: t("filter_options.disability"), value: "DISABILITY" },
      { label: t("filter_options.marital"), value: "MARITAL" },
    ];

    const startYear = 1920;
    const endYear: number = new Date().getFullYear();

    const filterYears = (start: number, end: number): OptionType[] =>
      Array(end - start + 1)
        .fill(start)
        .map((year, index) => ({ label: `${year + index}`, value: `${year + index}` }));

    const { filter, setFilter, actives } = useFilter({
      period: query.period ? periods.find(item => item.value === query.period) : undefined,
      geography: query.geography
        ? geographies.filter(item => query.geography.split(",").includes(item.value))
        : [],
      demography: query.demography
        ? demographies.filter(item => query.demography.split(",").includes(item.value))
        : [],
      begin: query.begin
        ? filterYears(startYear, endYear).find(item => item.value === query.begin)
        : undefined,
      end: query.end
        ? filterYears(startYear, endYear).find(item => item.value === query.end)
        : undefined,
      source: query.source ? sources.find(item => query.source === item.value) : [],
      search: query.search ?? "",
    });

    const reset = () => {
      setFilter("search", "");
      setFilter("period", undefined);
      setFilter("geography", []);
      setFilter("demography", []);
      setFilter("begin", undefined);
      setFilter("end", undefined);
    };

    useImperativeHandle(ref, () => {
      return { setFilter };
    });

    return (
      <div className="dark:border-washed-dark sticky top-14 z-10 flex items-center justify-between gap-2 border-b bg-white py-3 dark:bg-black lg:pl-2">
        <div className="flex-1">
          <Search
            className="border-none"
            placeholder={t("placeholder.search")}
            query={filter.search}
            onChange={e => setFilter("search", e)}
          />
        </div>
        {actives.length > 0 && actives.findIndex(active => active[0] !== "source") !== -1 && (
          <Button
            variant="reset"
            className="hover:bg-washed dark:hover:bg-washed-dark text-dim group block rounded-full p-1 hover:text-black dark:hover:text-white xl:hidden"
            disabled={!actives.length}
            onClick={reset}
          >
            <XMarkIcon className="text-dim h-5 w-5 group-hover:text-black dark:group-hover:text-white" />
          </Button>
        )}
        {/* Mobile */}
        <div className="block xl:hidden">
          <Modal
            trigger={open => (
              <Button onClick={open} className="btn-default shadow-floating">
                <span>{t("filter")}</span>
                <span className="bg-primary dark:bg-primary-dark w-4.5 h-5 rounded-md text-center text-white">
                  {actives.length}
                </span>
                <ChevronDownIcon className="-mx-[5px] h-5 w-5" />
              </Button>
            )}
            title={<Label label={t("filter") + ":"} className="text-sm font-bold" />}
          >
            {close => (
              <div className="px-4.5 pb-4.5 dark:divide-washed-dark mb-[84px] flex h-max flex-col divide-y overflow-y-auto bg-white dark:bg-black">
                <div className="py-3">
                  <Radio
                    name="period"
                    label={t("period")}
                    options={periods}
                    value={filter.period}
                    onChange={e => setFilter("period", e)}
                  />
                </div>
                <div className="py-3">
                  <Checkbox
                    name="geography"
                    label={t("geography")}
                    options={geographies}
                    value={filter.geography}
                    onChange={e => setFilter("geography", e)}
                  />
                </div>
                <div className="py-3">
                  <Checkbox
                    name="demography"
                    label={t("demography")}
                    options={demographies}
                    value={filter.demography}
                    onChange={e => setFilter("demography", e)}
                  />
                </div>
                <div className="grid grid-cols-2 gap-3 pt-3">
                  <Dropdown
                    label={t("begin")}
                    width="w-full"
                    anchor="left-0 bottom-10"
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
                <div className="dark:border-washed-dark fixed bottom-0 left-0 flex w-full flex-col border-t bg-white p-3 dark:bg-black">
                  <Button
                    variant="primary"
                    className="justify-center"
                    disabled={!actives.length}
                    onClick={reset}
                  >
                    {t("common:common.reset")}
                  </Button>
                  <Button variant="base" className="justify-center" onClick={close}>
                    {/* <XMarkIcon className="h-4 w-4" /> */}
                    {t("common:common.close")}
                  </Button>
                </div>
              </div>
            )}
          </Modal>
        </div>

        {/* Desktop */}
        <div className="hidden gap-2 pr-6 xl:flex">
          {actives.length > 0 && actives.findIndex(active => active[0] !== "source") !== -1 && (
            <Button
              className="btn-ghost text-dim group hover:text-black dark:hover:text-white"
              disabled={!actives.length}
              onClick={reset}
            >
              <XMarkIcon className="text-dim h-5 w-5 group-hover:text-black dark:group-hover:text-white" />
              {t("common:common.clear_all")}
            </Button>
          )}
          <Dropdown
            options={periods}
            placeholder={t("period")}
            selected={periods.find(item => item.value === filter.period?.value) ?? undefined}
            onChange={e => setFilter("period", e)}
          />
          <Dropdown
            multiple
            enableClear
            title={t("geography")}
            options={geographies}
            selected={filter.geography}
            onChange={e => setFilter("geography", e)}
          />
          <Dropdown
            multiple
            enableClear
            title={t("demography")}
            description={t("placeholder.demography") + ":"}
            options={demographies}
            selected={filter.demography}
            onChange={e => setFilter("demography", e)}
          />

          <Daterange
            startYear={startYear}
            endYear={endYear}
            selectedStart={query.begin}
            selectedEnd={query.end}
            onChange={([begin, end]) => {
              if (begin) setFilter("begin", { label: begin, value: begin });
              if (end) setFilter("end", { label: end, value: end });
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

CatalogueFilter.displayName = "CatalogueFilter";

export default CatalogueIndex;
