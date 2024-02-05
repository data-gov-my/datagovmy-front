import { Dialog, Transition } from "@headlessui/react";
import { ChevronRightIcon } from "@heroicons/react/20/solid";
import { CheckCircleIcon, XMarkIcon } from "@heroicons/react/24/solid";
import { post } from "datagovmy-ui/api";
import { Button, Dropdown, Input, Label, Spinner, Textarea } from "datagovmy-ui/components";
import { body, header } from "datagovmy-ui/configs/font";
import { clx, isValidURL } from "datagovmy-ui/helpers";
import { useData, useTranslation } from "datagovmy-ui/hooks";
import { Fragment, FunctionComponent, useState } from "react";
import { product_type } from ".";
import { OptionType } from "datagovmy-ui/types";

type RequestFeatureModalProps = {
  show: boolean;
  hide: () => void;
};

export const RequestFeatureModal: FunctionComponent<RequestFeatureModalProps> = ({
  show,
  hide,
}) => {
  const { t, i18n } = useTranslation(["community-products"]);
  const [submissionLoading, setLoading] = useState(false);
  const [modalState, setModalState] = useState<"FORM" | "SUCCESS">("FORM");

  const PRODUCT_TYPE: OptionType[] = product_type.map(type => ({
    label: t(`product_type.${type}`),
    value: type,
  }));

  const { data, setData, reset } = useData({
    name: "",
    email: "",
    institution: "",
    product_name: "",
    product_type: "",
    product_year: "",
    product_description: "",
    problem_statement: "",
    solutions_developed: "",
    product_link: "",
    dataset_used: "",
  });

  const { data: errorData, setData: setError } = useData({
    message: "",
    code: "",
  });

  const { data: validation, setData: setValidation } = useData(
    Object.fromEntries(Object.entries(data).map(([key]) => [key, false]))
  );

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
          if (key === "email") {
            const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
            if (emailRegex.test(value)) {
              setValidation(key, false);
              return [key, true];
            } else {
              setValidation(key, "Enter valid email");
              return [key, false];
            }
          }
          if (key === "product_year") {
            // Valid year: 1900 - 2099
            const yearRegex = /^(19|20)\d{2}$/;
            if (yearRegex.test(value)) {
              setValidation(key, false);
              return [key, true];
            } else {
              setValidation(key, "Enter valid year");
              return [key, false];
            }
          }
          if (key === "product_link") {
            if (isValidURL(value)) {
              setValidation(key, false);
              return [key, true];
            } else {
              setValidation(key, "Enter valid URL");
              return [key, false];
            }
          }
          if (key === "dataset_used") {
            const links = value.split(",");
            const validateLink = links.map(link => {
              const trimmed = link.trim();
              if (isValidURL(trimmed)) {
                return true;
              } else {
                return false;
              }
            });

            if (validateLink.every(el => el === true)) {
              setValidation(key, false);
              return [key, true];
            } else {
              setValidation(key, "Invalid URL in one or more links");
              return [key, false];
            }
          }
          if (value) {
            setValidation(key, false);
            return [key, true];
          } else {
            setValidation(key, "Required");
            return [key, false];
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
            <div className="flex h-screen items-center justify-center py-2 text-center">
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
                    modalState === "SUCCESS" ? "h-60" : "h-full max-h-[800px]"
                  )}
                >
                  {modalState === "FORM" && (
                    <>
                      <Dialog.Title
                        as="div"
                        className="border-outline flex items-start text-black dark:text-white"
                      >
                        <div className="flex flex-1 flex-col gap-1.5">
                          <p className="text-lg font-bold">{t("request_feature_modal.title")}</p>
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
                          {t("request_feature_modal.subtitle")}
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
                              label={t("request_feature_modal.name")}
                              placeholder={t("request_feature_modal.name")}
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
                              label={t("request_feature_modal.email")}
                              placeholder={t("request_feature_modal.email")}
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
                              label={t("request_feature_modal.institution")}
                              placeholder={t("request_feature_modal.institution")}
                              value={data.institution}
                              onChange={e => {
                                setData("institution", e);
                                setValidation("institution", false);
                              }}
                              validation={validation.institution}
                            />
                          </div>

                          <div className="flex">
                            <Input
                              required
                              type="text"
                              name="product_name"
                              className="w-full"
                              label={t("request_feature_modal.product_name")}
                              placeholder={t("request_feature_modal.product_name")}
                              value={data.product_name}
                              onChange={e => {
                                setData("product_name", e);
                                setValidation("product_name", false);
                              }}
                              validation={validation.product_name}
                            />
                          </div>
                          <div className="flex gap-3">
                            <div className="flex w-full flex-col gap-2">
                              <Label required label={t("request_feature_modal.product_type")} />
                              <Dropdown
                                anchor="left"
                                width="w-full"
                                className={
                                  validation.product_type ? "border-danger h-10 border-2" : "h-10"
                                }
                                options={PRODUCT_TYPE}
                                placeholder={t("request_feature_modal.product_type")}
                                selected={
                                  PRODUCT_TYPE.find(e => e.value === data.product_type) ?? undefined
                                }
                                onChange={e => {
                                  setData("product_type", e.value);
                                  setValidation("product_type", false);
                                }}
                              />
                              <p className="text-danger text-xs">{validation.product_type}</p>
                            </div>
                            <Input
                              required
                              type="text"
                              name="product_year"
                              className="w-full"
                              label={t("request_feature_modal.product_year")}
                              placeholder={t("request_feature_modal.product_year_placeholder")}
                              value={data.product_year}
                              onChange={e => {
                                setData("product_year", e);
                                setValidation("product_year", false);
                              }}
                              validation={validation.product_year}
                            />
                          </div>
                          <div className="flex w-full flex-col gap-2">
                            <Label
                              required
                              name="product_description"
                              label={t("request_feature_modal.product_description")}
                            />
                            <Textarea
                              required
                              placeholder={t(
                                "request_feature_modal.product_description_placeholder"
                              )}
                              rows={3}
                              className={
                                validation.product_description
                                  ? "border-danger border-2"
                                  : "border-outline"
                              }
                              value={data.product_description}
                              onChange={e => {
                                setData("product_description", e.target.value);
                                setValidation("product_description", false);
                              }}
                            />
                            <p className="text-danger text-xs">{validation.product_description}</p>
                          </div>
                          <div className="flex w-full flex-col gap-2">
                            <Label
                              required
                              name="problem_statement"
                              label={t("request_feature_modal.problem_statement")}
                            />
                            <Textarea
                              required
                              placeholder={t("request_feature_modal.problem_statement_placeholder")}
                              rows={3}
                              className={
                                validation.problem_statement
                                  ? "border-danger border-2"
                                  : "border-outline"
                              }
                              value={data.problem_statement}
                              onChange={e => {
                                setData("problem_statement", e.target.value);
                                setValidation("problem_statement", false);
                              }}
                            />
                            <p className="text-danger text-xs">{validation.problem_statement}</p>
                          </div>
                          <div className="flex w-full flex-col gap-2">
                            <Label
                              required
                              name="solutions_developed"
                              label={t("request_feature_modal.solutions_developed")}
                            />
                            <Textarea
                              required
                              placeholder={t(
                                "request_feature_modal.solutions_developed_placeholder"
                              )}
                              rows={3}
                              className={
                                validation.solutions_developed
                                  ? "border-danger border-2"
                                  : "border-outline"
                              }
                              value={data.solutions_developed}
                              onChange={e => {
                                setData("solutions_developed", e.target.value);
                                setValidation("solutions_developed", false);
                              }}
                            />
                            <p className="text-danger text-xs">{validation.solutions_developed}</p>
                          </div>

                          <div className="flex w-full flex-col gap-2">
                            <Input
                              required
                              type="text"
                              name="product_link"
                              className="w-full"
                              label={t("request_feature_modal.product_link")}
                              placeholder={t("request_feature_modal.product_link")}
                              value={data.product_link}
                              onChange={e => {
                                setData("product_link", e);
                                setValidation("product_link", false);
                              }}
                              validation={validation.product_link}
                            />
                            <p className="text-dim text-xs">
                              {t("request_feature_modal.product_link_note")}
                            </p>
                          </div>
                          <div className="flex w-full flex-col gap-2">
                            <Label
                              required
                              name="dataset_used"
                              label={t("request_feature_modal.dataset_used")}
                            />

                            <Textarea
                              required
                              placeholder={t("request_feature_modal.dataset_used")}
                              rows={3}
                              className={
                                validation.dataset_used
                                  ? "border-danger border-2"
                                  : "border-outline"
                              }
                              value={data.dataset_used}
                              onChange={e => {
                                setData("dataset_used", e.target.value);
                                setValidation("dataset_used", false);
                              }}
                            />
                            <p className="text-danger text-xs">{validation.dataset_used}</p>
                            <p className="text-dim text-xs">
                              {t("request_feature_modal.dataset_used_note")}
                            </p>
                          </div>

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
                                  // const response = await post(
                                  //   `/data-request/?language=${
                                  //     SHORT_LANG[i18n.language as keyof typeof SHORT_LANG]
                                  //   }`,
                                  //   {
                                  //     ...data,
                                  //     purpose_of_request: radio.useInput
                                  //       ? radio.input_value
                                  //       : data.purpose_of_request.label,
                                  //   }
                                  // );

                                  setLoading(false);
                                  setModalState("SUCCESS");
                                  reset();
                                }
                              } catch (error) {
                                setLoading(false);
                              }
                            }}
                          >
                            {t("request_feature_modal.submit")}
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
                          {t("request_feature_modal.success_title")}
                        </p>
                        <p className="text-dim text-base font-medium">
                          {t("request_feature_modal.success_description")}
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
