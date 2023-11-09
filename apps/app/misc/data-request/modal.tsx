import { Dialog, Transition } from "@headlessui/react";
import { BuildingLibraryIcon } from "@heroicons/react/20/solid";
import { XMarkIcon } from "@heroicons/react/24/solid";
import { At, Button, Card } from "datagovmy-ui/components";
import { clx, toDate } from "datagovmy-ui/helpers";
import { useTranslation } from "datagovmy-ui/hooks";
import { Fragment, FunctionComponent } from "react";

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
          className="relative z-30"
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
