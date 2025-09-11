import { Button, Container, Dropdown, Input, Label, Section } from "datagovmy-ui/components";
import { Dispatch, FunctionComponent, SetStateAction } from "react";
import { useTranslation } from "datagovmy-ui/hooks";
import { demographies, frequencies, geographies } from "datagovmy-ui/options";
import { BuildingLibraryIcon, ChevronDownIcon, XMarkIcon } from "@heroicons/react/20/solid";

interface StepBasicProps {
  setIndex: Dispatch<SetStateAction<number>>;
  sources: string[];
}

const StepBasic: FunctionComponent<StepBasicProps> = ({ setIndex, sources }) => {
  const { t } = useTranslation(["gui-opendosm-pub", "catalogue", "common"]);

  const frequencyOptions = frequencies(t);
  const geographiesOptions = geographies(t);
  const demographiesOptions = demographies(t);

  const sourceOptions = sources.map(source => ({
    label: t(`agencies:${source.toLowerCase()}.full`),
    value: source,
  }));

  return (
    <form className="flex w-full flex-col gap-6 lg:min-h-0 lg:gap-8 lg:py-12">
      <Container>
        <Section className="p-0" title={t("get_started")} description={t("get_started_desc")}>
          <div className="flex w-full flex-col gap-6">
            <div className="mx-auto w-full max-w-screen-md space-y-6">
              <div className="space-y-1">
                <h5>{t("links")}</h5>
                <p className="text-dim">{t("links_desc")}</p>
              </div>
              <div className="space-y-3">
                <Input
                  required
                  type="text"
                  className="w-full"
                  name="link_csv"
                  label={t("forms.link_csv")}
                  placeholder={t("forms.link_csv")}
                  // value={data.link_csv}
                  // onChange={e => {
                  //   setData("link_csv", e);
                  //   setValidation("link_csv", false);
                  // }}
                  // validation={validation.link_csv}
                />
                <Input
                  required
                  type="text"
                  className="w-full"
                  name="link_parquet"
                  label={t("forms.link_parquet")}
                  placeholder={t("forms.link_parquet")}
                  // value={data.link_parquet}
                  // onChange={e => {
                  //   setData("link_parquet", e);
                  //   setValidation("link_parquet", false);
                  // }}
                  // validation={validation.link_parquet}
                />
                <Input
                  type="text"
                  className="w-full"
                  name="link_preview"
                  label={t("forms.link_preview")}
                  placeholder={t("forms.link_preview")}
                  // value={data.link_preview}
                  // onChange={e => {
                  //   setData("link_preview", e);
                  //   setValidation("link_preview", false);
                  // }}
                  // validation={validation.link_preview}
                />
              </div>

              <div className="space-y-1">
                <h5>{t("non_gui_items")}</h5>
                <p className="text-dim">{t("non_gui_items_desc")}</p>
              </div>
              <div className="space-y-3">
                <Input
                  required
                  type="text"
                  className="w-full"
                  name="file_name"
                  label={t("forms.file_name")}
                  placeholder={t("forms.file_name")}
                  // value={data.file_name}
                  // onChange={e => {
                  //   setData("file_name", e);
                  //   setValidation("file_name", false);
                  // }}
                  // validation={validation.file_name}
                />

                <div className="flex flex-col gap-2">
                  <Label label={t("choose_items")} />
                  <div className="flex flex-col gap-3 lg:flex-row lg:gap-2">
                    <Dropdown
                      anchor="left"
                      width="w-full"
                      // className={validation.frequency ? "border-2 border-danger dark:border-danger" : ""}
                      options={frequencyOptions}
                      placeholder={t("catalogue:frequency")}
                      // selected={frequencyOptions.find(e => e.value === data.frequency) ?? undefined}
                      onChange={e => {}}
                      // onChange={e => {
                      //   setData("frequency", e.value);
                      //   setValidation("frequency", false);
                      // }}
                    />
                    <Dropdown
                      anchor="left"
                      width="w-full"
                      multiple
                      enableClear
                      title={t("catalogue:geography")}
                      options={geographiesOptions}
                      // selected={data.geography}
                      onChange={e => {}}
                      // onChange={e => {
                      //   setData("geography", e);
                      // }}
                    />
                    <Dropdown
                      anchor="left"
                      width="w-full"
                      multiple
                      enableClear
                      title={t("catalogue:demography")}
                      description={t("catalogue:placeholder.demography") + ":"}
                      options={demographiesOptions}
                      // selected={data.demography}
                      onChange={e => {}}
                      // onChange={e => {
                      //   setData("demography", e);
                      // }}
                    />
                  </div>
                  {/* <p className="text-xs text-danger">{validation.frequency}</p> */}
                </div>

                <div className="flex flex-col gap-3 lg:flex-row lg:gap-2">
                  <Input
                    required
                    type="number"
                    className="w-full"
                    name="dataset_begin"
                    label={t("forms.dataset_begin")}
                    placeholder={t("forms.dataset_begin")}
                    // value={data.dataset_begin}
                    // onChange={e => {
                    //   setData("dataset_begin", e);
                    //   setValidation("dataset_begin", false);
                    // }}
                    // validation={validation.dataset_begin}
                  />
                  <Input
                    required
                    type="number"
                    className="w-full"
                    name="dataset_end"
                    label={t("forms.dataset_end")}
                    placeholder={t("forms.dataset_end")}
                    // value={data.dataset_end}
                    // onChange={e => {
                    //   setData("dataset_end", e);
                    //   setValidation("dataset_end", false);
                    // }}
                    // validation={validation.dataset_end}
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <Label label={t("select_data_sources")} />
                  <Dropdown
                    icon={<BuildingLibraryIcon className="text-dim h-4 w-4" />}
                    anchor="left"
                    width="w-full"
                    multiple
                    enableClear
                    // className={validation.frequency ? "border-2 border-danger dark:border-danger" : ""}
                    options={sourceOptions}
                    title={t("catalogue:placeholder.source")}
                    description={t("catalogue:placeholder.source")}
                    // selected={frequencyOptions.find(e => e.value === data.frequency) ?? undefined}
                    onChange={e => {}}
                    // onChange={e => {
                    //   setData("frequency", e.value);
                    //   setValidation("frequency", false);
                    // }}
                  />
                </div>
              </div>

              <div className="flex w-full items-center justify-center gap-4">
                <Button
                  variant="primary"
                  className=""
                  // onClick={async () => {
                  //   try {
                  //     const isValid = (await validateInput()) as { ok: boolean; message: string };
                  //     if (isValid.ok) {
                  //       downloadJSON(
                  //         generateOutputJSON(),
                  //         `${data.publication}.json`,
                  //         "application/json"
                  //       );
                  //     }
                  //   } catch (error) {}
                  // }}
                >
                  {t("validate_and_next")}
                </Button>
              </div>
            </div>
          </div>
        </Section>
      </Container>
    </form>
  );
};

export default StepBasic;
