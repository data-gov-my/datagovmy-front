import { GetStaticProps, InferGetStaticPropsType } from "next";
import { OptionType, Page } from "datagovmy-ui/types";
import { MinusCircleIcon } from "@heroicons/react/20/solid";
import {
  Button,
  Container,
  Dropdown,
  Input,
  Label,
  Metadata,
  PublicationCard,
  Section,
  Textarea,
} from "datagovmy-ui/components";
import { useData, useTranslation } from "datagovmy-ui/hooks";
import { withi18n } from "datagovmy-ui/decorators";
import GUILayout from "@misc/gui/layout";

type PublicationResource = {
  resource_id: string;
  resource_type: string;
  resource_name: string;
  resource_name_bm: string;
  resource_link: string;
};

const GUIOpendosmPub: Page = ({ meta }: InferGetStaticPropsType<typeof getStaticProps>) => {
  const { t } = useTranslation(["gui", "catalogue"]);
  const { data, setData } = useData({
    title: "",
    title_bm: "",
    frequency: "",
    demography: [],
    geography: [],
    resources: [],
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

  const handleAddNewResource = () => {
    setData("resources", [
      ...data.resources,
      {
        resource_id: "",
        resource_type: "",
        resource_name: "",
        resource_name_bm: "",
        resource_link: "",
      },
    ]);
  };

  const handleDeleteOneResource = (index: number) => {
    setData(
      "resources",
      data.resources.filter((item: PublicationResource, idx: number) => idx !== index)
    );
  };

  return (
    <>
      <Metadata title={t("header")} description={t("description")} keywords={""} />
      <GUILayout>
        <Container>
          <Section
            title={"Get Started"}
            description="Fill in the forms and show preview of the metadata of the publication"
          >
            <div className="flex w-full">
              <div className="w-1/2">
                <form className="p-6 lg:p-8" method="post">
                  <div className="space-y-3">
                    <div className="flex gap-2">
                      <Input
                        required
                        type="date"
                        className="w-full"
                        name="release_date"
                        label="Release Date"
                        placeholder={"Release Date"}
                        value={data.title}
                        onChange={e => {
                          setData("title", e);
                        }}
                      />
                    </div>
                    <div className="flex gap-2">
                      <Input
                        required
                        type="text"
                        className="w-full"
                        name="publication"
                        label="Publication ID"
                        placeholder={"Publication ID"}
                        value={data.title}
                        onChange={e => {
                          setData("title", e);
                        }}
                      />
                      <Input
                        required
                        type="text"
                        className="w-full"
                        name="publication_type"
                        label="Publication Type"
                        placeholder={"Publication Type"}
                        value={data.title}
                        onChange={e => {
                          setData("title", e);
                        }}
                      />
                    </div>

                    <div className="flex flex-col gap-2">
                      <Label label="Choose items" />
                      <div className="flex gap-2">
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
                    <div className="flex gap-2">
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
                        value={data.title}
                        onChange={e => {
                          setData("title", e);
                        }}
                      />
                    </div>
                    <div className="flex gap-2">
                      <Input
                        required
                        type="text"
                        className="w-full"
                        name="publication_type_title"
                        label="Publication Type Title"
                        placeholder={"Publication Type Title"}
                        value={data.title}
                        onChange={e => {
                          setData("title", e);
                        }}
                      />
                      <Input
                        required
                        type="text"
                        className="w-full"
                        name="publication_type_title_bm"
                        label="Publication Type Title BM"
                        placeholder={"Publication Type Title BM"}
                        value={data.title}
                        onChange={e => {
                          setData("title", e);
                        }}
                      />
                    </div>
                    <div className="flex gap-2">
                      <div className="flex w-full flex-col gap-2">
                        <Label name="description" label="Description" />
                        <Textarea placeholder="Add description here" rows={2} />
                      </div>
                      <div className="flex w-full flex-col gap-2">
                        <Label name="description_bm" label="Description BM" />
                        <Textarea placeholder="Add description BM here" rows={2} />
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
                        {data.resources.map((item: PublicationResource, index: number) => (
                          <div key={index} className="flex flex-col space-y-3">
                            <div className="group flex w-fit items-center gap-2">
                              <p className="text-md font-medium text-black">Resource {index + 1}</p>
                              <MinusCircleIcon
                                className="text-danger h-4 w-4 opacity-0 transition-opacity hover:cursor-pointer group-hover:block group-hover:opacity-100"
                                onClick={() => handleDeleteOneResource(index)}
                              />
                            </div>
                            <div className="space-y-3">
                              <div className="flex gap-2">
                                <Input
                                  required
                                  type="text"
                                  className="w-full"
                                  name="resource_link"
                                  label="Resource Link"
                                  placeholder={"Insert resource url"}
                                  value={data.title}
                                  onChange={e => {
                                    setData("title", e);
                                  }}
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
                                  value={data.title}
                                  onChange={e => {
                                    setData("title", e);
                                  }}
                                />
                                <Input
                                  required
                                  type="text"
                                  className="w-full"
                                  name="resource_type"
                                  label="Resource Type"
                                  placeholder={"Resource Type"}
                                  value={data.title}
                                  onChange={e => {
                                    setData("title", e);
                                  }}
                                />
                              </div>
                              <div className="flex gap-2">
                                <Input
                                  required
                                  type="text"
                                  className="w-full"
                                  name="resource_name"
                                  label="Resource Name"
                                  placeholder={"Resource Name"}
                                  value={data.title}
                                  onChange={e => {
                                    setData("title", e);
                                  }}
                                />
                                <Input
                                  required
                                  type="text"
                                  className="w-full"
                                  name="resource_name_bm"
                                  label="Resource Name BM"
                                  placeholder={"Resource Name BM"}
                                  value={data.title}
                                  onChange={e => {
                                    setData("title", e);
                                  }}
                                />
                              </div>
                            </div>
                          </div>
                        ))}
                        <Button onClick={handleAddNewResource} variant="primary">
                          Add more
                        </Button>
                      </div>
                    )}
                  </Section>
                </form>
              </div>
              <div className="flex w-1/2 justify-center">
                <div className="hide-scrollbar sticky top-[15%] flex h-[70vh] max-w-md flex-col items-center space-y-3 overflow-auto py-10">
                  <PublicationCard
                    onClick={() => null}
                    publication={{
                      publication_id: "key_of_publication",
                      description:
                        "Leading, lagging, and coincident composite indices (with diffusion) showing overall economic direction.",
                      publication_type: "indicators",
                      release_date: "2023-10-01",
                      title: "[Aug 2023] HAHA huhuh hhe",
                      total_downloads: 0,
                    }}
                  />
                  <PublicationCard
                    onClick={() => null}
                    publication={{
                      publication_id: "key_of_publication",
                      description:
                        "Indeks komposit pelopor, serentak, dan susulan (termasuk difusi) menunjuk prestasi ekonomi secara am.",
                      publication_type: "indicators",
                      release_date: "2023-10-25",
                      title: "[Aug 2023] Title in Malay pulak",
                      total_downloads: 0,
                    }}
                  />
                  <PublicationCard
                    onClick={() => null}
                    publication={{
                      publication_id: "key_of_publication",
                      description:
                        "Leading, lagging, and coincident composite indices (with diffusion) showing overall economic direction.",
                      publication_type: "indicators",
                      release_date: "2023-10-25",
                      title: "[Aug 2023] HAHA huhuh hhe",
                      total_downloads: 0,
                    }}
                  />
                  <PublicationCard
                    onClick={() => null}
                    publication={{
                      publication_id: "key_of_publication",
                      description:
                        "Indeks komposit pelopor, serentak, dan susulan (termasuk difusi) menunjuk prestasi ekonomi secara am.",
                      publication_type: "indicators",
                      release_date: "2023-10-25",
                      title: "[Aug 2023] Title in Malay pulak",
                      total_downloads: 0,
                    }}
                  />
                </div>
              </div>
            </div>
            <div className="flex gap-4">
              <Button className="w-full">Generate JSON</Button>
              <Button className="w-full" disabled={true}>
                Push
              </Button>
            </div>
          </Section>
        </Container>
      </GUILayout>
    </>
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
