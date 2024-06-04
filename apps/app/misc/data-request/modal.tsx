import { Dialog, Transition } from "@headlessui/react";
import { ChevronRightIcon } from "@heroicons/react/20/solid";
import { CheckCircleIcon, XMarkIcon } from "@heroicons/react/24/solid";
import { AxiosError } from "axios";
import { post } from "datagovmy-ui/api";
import { Button, Dropdown, Input, Label, Radio, Spinner, Textarea } from "datagovmy-ui/components";
import { body, header } from "datagovmy-ui/configs/font";
import { SHORT_LANG } from "datagovmy-ui/constants";
import { Catalogue, CatalogueCard } from "datagovmy-ui/data-catalogue";
import { clx } from "datagovmy-ui/helpers";
import { useData, useTranslation } from "datagovmy-ui/hooks";
import { OptionType } from "datagovmy-ui/types";
import { Fragment, FunctionComponent, useState } from "react";

type PublishedDataModalProps = {
  items: Array<Catalogue> | string;
  show: boolean;
  hide: () => void;
};

export const PublishedDataModal: FunctionComponent<PublishedDataModalProps> = ({
  items,
  show,
  hide,
}) => {
  const { t } = useTranslation(["data-request"]);
  return (
    <>
      <Transition show={show} as={Fragment}>
        <Dialog
          as="div"
          className={clx(header.variable, body.variable, "relative z-30 font-sans")}
          onClose={() => {
            hide();
          }}
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-50" />
          </Transition.Child>

          <div className="fixed inset-0">
            <div className="flex h-screen items-center justify-center p-1 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel
                  className={
                    "border-outline shadow-floating  dark:border-outlineHover-dark flex max-h-[600px] w-full max-w-xl transform flex-col gap-3 rounded-xl border bg-white p-6 text-left font-sans transition-all dark:bg-black"
                  }
                >
                  <Dialog.Title
                    as="div"
                    className="border-outline flex items-start text-black dark:text-white"
                  >
                    <div className="flex flex-1 flex-col gap-1.5">
                      <p className="text-lg font-bold">{t("success_modal.title")}</p>
                    </div>
                    <Button
                      variant="reset"
                      className="hover:bg-washed dark:hover:bg-washed-dark h-6 w-6 rounded-full"
                      onClick={() => {
                        hide();
                      }}
                    >
                      <XMarkIcon className="text-dim mx-auto h-6 w-6 group-hover:text-black group-hover:dark:text-white" />
                    </Button>
                  </Dialog.Title>

                  <div className="flex flex-1 flex-col gap-3 overflow-hidden">
                    {Array.isArray(items) && Boolean(items.length) ? (
                      <>
                        <p className="text-base font-medium">{t("success_modal.subtitle")}</p>
                        <div className="bg-washed dark:bg-washed-dark hide-scrollbar flex flex-col gap-2 overflow-y-auto rounded-xl p-3">
                          {items.map((dataset, index) => (
                            <CatalogueCard key={index} dataset={dataset} index={index} />
                          ))}
                        </div>
                      </>
                    ) : (
                      typeof items === "string" && (
                        <div className="text-sm">
                          <p className="">Remark:</p>
                          <p className="">{items}</p>
                        </div>
                      )
                    )}
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
};

type ConditionalRequestDataModalProps =
  | {
      type: "REQUEST_DATA";
      ticket_id?: never;
      dropdown: Array<{ acronym: string; name: string }>;
    }
  | {
      type: "SUBSCRIBE_TICKET";
      ticket_id: number;
      dropdown?: never;
    };

type RequestDataModalProps = {
  show: boolean;
  hide: () => void;
} & ConditionalRequestDataModalProps;

export const RequestDataModal: FunctionComponent<RequestDataModalProps> = ({
  show,
  hide,
  type,
  ticket_id,
  dropdown,
}) => {
  const { t, i18n } = useTranslation(["data-request", "agencies", "validations"]);
  const [modalState, setModalState] = useState<"FORM" | "SUCCESS">("FORM");
  const [submissionLoading, setLoading] = useState(false);

  const { data, setData, reset } = useData({
    name: "",
    email: "",
    institution: "",
    ...(type === "REQUEST_DATA"
      ? {
          dataset_title: "",
          dataset_description: "",
          agency: "",
          purpose_of_request: "",
        }
      : {}),
  });

  const {
    data: radio,
    setData: setRadio,
    reset: resetRadio,
  } = useData({
    useInput: false,
    input_value: "",
  });

  const { data: errorData, setData: setError } = useData({
    message: "",
    code: "",
  });

  const { data: validation, setData: setValidation } = useData(
    Object.fromEntries(Object.entries(data).map(([key]) => [key, false]))
  );

  const agencies: OptionType[] = dropdown
    ? dropdown?.map(item => ({
        label: `${item.name} (${item.acronym})`,
        value: item.acronym,
      }))
    : [];

  const PURPOSES: Array<OptionType> = [
    { label: t("forms.radio.research"), value: "research" },
    { label: t("forms.radio.learning"), value: "learning" },
    { label: t("forms.radio.product_development"), value: "product_development" },
    { label: t("forms.radio.general_knowledge"), value: "general_knowledge" },
    { label: t("forms.radio.others"), value: "others" },
  ];

  const validateInput = async () =>
    new Promise((resolve, reject) => {
      setLoading(true);
      setError("code", "");
      setError("message", "");
      const updatedValidation = Object.entries(data).map(([key, value]) => {
        if (typeof value === "string") {
          if (key === "institution") {
            setValidation(key, false);
            return [key, true];
          }
          if (value) {
            setValidation(key, false);
            return [key, true];
          } else {
            setValidation(key, t("validations:required"));
            return [key, false];
          }
        }
        if (key === "purpose_of_request") {
          if (radio.useInput) {
            if (radio.input_value) {
              setValidation(key, false);
              return [key, true];
            } else {
              setValidation(key, t("validations:required"));
              return [key, false];
            }
          } else {
            const purpose = value as { value: string; label: string };
            if (purpose && purpose.label) {
              setValidation(key, false);
              return [key, true];
            } else {
              setValidation(key, t("validations:required"));
              return [key, false];
            }
          }
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

  return (
    <>
      <Transition show={show} as={Fragment}>
        <Dialog
          as="div"
          className={clx(header.variable, body.variable, "relative z-30 font-sans")}
          onClose={() => {
            hide();
          }}
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-50" />
          </Transition.Child>

          <div className="fixed inset-0">
            <div className="flex h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel
                  className={clx(
                    "border-outline shadow-floating dark:border-outlineHover-dark flex w-full max-w-xl transform flex-col gap-3 rounded-xl border bg-white p-6 text-left font-sans transition-all dark:bg-black",
                    type === "REQUEST_DATA" && modalState === "SUCCESS"
                      ? "h-60"
                      : "h-full max-h-[800px]",
                    type === "SUBSCRIBE_TICKET" && "h-fit"
                  )}
                >
                  {modalState === "FORM" && (
                    <>
                      <Dialog.Title
                        as="div"
                        className="border-outline flex items-start text-black dark:text-white"
                      >
                        <div className="flex flex-1 flex-col gap-1.5">
                          <p className="text-lg font-bold">
                            {type === "REQUEST_DATA" && t("request_modal.title")}
                            {type === "SUBSCRIBE_TICKET" &&
                              t("request_modal.title", { context: "subscribe" })}
                          </p>
                        </div>
                        <Button
                          variant="reset"
                          className="hover:bg-washed dark:hover:bg-washed-dark h-6 w-6 rounded-full"
                          onClick={() => {
                            hide();
                          }}
                        >
                          <XMarkIcon className="text-dim mx-auto h-6 w-6 group-hover:text-black group-hover:dark:text-white" />
                        </Button>
                      </Dialog.Title>

                      <div className="flex flex-1 flex-col gap-3 overflow-hidden">
                        <p className="text-base font-medium">
                          {type === "REQUEST_DATA" && t("request_modal.subtitle")}
                          {type === "SUBSCRIBE_TICKET" &&
                            t("request_modal.subtitle", { context: "subscribe" })}
                        </p>
                        <form
                          className="hide-scrollbar flex flex-1 flex-col gap-3 overflow-y-scroll text-sm font-medium"
                          method="post"
                        >
                          <div className="flex">
                            <Input
                              required
                              type="text"
                              name="name"
                              className="w-full"
                              label={t("forms.name")}
                              placeholder={t("forms.name")}
                              value={data.name}
                              onChange={e => {
                                setData("name", e);
                                setValidation("name", false);
                              }}
                              validation={validation.name}
                            />
                          </div>
                          <div className="flex">
                            <Input
                              required
                              type="text"
                              name="email"
                              className="w-full"
                              label={t("forms.email")}
                              placeholder={t("forms.email")}
                              value={data.email}
                              onChange={e => {
                                setData("email", e);
                                setValidation("email", false);
                              }}
                              validation={validation.email}
                            />
                          </div>
                          <div className="flex">
                            <Input
                              type="text"
                              name="institution"
                              className="w-full"
                              label={t("forms.institution")}
                              placeholder={t("forms.institution")}
                              value={data.institution}
                              onChange={e => {
                                setData("institution", e);
                                setValidation("institution", false);
                              }}
                              validation={validation.institution}
                            />
                          </div>

                          {type === "REQUEST_DATA" && (
                            <>
                              <div className="flex">
                                <Input
                                  required
                                  type="text"
                                  name="dataset_title"
                                  className="w-full"
                                  label={t("forms.dataset_title")}
                                  placeholder={t("forms.dataset_title")}
                                  value={data.dataset_title}
                                  onChange={e => {
                                    setData("dataset_title", e);
                                    setValidation("dataset_title", false);
                                  }}
                                  validation={validation.dataset_title}
                                />
                              </div>
                              <div className="flex w-full flex-col gap-2">
                                <Label
                                  required
                                  name="dataset_description"
                                  label={t("forms.dataset_description")}
                                />
                                <Textarea
                                  required
                                  placeholder={t("forms.dataset_description_placeholder")}
                                  rows={2}
                                  className={
                                    validation.dataset_description
                                      ? "border-danger border-2"
                                      : "border-outline"
                                  }
                                  value={data.dataset_description}
                                  onChange={e => {
                                    setData("dataset_description", e.target.value);
                                    setValidation("dataset_description", false);
                                  }}
                                />
                                <p className="text-danger text-xs">
                                  {validation.dataset_description}
                                </p>
                              </div>

                              <div className="flex flex-col gap-2">
                                <Label required label={t("forms.agency")} />
                                <Dropdown
                                  enableSearch={true}
                                  anchor="left"
                                  width="w-full"
                                  className={validation.agency ? "border-danger border-2" : ""}
                                  options={agencies}
                                  placeholder={t("forms.agency")}
                                  selected={
                                    agencies.find(e => e.value === data.agency) ?? undefined
                                  }
                                  onChange={e => {
                                    setData("agency", e.value);
                                    setValidation("agency", false);
                                  }}
                                />
                                <p className="text-danger text-xs">{validation.agency}</p>
                              </div>
                              <div className="flex w-full flex-col gap-2">
                                <Label
                                  required
                                  name="purpose_of_request"
                                  label={t("forms.purpose")}
                                />
                                <Radio
                                  name="purpose_of_request"
                                  className="flex flex-col gap-3 pl-2"
                                  options={PURPOSES}
                                  required={true}
                                  value={data.purpose_of_request}
                                  onChange={e => {
                                    setData("purpose_of_request", e);
                                    if (e.value === "others") {
                                      setRadio("useInput", true);
                                    } else {
                                      setRadio("useInput", false);
                                      setValidation("purpose_of_request", false);
                                    }
                                  }}
                                />
                                <Textarea
                                  placeholder={t("forms.purpose_placeholder")}
                                  rows={2}
                                  className={clx("ml-8", "border-outline")}
                                  value={radio.input_value}
                                  onChange={e => {
                                    setRadio("input_value", e.target.value);
                                    setValidation("purpose_of_request", false);
                                  }}
                                />
                                <p className="text-danger ml-8 text-xs">
                                  {validation.purpose_of_request}
                                </p>
                              </div>
                            </>
                          )}

                          <Button
                            variant="primary"
                            className="mt-3 flex w-full items-center justify-center text-center text-base font-medium"
                            onClick={async () => {
                              try {
                                const isValid = (await validateInput()) as {
                                  ok: boolean;
                                  message: string;
                                };
                                if (isValid.ok) {
                                  if (type === "REQUEST_DATA") {
                                    const response = await post(
                                      `/data-request/?language=${
                                        SHORT_LANG[i18n.language as keyof typeof SHORT_LANG]
                                      }`,
                                      {
                                        ...data,
                                        purpose_of_request: radio.useInput
                                          ? radio.input_value
                                          : data.purpose_of_request.label,
                                      }
                                    );

                                    setLoading(false);
                                    setModalState("SUCCESS");
                                    reset();
                                    resetRadio();
                                  }

                                  if (type === "SUBSCRIBE_TICKET") {
                                    const response = await post(
                                      `data-request/${ticket_id}/subscription/`,
                                      {
                                        ...data,
                                        language: i18n.language,
                                      }
                                    );

                                    setLoading(false);
                                    setModalState("SUCCESS");
                                    reset();
                                  }
                                }
                              } catch (error) {
                                if (error instanceof AxiosError) {
                                  if (error.response?.data.detail) {
                                    setError("code", error.response?.status);
                                    setError("message", error.response?.data.detail);
                                  } else if (error.response?.data.email) {
                                    setError("code", error.response?.status);
                                    setError("message", error.response?.data.email);
                                  } else {
                                    setError("code", error.code);
                                    setError(
                                      "message",
                                      "Something went wrong with the submission. Please try again later."
                                    );
                                  }
                                }

                                setLoading(false);
                              }
                            }}
                          >
                            {t("forms.submit")}
                            {submissionLoading ? (
                              <Spinner loading={submissionLoading} className="border-t-white" />
                            ) : (
                              <ChevronRightIcon className="w-4.5 h-4.5 text-white" />
                            )}
                          </Button>
                          {errorData.message && (
                            <p className="text-danger text-sm">{errorData.message}</p>
                          )}
                        </form>
                      </div>
                    </>
                  )}
                  {modalState === "SUCCESS" && (
                    <>
                      <Dialog.Title
                        as="div"
                        className="border-outline flex items-start justify-end text-black dark:text-white"
                      >
                        <Button
                          variant="reset"
                          className="hover:bg-washed dark:hover:bg-washed-dark h-6 w-6 rounded-full"
                          onClick={() => {
                            hide();
                            setTimeout(() => {
                              setModalState("FORM");
                            }, 300);
                          }}
                        >
                          <XMarkIcon className="text-dim mx-auto h-6 w-6 group-hover:text-black group-hover:dark:text-white" />
                        </Button>
                      </Dialog.Title>

                      <div className="flex flex-col items-center justify-center gap-3 pb-8 text-center">
                        <CheckCircleIcon className="text-primary h-11 w-11" />
                        <p className="text-lg font-bold">
                          {type === "REQUEST_DATA" && t("request_modal.success_title")}
                          {type === "SUBSCRIBE_TICKET" &&
                            t("request_modal.success_title", { context: "subscribe" })}
                        </p>
                        <p className="text-dim text-base font-medium">
                          {type === "REQUEST_DATA" && t("request_modal.success_description")}
                          {type === "SUBSCRIBE_TICKET" &&
                            t("request_modal.success_description", { context: "subscribe" })}
                        </p>
                      </div>
                    </>
                  )}
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
};
