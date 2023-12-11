import { Dialog, Transition } from "@headlessui/react";
import { ChevronRightIcon } from "@heroicons/react/20/solid";
import { CheckCircleIcon, XMarkIcon } from "@heroicons/react/24/solid";
import { post } from "datagovmy-ui/api";
import { Button, Dropdown, Input, Label, Spinner, Textarea } from "datagovmy-ui/components";
import { body, header } from "datagovmy-ui/configs/font";
import { AgencyLink, SHORT_LANG } from "datagovmy-ui/constants";
import { Catalogue, CatalogueCard } from "datagovmy-ui/data-catalogue";
import { clx } from "datagovmy-ui/helpers";
import { useData, useTranslation } from "datagovmy-ui/hooks";
import { OptionType } from "datagovmy-ui/types";
import { Fragment, FunctionComponent, useState } from "react";

type PublishedDataModalProps = {
  items?: Array<Catalogue>;
  show: boolean;
  hide: () => void;
};

const dummyPublished: Array<Catalogue> = [
  {
    id: "commodities_fuelprice_master",
    catalog_name: "Fuel Price Table",
    data_as_of: "2023-09-07 00:01:00",
    description:
      "This dataset presents the weekly retail price of RON95 petrol, RON97 petrol, and diesel in Malaysia. Since April 2017, the retail price of fuel in Malaysia has been set on a weekly basis using the Automatic Pricing Mechanism (APM). Prior to that, it changed at a monthly (or longer) frequency. The APM is designed to allow the government to monitor the effects of changes in global crude oil prices and adjust retail fuel prices to ensure the continued welfare of the rakyat.",
    data_source: ["MOF"],
  },
  {
    id: "commodities_fuelprice_master",
    catalog_name: "Fuel Price Table",
    data_as_of: "2023-09-07 00:01:00",
    description:
      "This dataset presents the weekly retail price of RON95 petrol, RON97 petrol, and diesel in Malaysia. Since April 2017, the retail price of fuel in Malaysia has been set on a weekly basis using the Automatic Pricing Mechanism (APM). Prior to that, it changed at a monthly (or longer) frequency. The APM is designed to allow the government to monitor the effects of changes in global crude oil prices and adjust retail fuel prices to ensure the continued welfare of the rakyat.",
    data_source: ["MOF"],
  },
  {
    id: "commodities_fuelprice_master",
    catalog_name: "Fuel Price Table",
    data_as_of: "2023-09-07 00:01:00",
    description:
      "This dataset presents the weekly retail price of RON95 petrol, RON97 petrol, and diesel in Malaysia. Since April 2017, the retail price of fuel in Malaysia has been set on a weekly basis using the Automatic Pricing Mechanism (APM). Prior to that, it changed at a monthly (or longer) frequency. The APM is designed to allow the government to monitor the effects of changes in global crude oil prices and adjust retail fuel prices to ensure the continued welfare of the rakyat.",
    data_source: ["MOF"],
  },
];

export const PublishedDataModal: FunctionComponent<PublishedDataModalProps> = ({
  items = [...dummyPublished, ...dummyPublished],
  show,
  hide,
}) => {
  const { t, i18n } = useTranslation(["data-request"]);
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
                    "border-outline shadow-floating  dark:border-outlineHover-dark flex h-full max-h-[600px] w-full max-w-xl transform flex-col gap-3 rounded-xl border bg-white p-6 text-left font-sans transition-all dark:bg-black"
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
                    <p className="text-base font-medium">{t("success_modal.subtitle")}</p>
                    <div className="bg-washed dark:bg-washed-dark hide-scrollbar flex flex-1 flex-col gap-2 overflow-y-auto rounded-xl p-3">
                      {items.map((dataset, index) => (
                        <CatalogueCard key={index} dataset={dataset} index={index} />
                      ))}
                    </div>
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

type RequestDataModalProps = {
  show: boolean;
  hide: () => void;
};

export const RequestDataModal: FunctionComponent<RequestDataModalProps> = ({ show, hide }) => {
  const { t, i18n } = useTranslation(["data-request", "agencies"]);
  const [modalState, setModalState] = useState<"FORM" | "SUCCESS">("FORM");
  const [submissionLoading, setLoading] = useState(false);

  const { data, setData, reset } = useData({
    name: "",
    email: "",
    institution: "",
    dataset_title: "",
    dataset_description: "",
    agency: "",
    purpose_of_request: "",
  });

  const { data: validation, setData: setValidation } = useData(
    Object.fromEntries(Object.entries(data).map(([key]) => [key, false]))
  );

  const agencies: OptionType[] = Object.keys(AgencyLink).map(agency => ({
    label: t(`agencies:${agency}.abbr`),
    value: agency,
  }));

  const validateInput = async () =>
    new Promise((resolve, reject) => {
      setLoading(true);
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

          <div className="over fixed inset-0">
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
                          <p className="text-lg font-bold">{t("request_modal.title")}</p>
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
                        <p className="text-base font-medium">{t("request_modal.subtitle")}</p>
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
                              required
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
                            <p className="text-danger text-xs">{validation.dataset_description}</p>
                          </div>

                          <div className="flex flex-col gap-2">
                            <Label required label={t("forms.agency")} />
                            <Dropdown
                              anchor="left"
                              width="w-full"
                              className={validation.agency ? "border-danger border-2" : ""}
                              options={agencies}
                              placeholder={t("forms.agency")}
                              selected={agencies.find(e => e.value === data.agency) ?? undefined}
                              onChange={e => {
                                setData("agency", e.value);
                                setValidation("agency", false);
                              }}
                            />
                            <p className="text-danger text-xs">{validation.agency}</p>
                          </div>
                          <div className="flex w-full flex-col gap-2">
                            <Label required name="purpose_of_request" label={t("forms.purpose")} />
                            <Textarea
                              placeholder={t("forms.purpose_placeholder")}
                              rows={2}
                              className={
                                validation.purpose_of_request
                                  ? "border-danger border-2"
                                  : "border-outline"
                              }
                              value={data.purpose_of_request}
                              onChange={e => {
                                setData("purpose_of_request", e.target.value);
                                setValidation("purpose_of_request", false);
                              }}
                            />
                            <p className="text-danger text-xs">{validation.purpose_of_request}</p>
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
                                  const response = await post(
                                    `/data-request/?language=${
                                      SHORT_LANG[i18n.language as keyof typeof SHORT_LANG]
                                    }`,
                                    data
                                  );

                                  setLoading(false);
                                  setModalState("SUCCESS");
                                  reset();
                                }
                              } catch (error) {
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
                        <p className="text-lg font-bold">{t("request_modal.success_title")}</p>
                        <p className="text-dim text-base font-medium">
                          {t("request_modal.success_description")}
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
