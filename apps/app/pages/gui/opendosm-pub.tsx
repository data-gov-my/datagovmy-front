import { GetStaticProps, InferGetStaticPropsType } from "next";
import { OptionType, Page } from "datagovmy-ui/types";
import { TrashIcon } from "@heroicons/react/20/solid";
import {
  Accordion,
  Button,
  Container,
  Dropdown,
  Input,
  Label,
  Metadata,
  PubResource,
  PublicationCard,
  Resource,
  Section,
  Textarea,
} from "datagovmy-ui/components";
import { useData, useTranslation } from "datagovmy-ui/hooks";
import { withi18n } from "datagovmy-ui/decorators";
import GUILayout from "@misc/gui/layout";
import { DateTime } from "luxon";
import { toDate } from "datagovmy-ui/helpers";
import Table, { TableConfig } from "datagovmy-ui/charts/table";
import { useContext } from "react";
import { WindowContext } from "datagovmy-ui/contexts/window";
import { BREAKPOINTS } from "datagovmy-ui/constants";
import { ExcelIcon, PDFIcon } from "datagovmy-ui/icons";

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

  const frequencies: OptionType[] = [
    { label: t("catalogue:filter_options.monthly"), value: "MONTHLY" },
    { label: t("catalogue:filter_options.quarterly"), value: "QUARTERLY" },
    { label: t("catalogue:filter_options.yearly"), value: "YEARLY" },
    { label: t("catalogue:filter_options.one_off"), value: "ONE_OFF" },
  ];
  const geographies: OptionType[] = [
    { label: t("catalogue:filter_options.national"), value: "NATIONAL" },
    { label: t("catalogue:filter_options.state"), value: "STATE" },
    { label: t("catalogue:filter_options.district"), value: "DISTRICT" },
    { label: t("catalogue:filter_options.parlimen"), value: "PARLIMEN" },
    { label: t("catalogue:filter_options.dun"), value: "DUN" },
  ];
  const demographies: OptionType[] = [
    { label: t("catalogue:filter_options.sex"), value: "SEX" },
    { label: t("catalogue:filter_options.ethnicity"), value: "ETHNICITY" },
    { label: t("catalogue:filter_options.age"), value: "AGE" },
    { label: t("catalogue:filter_options.religion"), value: "RELIGION" },
    { label: t("catalogue:filter_options.nationality"), value: "NATIONALITY" },
    { label: t("catalogue:filter_options.disability"), value: "DISABILITY" },
    { label: t("catalogue:filter_options.marital"), value: "MARITAL" },
  ];
  const resourceType: OptionType[] = [
    { label: t("publications:download_mobile_excel"), value: "excel" },
    { label: t("publications:download_mobile_pdf"), value: "pdf" },
  ];

  const handleAddNewResource = () => {
    setData("resources", [
      ...data.resources,
      {
        resource_id: "",
        resource_type: "",
        resource_name: "",
        resource_name_bm: "",
        resource_link: "",
        downloads: 0,
      },
    ]);

    setValidation("resources", [
      ...validation.resources,
      {
        resource_id: false,
        resource_type: false,
        resource_name: false,
        resource_name_bm: false,
        resource_link: false,
        downloads: false,
      },
    ]);
  };

  const handleDeleteOneResource = (index: number) => {
    setData(
      "resources",
      data.resources.filter((item: Resource, idx: number) => idx !== index)
    );
    setValidation(
      "resources",
      validation.resources.filter((item: Resource, idx: number) => idx !== index)
    );
  };

  const updateSingleResource = (index: number, key: string, value: any) => {
    if (index < 0 || index >= data.resources.length) {
      return;
    }

    // Create a copy of the resources array
    const updatedResource = [...data.resources];
    updatedResource[index] = {
      ...updatedResource[index],
      [key]: value,
    };

    setData("resources", updatedResource);
  };

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

  function downloadJSON(data: any, filename: string, type: "application/json") {
    const file = new Blob([data], { type: type });
    const a = document.createElement("a");
    const url = URL.createObjectURL(file);
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    }, 0);
  }

  return (
    <>
      <Metadata title={t("header")} description={t("description")} keywords={""} />
      <GUILayout>
        <Container>
          <Section title={t("get_started")} description={t("get_started_desc")}>
            <div className="flex w-full flex-col gap-6">
              <div className="mx-auto w-full max-w-screen-md">
                <form className="flex w-full flex-col" method="post">
                  <div className="space-y-3">
                    <div className="flex flex-col gap-2 lg:flex-row">
                      <Input
                        required
                        type="text"
                        className="w-full"
                        name="publication"
                        label={t("forms.publication")}
                        placeholder={t("forms.publication")}
                        value={data.publication}
                        onChange={e => {
                          setData("publication", e);
                          setValidation("publication", false);
                        }}
                        validation={validation.publication}
                      />
                      <Input
                        required
                        type="text"
                        className="w-full"
                        name="publication_type"
                        label={t("forms.publication_type")}
                        placeholder={t("forms.publication_type")}
                        value={data.publication_type}
                        onChange={e => {
                          setData("publication_type", e);
                          setValidation("publication_type", false);
                        }}
                        validation={validation.publication_type}
                      />
                    </div>

                    <div className="flex flex-col gap-2">
                      <Label label={t("choose_items")} />
                      <div className="flex flex-col gap-3 lg:flex-row lg:gap-2">
                        <Dropdown
                          anchor="left"
                          width="w-full"
                          className={validation.frequency ? "border-danger border-2" : ""}
                          options={frequencies}
                          placeholder={t("catalogue:frequency")}
                          selected={frequencies.find(e => e.value === data.frequency) ?? undefined}
                          onChange={e => {
                            setData("frequency", e.value);
                            setValidation("frequency", false);
                          }}
                        />
                        <Dropdown
                          anchor="left"
                          width="w-full"
                          multiple
                          enableClear
                          title={t("catalogue:geography")}
                          options={geographies}
                          selected={data.geography}
                          onChange={e => {
                            setData("geography", e);
                          }}
                        />
                        <Dropdown
                          anchor="left"
                          width="w-full"
                          multiple
                          enableClear
                          title={t("catalogue:demography")}
                          description={t("catalogue:placeholder.demography") + ":"}
                          options={demographies}
                          selected={data.demography}
                          onChange={e => {
                            setData("demography", e);
                          }}
                        />
                      </div>
                      <p className="text-danger text-xs">{validation.frequency}</p>
                    </div>
                    <div className="flex flex-col gap-2 lg:flex-row">
                      <Input
                        required
                        type="text"
                        name="title"
                        className="w-full"
                        label={t("forms.title")}
                        placeholder={t("forms.title")}
                        value={data.title}
                        onChange={e => {
                          setData("title", e);
                          setValidation("title", false);
                        }}
                        validation={validation.title}
                      />
                      <Input
                        required
                        type="text"
                        className="w-full"
                        name="title_bm"
                        label={t("forms.title_bm")}
                        placeholder={t("forms.title_bm")}
                        value={data.title_bm}
                        onChange={e => {
                          setData("title_bm", e);
                          setValidation("title_bm", false);
                        }}
                        validation={validation.title_bm}
                      />
                    </div>
                    <div className="flex flex-col gap-2 lg:flex-row">
                      <Input
                        required
                        type="text"
                        className="w-full"
                        name="publication_type_title"
                        label={t("forms.publication_type_title")}
                        placeholder={t("forms.publication_type_title")}
                        value={data.publication_type_title}
                        onChange={e => {
                          setData("publication_type_title", e);
                          setValidation("publication_type_title", false);
                        }}
                        validation={validation.publication_type_title}
                      />
                      <Input
                        required
                        type="text"
                        className="w-full"
                        name="publication_type_title_bm"
                        label={t("forms.publication_type_title_bm")}
                        placeholder={t("forms.publication_type_title_bm")}
                        value={data.publication_type_title_bm}
                        onChange={e => {
                          setData("publication_type_title_bm", e);
                          setValidation("publication_type_title_bm", false);
                        }}
                        validation={validation.publication_type_title_bm}
                      />
                    </div>
                    <div className="flex flex-col gap-2 lg:flex-row">
                      <div className="flex w-full flex-col gap-2">
                        <Label name="description" label={t("forms.description")} />
                        <Textarea
                          placeholder={t("forms.description_placeholder")}
                          rows={2}
                          className={validation.description ? "border-danger border-2" : ""}
                          value={data.description}
                          onChange={e => {
                            setData("description", e.target.value);
                            setValidation("description", false);
                          }}
                        />
                        <p className="text-danger text-xs">{validation.description}</p>
                      </div>
                      <div className="flex w-full flex-col gap-2">
                        <Label name="description_bm" label={t("forms.description_bm")} />
                        <Textarea
                          placeholder={t("forms.description_placeholder_bm")}
                          rows={2}
                          value={data.description_bm}
                          className={validation.description_bm ? "border-danger border-2" : ""}
                          onChange={e => {
                            setData("description_bm", e.target.value);
                            setValidation("description_bm", false);
                          }}
                        />
                        <p className="text-danger text-xs">{validation.description_bm}</p>
                      </div>
                    </div>
                  </div>

                  <Section title={t("resources")} description={t("resources_desc")}>
                    {data.resources?.length === 0 ? (
                      <div className="flex h-[300px] w-full flex-col items-center justify-center gap-2">
                        <p className="text-dim ">{t("no_resource_added")}</p>
                        <Button onClick={handleAddNewResource} variant="primary">
                          {t("add_one")}
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-6">
                        {data.resources.map((item: Resource, index: number) => (
                          <Accordion
                            defaultOpen={true}
                            title={
                              <div className="flex w-full items-center gap-2">
                                <p className="text-md flex-1 font-medium text-black">
                                  {t("resources")} {index + 1}
                                </p>
                                <TrashIcon
                                  className="text-danger hover:bg-outlineHover/30 h-4 w-4 rounded-full"
                                  onClick={() => handleDeleteOneResource(index)}
                                />
                              </div>
                            }
                            key={index}
                            className="group flex"
                          >
                            <div className="space-y-3">
                              <div className="flex gap-2">
                                <Input
                                  required
                                  type="text"
                                  className="w-full"
                                  name="resource_link"
                                  label={t("forms.resource_link")}
                                  placeholder={t("forms.resource_link_placeholder")}
                                  value={data.resources[index].resource_link}
                                  onChange={e => updateSingleResource(index, "resource_link", e)}
                                  validation={validation.resources[index].resource_link}
                                />
                              </div>
                              <div className="flex gap-2">
                                <Input
                                  required
                                  type="text"
                                  className="w-full"
                                  name="resource_id"
                                  label={t("forms.resource_id")}
                                  placeholder={t("forms.resource_id")}
                                  value={data.resources[index].resource_id}
                                  onChange={e => updateSingleResource(index, "resource_id", e)}
                                  validation={validation.resources[index].resource_id}
                                />
                                <div className="flex w-full flex-col gap-2">
                                  <Label label={t("forms.resource_type")} />
                                  <Dropdown
                                    anchor="left"
                                    width="w-full"
                                    className={
                                      validation.resources[index].resource_type
                                        ? "border-danger border-2"
                                        : ""
                                    }
                                    options={resourceType}
                                    placeholder={t("forms.resource_type")}
                                    selected={
                                      resourceType.find(
                                        e => e.value === data.resources[index].resource_type
                                      ) ?? undefined
                                    }
                                    onChange={e =>
                                      updateSingleResource(index, "resource_type", e.value)
                                    }
                                  />
                                  <p className="text-danger text-xs">
                                    {validation.resources[index].resource_type}
                                  </p>
                                </div>
                              </div>
                              <div className="flex gap-2">
                                <Input
                                  required
                                  type="text"
                                  className="w-full"
                                  name="resource_name"
                                  label={t("forms.resource_name")}
                                  placeholder={t("forms.resource_name")}
                                  value={data.resources[index].resource_name}
                                  onChange={e => updateSingleResource(index, "resource_name", e)}
                                  validation={validation.resources[index].resource_name}
                                />
                                <Input
                                  required
                                  type="text"
                                  className="w-full"
                                  name="resource_name_bm"
                                  label={t("forms.resource_name_bm")}
                                  placeholder={t("forms.resource_name_bm")}
                                  value={data.resources[index].resource_name_bm}
                                  onChange={e => updateSingleResource(index, "resource_name_bm", e)}
                                  validation={validation.resources[index].resource_name_bm}
                                />
                              </div>
                            </div>
                          </Accordion>
                        ))}
                        <Button onClick={handleAddNewResource} variant="primary">
                          {t("add_more")}
                        </Button>
                      </div>
                    )}
                  </Section>
                </form>
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

const ModalAsCard = ({ publication }: { publication: PubResource }) => {
  const { t, i18n } = useTranslation(["publications"]);
  const { size } = useContext(WindowContext);

  const config: TableConfig[] = [
    {
      accessorKey: "resource_name",
      id: "resource_name",
      header: t("subject"),
      enableSorting: false,
      cell: ({ getValue }) => {
        return <p className="whitespace-normal">{getValue()}</p>;
      },
    },
    {
      accessorKey: "resource_link",
      id: "download_link",
      header: t("file_download"),
      enableSorting: false,
      cell: ({ row, getValue }) => {
        return (
          <div className="link-primary font-normal" onClick={() => {}}>
            {row.original.resource_type === "excel" ? (
              <ExcelIcon className="inline h-5 w-5 pr-1 text-black dark:text-white" />
            ) : (
              <PDFIcon className="inline h-5 w-5 pr-1 text-black dark:text-white" />
            )}
            {size.width <= BREAKPOINTS.SM
              ? t("download_mobile", { context: row.original.resource_type })
              : t("download", { context: row.original.resource_type })}
          </div>
        );
      },
    },
    {
      accessorKey: "downloads",
      id: "downloads",
      className: "w-20",
      header: t("downloads"),
    },
  ];

  return (
    <div className="border-outline shadow-floating dark:border-outlineHover-dark w-full rounded-xl border bg-white p-6">
      <div className="flex flex-col gap-y-1.5 text-black dark:text-white">
        <span className="text-dim pr-8 text-sm uppercase">
          {toDate(publication.release_date, "dd MMM yyyy", i18n.language)}
        </span>
        <span className="text-lg font-bold">{publication.title}</span>
        <p className="text-sm">{publication.description}</p>
      </div>
      <div className="flex flex-col justify-between gap-3 pt-6 sm:flex-row sm:items-center">
        <h5>{t("download_list")}</h5>
      </div>
      <Table
        className="pt-3 md:w-full"
        data={publication.resources}
        enablePagination={publication.resources.length > 10 ? 10 : false}
        config={config}
        precision={0}
      />
    </div>
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
