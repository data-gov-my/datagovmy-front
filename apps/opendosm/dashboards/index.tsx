import { ArrowUpRightIcon, XMarkIcon } from "@heroicons/react/24/solid";
import DivisionIcon, { Division } from "@icons/division";
import { get } from "datagovmy-ui/api";
import { AgencyBadge, At, Button, Container, Hero, Section, Search } from "datagovmy-ui/components";
import { numFormat } from "datagovmy-ui/helpers";
import { useData, useTranslation } from "datagovmy-ui/hooks";
import { FunctionComponent, useEffect, useMemo, useState } from "react";

/**
 * Dashboard Index
 * @overview Status: Live
 */

type Dashboard = {
  id: string;
  name: string;
  division: Division;
  route: string;
  colour?: string;
};

type View = {
  id: string;
  view_count: number;
};

interface DashboardIndexProps {
  dashboards: Record<string, Dashboard[]>;
}

const DashboardIndex: FunctionComponent<DashboardIndexProps> = ({ dashboards }) => {
  const { t } = useTranslation(["dashboards", "opendosm-home", "agencies", "common"]);

  const { data, setData } = useData({ search: "" });

  // for ALL dashboards
  const _collection = useMemo<Dashboard[]>(() => {
    return dashboards.data.filter(d => {
      return (
        !data.search ||
        t(`dashboards.${d.name}.name`).toLowerCase().includes(data.search.toLowerCase())
      );
    });
  }, [data.search]);

  return (
    <>
      <Hero
        background="gray"
        category={[t("opendosm-home:category"), "text-primary dark:text-primary-dark"]}
        header={[`DOSM: ${t("header")}`]}
        description={[t("description", { agency: t("agencies:dosm.abbr"), context: "agency" })]}
        agencyBadge={<AgencyBadge agency="dosm" />}
      />
      <DashboardFilter
        data={{ search: data.search }}
        onSearch={value => setData("search", value)}
      />
      <Container className="min-h-screen">
        <Section title={t("section2_title")}>
          <Ranking ranks={_collection} />
        </Section>
      </Container>
    </>
  );
};

/**
 * Dashboard Filter Component
 */
interface DashboardFilterProps {
  data: {
    search: string;
  };
  onSearch: (value: string) => void;
}

const DashboardFilter: FunctionComponent<DashboardFilterProps> = ({ data, onSearch }) => {
  const { t } = useTranslation(["dashboards", "agencies", "common"]);
  const reset = () => onSearch("");

  return (
    <div className="sticky top-14 z-10 flex items-center justify-between gap-2 border-b bg-white py-3 dark:border-washed-dark dark:bg-black lg:pl-2">
      <Container>
        <div className="flex flex-row items-center gap-x-3">
          <Search
            className="w-full border-0"
            placeholder={t("search_placeholder")}
            query={data.search}
            onChange={e => typeof e === "string" && onSearch(e)}
          />
          {data.search && (
            <Button
              variant="ghost"
              className="max-md:rounded-full"
              icon={<XMarkIcon className="h-4 w-4" />}
              onClick={reset}
            >
              <p className="hidden md:block">{t("common:common.clear")}</p>
            </Button>
          )}
        </div>
      </Container>
    </div>
  );
};

DashboardFilter.displayName = "DashboardFilter";

interface RankingProps {
  ranks: Dashboard[];
}

const Ranking = ({ ranks }: RankingProps) => {
  const { t, i18n } = useTranslation(["dashboards", "agencies", "common", "division"]);
  const [views, setViews] = useState<View[]>([]);

  useEffect(() => {
    const fetchViews = () =>
      get("/view-count/", { type: "dashboard", views_only: true }).then(({ data }) =>
        setViews(data)
      );
    fetchViews();
  }, []);

  return (
    <>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 xl:grid-cols-3">
        {ranks.map((item, i) => (
          <At href={item.route} locale={i18n.language} key={i} prefetch={false}>
            <div className="group flex h-full w-full flex-col space-y-3 rounded-xl border border-outline p-6 transition-colors hover:border-outlineHover hover:bg-background motion-reduce:transition-none dark:border-washed-dark dark:hover:border-outlineHover-dark dark:hover:bg-washed-dark/50">
              <div className="relative flex items-center gap-3">
                <DivisionIcon
                  division={item.division}
                  className="h-6 w-6"
                  fillColor={item.colour}
                />
                <p className="text-sm text-dim">{t(`division:${item.division}.abbr`)}</p>
                <ArrowUpRightIcon className="absolute right-1 h-5 w-5 text-dim opacity-0 transition-all group-hover:translate-x-1 group-hover:opacity-100 motion-reduce:transition-none" />
              </div>
              <div className="flex grow flex-col items-start gap-3 overflow-hidden">
                <div className="grow space-y-3">
                  <p className="truncate text-lg font-bold dark:text-white" title={item.name}>
                    {t(`dashboards.${item.name}.name`)}
                  </p>
                  <p className="text-sm dark:text-white" title={item.name}>
                    {t(`dashboards.${item.name}.description`)}
                  </p>
                </div>
                <div className="relative w-full">
                  <p className="h-6 text-dim transition-transform group-hover:translate-y-6">
                    {`${numFormat(
                      views.find(e => e.id === item.id)?.view_count ?? 0,
                      "compact"
                    )} ${t("common:common.views", {
                      count: views.find(e => e.id === item.id)?.view_count ?? 0,
                    })}`}
                  </p>
                  <p className="absolute -bottom-6 whitespace-nowrap text-primary transition-transform group-hover:-translate-y-6 dark:text-primary-dark">
                    {t("common:components.click_to_explore")}
                  </p>
                </div>
              </div>
            </div>
          </At>
        ))}
      </div>
    </>
  );
};

export default DashboardIndex;
