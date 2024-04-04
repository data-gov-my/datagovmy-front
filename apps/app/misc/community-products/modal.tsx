import { Dialog, Transition } from "@headlessui/react";
import { MagnifyingGlassMinusIcon, MagnifyingGlassPlusIcon } from "@heroicons/react/20/solid";
import { XMarkIcon } from "@heroicons/react/24/solid";
import { At, Button, Spinner } from "datagovmy-ui/components";
import { body, header } from "datagovmy-ui/configs/font";
import { BREAKPOINTS } from "datagovmy-ui/constants";
import { WindowContext } from "datagovmy-ui/contexts/window";
import { clx, isValidURL } from "datagovmy-ui/helpers";
import { useTranslation } from "datagovmy-ui/hooks";
import { DateTime } from "luxon";
import Image from "next/image";
import { CommunityProductsItem } from "pages/community-products/[[...product_id]]";
import { Fragment, FunctionComponent, useContext, useState } from "react";

interface CommunityProductsModalProps {
  hide: () => void;
  loading: true;
  show: boolean;
  product: CommunityProductsItem;
}

const CommunityProductsModal: FunctionComponent<CommunityProductsModalProps> = ({
  hide,
  loading,
  show,
  product,
}) => {
  const { t } = useTranslation(["community-products"]);
  const diffInDays =
    product && DateTime.now().diff(DateTime.fromISO(product.date_approved), ["days"]);
  const [expandImage, setExpandImage] = useState(false);
  const { size } = useContext(WindowContext);

  return (
    <>
      {product && (
        <Transition show={show} as={Fragment}>
          <Dialog
            as="div"
            className={clx(header.variable, body.variable, "relative z-30 font-sans")}
            onClose={() => {
              hide();
              setExpandImage(false);
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
                    className={
                      "border-outline shadow-floating dark:border-outlineHover-dark flex h-full max-h-[800px] w-full max-w-4xl transform flex-col gap-3 rounded-xl border bg-white text-left font-sans transition-all dark:bg-black"
                    }
                  >
                    {loading ? (
                      <div className="flex h-[300px] w-full items-center justify-center">
                        <Spinner loading={loading} />
                      </div>
                    ) : (
                      <>
                        <Dialog.Title
                          as="div"
                          className="border-outline flex items-start border-b p-6 text-black dark:text-white"
                        >
                          <div className="flex flex-1 flex-col gap-1.5">
                            <p className="text-lg font-bold">{product.product_name}</p>
                            <div className="flex flex-col items-start text-sm font-medium sm:flex-row sm:items-center sm:gap-1.5">
                              <p
                                className={clx(
                                  "text-primary",
                                  diffInDays.days < 14 ? "opacity-100" : "opacity-0"
                                )}
                              >
                                {t("new")}
                              </p>
                              {diffInDays.days < 14 && (
                                <div className="bg-dim hidden h-1 w-1 rounded-full sm:block" />
                              )}
                              <p className="text-dim capitalize">
                                {t(`product_type.${product.product_type}`)}
                              </p>
                              <div className="bg-dim hidden h-1 w-1 rounded-full sm:block" />
                              <p className="text-dim">
                                {" "}
                                {DateTime.fromISO(product.date_approved).toFormat(
                                  "dd MMM yyyy hh:mm a"
                                )}
                              </p>
                            </div>
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

                        {/* Content */}
                        <div className="hide-scrollbar flex flex-1 flex-col gap-8 overflow-scroll p-6 sm:h-full sm:flex-row sm:overflow-hidden">
                          <div
                            className={clx(
                              "gap-4.5 hide-scrollbar flex flex-col overflow-y-visible sm:overflow-y-scroll",
                              expandImage && "w-full transition-all"
                            )}
                          >
                            <div
                              className={clx(
                                "bg-background border-outline group relative flex h-full w-full items-center overflow-hidden rounded-lg border transition-all ease-in hover:cursor-pointer sm:h-[300px] sm:w-[300px]",
                                expandImage && "flex-1 sm:w-full"
                              )}
                              onClick={() =>
                                size.width > BREAKPOINTS.SM && setExpandImage(prev => !prev)
                              }
                            >
                              <Image
                                src={product.thumbnail || "/static/images/og_en-GB.png"}
                                width={1000}
                                height={1000}
                                alt={product.product_name}
                              />
                              <p className="text-dim absolute bottom-0 left-1/2 hidden -translate-x-1/2 items-center gap-1 text-xs group-hover:flex">
                                {expandImage ? (
                                  <MagnifyingGlassMinusIcon className="h-3 w-3" />
                                ) : (
                                  <MagnifyingGlassPlusIcon className="h-3 w-3" />
                                )}
                                {expandImage ? "Close" : "Expand"}
                              </p>
                            </div>
                            {!expandImage &&
                              Object.entries(product).map(([key, value]) => {
                                if (key === "email" || key === "product_link") {
                                  return (
                                    <div className="flex max-w-xs flex-col gap-1 text-base text-black">
                                      <p className="font-bold">{t(key)}:</p>
                                      <At
                                        passHref={true}
                                        external={true}
                                        href={
                                          key === "email" && typeof value === "string"
                                            ? `mailto:${value}`
                                            : typeof value === "string" && value.startsWith("http")
                                            ? value
                                            : `https://${value}`
                                        }
                                        className="group"
                                      >
                                        <p className="text-primary group-hover:underline">
                                          {value}
                                        </p>
                                      </At>
                                    </div>
                                  );
                                }
                              })}
                          </div>
                          <div
                            className={clx(
                              "hide-scrollbar flex h-full flex-1 flex-col gap-6 overflow-y-visible sm:overflow-y-scroll",
                              expandImage && "hidden"
                            )}
                          >
                            {Object.entries(product).map(([key, value]) => {
                              if (
                                key !== "product_name" &&
                                key !== "product_year" &&
                                key !== "product_description" &&
                                key !== "problem_statement" &&
                                key !== "solutions_developed" &&
                                key !== "dataset_used"
                              ) {
                                return null;
                              }

                              if (key === "dataset_used") {
                                if (typeof value === "string") {
                                  const datasets = value.split(",");
                                  return (
                                    <div className="flex flex-col gap-1 text-base text-black">
                                      <p className="font-bold">{t(key)}:</p>
                                      {datasets.map(ds => {
                                        return isValidURL(ds) ? (
                                          <At
                                            passHref={true}
                                            external={true}
                                            href={ds}
                                            className="text-primary hover:underline"
                                          >
                                            {ds}
                                          </At>
                                        ) : (
                                          <p>{ds}</p>
                                        );
                                      })}
                                    </div>
                                  );
                                }
                              }
                              return (
                                <div className="flex flex-col gap-1 text-base text-black">
                                  <p className="font-bold">{t(key)}:</p>
                                  <p>{value}</p>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </>
                    )}
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </div>
          </Dialog>
        </Transition>
      )}
    </>
  );
};

export default CommunityProductsModal;
