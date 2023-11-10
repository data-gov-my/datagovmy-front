import { Dialog, Transition } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/solid";
import { Button } from "datagovmy-ui/components";
import { useTranslation } from "datagovmy-ui/hooks";
import { Fragment, FunctionComponent } from "react";

type RequestFeatureModalProps = {
  show: boolean;
  hide: () => void;
};

export const RequestFeatureModal: FunctionComponent<RequestFeatureModalProps> = ({
  show,
  hide,
}) => {
  const { t, i18n } = useTranslation(["community-products"]);
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

                  <div className="mt-3 flex flex-col gap-3">
                    <p className="text-base font-medium">
                      {t("request_feature_modal.subtitle", {
                        email: `data.dtsa@mampu.gov.my`,
                      })}
                    </p>
                    <div className="bg-washed text-washed-dark mt-2 flex flex-col gap-2 rounded-xl p-3 text-base">
                      <p className="">1) {t("request_feature_modal.name")} **</p>
                      <p className="">2) {t("request_feature_modal.email")} **</p>
                      <p className="">3) {t("request_feature_modal.institution")}</p>
                      <p className="">4) {t("request_feature_modal.product_name")} **</p>
                      <p className="">5) {t("request_feature_modal.product_description")} **</p>
                      <p className="">6) {t("request_feature_modal.link_to_product")} **</p>
                      <p className="">7) {t("request_feature_modal.dataset_used")} **</p>
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
