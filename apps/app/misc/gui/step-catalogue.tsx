import {
  ArrowDownIcon,
  ArrowRightIcon,
  ArrowUpIcon,
  ArrowUturnLeftIcon,
  CheckIcon,
} from "@heroicons/react/20/solid";
import {
  ExclamationCircleIcon,
  ExclamationTriangleIcon,
  PencilIcon,
  SparklesIcon,
} from "@heroicons/react/24/outline";
import { post } from "datagovmy-ui/api";
import {
  Button,
  Container,
  Input,
  Modal,
  Section,
  Skeleton,
  Spinner,
  Textarea,
} from "datagovmy-ui/components";
import { CatalogueContext } from "datagovmy-ui/contexts/catalogue";
import { CatalogueMethodology, CatalogueMetadata } from "datagovmy-ui/data-catalogue";
import { clx, interpolate } from "datagovmy-ui/helpers";
import { useCache, useData, useTranslation } from "datagovmy-ui/hooks";
import { languages } from "datagovmy-ui/options";
import { UNIVERSAL_TABLE_SCHEMA } from "datagovmy-ui/schema/data-catalogue";
import { OptionType } from "datagovmy-ui/types";
import dynamic from "next/dynamic";
import { Dispatch, FunctionComponent, SetStateAction, useContext, useState } from "react";

const Table = dynamic(() => import("datagovmy-ui/charts/table"), { ssr: false });

interface StepCatalogueProps {
  data: Record<string, any>;
  setData: (key: string, value: any) => void;
  validation: Record<string, any>;
  setValidation: (key: string, value: any) => void;
  onPublish: (json: string) => void;
  resetData: (overridingState?: Record<string, any> | undefined) => void;
  cache: Map<string, any>;
}

