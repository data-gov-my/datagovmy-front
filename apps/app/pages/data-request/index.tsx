import DataRequestDashboard from "@misc/data-request";
import { Metadata } from "datagovmy-ui/components";
import { WindowProvider } from "datagovmy-ui/contexts/window";
import { withi18n } from "datagovmy-ui/decorators";
import { useTranslation } from "datagovmy-ui/hooks";
import { Agency, Page } from "datagovmy-ui/types";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";

export type DataRequestStatus = "under_review" | "rejected" | "in_progress" | "published";

export type DataRequestItem = {
  id: string;
  title: string;
  status: DataRequestStatus;
  date: string;
  description: string;
  data_owner: Agency;
};

// Dummy items for the page
const dummy: Array<DataRequestItem> = [
  {
    id: "1",
    title: "Title of the data set",
    status: "under_review",
    date: "2023-11-07",
    description:
      "Description of the data set long long descriptionDescription of the data set long long descriptionDescription of the data set long long description",
    data_owner: "dosm",
  },
  {
    id: "2",
    title: "Title of the data set",
    status: "in_progress",
    date: "2023-11-07",
    description: "Description of the data set long long description",
    data_owner: "dosm",
  },
  {
    id: "3",
    title: "Title of the data set",
    status: "rejected",
    date: "2023-11-07",
    description: "Description of the data set long long description",
    data_owner: "dosm",
  },
  {
    id: "4",
    title: "Random of the data set",
    status: "under_review",
    date: "2023-11-07",
    description: "Description of the data set long long description",
    data_owner: "bnm",
  },
  {
    id: "5",
    title: "Title of the data set",
    status: "under_review",
    date: "2023-11-07",
    description: "Description of the data set long long description",
    data_owner: "dosm",
  },
  {
    id: "6",
    title: "What of the data set",
    status: "rejected",
    date: "2023-11-07",
    description: "Description of the data set long long description",
    data_owner: "dosm",
  },
  {
    id: "7",
    title: "Test of the data set",
    status: "published",
    date: "2023-11-07",
    description: "Description of the data set long long description",
    data_owner: "dosm",
  },
  {
    id: "8",
    title: "Title of the data set",
    status: "published",
    date: "2023-11-07",
    description: "Description of the data set long long description",
    data_owner: "bnm",
  },
  {
    id: "9",
    title: "Title of the data set",
    status: "in_progress",
    date: "2023-11-07",
    description: "Description of the data set long long description",
    data_owner: "bomba",
  },
  {
    id: "10",
    title: "Title of the data set",
    status: "under_review",
    date: "2023-11-07",
    description: "Description of the data set long long description",
    data_owner: "dosm",
  },
  {
    id: "11",
    title: "Title of the data set",
    status: "under_review",
    date: "2023-11-07",
    description: "Description of the data set long long description",
    data_owner: "dosm",
  },
  {
    id: "12",
    title: "Title of the data set",
    status: "under_review",
    date: "2023-11-07",
    description: "Description of the data set long long description",
    data_owner: "dosm",
  },
  {
    id: "13",
    title: "Title of the data set",
    status: "rejected",
    date: "2023-11-07",
    description: "Description of the data set long long description",
    data_owner: "dosm",
  },
  {
    id: "14",
    title: "Title of the data set",
    status: "published",
    date: "2023-11-07",
    description: "Description of the data set long long description",
    data_owner: "dosm",
  },
  {
    id: "15",
    title: "Title of the data set",
    status: "in_progress",
    date: "2023-11-07",
    description: "Description of the data set long long description",
    data_owner: "dosm",
  },
];

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
      // Fetch data from BE here later
      const data = dummy;

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
