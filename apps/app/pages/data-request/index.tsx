import DataRequestDashboard from "@misc/data-request";
import { get } from "datagovmy-ui/api";
import { Metadata } from "datagovmy-ui/components";
import { SHORT_LANG } from "datagovmy-ui/constants";
import { WindowProvider } from "datagovmy-ui/contexts/window";
import { withi18n } from "datagovmy-ui/decorators";
import { useTranslation } from "datagovmy-ui/hooks";
import { Agency, Page } from "datagovmy-ui/types";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";

export type DataRequestStatus = "under_review" | "rejected" | "in_progress" | "data_published";

export type DataRequestItem = {
  ticket_id: number;
  name: string;
  email: string;
  institution: string;
  dataset_title: string;
  dataset_description: string;
  agency: Agency;
  purpose_of_request: string;
  status: DataRequestStatus;
};

const DataRequest: Page = ({
  meta,
  items,
  query,
  total_requests,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const { t } = useTranslation(["data-request"]);

  return (
    <>
      <Metadata title={t("header")} description={t("description")} keywords={""} />
      <WindowProvider>
        <DataRequestDashboard query={query} total_requests={total_requests} items={items} />
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

      return {
        notFound: process.env.NEXT_PUBLIC_APP_ENV === "production",
        props: {
          meta: {
            id: "data-request",
            type: "misc",
            category: null,
            agency: null,
          },
          items: data,
          query: query ?? {},
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
