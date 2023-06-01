import Metadata from "@components/Metadata";
import KTMBExplorerDashboard from "@dashboards/transportation/ktmb-explorer";
import { useTranslation } from "@hooks/useTranslation";
import { get } from "@lib/api";
import { withi18n } from "@lib/decorators";
import type { Page } from "@lib/types";
import { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from "next";

const KTMBExplorer: Page = ({
  dropdown,
  last_updated,
  A_to_B,
  A_to_B_callout,
  params,
  B_to_A,
  B_to_A_callout,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  const { t } = useTranslation(["dashboard-ktmb-explorer", "common"]);

  return (
    <>
      <Metadata title={t("header")} description={t("description")} keywords={""} />
      <KTMBExplorerDashboard
        dropdown={dropdown}
        last_updated={last_updated}
        A_to_B={A_to_B}
        A_to_B_callout={A_to_B_callout}
        params={params}
        B_to_A={B_to_A}
        B_to_A_callout={B_to_A_callout}
      />
    </>
  );
};

/**
 * Path: /{service}/{origin}/{destination}
 * service - required - tebrau
 * origin - required - JB SENTRAL
 * destination - required - WOODLANDS CIQ
 */
export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [],
    fallback: "blocking",
  };
};

export const getStaticProps: GetStaticProps = withi18n(
  "dashboard-ktmb-explorer",
  async ({ params }) => {
    try {
      const [service, origin, destination] = params
        ? (params.service as string[])
        : [undefined, undefined, undefined];

      const [dropdown, A_to_B, B_to_A] = await Promise.all([
        get("/dropdown", { dashboard: "ktmb" }),
        get("/dashboard", {
          dashboard: "ktmb",
          service,
          origin,
          destination,
        }),
        get("/dashboard", {
          dashboard: "ktmb",
          service,
          origin: destination,
          destination: origin,
        }),
      ]).catch(e => {
        throw new Error("Invalid service. Message: " + e);
      });

      return {
        notFound: false,
        props: {
          meta: {
            id: "dashboard-ktmb-explorer",
            type: "dashboard",
            category: "transportation",
            agency: "MoT",
          },
          dropdown: dropdown.data.data,
          last_updated: Date.now(),
          A_to_B: A_to_B.data.timeseries.data,
          A_to_B_callout: A_to_B.data.timeseries_callout.data,
          params: { service: service, origin: origin, destination: destination },
          B_to_A: B_to_A.data.timeseries.data,
          B_to_A_callout: B_to_A.data.timeseries_callout.data,
        },
      };
    } catch (e: any) {
      console.error(e.message);
      return { notFound: true };
    }
  }
);

export default KTMBExplorer;
