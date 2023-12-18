import { GetStaticProps, InferGetStaticPropsType } from "next";
import { Page } from "datagovmy-ui/types";
import { Container, Metadata } from "datagovmy-ui/components";
import { useData, useTranslation } from "datagovmy-ui/hooks";
import { withi18n } from "datagovmy-ui/decorators";
import GUILayout from "@misc/gui/layout";
import { CatalogueMethodology } from "datagovmy-ui/data-catalogue";

const GUICatalogue: Page = ({ meta }: InferGetStaticPropsType<typeof getStaticProps>) => {
  const { t } = useTranslation(["gui-opendosm-pub"]);
  const { data: methodology, setData: setMethodology } = useData({
    caveat: "",
    methodology: "",
    publication: "",
    related_datasets: [],
  });

  return (
    <>
      <Metadata title={t("header")} description={t("description")} keywords={""} />
      <GUILayout>
        <Container>
          <div className="mx-auto flex-1 p-2 py-6 pt-16 md:max-w-screen-md lg:max-w-screen-lg lg:p-8 lg:pb-6">
            <CatalogueMethodology
              isGUI={true}
              explanation={{
                methodology: methodology.methodology,
                caveat: methodology.caveat,
                publication: methodology.publication,
                related_datasets: [],
              }}
              setMethodology={setMethodology}
            />
          </div>
        </Container>
      </GUILayout>
    </>
  );
};

export const getStaticProps: GetStaticProps = withi18n(
  ["gui-opendosm-pub", "catalogue"],
  async () => {
    return {
      notFound: false,
      props: {
        meta: {
          id: "gui",
          type: "misc",
          category: null,
          agency: null,
        },
      },
    };
  }
);

export default GUICatalogue;
