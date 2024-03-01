import { XMarkIcon } from "@heroicons/react/24/solid";
import {
  Button,
  ComboBox,
  Container,
  Dropdown,
  Input,
  Label,
  Modal,
  NumberedPagination,
  Radio,
  Section,
  Spinner,
} from "datagovmy-ui/components";
import { useData, useFilter, useTranslation, useWatch } from "datagovmy-ui/hooks";
import { OptionType } from "datagovmy-ui/types";
import { FunctionComponent, useCallback, useEffect } from "react";
import CommunityProductsCard from "./card";
import {
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/20/solid";
import CommunityProductsModal from "./modal";
import { CommunityProductsItem } from "pages/community-products/[[...product_id]]";
import { useRouter } from "next/router";
import { routes } from "@lib/routes";
import { RequestFeatureModal } from "./request-feature-modal";
import { debounce } from "lodash";
import { NotFoundIcon } from "datagovmy-ui/icons";

export const product_type: string[] = [
  "web_application",
  "mobile_application",
  "dashboard",
  "academic_publication",
  "machine_learning",
  "analytics",
];

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
  const { t } = useTranslation(["community-products", "catalogue"]);
  const { push, events } = useRouter();

  const { data, setData } = useData({
    loading: false,
    modal_loading: false,
    show: false,
    show_feature_request: false,
    search_query: query.search ? query.search : "",
  });

  const { filter, setFilter, actives, queries } = useFilter({
    search: query.search ? query.search : "",
    product_type: query.product_type
      ? { label: t(`product_type.${query.product_type}`), value: query.product_type }
      : undefined,
    product_year: query.product_year
      ? { label: query.product_year, value: query.product_year }
      : undefined,
    page: query.page ?? "1",
  });

  const PRODUCT_TYPE: OptionType[] = product_type.map(type => ({
    label: t(`product_type.${type}`),
    value: type,
  }));

  const PRODUCT_YEAR: OptionType[] = [
    { label: "2024", value: "2024" },
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

  const handleSearch = useCallback(
    debounce((query: string) => {
      setFilter("search", query.trim());
      setFilter("page", "1");
    }, 500),
    []
  );

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
            <Input
              name="search"
              icon={<MagnifyingGlassIcon className="h-5 w-5" />}
              value={data.search_query}
              className="h-12 rounded-full"
              placeholder={t("select_publication")}
              onChange={query => {
                setData("search_query", query);
                handleSearch(query);
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
                    {actives.filter(e => !(e.includes("page") || e.includes("search"))).length}
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
                      value={filter.product_type}
                      onChange={e => {
                        setData("loading", true);
                        setFilter("product_type", e);
                        setFilter("page", "1");
                      }}
                    />
                  </div>
                  <div className="py-3">
                    <Radio
                      name="year"
                      label={"Year"}
                      options={PRODUCT_YEAR}
                      value={filter.product_year}
                      onChange={e => {
                        setData("loading", true);
                        setFilter("product_year", e);
                        setFilter("page", "1");
                      }}
                    />
                  </div>
                  <div className="dark:border-washed-dark fixed bottom-0 left-0 flex w-full flex-col gap-3 border-t bg-white p-3 dark:bg-black">
                    <Button
                      variant="primary"
                      className="w-full justify-center"
                      disabled={!actives.filter(e => !e.includes("page")).length}
                      onClick={() => {
                        setData("loading", true);
                        setFilter("product_year", undefined);
                        setFilter("product_type", undefined);
                      }}
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
            <span className="text-dim">{t("filter_by")}</span>
            <Dropdown
              anchor="left"
              width="w-fit"
              options={PRODUCT_TYPE}
              placeholder={"Product type"}
              selected={PRODUCT_TYPE.find(e => e.value === filter.product_type?.value) ?? undefined}
              onChange={e => {
                setData("loading", true);
                setFilter("product_type", e);
                setFilter("page", "1");
              }}
            />
            <Dropdown
              anchor="left"
              width="w-fit"
              placeholder={"Year"}
              options={PRODUCT_YEAR}
              selected={PRODUCT_YEAR.find(e => e.value === filter.product_year?.value) ?? undefined}
              onChange={e => {
                setData("loading", true);
                setFilter("product_year", e);
                setFilter("page", "1");
              }}
            />
            {actives.length > 0 &&
              actives.findIndex(active => !["page", "search"].includes(active[0])) !== -1 && (
                <Button
                  variant="ghost"
                  className="group"
                  disabled={!actives.length}
                  onClick={() => {
                    setData("loading", true);
                    setFilter("product_year", undefined);
                    setFilter("product_type", undefined);
                  }}
                >
                  <XMarkIcon className="text-dim h-5 w-5 group-hover:text-black dark:group-hover:text-white" />
                  {t("common:common.clear_all")}
                </Button>
              )}
          </div>
          <Section>
            {data.loading ? (
              <div className="flex h-[300px] w-full items-center justify-center">
                <Spinner loading={data.loading} className="border-t-primary" />
              </div>
            ) : products.length > 0 ? (
              <div>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
                  {products.map(item => (
                    <CommunityProductsCard
                      key={item.id}
                      item={item}
                      onClick={() => {
                        setData("show", true);
                        setData("modal_loading", true);
                        push(
                          routes.COMMUNITY_PRODUCTS.concat("/", item.id.toString()),
                          routes.COMMUNITY_PRODUCTS.concat("/", item.id.toString()),
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
                      setData("loading", true);
                      setFilter("page", `${+filter.page - 1}`);
                    }}
                    disabled={filter.page === "1"}
                  >
                    <ChevronLeftIcon className="h-4.5 w-4.5" />
                    {t("common:common.previous")}
                  </Button>

                  <NumberedPagination
                    currentPage={Number(filter.page)}
                    totalPage={Math.ceil(total_products / 9)}
                    setPage={newPage => {
                      setData("loading", true);
                      setFilter("page", newPage.toString());
                    }}
                  />
                  <Button
                    variant="default"
                    className="btn-disabled"
                    onClick={() => {
                      setData("loading", true);
                      setFilter("page", `${+filter.page + 1}`);
                    }}
                    disabled={filter.page === Math.ceil(total_products / 9).toString()}
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
                    push(
                      routes.COMMUNITY_PRODUCTS.concat(actives.length ? queries : ""),
                      undefined,
                      {
                        scroll: false,
                      }
                    );
                  }}
                  product={product}
                />
              </div>
            ) : (
              <div className="flex w-full flex-col items-center justify-center gap-6 py-12">
                <NotFoundIcon />
                <div className="flex flex-col items-center gap-3">
                  <p className="font-bold">No product found</p>
                  <p className="text-dim text-sm">Try again with different keyword or filter.</p>
                </div>
              </div>
            )}
          </Section>
        </Section>
      </Container>
    </>
  );
};

export default CommunityProductsDashboard;
