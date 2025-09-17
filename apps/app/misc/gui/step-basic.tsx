import { Banner, Button, Dropdown, Input, Label, Spinner, Textarea } from "datagovmy-ui/components";
import { Dispatch, FunctionComponent, SetStateAction, useEffect, useRef, useState } from "react";
import { useTranslation } from "datagovmy-ui/hooks";
import { demographies, frequencies, geographies } from "datagovmy-ui/options";
import {
  ArrowRightIcon,
  BuildingLibraryIcon,
  CheckCircleIcon,
  XMarkIcon,
} from "@heroicons/react/20/solid";
import { clx } from "datagovmy-ui/helpers";
import { ExclamationCircleIcon } from "@heroicons/react/24/outline";

interface StepBasicProps {
  setIndex: Dispatch<SetStateAction<number>>;
  sources: string[];
  data: Record<string, any>;
  setData: (key: string, value: any) => void;
  validation: Record<string, any>;
  setValidation: (key: string, value: any) => void;
}

const StepBasic: FunctionComponent<StepBasicProps> = ({
  setIndex,
  sources,
  data,
  setData,
  validation,
  setValidation,
}) => {
  const { t } = useTranslation(["gui-data-catalogue", "catalogue", "common"]);
  const [validatedBanner, setValidatedBanner] = useState(false);

  const bannerRef = useRef<HTMLDivElement>(null);

  const frequencyOptions = frequencies(t);
  const geographiesOptions = geographies(t);
  const demographiesOptions = demographies(t);

  const sourceOptions = sources.map(source => ({
    label: t(`agencies:${source.toLowerCase()}.full`),
    value: source,
  }));

  const getValidationMessage = (status?: number, errorMsg?: string) => {
    switch (status) {
      case 404:
        return `${t(`validations.${status}`)} - ${t(`validations.ensure_upload`)}`;
      case 400:
        return `${t(`validations.${status}`)} - ${t(`validations.${errorMsg}`)}`;

      case undefined:
        return `${errorMsg}`;
      default:
        return `${t(`validations.${status}`)} - ${t(`validations.${errorMsg}`)}`;
    }
  };

  const testLink = async (url: string, field: string) => {
    if (field === "link_preview" && (!url || !url.trim())) {
      return true;
    }
    if (!url || !url.trim()) {
      setValidation(field, t("validations.link_required"));
      return false;
    }

    // Set loading state
    setValidation(field, "loading");

    try {
      const response = await fetch("/api/validate-link", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url, field }),
      });

      const result = await response.json();

      if (response.ok) {
        if (result.isValid) {
          // Store preview data if available
          if (result.preview) {
            setData(`${field}_preview`, result.preview);
          }
          setValidation(field, "success");
          return true;
        }
      } else {
        setValidation(
          field,
          result.status || result.error
            ? getValidationMessage(result.status, result.error)
            : t("validations.failed_to_retrieve")
        );
        return false;
      }
    } catch (error) {
      setValidation(field, t("validations.network_error"));
      return false;
    }
  };

  const validateInput = async () => {
    const validationPromises = Object.entries(data).map(async ([key, value]) => {
      if (key === "link_csv" || key === "link_parquet" || key === "link_preview") {
        const validated = await testLink(data[key], key);
        return [key, validated];
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

      if (
        Array.isArray(value) &&
        (key === "demography" || key === "geography" || key === "data_source")
      ) {
        if (value.length > 0) {
          setValidation(key, false);
        } else {
          setValidation(key, t("validations.required"));
        }
        return [key, value.length > 0];
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
      // throw new Error("Some fields need to be validated");
      setValidatedBanner(true);
      return {
        ok: false,
        message: "Some fields need to be validated",
      };
    }
  };

  useEffect(() => {
    if (bannerRef.current && validatedBanner) {
      bannerRef.current.scrollIntoView({ behavior: "smooth", block: "end" });
    }
  }, [validatedBanner]);

  return (
    <form className="md:px-4.5 flex h-full w-full flex-col px-3 lg:min-h-0 lg:gap-8 lg:py-12 lg:pl-6 lg:pr-0">
      <div className="flex w-full flex-1 flex-col gap-4">
        {validatedBanner && (
          <div ref={bannerRef} className="relative">
            <Banner
              className="mt-0 bg-[#FEFCE8] font-semibold text-[#A16207]"
              text={t("step_basic.fill_all")}
              icon={<ExclamationCircleIcon className="size-5 shrink-0" />}
            />
            <Button
              onClick={() => setValidatedBanner(false)}
              className="absolute right-4 top-1/2 h-fit -translate-y-1/2"
              icon={<XMarkIcon className="size-5" />}
            ></Button>
          </div>
        )}
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
              value={data.link_csv}
              onChange={e => {
                setData("link_csv", e);
                setValidation("link_csv", false);
              }}
              validation={
                validation.link_csv === "loading" || validation.link_csv === "success"
                  ? false
                  : validation.link_csv
              }
            />
            <Button
              variant="default"
              icon={
                validation.link_csv === "success" ? (
                  <CheckCircleIcon className="size-4" />
                ) : validation.link_csv === "loading" ? (
                  <Spinner loading={true} />
                ) : null
              }
              className={clx(
                "h-full w-fit self-end text-nowrap rounded-lg rounded-l-none",
                validation.link_csv && validation.link_csv === "success" && "text-[#15803D]",
                validation.link_csv &&
                  validation.link_csv !== "success" &&
                  validation.link_csv !== "loading" &&
                  "border-danger mt-1 self-center border-2 border-l-0"
              )}
              onClick={() => {
                if (validation.link_csv === "success") {
                  return;
                }
                testLink(data.link_csv, "link_csv");
              }}
              disabled={validation.link_csv === "loading"}
            >
              {validation.link_csv === "loading"
                ? t("forms.fetching")
                : validation.link_csv === "success"
                  ? t("forms.success")
                  : t("forms.test_link")}
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
              value={data.link_parquet}
              onChange={e => {
                setData("link_parquet", e);
                setValidation("link_parquet", false);
              }}
              validation={
                validation.link_parquet === "loading" || validation.link_parquet === "success"
                  ? false
                  : validation.link_parquet
              }
            />
            <Button
              variant="default"
              icon={
                validation.link_parquet === "success" ? (
                  <CheckCircleIcon className="size-4" />
                ) : validation.link_parquet === "loading" ? (
                  <Spinner loading={true} />
                ) : null
              }
              className={clx(
                "h-full w-fit self-end text-nowrap rounded-lg rounded-l-none",
                validation.link_parquet &&
                  validation.link_parquet === "success" &&
                  "text-[#15803D]",
                validation.link_parquet &&
                  validation.link_parquet !== "success" &&
                  validation.link_parquet !== "loading" &&
                  "border-danger mt-1 self-center border-2 border-l-0"
              )}
              onClick={() => {
                if (validation.link_parquet === "success") {
                  return;
                }
                testLink(data.link_parquet, "link_parquet");
              }}
              disabled={validation.link_parquet === "loading"}
            >
              {validation.link_parquet === "loading"
                ? t("forms.fetching")
                : validation.link_parquet === "success"
                  ? t("forms.success")
                  : t("forms.test_link")}
            </Button>
          </div>
          <div className="flex">
            <Input
              type="text"
              className="w-full rounded-lg rounded-r-none py-1.5"
              name="link_preview"
              label={t("forms.link_preview")}
              placeholder={t("forms.link_placeholder")}
              value={data.link_preview}
              onChange={e => {
                setData("link_preview", e);
                setValidation("link_preview", false);
              }}
              validation={
                validation.link_preview === "loading" || validation.link_preview === "success"
                  ? false
                  : validation.link_preview
              }
            />
            <Button
              variant="default"
              icon={
                validation.link_preview === "success" ? (
                  <CheckCircleIcon className="size-4" />
                ) : validation.link_preview === "loading" ? (
                  <Spinner loading={true} />
                ) : null
              }
              className={clx(
                "h-full w-fit self-end text-nowrap rounded-lg rounded-l-none",
                validation.link_preview &&
                  validation.link_preview === "success" &&
                  "text-[#15803D]",
                validation.link_preview &&
                  validation.link_preview !== "success" &&
                  validation.link_preview !== "loading" &&
                  "border-danger mt-1 self-center border-2 border-l-0"
              )}
              onClick={() => {
                if (validation.link_preview === "success") {
                  return;
                }
                testLink(data.link_preview, "link_preview");
              }}
              disabled={validation.link_preview === "loading"}
            >
              {validation.link_preview === "loading"
                ? t("forms.fetching")
                : validation.link_preview === "success"
                  ? t("forms.success")
                  : t("forms.test_link")}
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
              value={data.title_en}
              onChange={e => {
                setData("title_en", e);
                setValidation("title_en", false);
              }}
              validation={validation.title_en}
            />
            <Input
              required
              type="text"
              className="w-full rounded-lg py-1.5"
              name="title_ms"
              label={t("forms.title_ms")}
              placeholder={t("forms.title_ms_placeholder")}
              value={data.title_ms}
              onChange={e => {
                setData("title_ms", e);
                setValidation("title_ms", false);
              }}
              validation={validation.title_ms}
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
                className={clx(
                  "w-full rounded-lg py-1.5",
                  validation.description_en && "border-danger border-2"
                )}
                name="description_en"
                placeholder={t("forms.description_en_placeholder")}
                rows={4}
                value={data.description_en}
                onChange={e => {
                  setData("description_en", e.target.value);
                  setValidation("description_en", false);
                }}
              />
              <p className="text-danger text-xs">{validation.description_en}</p>
            </div>
            <div className="w-full space-y-2">
              <Label
                label={t("forms.description_ms")}
                name={t("forms.description_ms")}
                required={true}
              />
              <Textarea
                required
                className={clx(
                  "w-full rounded-lg py-1.5",
                  validation.description_ms && "border-danger border-2"
                )}
                name="description_ms"
                placeholder={t("forms.description_ms_placeholder")}
                rows={4}
                value={data.description_ms}
                onChange={e => {
                  setData("description_ms", e.target.value);
                  setValidation("description_ms", false);
                }}
              />
              <p className="text-danger text-xs">{validation.description_ms}</p>
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
            value={data.file_name}
            onChange={e => {
              setData("file_name", e);
              setValidation("file_name", false);
            }}
            validation={validation.file_name}
          />

          <div className="flex flex-col gap-2">
            <Label label={t("forms.choose_attributes")} />
            <div className="flex flex-col gap-3 lg:flex-row lg:gap-2">
              <Dropdown
                anchor="left"
                width="w-full"
                className={validation.frequency ? "border-danger dark:border-danger border-2" : ""}
                options={frequencyOptions}
                placeholder={t("catalogue:frequency")}
                selected={frequencyOptions.find(e => e.value === data.frequency) ?? undefined}
                onChange={e => {
                  setData("frequency", e.value);
                  setValidation("frequency", false);
                }}
              />
              <Dropdown
                anchor="left"
                width="w-full"
                className={validation.geography ? "border-danger dark:border-danger border-2" : ""}
                multiple
                enableClear
                title={t("catalogue:geography")}
                options={geographiesOptions}
                selected={data.geography}
                onChange={e => {
                  setData("geography", e);
                  setValidation("geography", false);
                }}
              />
              <Dropdown
                anchor="left"
                width="w-full"
                className={validation.demography ? "border-danger dark:border-danger border-2" : ""}
                multiple
                enableClear
                title={t("catalogue:demography")}
                description={t("catalogue:placeholder.demography") + ":"}
                options={demographiesOptions}
                selected={data.demography}
                onChange={e => {
                  setData("demography", e);
                  setValidation("demography", false);
                }}
              />
            </div>
            <p className="text-danger text-xs">
              {validation.frequency || validation.geography || validation.demography}
            </p>
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
                value={data.dataset_start}
                onChange={e => {
                  setData("dataset_start", e);
                  setValidation("dataset_start", false);
                }}
                validation={validation.dataset_start}
              />
              <Input
                required
                type="number"
                className="w-full rounded-lg py-1.5"
                name="dataset_end"
                placeholder={t("forms.dataset_end")}
                value={data.dataset_end}
                onChange={e => {
                  setData("dataset_end", e);
                  setValidation("dataset_end", false);
                }}
                validation={validation.dataset_end}
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
              className={validation.data_source ? "border-danger dark:border-danger border-2" : ""}
              options={sourceOptions}
              title={t("catalogue:placeholder.source")}
              description={t("catalogue:placeholder.source")}
              selected={data.data_source}
              onChange={e => {
                setData("data_source", e);
                setValidation("data_source", false);
              }}
            />
            <p className="text-danger text-xs">{validation.data_source}</p>
          </div>
        </div>
      </div>

      <Button
        variant="primary"
        className="w-fit"
        onClick={async () => {
          try {
            const isValid = (await validateInput()) as { ok: boolean; message: string };
            if (isValid.ok) {
              setIndex(2);
            }
          } catch (error) {
            console.error("Validation failed:", error);
          }
        }}
      >
        {t("step_basic.continue")}
        <ArrowRightIcon className="size-4 text-white" />
      </Button>
    </form>
  );
};

export default StepBasic;
