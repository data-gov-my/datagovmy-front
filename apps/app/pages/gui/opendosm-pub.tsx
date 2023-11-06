import { GetStaticProps, InferGetStaticPropsType } from "next";
import { OptionType, Page } from "datagovmy-ui/types";
import {
  Button,
  Container,
  Metadata,
  PublicationCard,
  Resource,
  Section,
} from "datagovmy-ui/components";
import { useData, useTranslation } from "datagovmy-ui/hooks";
import { withi18n } from "datagovmy-ui/decorators";
import GUILayout from "@misc/gui/layout";
import { DateTime } from "luxon";
import GUIOpenDOSMPubForms from "@misc/gui/opendosm-pub/forms";
import { downloadJSON } from "@misc/gui/opendosm-pub/functions";
import ModalAsCard from "@misc/gui/opendosm-pub/ModalCard";

const GUIOpendosmPub: Page = ({ meta }: InferGetStaticPropsType<typeof getStaticProps>) => {
  const { t } = useTranslation(["gui-opendosm-pub", "catalogue", "publications"]);
  const { data, setData } = useData({
    release_date: DateTime.now().toISODate(),
    publication: "",
    publication_type: "",
    title: "",
    title_bm: "",
    frequency: "",
    demography: [],
    geography: [],
    resources: [],
    publication_type_title: "",
    publication_type_title_bm: "",
    description: "",
    description_bm: "",
  });

  const { data: validation, setData: setValidation } = useData(
    Object.fromEntries(Object.entries(data).map(([key]) => [key, key === "resources" ? [] : false]))
  );

  const validateInput = async () =>
    new Promise((resolve, reject) => {
      const updatedValidation = Object.entries(data).map(([key, value]) => {
        if (typeof value === "string") {
          if (value) {
            setValidation(key, false);
            return [key, true];
          } else {
            setValidation(key, "Required");
            return [key, false];
          }
        }

        if (Array.isArray(value) && (key === "demography" || key === "geography")) {
          setValidation(key, false);
          return [key, true];
        }

        if (Array.isArray(value) && key === "resources") {
          const validatedResource = data.resources.map((item: any, index: number) => {
            return Object.fromEntries(
              Object.entries(item).map(([k, v]) => {
                if (typeof v === "string") {
                  if (k === "resource_link") {
                    const isValidUrl = new RegExp(/^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/, "i").test(
                      v
                    );
                    return [k, !Boolean(v) ? "Required" : !isValidUrl ? "Not a valid url" : false];
                  }

                  if (v) {
                    return [k, false];
                  } else {
                    return [k, "Required"];
                  }
                }
                return [k, false];
              })
            );
          });

          setValidation(key, validatedResource);
          return [
            key,
            validatedResource.length > 0
              ? validatedResource
                  .map((item: any) => Object.values(item).filter(i => Boolean(i) === true))
                  .every((arr: any) => arr.length === 0)
              : false,
          ];
        }
      });

      if (updatedValidation.every(el => el && el[1] === true)) {
        resolve({
          ok: true,
          message: "All fields are validated",
        });
      } else {
        reject("Some field needs to be validated");
      }
    });

  const generateOutputJSON = () => {
    return JSON.stringify(
      {
        publication: data.publication,
        publication_type: data.publication_type,
        release_date: "YYYY-MM-DD",
        frequency: data.frequency,
        geography: data.geography.map((item: OptionType) => item.value),
        demography: data.demography.map((item: OptionType) => item.value),
        en: {
          title: data.title,
          publication_type_title: data.publication_type_title,
          description: data.description,
          resources: data.resources.map((item: Resource & { resource_name_bm: string }) => ({
            resource_id: item.resource_id,
            resource_type: item.resource_type,
            resource_name: item.resource_name,
            resource_link: item.resource_link,
          })),
        },
        bm: {
          title: data.title_bm,
          publication_type_title: data.publication_type_title_bm,
          description: data.description_bm,
          resources: data.resources.map((item: Resource & { resource_name_bm: string }) => ({
            resource_id: item.resource_id,
            resource_type: item.resource_type,
            resource_name: item.resource_name_bm,
            resource_link: item.resource_link,
          })),
        },
      },
      null,
      4
    );
  };

  return (
    <>
      <Metadata title={t("header")} description={t("description")} keywords={""} />
      <GUILayout>
        <Container>
          <Section title={t("get_started")} description={t("get_started_desc")}>
            <div className="flex w-full flex-col gap-6">
              <div className="mx-auto w-full max-w-screen-md">
                <GUIOpenDOSMPubForms
                  data={data}
                  setData={setData}
                  validation={validation}
                  setValidation={setValidation}
                />
              </div>
              <div className="mx-auto w-full max-w-screen-lg">
                <div className="flex flex-col items-center space-y-6 lg:flex-row lg:space-x-6 lg:space-y-0">
                  {/* Publication Card English */}
                  <PublicationCard
                    onClick={() => null}
                    publication={{
                      publication_id: data.publication,
                      description: data.description
                        ? data.description
                        : "The publication description preview in English. This is required for a publication",
                      publication_type: data.publication_type,
                      release_date: data.release_date
                        ? data.release_date
                        : DateTime.now().toISODate(),
                      title: data.title ? data.title : "[PUBLICATION TITLE]",
                      total_downloads: 0,
                    }}
                  />
                  {/* Publication Card BM */}
                  <PublicationCard
                    onClick={() => null}
                    publication={{
                      publication_id: data.publication,
                      description: data.description_bm
                        ? data.description_bm
                        : "The publication description preview in Bahasa Malaysia. This is required for a publication",
                      publication_type: data.publication_type,
                      release_date: data.release_date
                        ? data.release_date
                        : DateTime.now().toISODate(),
                      title: data.title_bm ? data.title_bm : "[TAJUK PENERBITAN]",
                      total_downloads: 0,
                    }}
                  />
                </div>
              </div>
              <div className="mx-auto w-full max-w-screen-xl">
                <div className="flex w-full flex-col items-center space-y-6 lg:flex-row lg:space-x-6 lg:space-y-0">
                  <ModalAsCard
                    publication={{
                      title: data.title ? data.title : "[PUBLICATION TITLE]",
                      release_date: data.release_date
                        ? data.release_date
                        : DateTime.now().toISODate(),
                      description: data.description
                        ? data.description
                        : "The publication description preview in English. This is required for a publication metadata",
                      resources: data.resources.map(
                        (item: Resource & { resource_name_bm: string }) => ({
                          resource_id: item.resource_id,
                          resource_type: item.resource_type,
                          resource_name: item.resource_name
                            ? item.resource_name
                            : "[INSERT RESOURCE NAME]",
                          resource_link: item.resource_link,
                          downloads: 0,
                        })
                      ),
                    }}
                  />
                  <ModalAsCard
                    publication={{
                      title: data.title_bm ? data.title_bm : "[TAJUK PENERBITAN]",
                      release_date: data.release_date
                        ? data.release_date
                        : DateTime.now().toISODate(),
                      description: data.description_bm
                        ? data.description_bm
                        : "The publication description preview in Bahasa Malaysia. This is required for a publication metadata",
                      resources: data.resources.map(
                        (item: Resource & { resource_name_bm: string }) => ({
                          resource_id: item.resource_id,
                          resource_type: item.resource_type,
                          resource_name: item.resource_name_bm
                            ? item.resource_name_bm
                            : "[NAMA SUMBER]",
                          resource_link: item.resource_link,
                          downloads: 0,
                        })
                      ),
                    }}
                  />
                </div>
              </div>
              <div className="flex w-full items-center justify-center gap-4">
                <Button
                  variant="primary"
                  className=""
                  onClick={async () => {
                    try {
                      const isValid = (await validateInput()) as { ok: boolean; message: string };
                      if (isValid.ok) {
                        downloadJSON(
                          generateOutputJSON(),
                          `${data.publication}.json`,
                          "application/json"
                        );
                      }
                    } catch (error) {}
                  }}
                >
                  Generate JSON
                </Button>
              </div>
            </div>
          </Section>
        </Container>
      </GUILayout>
    </>
  );
};

export const getStaticProps: GetStaticProps = withi18n(
  ["gui-opendosm-pub", "catalogue", "publications"],
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

export default GUIOpendosmPub;
