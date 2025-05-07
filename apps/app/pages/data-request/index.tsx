import DataRequestDashboard from "@misc/data-request";
import { get } from "datagovmy-ui/api";
import { Metadata } from "datagovmy-ui/components";
import { SHORT_LANG } from "datagovmy-ui/constants";
import { WindowProvider } from "datagovmy-ui/contexts/window";
import { Catalogue } from "datagovmy-ui/data-catalogue";
import { withi18n } from "datagovmy-ui/decorators";
import { useTranslation } from "datagovmy-ui/hooks";
import { Agency, Page } from "datagovmy-ui/types";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";

export type DataRequestStatus = "under_review" | "rejected" | "data_published";

export type DataRequestItem = {
  ticket_id: number;
  date_submitted: string;
  date_under_review: string | null;
  date_completed: string | null;
  name: string;
  email: string;
  institution: string;
  dataset_title: string;
  dataset_description: string;
  agency: Agency;
  purpose_of_request: string;
  status: DataRequestStatus;
  remark: string;
  published_data: Array<Catalogue>;
};

const DataRequest: Page = ({
  meta,
  items,
  query,
  total_requests,
  dropdown,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const { t } = useTranslation(["data-request"]);

  return (
    <>
      <Metadata title={t("site.title")} description={t("site.description")} keywords={""} />
      <WindowProvider>
        <DataRequestDashboard
          query={query}
          total_requests={total_requests}
          items={items}
          dropdown={dropdown}
        />
      </WindowProvider>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = withi18n(
  ["data-request", "catalogue", "agencies"],
  async ({ locale, query }) => {
    try {
      const { data } = await get("data-request/list", {
        language: SHORT_LANG[locale as keyof typeof SHORT_LANG],
        ...query,
      });

      const { data: dropdown } = await get("data-request/agencies/list", {
        language: SHORT_LANG[locale as keyof typeof SHORT_LANG],
      });

      return {
        notFound: process.env.NEXT_PUBLIC_APP_ENV === "production" ? true : false,
        props: {
          meta: {
            id: "data-request",
            type: "misc",
            category: null,
            agency: null,
          },
          items: data,
          query: query ?? {},
          dropdown: dropdown,
          total_requests: data.length,
        },
      };
    } catch (error) {
      return { notFound: true };
    }
  },
  {
    cache_expiry: 60 * 60 * 24, // 1 day
  }
);

export default DataRequest;
