import {
  AgencyBadge,
  At,
  Button,
  Checkbox,
  Container,
  Dropdown,
  Hero,
  Modal,
  Radio,
  Search,
  Section,
} from "@components/index";
import { ChevronDownIcon, XMarkIcon } from "@heroicons/react/20/solid";
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
import Image from "next/image";
import Label from "@components/Label";
import { useFilter } from "@hooks/useFilter";
import { useTranslation } from "@hooks/useTranslation";
import { OptionType } from "@components/types";
import Sidebar from "@components/Sidebar";
import { WindowContext, WindowProvider } from "@hooks/useWindow";
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
          <AgencyBadge
            agency={t("agencies:govt.full")}
            link="https://www.malaysia.gov.my/portal/index"
            icon={
              <Image src={"/static/images/jata_logo.png"} width={28} height={28} alt="Jata Logo" />
            }
          />
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
    </div>
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

    const startYear = 1982;
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
      demographic: query.demography
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
      setFilter("demographic", []);
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
        {/* Mobile */}
        <div className="block xl:hidden">
          <Modal
            trigger={open => (
              <button onClick={open} className="btn-default btn-disabled shadow-floating">
                <span>{t("filter")}</span>
                <span className="bg-primary dark:bg-primary-dark w-4.5 h-5 rounded-md text-center text-white">
                  {actives.length}
                </span>
                <ChevronDownIcon className="-mx-[5px] h-5 w-5" />
              </button>
            )}
            title={<Label label={t("filter") + ":"} className="text-sm font-bold" />}
          >
            {close => (
              <div className="px-4.5 pb-4.5 dark:divide-washed-dark mb-[105px] flex h-[400px] flex-col divide-y overflow-y-auto">
                <div className="py-3">
                  <Label label={t("period")} />
                  <Radio
                    name="period"
                    className="gap-x-4.5 flex flex-wrap gap-y-2.5 py-2"
                    options={periods}
                    value={filter.period}
                    onChange={e => setFilter("period", e)}
                  />
                </div>
                <div className="py-3">
                  <Label label={t("geography")} />
                  <Checkbox
                    className="gap-x-4.5 flex flex-wrap gap-y-2.5 py-2"
                    name="geography"
                    options={geographies}
                    value={filter.geography}
                    onChange={e => setFilter("geography", e)}
                  />
                </div>
                <div className="py-3">
                  <Label label={t("demography")} />
                  <Checkbox
                    className="gap-x-4.5 flex flex-wrap gap-y-2.5 py-2"
                    name="demographic"
                    options={demographies}
                    value={filter.demographic}
                    onChange={e => setFilter("demographic", e)}
                  />
                </div>
                <div className="grid grid-cols-2 gap-3 pt-3">
                  <Dropdown
                    width="w-full"
                    label={t("begin")}
                    options={filterYears(startYear, endYear)}
                    selected={filter.begin}
                    placeholder={t("common:common.select")}
                    onChange={e => setFilter("begin", e)}
                  />
                  <Dropdown
                    label={t("end")}
                    width="w-full"
                    disabled={!filter.begin}
                    options={filter.begin ? filterYears(+filter.begin.value, endYear) : []}
                    selected={filter.end}
                    placeholder={t("common:common.select")}
                    onChange={e => setFilter("end", e)}
                  />
                </div>
                <div className="dark:border-washed-dark fixed bottom-0 left-0 flex w-full flex-col gap-3 border-t p-3">
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
        <div className="hidden gap-2 pr-6 xl:flex">
          {actives.length > 0 && actives.findIndex(active => active[0] !== "source") !== -1 && (
            <div>
              <Button
                className="btn-ghost text-dim group hover:text-black dark:hover:text-white"
                disabled={!actives.length}
                onClick={reset}
              >
                <XMarkIcon className="text-dim h-5 w-5 group-hover:text-black dark:group-hover:text-white" />
                {t("common:common.clear_all")}
              </Button>
            </div>
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
            selected={filter.demographic}
            onChange={e => setFilter("demographic", e)}
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

CatalogueFilter.displayName = "CatalogueFilter";

export default CatalogueIndex;
