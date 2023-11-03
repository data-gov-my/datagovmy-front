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
  const { t } = useTranslation(["gui", "catalogue", "publications"]);
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
  };

  const handleDeleteOneResource = (index: number) => {
    setData(
      "resources",
      data.resources.filter((item: Resource, idx: number) => idx !== index)
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
          <Section
            title={"Get Started"}
            description="Fill in the forms and show preview of the metadata of the publication"
          >
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
                        label="Publication ID"
                        placeholder={"Publication ID"}
                        value={data.publication}
                        onChange={e => {
                          setData("publication", e);
                        }}
                      />
                      <Input
                        required
                        type="text"
                        className="w-full"
                        name="publication_type"
                        label="Publication Type"
                        placeholder={"Publication Type"}
                        value={data.publication_type}
                        onChange={e => {
                          setData("publication_type", e);
                        }}
                      />
                    </div>

                    <div className="flex flex-col gap-2">
                      <Label label="Choose items" />
                      <div className="flex flex-col gap-3 lg:flex-row lg:gap-2">
                        <Dropdown
                          anchor="left"
                          width="w-full"
                          options={frequencies}
                          placeholder={t("catalogue:frequency")}
                          selected={frequencies.find(e => e.value === data.frequency) ?? undefined}
                          onChange={e => {
                            setData("frequency", e.value);
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
                    </div>
                    <div className="flex flex-col gap-2 lg:flex-row">
                      <Input
                        required
                        type="text"
                        name="title"
                        className="w-full"
                        label="Title"
                        placeholder={"Title"}
                        value={data.title}
                        onChange={e => {
                          setData("title", e);
                        }}
                      />
                      <Input
                        required
                        type="text"
                        className="w-full"
                        name="title_bm"
                        label="Title BM"
                        placeholder={"Title BM"}
                        value={data.title_bm}
                        onChange={e => {
                          setData("title_bm", e);
                        }}
                      />
                    </div>
                    <div className="flex flex-col gap-2 lg:flex-row">
                      <Input
                        required
                        type="text"
                        className="w-full"
                        name="publication_type_title"
                        label="Publication Type Title"
                        placeholder={"Publication Type Title"}
                        value={data.publication_type_title}
                        onChange={e => {
                          setData("publication_type_title", e);
                        }}
                      />
                      <Input
                        required
                        type="text"
                        className="w-full"
                        name="publication_type_title_bm"
                        label="Publication Type Title BM"
                        placeholder={"Publication Type Title BM"}
                        value={data.publication_type_title_bm}
                        onChange={e => {
                          setData("publication_type_title_bm", e);
                        }}
                      />
                    </div>
                    <div className="flex flex-col gap-2 lg:flex-row">
                      <div className="flex w-full flex-col gap-2">
                        <Label name="description" label="Description" />
                        <Textarea
                          placeholder="Add description here"
                          rows={2}
                          value={data.description}
                          onChange={e => {
                            setData("description", e.target.value);
                          }}
                        />
                      </div>
                      <div className="flex w-full flex-col gap-2">
                        <Label name="description_bm" label="Description BM" />
                        <Textarea
                          placeholder="Add description BM here"
                          rows={2}
                          value={data.description_bm}
                          onChange={e => {
                            setData("description_bm", e.target.value);
                          }}
                        />
                      </div>
                    </div>
                  </div>

                  <Section
                    title="Resources"
                    description="Add or remove resources for this publication"
                  >
                    {data.resources?.length === 0 ? (
                      <div className="flex h-[300px] w-full flex-col items-center justify-center gap-2">
                        <p className="text-dim ">No resources added.</p>
                        <Button onClick={handleAddNewResource} variant="primary">
                          Add one
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
                                  Resource {index + 1}
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
                                  label="Resource Link"
                                  placeholder={"Insert resource url"}
                                  value={data.resources[index].resource_link}
                                  onChange={e => updateSingleResource(index, "resource_link", e)}
                                />
                              </div>
                              <div className="flex gap-2">
                                <Input
                                  required
                                  type="text"
                                  className="w-full"
                                  name="resource_id"
                                  label="Resource ID"
                                  placeholder={"Resource ID"}
                                  value={data.resources[index].resource_id}
                                  onChange={e => updateSingleResource(index, "resource_id", e)}
                                />
                                <div className="flex w-full flex-col gap-2">
                                  <Label label="Resource Type" />
                                  <Dropdown
                                    anchor="left"
                                    width="w-full"
                                    options={resourceType}
                                    placeholder="Resource Type"
                                    selected={
                                      resourceType.find(
                                        e => e.value === data.resources[index].resource_type
                                      ) ?? undefined
                                    }
                                    onChange={e =>
                                      updateSingleResource(index, "resource_type", e.value)
                                    }
                                  />
                                </div>
                              </div>
                              <div className="flex gap-2">
                                <Input
                                  required
                                  type="text"
                                  className="w-full"
                                  name="resource_name"
                                  label="Resource Name"
                                  placeholder={"Resource Name"}
                                  value={data.resources[index].resource_name}
                                  onChange={e => updateSingleResource(index, "resource_name", e)}
                                />
                                <Input
                                  required
                                  type="text"
                                  className="w-full"
                                  name="resource_name_bm"
                                  label="Resource Name BM"
                                  placeholder={"Resource Name BM"}
                                  value={data.resources[index].resource_name_bm}
                                  onChange={e => updateSingleResource(index, "resource_name_bm", e)}
                                />
                              </div>
                            </div>
                          </Accordion>
                        ))}
                        <Button onClick={handleAddNewResource} variant="primary">
                          Add more
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
                      title: data.title ? data.title : "[SERIES] [PUBLICATION TITLE]",
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
                      title: data.title_bm ? data.title_bm : "[SIRI] [TAJUK PENERBITAN]",
                      total_downloads: 0,
                    }}
                  />
                </div>
              </div>
              <div className="mx-auto w-full max-w-screen-xl">
                <div className="flex w-full flex-col items-center space-y-6 lg:flex-row lg:space-x-6 lg:space-y-0">
                  <ModalAsCard
                    publication={{
                      title: data.title ? data.title : "[SERIES] [PUBLICATION TITLE]",
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
                            : "[INSERT RESOURCE NAME]: [SERIES]",
                          resource_link: item.resource_link,
                          downloads: 0,
                        })
                      ),
                    }}
                  />
                  <ModalAsCard
                    publication={{
                      title: data.title ? data.title : "[SIRI] [TAJUK PENERBITAN]",
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
                          resource_name: item.resource_name_bm
                            ? item.resource_name_bm
                            : "[NAMA SUMBER]: [SIRI]",
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
                  onClick={() =>
                    downloadJSON(
                      generateOutputJSON(),
                      `${data.publication}.json`,
                      "application/json"
                    )
                  }
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
  ["gui", "catalogue", "publications"],
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
