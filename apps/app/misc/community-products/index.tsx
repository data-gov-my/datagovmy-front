import { XMarkIcon } from "@heroicons/react/24/solid";
import {
  Button,
  ComboBox,
  Container,
  Dropdown,
  Label,
  Modal,
  NumberedPagination,
  Radio,
  Section,
  Spinner,
} from "datagovmy-ui/components";
import { useData, useTranslation, useWatch } from "datagovmy-ui/hooks";
import { OptionType } from "datagovmy-ui/types";
import { FunctionComponent, useEffect } from "react";
import CommunityProductsCard from "./card";
import { ChevronDownIcon, ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/20/solid";
import CommunityProductsModal from "./modal";
import { CommunityProductsItem } from "pages/community-products/[[...product_id]]";
import { useRouter } from "next/router";
import { routes } from "@lib/routes";
import { RequestFeatureModal } from "./request-feature-modal";

interface CommunityProductsDashboardProps {
  params: any;
  query: any;
  total_products: number;
  products: Array<CommunityProductsItem>;
  product: CommunityProductsItem;
}

const CommunityProductsDashboard: FunctionComponent<CommunityProductsDashboardProps> = ({
  params,
  query,
  total_products,
  product,
  products,
}) => {
  const { t, i18n } = useTranslation(["community-products, catalogue"]);
  const { push, events } = useRouter();

  const { data, setData } = useData({
    loading: false,
    modal_loading: false,
    show: false,
    show_feature_request: false,
    search_query: "",
    type: "",
    year: "",
    page: 1,
  });

  const PRODUCTS_OPTIONS: OptionType[] = products.map(e => ({
    label: e.title,
    value: e.id.toString(),
  }));

  const PRODUCT_TYPE: OptionType[] = [{ label: "App", value: "app" }];
  const PRODUCT_YEAR: OptionType[] = [
    { label: "2023", value: "2023" },
    { label: "2022", value: "2022" },
    { label: "2021", value: "2021" },
    { label: "2020", value: "2020" },
  ];

  useEffect(() => {
    if (product) {
      setData("show", true);
    }
    events.on("routeChangeComplete", () => {
      setData("loading", false);
      setData("modal_loading", false);
    });
    return () => {
      events.off("routeChangeComplete", () => {
        setData("loading", false);
        setData("modal_loading", false);
      });
    };
  }, [product]);

  useWatch(() => {
    data.show
      ? (document.body.style.overflow = "hidden")
      : (document.body.style.overflow = "unset");
  }, [data.show]);

  return (
    <>
      <Container
        background="bg-gradient-radial from-outline to-background dark:from-washed-dark dark:to-black"
        className="dark:border-outlineHover-dark border-b"
      >
        <div className="mx-auto flex flex-col items-center gap-3 py-12">
          <h2 className="text-center text-black">{t("header")}</h2>
          <p className="text-dim text-center">{t("description")}</p>
          <Button
            onClick={() => setData("show_feature_request", true)}
            variant="primary"
            className="mt-3 w-fit text-center"
          >
            {t("request_to_feature")}
          </Button>
        </div>
      </Container>
      <RequestFeatureModal
        show={data.show_feature_request}
        hide={() => {
          setData("show_feature_request", false);
        }}
      />
      <Container>
        <Section>
          <h4 className="text-center">{t("section_title")}</h4>
          <div className="mx-auto w-full py-6 sm:w-[434px]">
            <ComboBox
              placeholder={t("select_publication")}
              options={PRODUCTS_OPTIONS}
              selected={
                data.search_query ? PRODUCTS_OPTIONS.find(e => e.value === data.search_query) : null
              }
              onChange={selected => {
                if (selected) {
                  // setData("loading", true);
                  // setFilter("pub_type", selected.value);
                  // setFilter("page", "1");
                  setData("search_query", selected.value);
                } else {
                  // setFilter("pub_type", null);
                  setData("search_query", null);
                }
              }}
            />
          </div>

          {/* Mobile */}
          <div className="flex w-full justify-end sm:hidden">
            <Modal
              trigger={open => (
                <Button onClick={open} variant="default" className="shadow-floating">
                  <span>{t("catalogue:filter")}</span>
                  <span className="w-4.5 bg-primary dark:bg-primary-dark h-5 rounded-md text-center text-white">
                    {/* {actives.filter(e => !e.includes("page")).length} */}0
                  </span>
                  <ChevronDownIcon className="-mx-[5px] h-5 w-5" />
                </Button>
              )}
              title={<Label label={t("catalogue:filter") + ":"} className="text-sm font-bold" />}
            >
              {close => (
                <div className="px-4.5 dark:divide-washed-dark mb-[100px] flex h-max flex-col divide-y overflow-y-auto bg-white dark:bg-black">
                  <div className="py-3">
                    <Radio
                      name="type"
                      label={"Product Type"}
                      options={PRODUCT_TYPE}
                      value={data.type}
                      onChange={e => {
                        // setData("loading", true);
                        setData("type", e.value);
                        // setFilter("frequency", e);
                        // setFilter("page", "1");
                      }}
                    />
                  </div>
                  <div className="py-3">
                    <Radio
                      name="year"
                      label={"Year"}
                      options={PRODUCT_YEAR}
                      value={data.year}
                      onChange={e => {
                        // setData("loading", true);
                        setData("year", e.value);
                        // setFilter("frequency", e);
                        // setFilter("page", "1");
                      }}
                    />
                  </div>
                  <div className="dark:border-washed-dark fixed bottom-0 left-0 flex w-full flex-col gap-3 border-t bg-white p-3 dark:bg-black">
                    <Button
                      variant="primary"
                      className="w-full justify-center"
                      // disabled={!actives.filter(e => !e.includes("page")).length}
                      disabled={true}
                      // onClick={() => {
                      //   setData("loading", true);
                      //   reset();
                      // }}
                    >
                      {t("common:common.reset")}
                    </Button>
                    <Button className="btn w-full justify-center px-3 py-1.5" onClick={close}>
                      <XMarkIcon className="h-5 w-5" />
                      {t("common:common.close")}
                    </Button>
                  </div>
                </div>
              )}
            </Modal>
          </div>

          <div className="hidden gap-x-2 sm:flex sm:items-center sm:justify-center">
            <span className="text-dim">{t("filter_by")}:</span>
            <Dropdown
              anchor="left"
              width="w-fit"
              options={PRODUCT_TYPE}
              placeholder={"Product type"}
              selected={PRODUCT_TYPE.find(e => e.value === data.type) ?? undefined}
              onChange={e => {
                // setData("loading", true);
                setData("type", e.value);
                // setFilter("frequency", e);
                // setFilter("page", "1");
              }}
            />
            <Dropdown
              anchor="left"
              width="w-fit"
              placeholder={"Year"}
              options={PRODUCT_YEAR}
              selected={PRODUCT_YEAR.find(e => e.value === data.year) ?? undefined}
              onChange={e => {
                // setData("loading", true);
                setData("year", e.value);
                // setFilter("geography", e);
                // setFilter("page", "1");
              }}
            />
            {/* {actives.length > 0 &&
                actives.findIndex(active => !["page"].includes(active[0])) !== -1 && (
                  <Button
                    variant="ghost"
                    className="group"
                    disabled={!actives.length}
                    onClick={() => {
                      setData("loading", true);
                      reset();
                    }}
                  >
                    <XMarkIcon className="text-dim h-5 w-5 group-hover:text-black dark:group-hover:text-white" />
                    {t("common:common.clear_all")}
                  </Button>
                )} */}
            <Button
              variant="ghost"
              className="group"
              disabled={true}
              onClick={() => {
                setData("loading", true);
                // reset();
              }}
            >
              <XMarkIcon className="text-dim h-5 w-5 group-hover:text-black dark:group-hover:text-white" />
              {t("common:common.clear_all")}
            </Button>
          </div>
          <Section>
            {data.loading ? (
              <div className="flex h-[300px] w-full items-center justify-center">
                <Spinner loading={data.loading} className="border-t-primary" />
              </div>
            ) : (
              <div>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
                  {products.map(item => (
                    <CommunityProductsCard
                      item={item}
                      onClick={() => {
                        setData("show", true);
                        setData("modal_loading", true);
                        push(
                          routes.COMMUNITY_PRODUCTS.concat("/", item.id),
                          routes.COMMUNITY_PRODUCTS.concat("/", item.id),
                          { scroll: false }
                        );
                      }}
                    />
                  ))}
                </div>
                <div className="flex items-center justify-center gap-4 pt-8 text-sm font-medium">
                  <Button
                    className="btn-disabled"
                    variant="default"
                    onClick={() => {
                      // setData("loading", true);
                      // setFilter("page", `${+filter.page - 1}`);
                      setData("page", data.page - 1);
                    }}
                    disabled={data.page === 1}
                  >
                    <ChevronLeftIcon className="h-4.5 w-4.5" />
                    {t("common:common.previous")}
                  </Button>

                  <NumberedPagination
                    currentPage={data.page}
                    totalPage={total_products}
                    setPage={newPage => setData("page", newPage)}
                  />
                  <Button
                    variant="default"
                    className="btn-disabled"
                    onClick={() => {
                      // setData("loading", true);
                      // setFilter("page", `${+filter.page + 1}`);
                      setData("page", data.page + 1);
                    }}
                    disabled={data.page === total_products}
                  >
                    {t("common:common.next")}
                    <ChevronRightIcon className="h-4.5 w-4.5" />
                  </Button>
                </div>

                <CommunityProductsModal
                  show={data.show}
                  loading={data.loading}
                  hide={() => {
                    setData("show", false);
                    push(routes.COMMUNITY_PRODUCTS, undefined, {
                      scroll: false,
                    });
                  }}
                  product={product}
                />
              </div>
            )}
          </Section>
        </Section>
      </Container>
    </>
  );
};

export default CommunityProductsDashboard;
