import CommunityProductsDashboard from "@misc/community-products";
import { Metadata } from "datagovmy-ui/components";
import { withi18n } from "datagovmy-ui/decorators";
import { useTranslation } from "datagovmy-ui/hooks";
import { Page } from "datagovmy-ui/types";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";

export type CommunityProductsItem = {
  id: string;
  title: string;
  date: string;
  type: "app";
  description: string;
  image: string;
};

// Dummy items for the page
const dummy: Array<CommunityProductsItem> = [
  {
    id: "1",
    title: "CHIPTA 2020 : BAZ apps",
    type: "app",
    date: "2023-11-07",
    description:
      "Aplikasi dapat membantu ibu bapa mendapatkan maklumat berkaitan taska, pengasuh dan perkhidmatan yang ditawarkan.",
    image: "/static/images/og_en-GB.png",
  },
  {
    id: "2",
    title: "CHIPTA 2020 : Digital Therapeutics",
    type: "app",
    date: "2021-04-09",
    description:
      "Membangunkan aplikasi telefon pintar 'My Transplant Diary' untuk meningkatkan swadaya pesakit buah pinggang melalui mekanisma sokongan pesakit dan perkongsian pengalaman",
    image: "/static/images/og_en-GB.png",
  },
  {
    id: "3",
    title: "CHIPTA 2020 : PGAD",
    type: "app",
    date: "2023-11-03",
    description:
      "1. Pemetaan maklumat dadah2. Pemetaan lokasi dan kawasan berisiko3. Pelaporan/Statistik kepada stakeholder4. Merancang program kesedaran yang sesuai5. Pengintegrasian dengan maklumat penduduk",
    image: "/static/images/og_en-GB.png",
  },
  {
    id: "4",
    title: "CHIPTA 2020 : DuoFlex",
    type: "app",
    date: "2023-10-24",
    description:
      "1. Menambahbaik kadar kitar semula negara. 2. Menggalakkan rutin lestari di kalangan rakyat Malaysia.3. Mendigitalkan industri kitar semula negara",
    image: "/static/images/og_en-GB.png",
  },
  {
    id: "5",
    title: "CHIPTA 2020 : Dominator Innovation Team",
    type: "app",
    date: "2021-04-09",
    description:
      "Memastikan setiap pelajar berjaya mendapatkan pendidikan berkualiti secara percuma serta suasana pembelajaran yang relevan disamping menaik taraf sistem pendidikan di Malaysia.",
    image: "/static/images/og_en-GB.png",
  },
  {
    id: "6",
    title: "CHIPTA 2020 : Seedoo.my",
    type: "app",
    date: "2021-04-09",
    description:
      "Membantu petani menjadi 'broker' sendiri agar mereka boleh mengakses tanpa menggunakan orang tengah ke pasaran pertanian dan petani juga boleh menetapkan harga tanaman mereka dengan kadar yang lebih kompetitif.",
    image: "/static/images/og_en-GB.png",
  },
  {
    id: "7",
    title: "CHIPTA 2020 : Lestari",
    type: "app",
    date: "2021-04-09",
    description:
      "Memangkin kelestarian inovasi dalam industri SME seiring dengan norma baharu serta menyediakan kemudahan “marketplace” untuk mempromosi produk kepada pihak kerajaan / GLC / MNC",
    image: "/static/images/og_en-GB.png",
  },
];

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
      <CommunityProductsDashboard
        params={params}
        query={query}
        total_products={total_products}
        product={product}
        products={products}
      />
    </>
  );
};

export const getServerSideProps: GetServerSideProps = withi18n(
  ["community-products"],
  async ({ locale, query, params }) => {
    try {
      const product_id = params && params.product_id ? params.product_id[0] : "";

      // Fetch data from BE here later
      const data = dummy;

      const product = product_id ? dummy.find(item => item.id === product_id) : null;

      return {
        notFound: false,
        props: {
          meta: {
            id: "community-products",
            type: "misc",
            category: null,
            agency: null,
          },
          products: data,
          product: product,
          params: { product_id },
          query: query ?? {},
          total_products: data.length,
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
