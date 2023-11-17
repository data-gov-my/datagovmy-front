import { Dialog, Transition } from "@headlessui/react";
import { BuildingLibraryIcon, ChevronRightIcon } from "@heroicons/react/20/solid";
import { CheckCircleIcon, XMarkIcon } from "@heroicons/react/24/solid";
import {
  At,
  Button,
  Card,
  Dropdown,
  Input,
  Label,
  Spinner,
  Textarea,
} from "datagovmy-ui/components";
import { body, header } from "datagovmy-ui/configs/font";
import { AgencyLink } from "datagovmy-ui/constants";
import { clx, toDate } from "datagovmy-ui/helpers";
import { useData, useTranslation } from "datagovmy-ui/hooks";
import { OptionType } from "datagovmy-ui/types";
import { Fragment, FunctionComponent, useState } from "react";

// TODO: Temp, please import from DC index, when the branch is merged
type Catalogue = {
  id: string;
  catalog_name: string;
  description?: string;
  data_as_of?: string;
  data_source?: Array<string>;
};

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
            <div className="flex min-h-full items-center justify-center py-2 text-center">
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
                    "border-outline shadow-floating dark:border-outlineHover-dark w-full max-w-xl transform overflow-hidden rounded-xl border bg-white p-6 text-left align-middle font-sans transition-all dark:bg-black"
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

                  <div className="mt-3 flex flex-col gap-3">
                    <p className="text-base font-medium">{t("success_modal.subtitle")}</p>
                    <div className="bg-washed hide-scrollbar flex h-[80vh] flex-col gap-2 overflow-y-scroll rounded-xl p-3">
                      {items.map((dataset, index) => (
                        // TODO: Use Component from DC when merged
                        <Card
                          key={index}
                          className={clx(
                            "border-outline hover:border-outlineHover hover:bg-background dark:hover:bg-washed-dark/50 dark:border-washed-dark dark:hover:border-outlineHover-dark group relative rounded-xl bg-white transition-colors",
                            "w-full"
                          )}
                        >
                          <At
                            href={`/data-catalogue/${dataset.id}`}
                            locale={i18n.language}
                            prefetch={false}
                            target="_blank"
                            className="py-4.5 flex flex-col gap-4 px-5"
                          >
                            <div className="flex flex-col gap-1.5">
                              <p
                                className="truncate text-lg font-bold text-black dark:text-white"
                                title={dataset.catalog_name}
                              >
                                {dataset.catalog_name}
                              </p>

                              <p className={clx("text-sm", "truncate")}>{dataset.description}</p>
                            </div>

                            <div className="flex flex-row items-center gap-1">
                              <BuildingLibraryIcon className="text-dim h-4 w-4" />
                              <p className="text-dim text-sm font-medium">
                                {dataset.data_source?.length ? dataset.data_source[0] : ""}
                              </p>
                              <div className="bg-dim h-1 w-1 rounded-full px-0.5" />
                              <p className="text-dim text-sm">
                                {t("common:common.data_of", {
                                  date: toDate(
                                    dataset.data_as_of
                                      ? dataset.data_as_of
                                      : new Date().toISOString(),
                                    "dd MMM yyyy, HH:mm",
                                    i18n.language
                                  ),
                                })}
                              </p>
                            </div>
                          </At>
                        </Card>
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
    purpose: "",
  });

  const { data: validation, setData: setValidation } = useData(
    Object.fromEntries(Object.entries(data).map(([key]) => [key, key === "resources" ? [] : false]))
  );

  const agencies: OptionType[] = Object.keys(AgencyLink).map(agency => ({
    label: t(`agencies:${agency}.abbr`),
    value: agency,
  }));
  // TODO: to set up actual list for the dropdown
  const purposes: OptionType[] = [
    { label: t("catalogue:filter_options.monthly"), value: "MONTHLY" },
    { label: t("catalogue:filter_options.quarterly"), value: "QUARTERLY" },
    { label: t("catalogue:filter_options.yearly"), value: "YEARLY" },
  ];

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
            <div className="flex min-h-full items-center justify-center py-2 text-center">
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
                    "border-outline shadow-floating dark:border-outlineHover-dark w-full max-w-xl transform overflow-hidden rounded-xl border bg-white p-6 text-left align-middle font-sans transition-all dark:bg-black"
                  }
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

                      <div className="mt-3 flex flex-col gap-3">
                        <p className="text-base font-medium">{t("request_modal.subtitle")}</p>
                        <form
                          className="hide-scrollbar flex h-[70vh] flex-col gap-3 overflow-y-scroll text-sm font-medium"
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
                          <div className="flex">
                            <Input
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
                              validation={validation.institution}
                            />
                          </div>
                          <div className="flex w-full flex-col gap-2">
                            <Label
                              name="dataset_description"
                              label={t("forms.dataset_description")}
                            />
                            <Textarea
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
                            <Label label={t("forms.agency")} />
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
                          <div className="flex flex-col gap-2">
                            <Label label={t("forms.purpose")} />
                            <Dropdown
                              anchor="left"
                              width="w-full"
                              className={validation.purpose ? "border-danger border-2" : ""}
                              options={purposes}
                              placeholder={t("forms.purpose")}
                              selected={purposes.find(e => e.value === data.purpose) ?? undefined}
                              onChange={e => {
                                setData("purpose", e.value);
                                setValidation("purpose", false);
                              }}
                            />
                            <p className="text-danger text-xs">{validation.purpose}</p>
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
                                  setTimeout(() => {
                                    setLoading(false);
                                    setModalState("SUCCESS");
                                    reset();
                                  }, 500);
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

                      <div className="mt-2 flex flex-col items-center justify-center gap-3 pb-8">
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
