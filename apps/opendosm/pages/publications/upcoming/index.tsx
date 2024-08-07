import { get } from "datagovmy-ui/api";
import { Metadata } from "datagovmy-ui/components";
import { AnalyticsProvider } from "datagovmy-ui/contexts/analytics";
import { WindowProvider } from "datagovmy-ui/contexts/window";
import { withi18n } from "datagovmy-ui/decorators";
import { useTranslation } from "datagovmy-ui/hooks";
import { Page } from "datagovmy-ui/types";
import PublicationsLayout from "misc/publications/layout";
import UpcomingPublicationsDashboard, { UpcomingPublication } from "misc/publications/upcoming";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";

const UpcomingPublications: Page = ({
  cal_pubs,
  list_pubs,
  meta,
  params,
  query,
  total_pubs,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const { t } = useTranslation(["publications", "common"]);

  return (
    <AnalyticsProvider meta={meta}>
      <Metadata title={t("header")} description={t("description")} keywords={""} />
      <PublicationsLayout>
        <WindowProvider>
          <UpcomingPublicationsDashboard
            cal_pubs={cal_pubs}
            list_pubs={list_pubs}
            params={params}
            query={query}
            total_pubs={total_pubs}
          />
        </WindowProvider>
      </PublicationsLayout>
    </AnalyticsProvider>
  );
};

export const getServerSideProps: GetServerSideProps = withi18n(
  ["publications"],
  async ({ locale, query }) => {
    try {
      const today = new Date();
      const thisMonth = today.getMonth(); // 0 - 11
      const thisYear = today.getFullYear();

      const toDate = (date: Date): string => {
        return date.toISOString().split("T")[0];
      };

      const todayISO = toDate(new Date(thisYear, thisMonth, today.getDate(), 8, 0, 0));
      const firstDay = new Date(thisYear, thisMonth, 1, 8, 0, 0).getDay();
      const daysInCurrMonth = new Date(thisYear, thisMonth + 1, 0, 8, 0, 0).getDate();
      const remaining =
        (firstDay + daysInCurrMonth) % 7 === 0 ? 0 : 7 - ((firstDay + daysInCurrMonth) % 7);

      const startDay = toDate(new Date(thisYear, thisMonth, -firstDay));
      const endDay = toDate(new Date(thisYear, thisMonth + 1, remaining));

      const { start, end, ...rest } = query;
      const [{ data: calendar }, { data: list }] = await Promise.all([
        get("/pub-upcoming/calendar/", {
          language: locale,
          start: start ?? startDay,
          end: end ?? endDay,
        }),
        get("/pub-upcoming/list/", {
          language: locale,
          start: todayISO,
          ...rest,
        }),
      ]).catch(e => {
        throw new Error("Invalid filter. Message: " + e);
      });

      // map to array of only publication titles
      const transform = (input: Record<string, UpcomingPublication[]>) => {
        const result: Record<string, string[]> = {};
        for (const key in input) {
          result[key] = input[key].map(e => e.publication_title);
        }
        return result;
      };

      return {
        notFound: false,
        props: {
          meta: {
            id: "publications",
            type: "dashboard",
            category: null,
            agency: "DOSM",
          },
          cal_pubs: calendar ? transform(calendar) : {},
          list_pubs: list.results,
          params: "page" in query || "search" in query ? { tab_index: 1 } : { tab_index: 0 },
          query: query ?? {},
          total_pubs: list.count,
        },
      };
    } catch (e: any) {
      return { notFound: true };
    }
  },
  {
    cache_expiry: 600, // 10min
  }
);

export default UpcomingPublications;
