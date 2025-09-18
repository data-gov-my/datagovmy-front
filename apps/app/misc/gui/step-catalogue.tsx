import { ArrowDownIcon, ArrowRightIcon, ArrowUpIcon, CheckIcon } from "@heroicons/react/20/solid";
import { PencilIcon, SparklesIcon } from "@heroicons/react/24/outline";
import { Button, Container, Input, Section, Textarea } from "datagovmy-ui/components";
import { CatalogueContext } from "datagovmy-ui/contexts/catalogue";
import { CatalogueMethodology, CatalogueMetadata, DCField } from "datagovmy-ui/data-catalogue";
import { clx, interpolate } from "datagovmy-ui/helpers";
import { useData, useTranslation } from "datagovmy-ui/hooks";
import { languages } from "datagovmy-ui/options";
import { UNIVERSAL_TABLE_SCHEMA } from "datagovmy-ui/schema/data-catalogue";
import { OptionType } from "datagovmy-ui/types";
import dynamic from "next/dynamic";
import { Dispatch, FunctionComponent, SetStateAction, useContext, useState } from "react";

const Table = dynamic(() => import("datagovmy-ui/charts/table"), { ssr: false });

interface StepCatalogueProps {
  setIndex: Dispatch<SetStateAction<number>>;
  data: Record<string, any>;
  setData: (key: string, value: any) => void;
  validation: Record<string, any>;
  setValidation: (key: string, value: any) => void;
}

const StepCatalogue: FunctionComponent<StepCatalogueProps> = ({
  setIndex,
  data,
  setData,
  validation,
  setValidation,
}) => {
  const { t } = useTranslation(["gui-data-catalogue", "catalogue", "common"]);
  const [toggleIndex, setToggleIndex] = useState(0);
  const { dataset } = useContext(CatalogueContext);
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
  });

  const generateTableSchema = () => {
    const columns = Array.isArray(dataset.table) ? Object.keys(dataset.table[0]) : [];

    switch (dataset.type) {
      case "TABLE":
        return UNIVERSAL_TABLE_SCHEMA(
          columns,
          data.translations,
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

    setData("fields", updatedResource);
  };

  return (
    <>
      <Container className="divide-y-0 lg:px-0">
        <div className="dark:border-washed-dark sticky top-14 z-10 flex border-b bg-white p-6">
          <div className="flex-1 space-y-4">
            <ul className={clx("bg-washed flex w-fit flex-wrap rounded-md")}>
              {languages.map((option, index) => (
                <li
                  key={option.value}
                  className={clx(
                    "flex cursor-pointer select-none self-center whitespace-nowrap rounded-md px-2.5 py-1 text-sm outline-none transition-colors",
                    toggleIndex === index
                      ? "dark:bg-washed-dark border-outline border bg-white font-medium text-black dark:text-white"
                      : "text-dim bg-transparent hover:text-black dark:hover:text-white"
                  )}
                  onClick={() => setToggleIndex(index)}
                >
                  {option.label}
                </li>
              ))}
            </ul>

            <p className="text-dim text-sm">{t("step_catalogue.section_explanation")}</p>
          </div>
          <div className="flex items-start justify-center gap-2">
            <Button variant="base" className="text-primary border border-[#C2D5FF] dark:bg-white">
              Draft with AI
              <SparklesIcon className="text-primary size-4" />
            </Button>
            <Button variant="primary">
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
                    className="w-full py-1.5"
                    name="title"
                    placeholder={
                      toggleIndex === 0
                        ? t("forms.title_en_placeholder")
                        : t("forms.title_ms_placeholder")
                    }
                    value={toggleIndex === 0 ? data.title_en : data.title_ms}
                    onChange={e => {
                      setData(toggleIndex === 0 ? "title_en" : "title_ms", e);
                    }}
                  />
                  <div className="absolute -left-32 top-0 flex w-fit items-center gap-2">
                    <div className="border-outline shadow-floating flex items-center gap-[3px] overflow-hidden rounded-lg border">
                      <Button
                        className="size-8 justify-center p-1"
                        disabled
                        icon={<ArrowUpIcon className="size-5" />}
                      />
                      <Button
                        className="hover:bg-washed size-8 justify-center p-1"
                        icon={<ArrowDownIcon className="size-5 text-black" />}
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
                <div className="group relative w-full">
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
                    variant="default"
                    onClick={() => setEdit("edit_title", true)}
                    className="absolute -left-12 top-0 size-8 justify-center p-1 opacity-0 transition-opacity duration-200 group-hover:opacity-100"
                    icon={<PencilIcon className="size-5" />}
                  />
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
                    className="w-full py-1.5"
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
                    }}
                  />
                  <div className="absolute -left-32 top-0 flex w-fit items-center gap-2">
                    <div className="border-outline shadow-floating flex items-center gap-[3px] overflow-hidden rounded-lg border">
                      <Button
                        className="hover:bg-washed size-8 justify-center p-1"
                        icon={<ArrowUpIcon className="size-5 text-black" />}
                        onClick={() => {
                          setEdit("edit_title", true);
                          setEdit("edit_description", false);
                        }}
                      />
                      <Button
                        className="hover:bg-washed size-8 justify-center p-1"
                        icon={<ArrowDownIcon className="size-5 text-black" />}
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
                <div className="group relative w-full">
                  <p
                    className="text-dim w-full select-none whitespace-pre-line text-base"
                    data-testid="catalogue-description"
                  >
                    {data.description_en && data.description_ms
                      ? interpolate(
                          toggleIndex === 0
                            ? data.description_en.substring(data.description_en.indexOf("]") + 1)
                            : data.description_ms.substring(data.description_ms.indexOf("]") + 1)
                        )
                      : toggleIndex === 0
                        ? `[${t("forms.description_en_placeholder")}]`
                        : `[${t("forms.description_ms_placeholder")}]`}
                  </p>
                  <Button
                    variant="default"
                    onClick={() => setEdit("edit_description", true)}
                    className="absolute -left-12 top-0 size-8 justify-center p-1 opacity-0 transition-opacity duration-200 group-hover:opacity-100"
                    icon={<PencilIcon className="size-5" />}
                  />
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
          />
        </div>
      </Container>
      <div />
    </>
  );
};

export default StepCatalogue;
