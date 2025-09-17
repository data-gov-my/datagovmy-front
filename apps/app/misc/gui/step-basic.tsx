import { Button, Dropdown, Input, Label, Textarea } from "datagovmy-ui/components";
import { Dispatch, FunctionComponent, SetStateAction } from "react";
import { useTranslation } from "datagovmy-ui/hooks";
import { demographies, frequencies, geographies } from "datagovmy-ui/options";
import { ArrowRightIcon, BuildingLibraryIcon } from "@heroicons/react/20/solid";

interface StepBasicProps {
  setIndex: Dispatch<SetStateAction<number>>;
  sources: string[];
}

const StepBasic: FunctionComponent<StepBasicProps> = ({ setIndex, sources }) => {
  const { t } = useTranslation(["gui-data-catalogue", "catalogue", "common"]);

  const frequencyOptions = frequencies(t);
  const geographiesOptions = geographies(t);
  const demographiesOptions = demographies(t);

  const sourceOptions = sources.map(source => ({
    label: t(`agencies:${source.toLowerCase()}.full`),
    value: source,
  }));

  return (
    <form className="md:px-4.5 flex h-full w-full flex-col px-3 lg:min-h-0 lg:gap-8 lg:py-12 lg:pl-6 lg:pr-0">
      <div className="flex w-full flex-1 flex-col gap-4">
        <div className="">
          <h5 className="text-base">{t("step_basic.links")}</h5>
          <p className="text-dim text-sm">{t("step_basic.links_desc")}</p>
        </div>
        <div className="space-y-4.5 lg:w-1/2 lg:pr-3">
          <div className="flex">
            <Input
              required
              type="text"
              className="w-full rounded-lg rounded-r-none py-1.5"
              name="link_csv"
              label={t("forms.link_csv")}
              placeholder={t("forms.link_placeholder")}
              // value={data.link_csv}
              // onChange={e => {
              //   setData("link_csv", e);
              //   setValidation("link_csv", false);
              // }}
              // validation={validation.link_csv}
            />
            <Button
              variant="default"
              className="h-full w-fit self-end text-nowrap rounded-lg rounded-l-none"
            >
              {t("forms.test_link")}
            </Button>
          </div>
          <div className="flex">
            <Input
              required
              type="text"
              className="w-full rounded-lg rounded-r-none py-1.5"
              name="link_parquet"
              label={t("forms.link_parquet")}
              placeholder={t("forms.link_placeholder")}
              // value={data.link_parquet}
              // onChange={e => {
              //   setData("link_parquet", e);
              //   setValidation("link_parquet", false);
              // }}
              // validation={validation.link_parquet}
            />
            <Button
              variant="default"
              className="h-full w-fit self-end text-nowrap rounded-lg rounded-l-none"
            >
              {t("forms.test_link")}
            </Button>
          </div>
          <div className="flex">
            <Input
              type="text"
              className="w-full rounded-lg rounded-r-none py-1.5"
              name="link_preview"
              label={t("forms.link_preview")}
              placeholder={t("forms.link_placeholder")}
              // value={data.link_preview}
              // onChange={e => {
              //   setData("link_preview", e);
              //   setValidation("link_preview", false);
              // }}
              // validation={validation.link_preview}
            />
            <Button
              variant="default"
              className="h-full w-fit self-end text-nowrap rounded-lg rounded-l-none"
            >
              {t("forms.test_link")}
            </Button>
          </div>
        </div>

        <div className="pt-6">
          <h5 className="text-base">{t("step_basic.baseline_info")}</h5>
          <p className="text-dim text-sm">{t("step_basic.baseline_info_desc")}</p>
        </div>
        <div className="space-y-4.5">
          <div className="flex gap-6">
            <Input
              required
              type="text"
              className="w-full rounded-lg py-1.5"
              name="title_en"
              label={t("forms.title_en")}
              placeholder={t("forms.title_en_placeholder")}
              // value={data.title_en}
              // onChange={e => {
              //   setData("title_en", e);
              //   setValidation("title_en", false);
              // }}
              // validation={validation.title_en}
            />
            <Input
              required
              type="text"
              className="w-full rounded-lg py-1.5"
              name="title_ms"
              label={t("forms.title_ms")}
              placeholder={t("forms.title_ms_placeholder")}
              // value={data.title_ms}
              // onChange={e => {
              //   setData("title_ms", e);
              //   setValidation("title_ms", false);
              // }}
              // validation={validation.title_ms}
            />
          </div>
          <div className="flex gap-6">
            <div className="w-full space-y-2">
              <Label
                label={t("forms.description_en")}
                name={t("forms.description_en")}
                required={true}
              />
              <Textarea
                required
                className="w-full rounded-lg py-1.5"
                name="description_en"
                placeholder={t("forms.description_en_placeholder")}
                rows={4}
                // value={data.description_en}
                // onChange={e => {
                //   setData("description_en", e);
                //   setValidation("description_en", false);
                // }}
                // validation={validation.description_en}
              />
            </div>
            <div className="w-full space-y-2">
              <Label
                label={t("forms.description_ms")}
                name={t("forms.description_ms")}
                required={true}
              />
              <Textarea
                required
                className="w-full rounded-lg py-1.5"
                name="description_ms"
                placeholder={t("forms.description_ms_placeholder")}
                rows={4}
                // value={data.description_ms}
                // onChange={e => {
                //   setData("description_ms", e);
                //   setValidation("description_ms", false);
                // }}
                // validation={validation.description_ms}
              />
            </div>
          </div>
        </div>
        <div className="space-y-4.5 lg:w-1/2 lg:pr-3">
          <Input
            required
            type="text"
            className="w-full rounded-lg py-1.5"
            name="file_name"
            label={t("forms.file_name")}
            placeholder={t("forms.file_name_placeholder")}
            // value={data.file_name}
            // onChange={e => {
            //   setData("file_name", e);
            //   setValidation("file_name", false);
            // }}
            // validation={validation.file_name}
          />

          <div className="flex flex-col gap-2">
            <Label label={t("forms.choose_attributes")} />
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
          </div>

          <div className="space-y-2">
            <Label label={t("forms.dataset_date")} name={t("forms.dataset_date")} required={true} />
            <div className="flex flex-col gap-3 lg:flex-row lg:gap-2">
              <Input
                required
                type="number"
                className="w-full rounded-lg py-1.5"
                name="dataset_start"
                placeholder={t("forms.dataset_start")}
                // value={data.dataset_start}
                // onChange={e => {
                //   setData("dataset_start", e);
                //   setValidation("dataset_start", false);
                // }}
                // validation={validation.dataset_start}
              />
              <Input
                required
                type="number"
                className="w-full rounded-lg py-1.5"
                name="dataset_end"
                placeholder={t("forms.dataset_end")}
                // value={data.dataset_end}
                // onChange={e => {
                //   setData("dataset_end", e);
                //   setValidation("dataset_end", false);
                // }}
                // validation={validation.dataset_end}
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <Label label={t("forms.select_data_sources")} />
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
      </div>

      <Button
        variant="primary"
        className="w-fit"
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
        {t("step_basic.continue")}
        <ArrowRightIcon className="size-4 text-white" />
      </Button>
    </form>
  );
};

export default StepBasic;
