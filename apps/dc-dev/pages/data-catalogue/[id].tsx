import { CatalogueShow as DataCatalogueShow, DCVariable } from "datagovmy-ui/data-catalogue";
import { get } from "datagovmy-ui/api";
import { SHORT_LANG } from "datagovmy-ui/constants";
import { withi18n } from "datagovmy-ui/decorators";
import { Page } from "datagovmy-ui/types";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { AxiosResponse } from "axios";

const CatalogueShow: Page = ({
  meta,
  params,
  query,
  ...variable
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const data = variable as DCVariable;
  return <DataCatalogueShow params={params} data={data} meta={meta} query={query} />;
};

export const getServerSideProps: GetServerSideProps = withi18n(
  "catalogue",
  async ({ locale, query, params }) => {
    try {
      const { data } = (await get(`/data-catalogue/${params?.id}`, {
        language: SHORT_LANG[locale as keyof typeof SHORT_LANG],
        ...query,
      })) as AxiosResponse<DCVariable>;

      return {
        props: {
          meta: {
            id: data.id,
            type: "data-catalogue",
            category: null,
            agency: Array.isArray(data.data_source) ? data.data_source.join(",") : "",
          },
          params: { ...params },
          query: query,
          ...data,
        },
      };
    } catch (error) {
      console.error(error);
      return { notFound: true };
    }
  },
  {
    cache_expiry: 21600, // 6 hrs
  }
);

export default CatalogueShow;
