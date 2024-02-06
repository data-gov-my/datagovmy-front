import CommunityProductsDashboard from "@misc/community-products";
import { get } from "datagovmy-ui/api";
import { Metadata } from "datagovmy-ui/components";
import { SHORT_LANG } from "datagovmy-ui/constants";
import { WindowProvider } from "datagovmy-ui/contexts/window";
import { withi18n } from "datagovmy-ui/decorators";
import { useTranslation } from "datagovmy-ui/hooks";
import { Page } from "datagovmy-ui/types";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";

export type CommunityProductsItem = {
  id: number;
  name: string;
  email: string;
  institution: string;
  product_name: string;
  product_description: string;
  problem_statement: string;
  solutions_developed: string;
  product_type: string;
  product_year: number;
  product_link: string;
  dataset_used: string;
  status: string;
  created_at: string;
  date_approved: string;
  image?: string;
};

type CPResults = {
  count: number;
  next: string | null;
  previous: string | null;
  results: Array<CommunityProductsItem>;
};

const CommunityProducts: Page = ({
  meta,
  products,
  product,
  params,
  query,
  total_products,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const { t } = useTranslation(["community-products"]);

  return (
    <>
      <Metadata
        title={product ? product.title : t("header")}
        description={t("description")}
        keywords={""}
      />
      <WindowProvider>
        <CommunityProductsDashboard
          params={params}
          query={query}
          total_products={total_products}
          product={product}
          products={products}
        />
      </WindowProvider>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = withi18n(
  ["community-products", "catalogue"],
  async ({ locale, query, params }) => {
    try {
      const product_id = params && params.product_id ? params.product_id[0] : "";

      const { data } = (await get("community-product/list", {
        language: SHORT_LANG[locale as keyof typeof SHORT_LANG],
        ...query,
      })) as { data: CPResults };

      const product = product_id
        ? await get(`/community-product/${product_id}`, {
            language: locale,
          })
        : null;

      return {
        notFound: process.env.NEXT_PUBLIC_APP_ENV === "production",
        props: {
          meta: {
            id: "community-products",
            type: "misc",
            category: null,
            agency: null,
          },
          products: data.results,
          product: product ? product.data : null,
          params: { product_id },
          query: query ?? {},
          total_products: data.count,
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

export default CommunityProducts;