const StepCatalogue: FunctionComponent<StepCatalogueProps> = ({
  data,
  setData,
  validation,
  setValidation,
  onPublish,
  resetData,
  cache,
}) => {
  const { t } = useTranslation(["gui-data-catalogue", "catalogue", "common"]);
  const [toggleIndex, setToggleIndex] = useState(0);
  const { dataset } = useContext(CatalogueContext);

  // Default table config to use.
  const config = {
    precision: 0,
    filter_columns: [],
    freeze_columns: [],
  };

  const { data: edit, setData: setEdit } = useData({
    edit_title: false,
    edit_description: false,
    edit_methodology: false,
    edit_caveat: false,
    edit_publication: false,
    edit_description2: false,
    edit_fields: false,
    edit_last_updated: false,
    edit_next_update: false,
    ai_draft: false,
  });

  const generateTableSchema = () => {
    const columns = Array.isArray(dataset.table) ? Object.keys(dataset.table[0]) : [];

    switch (dataset.type) {
      case "TABLE":
        return UNIVERSAL_TABLE_SCHEMA(
          columns,
          toggleIndex === 0 ? data.translations_en : data.translations_ms,
          config.freeze_columns,
          (item, key) => item[key]
        );
      default:
        return UNIVERSAL_TABLE_SCHEMA(columns, data.translations, config.freeze_columns);
    }
  };

  const updateSingleResource = (key: string, value: any, index: number) => {
    if (index < 0 || index >= data.fields.length) {
      return;
    }

    const _key = key.split(".")[1];
    const lastKey = `${_key}_${toggleIndex === 0 ? "en" : "ms"}`;

    // Create a copy of the resources array
    const updatedResource = [...data.fields];
    updatedResource[index] = {
      ...updatedResource[index],
      [lastKey]: value,
    };
    const updatedValidations = [...validation.fields];
    updatedValidations[index] = {
      ...updatedValidations[index],
      [lastKey]: false,
    };

    setData("fields", updatedResource);
    setValidation("fields", updatedValidations);
  };

  const validateInput = async () => {
    const validationPromises = Object.entries(data).map(async ([key, value]) => {
      // skip these as it has been validated in prev step
      if (
        key === "link_csv" ||
        key === "link_parquet" ||
        key === "link_preview" ||
        key === "title_sort" ||
        key === "data_as_of" ||
        key === "file_name" ||
        key === "frequency" ||
        key === "geography" ||
        key === "demography" ||
        key === "dataset_begin" ||
        key === "dataset_end" ||
        key === "data_source" ||
        key === "related_datasets" ||
        key === "translations_en" ||
        key === "translations_ms" ||
        key === "site_category" ||
        key === "selected_category" ||
        key === "manual_trigger"
      ) {
        return [key, true];
      }

      if (typeof value === "string" || typeof value === "number") {
        if (value) {
          setValidation(key, false);
          return [key, true];
        } else {
          setValidation(key, t("validations.required"));
          return [key, false];
        }
      }

      if (Array.isArray(value) && key === "fields") {
        const validatedFields = data.fields.map((item: any, index: number) => {
          return Object.fromEntries(
            Object.entries(item).map(([k, v]) => {
              if (typeof v === "string") {
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

        setValidation(key, validatedFields);
        return [
          key,
          validatedFields.length > 0
            ? validatedFields
                .map((item: any) => Object.values(item).filter(i => Boolean(i) === true))
                .every((arr: any) => arr.length === 0)
            : false,
        ];
      }
      return [key, true]; // Default case
    });

    const updatedValidation = await Promise.all(validationPromises);

    if (updatedValidation.every(([key, validated]) => validated === true)) {
      return {
        ok: true,
        message: "All fields are validated",
      };
    } else {
      return {
        ok: false,
        message: "Some fields need to be validated",
      };
    }
  };

  const generateOutputJSON = () => {
    // Fields to exclude from the output
    const excludeFields = ["file_name", "selected_category", "link_csv_preview", "data"];

    const filteredData = Object.fromEntries(
      Object.entries(data).filter(([key]) => !excludeFields.includes(key))
    );

    return JSON.stringify(
      {
        ...filteredData,
        geography: data.geography.map((geo: OptionType) => geo.value),
        demography: data.demography.map((demo: OptionType) => demo.value),
        data_source: data.data_source.map((source: OptionType) => source.value),
        dataviz: [
          {
            dataviz_id: "table",
            title_en: "Table",
            title_ms: "Jadual",
            chart_type: "TABLE",
            config: config,
          },
        ],
      },
      null,
      4
    );
  };

  /**
   * Counts the number of validation errors for a specific language.
   * Counts validations where:
   * - Key includes the specified language, or
   * - Key does not contain "en" or "ms" (language-agnostic validations)
   * Handles arrays by counting invalid entries within them.
   * @param lang - The language to filter by ("ms" or "en")
   * @returns The count of validation errors
   */
  const getValidationCount = (lang: "ms" | "en"): number => {
    if (!validation || typeof validation !== "object") return 0;

    let count = 0;

    Object.entries(validation).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        // Handle array validations (e.g., fields)
        value.forEach(item => {
          if (item && typeof item === "object") {
            Object.entries(item).forEach(([k, v]) => {
              if (v && v !== "success") {
                if (
                  (lang === "en" && k.includes("en")) ||
                  (lang === "ms" && k.includes("ms")) ||
                  (!k.includes("en") && !k.includes("ms"))
                ) {
                  count++;
                }
              }
            });
          }
        });
      } else {
        // Handle non-array validations
        if (value && value !== "success") {
          if (
            (lang === "en" && key.includes("en")) ||
            (lang === "ms" && key.includes("ms")) ||
            (!key.includes("en") && !key.includes("ms"))
          ) {
            count++;
          }
        }
      }
    });

    return count;
  };

  const getDraftAI = async () => {
    try {
      const response = await post(`${process.env.NEXT_PUBLIC_AI_URL}/generate-meta`, {
        input_data: data,
      });

      return {
        ok: true,
        message: "Succesfully fetch draft metadata",
        data: response.data,
      };
    } catch (error) {
      return {
        ok: false,
        message: "Error fetching draft metadata",
        data: null,
      };
    } finally {
      setEdit("ai_draft", false);
    }
  };
  const revertDraftAI = async () => {
    try {
      const oldData = cache.get("data_state");
      resetData(oldData);
      // Show illusion that reverting process happened
      await new Promise(resolve => setTimeout(resolve, 200));

      return {
        ok: true,
        message: "Successfully revert draft",
      };
    } catch (error) {
      return {
        ok: false,
        message: "Error reverting",
      };
    } finally {
      setEdit("ai_draft", false);
    }
  };

  return (
    <>
      <Container className="divide-y-0 lg:px-0">
        <div className="dark:border-washed-dark sticky top-14 z-10 flex border-b bg-white p-6 dark:bg-black">
          <div className="flex-1 space-y-4">
            <ul className={clx("bg-washed flex w-fit flex-wrap rounded-md")}>
              {languages.map((option, index) => (
                <li
                  key={option.value}
                  className={clx(
                    "flex cursor-pointer select-none gap-2 self-center whitespace-nowrap rounded-md px-2.5 py-1 text-sm outline-none transition-colors",
                    toggleIndex === index
                      ? "dark:bg-washed-dark border-outline border bg-white font-medium text-black dark:text-white"
                      : "text-dim bg-transparent hover:text-black dark:hover:text-white"
                  )}
                  onClick={() => setToggleIndex(index)}
                >
                  {option.label}
                  {getValidationCount(option.value === "en-GB" ? "en" : "ms") > 0 && (
                    <span className="text-danger">
                      ({getValidationCount(option.value === "en-GB" ? "en" : "ms")})
                    </span>
                  )}
                </li>
              ))}
            </ul>

            <p className="text-dim text-sm">{t("step_catalogue.section_explanation")}</p>
          </div>
          <div className="flex items-start justify-center gap-2">
            <Modal
              trigger={open => (
                <Button
                  variant="base"
                  disabled={edit.ai_draft}
                  className="text-primary border border-[#C2D5FF] dark:bg-white"
                  onClick={open}
                >
                  {edit.ai_draft ? (
                    <Spinner loading={edit.ai_draft} />
                  ) : cache.has("data_state") ? (
                    <>
                      Revert
                      <ArrowUturnLeftIcon className="text-primary size-4" />
                    </>
                  ) : (
                    <>
                      Draft with AI
                      <SparklesIcon className="text-primary size-4" />
                    </>
                  )}
                </Button>
              )}
              title={<ExclamationCircleIcon className="text-warning mt-4 size-10" />}
              titleClassName="rounded-t-none border-b-0"
              className="w-[400px] lg:rounded-lg lg:rounded-b-lg lg:rounded-t-lg"
            >
              {close => (
                <div className="dark:divide-washed-dark flex h-max flex-col space-y-6 bg-white px-6 pb-6 dark:bg-black">
                  <div className="space-y-2">
                    <h5>
                      {cache.has("data_state")
                        ? t("step_catalogue.revert_draft")
                        : t("step_catalogue.draft_with_ai")}
                    </h5>
                    <p className="text-dim text-sm">
                      {cache.has("data_state")
                        ? t("step_catalogue.revert_draft_desc")
                        : t("step_catalogue.draft_with_ai_desc")}
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <Button
                      onClick={close}
                      className="w-full justify-center py-3"
                      variant="default"
                    >
                      {t("step_catalogue.cancel")}
                    </Button>
                    <Button
                      variant="base"
                      className={clx(
                        "bg-primary w-full justify-center py-3 text-white",
                        cache.has("data_state") && "bg-danger"
                      )}
                      onClick={async () => {
                        close();
                        setEdit("ai_draft", true);
                        Object.keys(edit).forEach(e => {
                          if (e === "ai_draft") {
                            return;
                          }
                          setEdit(e, false);
                        });
                        if (cache.has("data_state")) {
                          const response = await revertDraftAI();
                          if (response.ok) {
                            cache.delete("data_state");
                          }
                        } else {
                          try {
                            const draft_response = await getDraftAI();

                            if (draft_response.ok) {
                              cache.set("data_state", data);

                              resetData({
                                ...data,
                                ...draft_response.data.metadata,
                              });
                            }
                          } catch (error) {
                            console.error("Something went wrong");
                          }
                        }
                      }}
                    >
                      {cache.has("data_state")
                        ? t("step_catalogue.revert")
                        : t("step_catalogue.continue")}
                    </Button>
                  </div>
                </div>
              )}
            </Modal>
            <Button
              variant="primary"
              disabled={edit.ai_draft}
              onClick={async () => {
                try {
                  const isValid = (await validateInput()) as { ok: boolean; message: string };

                  if (isValid.ok) {
                    const json = generateOutputJSON();

                    onPublish(json);
                  }
                } catch (error) {}
              }}
            >
              Publish
              <ArrowRightIcon className="size-4 text-white" />
            </Button>
          </div>
        </div>
        <div className="mx-auto flex-1 p-2 py-6 pt-0 md:max-w-screen-md lg:max-w-[850px] lg:p-8 lg:py-0 lg:pb-6">
          <Section
            title={
              edit.edit_title ? (
                <div className="group relative flex w-full flex-col items-center justify-center gap-2">
                  <Input
                    required
                    autoFocus
                    className={clx(
                      "w-full py-1.5",
                      (toggleIndex === 0 ? validation.title_en : validation.title_ms)
                        ? "border-danger border-2"
                        : "border-outline dark:border-washed-dark"
                    )}
                    name="title"
                    placeholder={
                      toggleIndex === 0
                        ? t("forms.title_en_placeholder")
                        : t("forms.title_ms_placeholder")
                    }
                    value={toggleIndex === 0 ? data.title_en : data.title_ms}
                    onChange={e => {
                      setData(toggleIndex === 0 ? "title_en" : "title_ms", e);
                      setValidation(toggleIndex === 0 ? "title_en" : "title_ms", false);
                    }}
                  />
                  <div className="absolute -bottom-10 right-0 z-10 flex w-fit items-center gap-2">
                    <div className="border-outline shadow-floating dark:border-washed-dark flex items-center gap-[3px] overflow-hidden rounded-lg border">
                      <Button
                        className="size-8 justify-center p-1"
                        disabled
                        icon={<ArrowUpIcon className="size-5 text-black dark:text-white" />}
                      />
                      <Button
                        className="hover:bg-washed size-8 justify-center p-1"
                        icon={<ArrowDownIcon className="size-5 text-black dark:text-white" />}
                        onClick={() => {
                          setEdit("edit_title", false);
                          setEdit("edit_description", true);
                        }}
                      />
                    </div>
                    <Button
                      variant="default"
                      className="size-8 justify-center p-1"
                      onClick={() => setEdit("edit_title", false)}
                      icon={<CheckIcon className="text-success size-5" />}
                    />
                  </div>
                </div>
              ) : (
                <div
                  onClick={() => !edit.ai_draft && setEdit("edit_title", true)}
                  className={clx(
                    "hover:border-b-primary group relative w-full hover:rounded-sm hover:border",
                    edit.ai_draft && "hover:border-0"
                  )}
                >
                  {edit.ai_draft ? (
                    <Skeleton />
                  ) : (
                    <>
                      <h4 className="w-full select-none">
                        {data.title_en && data.title_ms
                          ? toggleIndex === 0
                            ? data.title_en
                            : data.title_ms
                          : toggleIndex === 0
                          ? `[${t("forms.title_en_placeholder")}]`
                          : `[${t("forms.title_ms_placeholder")}]`}
                      </h4>

                      <Button
                        variant={
                          (toggleIndex === 0 ? validation.title_en : validation.title_ms)
                            ? "ghost"
                            : "default"
                        }
                        className={clx("absolute -right-12 top-0 size-8 justify-center p-1")}
                        icon={
                          (toggleIndex === 0 ? validation.title_en : validation.title_ms) ? (
                            <ExclamationTriangleIcon className="text-danger size-5" />
                          ) : (
                            <PencilIcon className="size-5" />
                          )
                        }
                      />
                    </>
                  )}
                </div>
              )
            }
            description={
              edit.edit_description ? (
                <div className="group relative flex w-full flex-col items-center justify-center gap-2">
                  <Textarea
                    required
                    rows={3}
                    autoFocus
                    className={clx(
                      "w-full py-1.5",
                      (toggleIndex === 0 ? validation.description_en : validation.description_ms)
                        ? "border-danger border-2"
                        : "border-outline dark:border-washed-dark"
                    )}
                    name="description"
                    placeholder={
                      toggleIndex === 0
                        ? t("forms.description_en_placeholder")
                        : t("forms.description_ms_placeholder")
                    }
                    value={toggleIndex === 0 ? data.description_en : data.description_ms}
                    onChange={e => {
                      setData(
                        toggleIndex === 0 ? "description_en" : "description_ms",
                        e.target.value
                      );
                      setValidation(toggleIndex === 0 ? "description_en" : "description_ms", false);
                    }}
                  />
                  <div className="absolute -bottom-10 right-0 z-10 flex w-fit items-center gap-2">
                    <div className="border-outline shadow-floating dark:border-washed-dark flex items-center gap-[3px] overflow-hidden rounded-lg border">
                      <Button
                        className="hover:bg-washed size-8 justify-center p-1"
                        icon={<ArrowUpIcon className="size-5 text-black dark:text-white" />}
                        onClick={() => {
                          setEdit("edit_title", true);
                          setEdit("edit_description", false);
                        }}
                      />
                      <Button
                        className="hover:bg-washed size-8 justify-center p-1"
                        icon={<ArrowDownIcon className="size-5 text-black dark:text-white" />}
                        onClick={() => {
                          setEdit("edit_description", false);
                          setEdit("edit_methodology", true);
                        }}
                      />
                    </div>
                    <Button
                      variant="default"
                      className="size-8 justify-center p-1"
                      onClick={() => setEdit("edit_description", false)}
                      icon={<CheckIcon className="text-success size-5" />}
                    />
                  </div>
                </div>
              ) : (
                <div
                  onClick={() => !edit.ai_draft && setEdit("edit_description", true)}
                  className={clx(
                    "hover:border-b-primary group relative w-full hover:rounded-sm hover:border",
                    edit.ai_draft && "hover:border-0"
                  )}
                >
                  {edit.ai_draft ? (
                    <div className="space-y-1">
                      <Skeleton />
                      <Skeleton />
                      <Skeleton className="w-1/2" />
                    </div>
                  ) : (
                    <>
                      <p
                        className="text-dim w-full select-none whitespace-pre-line text-base"
                        data-testid="catalogue-description"
                      >
                        {data.description_en && data.description_ms
                          ? interpolate(
                              toggleIndex === 0
                                ? data.description_en.substring(
                                    data.description_en.indexOf("]") + 1
                                  )
                                : data.description_ms.substring(
                                    data.description_ms.indexOf("]") + 1
                                  )
                            )
                          : toggleIndex === 0
                          ? `[${t("forms.description_en_placeholder")}]`
                          : `[${t("forms.description_ms_placeholder")}]`}
                      </p>
                      <Button
                        variant={
                          (
                            toggleIndex === 0
                              ? validation.description_en
                              : validation.description_ms
                          )
                            ? "ghost"
                            : "default"
                        }
                        className={clx("absolute -right-12 top-0 size-8 justify-center p-1")}
                        icon={
                          (
                            toggleIndex === 0
                              ? validation.description_en
                              : validation.description_ms
                          ) ? (
                            <ExclamationTriangleIcon className="text-danger size-5" />
                          ) : (
                            <PencilIcon className="size-5" />
                          )
                        }
                      />
                    </>
                  )}
                </div>
              )
            }
          >
            <div className="min-h-[350px] lg:h-full">
              <div className={clx(dataset.type === "TABLE" ? "block" : "hidden")}>
                <Table
                  className={clx("table-stripe table-default table-sticky-header")}
                  responsive={dataset.type === "TABLE"}
                  data={dataset.table}
                  freeze={config.freeze_columns}
                  precision={config.precision}
                  config={generateTableSchema()}
                  enablePagination={["TABLE", "GEOPOINT"].includes(dataset.type) ? 15 : false}
                  data-testid="catalogue-table"
                />
              </div>
            </div>
          </Section>
          <CatalogueMethodology
            isGUI={true}
            explanation={{
              methodology: toggleIndex === 0 ? data.methodology_en : data.methodology_ms,
              caveat: toggleIndex === 0 ? data.caveat_en : data.caveat_ms,
              publication: toggleIndex === 0 ? data.publication_en : data.publication_ms,
              related_datasets: data.related_datasets,
            }}
            setMethodology={(key, value) =>
              setData(toggleIndex === 0 ? `${key}_en` : `${key}_ms`, value)
            }
            edit={edit}
            setEdit={setEdit}
            validation={validation}
            setValidation={setValidation}
            toggleIndex={toggleIndex}
          />
          <CatalogueMetadata
            isGUI={true}
            edit={edit}
            setEdit={setEdit}
            metadata={{
              description: toggleIndex === 0 ? data.description_en : data.description_ms,
              fields: data.fields.map((field: any) => ({
                name: field.name,
                title: toggleIndex === 0 ? field.title_en : field.title_ms,
                description: toggleIndex === 0 ? field.description_en : field.description_ms,
              })),
              last_updated: data.last_updated,
              next_update: data.next_update,
              data_source: data.data_source.map((source: OptionType) =>
                t(`agencies:${source.value.toLowerCase()}.full`, { defaultValue: source.value })
              ),
              link_csv: data.link_csv,
              link_parquet: data.link_parquet,
            }}
            selectedEdition={""}
            setSelectedEdition={(edition: string) => {}}
            setMetadata={(key, value, index) => {
              key.includes("fields")
                ? updateSingleResource(key, value, typeof index === "number" ? index : -1)
                : setData(
                    key === "description" ? (toggleIndex === 0 ? `${key}_en` : `${key}_ms`) : key,
                    value
                  );
            }}
            validation={validation}
            setValidation={setValidation}
            toggleIndex={toggleIndex}
          />
        </div>
      </Container>
      <div />
    </>
  );
};

export default StepCatalogue;
