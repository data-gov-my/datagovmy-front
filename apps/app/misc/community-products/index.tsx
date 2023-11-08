import { XMarkIcon } from "@heroicons/react/24/solid";
import {
  Button,
  ComboBox,
  Container,
  Dropdown,
  NumberedPagination,
  Section,
  Spinner,
} from "datagovmy-ui/components";
import { useData, useTranslation } from "datagovmy-ui/hooks";
import { OptionType } from "datagovmy-ui/types";
import { FunctionComponent } from "react";
import CommunityProductsCard from "./card";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/20/solid";

export type ComminityProductsItem = {
  id: number;
  title: string;
  date: string;
  type: "app";
  description: string;
  image: string;
};

// Dummy items for the page
const dropdown: Array<ComminityProductsItem> = [
  {
    id: 1,
    title: "CHIPTA 2020 : BAZ apps",
    type: "app",
    date: "2023-11-07",
    description:
      "Aplikasi dapat membantu ibu bapa mendapatkan maklumat berkaitan taska, pengasuh dan perkhidmatan yang ditawarkan.",
    image: "/static/images/og_en-GB.png",
  },
  {
    id: 2,
    title: "CHIPTA 2020 : Digital Therapeutics",
    type: "app",
    date: "2021-04-09",
    description:
      "Membangunkan aplikasi telefon pintar 'My Transplant Diary' untuk meningkatkan swadaya pesakit buah pinggang melalui mekanisma sokongan pesakit dan perkongsian pengalaman",
    image: "/static/images/og_en-GB.png",
  },
  {
    id: 3,
    title: "CHIPTA 2020 : PGAD",
    type: "app",
    date: "2023-11-03",
    description:
      "1. Pemetaan maklumat dadah2. Pemetaan lokasi dan kawasan berisiko3. Pelaporan/Statistik kepada stakeholder4. Merancang program kesedaran yang sesuai5. Pengintegrasian dengan maklumat penduduk",
    image: "/static/images/og_en-GB.png",
  },
  {
    id: 4,
    title: "CHIPTA 2020 : DuoFlex",
    type: "app",
    date: "2023-10-24",
    description:
      "1. Menambahbaik kadar kitar semula negara. 2. Menggalakkan rutin lestari di kalangan rakyat Malaysia.3. Mendigitalkan industri kitar semula negara",
    image: "/static/images/og_en-GB.png",
  },
  {
    id: 5,
    title: "CHIPTA 2020 : Dominator Innovation Team",
    type: "app",
    date: "2021-04-09",
    description:
      "Memastikan setiap pelajar berjaya mendapatkan pendidikan berkualiti secara percuma serta suasana pembelajaran yang relevan disamping menaik taraf sistem pendidikan di Malaysia.",
    image: "/static/images/og_en-GB.png",
  },
  {
    id: 6,
    title: "CHIPTA 2020 : Seedoo.my",
    type: "app",
    date: "2021-04-09",
    description:
      "Membantu petani menjadi 'broker' sendiri agar mereka boleh mengakses tanpa menggunakan orang tengah ke pasaran pertanian dan petani juga boleh menetapkan harga tanaman mereka dengan kadar yang lebih kompetitif.",
    image: "/static/images/og_en-GB.png",
  },
  {
    id: 7,
    title: "CHIPTA 2020 : Lestari",
    type: "app",
    date: "2021-04-09",
    description:
      "Memangkin kelestarian inovasi dalam industri SME seiring dengan norma baharu serta menyediakan kemudahan “marketplace” untuk mempromosi produk kepada pihak kerajaan / GLC / MNC",
    image: "/static/images/og_en-GB.png",
  },
];

const CommunityProductsDashboard: FunctionComponent = () => {
  const { t, i18n } = useTranslation(["community-products"]);

  const { data, setData } = useData({
    loading: false,
    modal_loading: false,
    // pub: pub,
    search_query: dropdown[0].id,
    type: "",
    year: "",
    page: 1,
  });

  const PRODUCTS_OPTIONS: OptionType[] = dropdown.map(e => ({
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
  return (
    <>
      <Container
        background="bg-gradient-radial from-outline to-background dark:from-washed-dark dark:to-black"
        className="dark:border-outlineHover-dark border-b"
      >
        <div className="mx-auto flex flex-col items-center gap-3 py-12">
          <h2 className="text-center text-black">{t("header")}</h2>
          <p className="text-dim text-center">{t("description")}</p>
          <Button variant="primary" className="mt-3 w-fit text-center">
            {t("request_to_feature")}
          </Button>
        </div>
      </Container>
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

          <div className="hidden gap-x-2 md:flex md:items-center md:justify-center">
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
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
                  {dropdown.map((item: ComminityProductsItem) => (
                    <CommunityProductsCard item={item} />
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
                    totalPage={11}
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
                    disabled={data.page === 11}
                  >
                    {t("common:common.next")}
                    <ChevronRightIcon className="h-4.5 w-4.5" />
                  </Button>
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
