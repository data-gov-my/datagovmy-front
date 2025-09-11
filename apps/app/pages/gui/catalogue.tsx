import { GetStaticProps, InferGetStaticPropsType } from "next";
import { Page } from "datagovmy-ui/types";
import { Button, Container, Input, Metadata, Section, Textarea } from "datagovmy-ui/components";
import { useData, useTranslation } from "datagovmy-ui/hooks";
import { withi18n } from "datagovmy-ui/decorators";
import GUILayout from "@misc/gui/layout";
import { CatalogueMethodology } from "datagovmy-ui/data-catalogue";
import { clx, interpolate } from "datagovmy-ui/helpers";
import GUIDataCatalogueLanding from "@misc/gui/landing";
import { get } from "datagovmy-ui/api";
import { SHORT_LANG } from "datagovmy-ui/constants";

const GUICatalogue: Page = ({ sources }: InferGetStaticPropsType<typeof getStaticProps>) => {
  const { t } = useTranslation(["gui-opendosm-pub"]);
  const { data: methodology, setData: setMethodology } = useData({
    caveat: "",
    methodology: "",
    publication: "",
    related_datasets: [],
  });
  const { data: title, setData: setTitle } = useData({
    title: "",
    description: "",
    edit_title: false,
    edit_description: false,
  });

  return (
    <>
      <Metadata title={t("header")} description={t("description")} keywords={""} />
      <GUIDataCatalogueLanding sources={sources} />
      {/* <GUILayout>
        <Container>
          <div className="mx-auto flex-1 p-2 py-6 pt-16 md:max-w-screen-md lg:max-w-screen-lg lg:p-8 lg:pb-6">
            <Section
              title={
                title.edit_title ? (
                  <div className="flex w-full flex-col items-end gap-2">
                    <Input
                      required
                      autoFocus
                      className="min-w-[500px]"
                      name="title"
                      placeholder={"[Double Click Here To Add Title]"}
                      value={title.title}
                      onChange={e => {
                        setTitle("title", e);
                      }}
                      // validation={validation.publication}
                    />
                    <div className="flex gap-2 self-end">
                      <Button variant="primary" onClick={() => setTitle("edit_title", false)}>
                        Ok
                      </Button>
                      <Button
                        variant="ghost"
                        onClick={() => {
                          setTitle("title", "");
                        }}
                      >
                        Clear
                      </Button>
                    </div>
                  </div>
                ) : (
                  <h4
                    className="select-none hover:cursor-pointer"
                    onDoubleClick={() => setTitle("edit_title", true)}
                  >
                    {title.title || "[Double Click Here To Add Title]"}
                  </h4>
                )
              }
              description={
                title.edit_description ? (
                  <div className="flex w-full flex-col items-end gap-2">
                    <Textarea
                      required
                      rows={2}
                      autoFocus
                      className="min-w-[500px]"
                      name="description"
                      placeholder={"[Double Click Here To Add Description]"}
                      value={title.description}
                      onChange={e => {
                        setTitle("description", e.target.value);
                      }}
                      // validation={validation.publication}
                    />
                    <div className="flex gap-2">
                      <Button variant="primary" onClick={() => setTitle("edit_description", false)}>
                        Ok
                      </Button>
                      <Button
                        variant="ghost"
                        onClick={() => {
                          setTitle("description", "");
                        }}
                      >
                        Clear
                      </Button>
                    </div>
                  </div>
                ) : (
                  <p
                    className="text-dim select-none whitespace-pre-line text-base hover:cursor-pointer"
                    data-testid="catalogue-description"
                    onDoubleClick={() => setTitle("edit_description", true)}
                  >
                    {interpolate(title.description.substring(title.description.indexOf("]") + 1)) ||
                      "[Double Click Here To Add Description]"}
                  </p>
                )
              }
            >
              <div className="bg-background flex h-40 w-full items-center justify-center rounded-lg text-sm">
                Preview of chart
              </div>
            </Section>
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
      </GUILayout> */}
    </>
  );
};

export const getStaticProps: GetStaticProps = withi18n(
  ["gui-opendosm-pub", "catalogue"],
  async ({ locale }) => {
    const { data } = await get("/data-catalogue", {
      language: SHORT_LANG[locale! as keyof typeof SHORT_LANG],
      site: "datagovmy",
    });

    return {
      notFound: process.env.NEXT_PUBLIC_APP_ENV === "production",
      props: {
        meta: {
          id: "gui",
          type: "misc",
          category: null,
          agency: null,
        },
        sources: data.source_filters.sort((a: string, b: string) => a.localeCompare(b)),
      },
    };
  }
);

export default GUICatalogue;
