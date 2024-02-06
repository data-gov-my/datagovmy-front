import { Dialog, Transition } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/solid";
import { At, Button, Spinner } from "datagovmy-ui/components";
import { body, header } from "datagovmy-ui/configs/font";
import { clx, toDate } from "datagovmy-ui/helpers";
import { useTranslation } from "datagovmy-ui/hooks";
import { DateTime } from "luxon";
import Image from "next/image";
import { CommunityProductsItem } from "pages/community-products/[[...product_id]]";
import { Fragment, FunctionComponent } from "react";

interface CommunityProductsModalProps {
  hide: () => void;
  loading: true;
  show: boolean;
  product: CommunityProductsItem;
}

type ApplicationData = {
  title: string;
  purpose: string;
  problem_statement: string;
  solution_developed: string;
  source: string;
  website: string;
  email: string;
};

const dummyApplication: ApplicationData = {
  title: "Mobile Trainer",
  purpose:
    "Aplikasi yang berfungsi sebagai pelatih kecergasan untuk kegunaan orang ramai. Berfungsi sebagai trainer maya yang mengingatkan anda tentang rancangan untuk menurunkan berat badan serta mengesyorkan diet, restoran dan gim berdekatan serta latihan fizikal yang berkesan.",
  problem_statement:
    "The cases of people becoming underweight, overweight and obesity is on the rise everywhere as most people don't have personal trainers or the willpower to get in shape.",
  solution_developed:
    "An app that acts as a fitness trainer. It reminds you of your plan to lose weight, recommends diets, nearby restaurants and gyms as well as effective physical exercises.An app that acts as a fitness trainer. It reminds you of your plan to lose weight, recommends diets, nearby restaurants and gyms as well as effective physical exercises.An app that acts as a fitness trainer. It reminds you of your plan to lose weight, recommends diets, nearby restaurants and gyms as well as effective physical exercises.An app that acts as a fitness trainer. It reminds you of your plan to lose weight, recommends diets, nearby restaurants and gyms as well as effective physical exercises.An app that acts as a fitness trainer. It reminds you of your plan to lose weight, recommends diets, nearby restaurants and gyms as well as effective physical exercises.An app that acts as a fitness trainer. It reminds you of your plan to lose weight, recommends diets, nearby restaurants and gyms as well as effective physical exercises.An app that acts as a fitness trainer. It reminds you of your plan to lose weight, recommends diets, nearby restaurants and gyms as well as effective physical exercises.An app that acts as a fitness trainer. It reminds you of your plan to lose weight, recommends diets, nearby restaurants and gyms as well as effective physical exercises.",
  source: "KKM",
  website: "www.website.com/hello",
  email: "marsyam83@gmail.com",
};

const CommunityProductsModal: FunctionComponent<CommunityProductsModalProps> = ({
  hide,
  loading,
  show,
  product,
}) => {
  const { t } = useTranslation(["community-products"]);
  const diffInDays =
    product && DateTime.now().diff(DateTime.fromISO(product.date_approved), ["days"]);

  return (
    <>
      {product && (
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
                      "border-outline shadow-floating dark:border-outlineHover-dark max-h-[100vh] w-full max-w-4xl transform overflow-hidden rounded-xl border bg-white text-left align-middle font-sans transition-all dark:bg-black sm:max-h-[90vh]"
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
                          className="border-outline flex items-start border-b p-6 pb-6 text-black dark:text-white"
                        >
                          <div className="flex flex-1 flex-col gap-1.5">
                            <p className="text-lg font-bold">{product.product_name}</p>
                            <div className="flex items-center gap-1.5 text-sm font-medium">
                              <p
                                className={clx(
                                  "text-primary",
                                  diffInDays.days < 14 ? "opacity-100" : "opacity-0"
                                )}
                              >
                                {t("new")}
                              </p>
                              {diffInDays.days < 14 && (
                                <div className="bg-dim h-1 w-1 rounded-full" />
                              )}
                              <p className="text-dim capitalize">
                                {t(`product_type.${product.product_type}`)}
                              </p>
                              <div className="bg-dim h-1 w-1 rounded-full" />
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
                        <div className="hide-scrollbar flex h-[85vh] flex-col gap-8 overflow-scroll p-6 sm:h-full sm:flex-row">
                          <div className="gap-4.5 flex flex-col">
                            <div className="bg-background border-outline relative flex h-full w-full items-center rounded-lg border sm:h-[300px] sm:w-[300px]">
                              <Image
                                src={product.image || "/static/images/og_en-GB.png"}
                                width={600}
                                height={600}
                                alt={product.product_name}
                              />
                            </div>
                            {Object.entries(product).map(([key, value]) => {
                              if (key === "email" || key === "product_link") {
                                return (
                                  <div className="flex flex-col gap-1 text-base text-black">
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
                                      <p className="text-primary group-hover:underline">{value}</p>
                                    </At>
                                  </div>
                                );
                              }
                            })}
                          </div>
                          <div className="hide-scrollbar flex h-full flex-1 flex-col gap-6 overflow-y-visible sm:h-[70vh] sm:overflow-y-scroll">
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
