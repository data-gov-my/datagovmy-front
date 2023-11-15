import { TrashIcon } from "@heroicons/react/20/solid";
import {
  Accordion,
  Button,
  Dropdown,
  Input,
  Label,
  Resource,
  Section,
  Textarea,
} from "datagovmy-ui/components";
import { useTranslation } from "datagovmy-ui/hooks";
import { OptionType } from "datagovmy-ui/types";
import { FunctionComponent } from "react";

type FormsProps = {
  data: any;
  setData: (key: string, value: any) => void;
  validation: any;
  setValidation: (key: string, value: any) => void;
};

const GUIOpenDOSMPubForms: FunctionComponent<FormsProps> = ({
  data,
  setData,
  validation,
  setValidation,
}) => {
  const { t } = useTranslation(["gui-opendosm-pub", "catalogue", "publications"]);

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
        resource_id: data.resources.length + 1,
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

  return (
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
                      readOnly={true}
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
                          validation.resources[index].resource_type ? "border-danger border-2" : ""
                        }
                        options={resourceType}
                        placeholder={t("forms.resource_type")}
                        selected={
                          resourceType.find(e => e.value === data.resources[index].resource_type) ??
                          undefined
                        }
                        onChange={e => updateSingleResource(index, "resource_type", e.value)}
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
  );
};

export default GUIOpenDOSMPubForms;
