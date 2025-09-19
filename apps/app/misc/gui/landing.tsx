import { useData, useTranslation } from "datagovmy-ui/hooks";
import { FunctionComponent, useMemo, useState } from "react";
import { CheckCircleIcon, LinkIcon, TableCellsIcon, UserIcon } from "@heroicons/react/20/solid";
import { At, Button } from "datagovmy-ui/components";
import { routes } from "@lib/routes";
import GUIDCLayout from "./layout";
import StepAuth from "./step-auth";
import StepBasic from "./step-basic";
import { DateTime } from "luxon";
import StepCatalogue from "./step-catalogue";
import { CatalogueProvider, DatasetType } from "datagovmy-ui/contexts/catalogue";
import { PublishDataCatalogueModal, usePublishDataCatalogue } from "./publish";
import { useRouter } from "next/router";

/**
 * GUI Data Catalogue Landing Page
 * @overview Status: Live
 */

export type CatalogueCategory = Record<
  string,
  Array<{
    subcategory: string;
    category_sort: number;
    subcategory_sort: number;
  }>
>;

interface GUIDCLandingProps {
  sources: string[];
  categoryEn: CatalogueCategory;
  categoryMs: CatalogueCategory;
}

const STEPBASICDUMMY = {
  link_csv: "https://storage.data.gov.my/demography/births.csv",
  link_parquet: "https://storage.data.gov.my/demography/births.parquet",
  link_preview: "",
  title_en: "title",
  title_ms: "tajuk",
  description_en: "desc",
  description_ms: "kete",
  title_sort: 1,
  exclude_openapi: false,
  manual_trigger: "",
  data_as_of: DateTime.now().toSQL(),
  file_name: "annual",
  frequency: "YEARLY",
  geography: [{ label: "STATE", value: "STATE" }],
  demography: [
    { label: "AGE", value: "AGE" },
    { label: "SEX", value: "SEX" },
  ],
  dataset_begin: DateTime.now().year,
  dataset_end: DateTime.now().year,
  data_source: [{ label: "BNM", value: "BNM" }],
  methodology_en: "",
  methodology_ms: "",
  caveat_en: "",
  caveat_ms: "",
  publication_en: "",
  publication_ms: "",
  related_datasets: [],
  last_updated: DateTime.now().toSQL(),
  next_update: "-",
  fields: [],
  translations_en: {},
  translations_ms: {},
  site_category: [
    {
      site: "datagovmy",
      category_en: "Demography",
      category_ms: "Demografi",
      category_sort: 1,
      subcategory_en: "Births",
      subcategory_ms: "Kelahiran",
      subcategory_sort: 2,
    },
  ],
  dataviz: [],

  // Specific for render
  data: [],
  selected_category: "demography_births",
};

const GUIDCLanding: FunctionComponent<GUIDCLandingProps> = ({
  sources,
  categoryEn,
  categoryMs,
}) => {
  const { t } = useTranslation("gui-data-catalogue");
  const router = useRouter();
  const [index, setIndex] = useState(0);

  const { data, setData, reset } = useData({
    ...STEPBASICDUMMY,
  });
  // const { data, setData, reset } = useData({
  //   link_csv: "",
  //   link_parquet: "",
  //   link_preview: "",
  //   title_en: "",
  //   title_ms: "",
  //   description_en: "",
  //   description_ms: "",
  //   file_name: "",
  //   frequency: "",
  //   demography: [],
  //   geography: [],
  //   dataset_begin: DateTime.now().year,
  //   dataset_end: DateTime.now().year,
  //   data_source: [],
  // });
  const { data: validation, setData: setValidation } = useData(
    Object.fromEntries(Object.entries(data).map(([key]) => [key, false]))
  );

  const {
    publishDataCatalogue,
    status: publishStatus,
    reset: resetPublish,
  } = usePublishDataCatalogue();

  const dataset: DatasetType = useMemo(() => {
    return {
      type: "TABLE",
      chart: {},
      table: data.data || [],
      meta: {
        unique_id: data.id,
        title: data.title,
        desc: data.description,
      },
    };
  }, [data.data]);

  const STEPS = [
    {
      icon: UserIcon,
      name: t("step_auth.name"),
      desc: t("step_auth.desc"),
      content: <StepAuth onClickContinue={() => setIndex(1)} />,
    },
    {
      icon: LinkIcon,
      name: t("step_basic.name"),
      desc: t("step_basic.desc"),
      content: (
        <StepBasic
          setIndex={setIndex}
          sources={sources}
          data={data}
          setData={setData}
          validation={validation}
          setValidation={setValidation}
          categoryEn={categoryEn}
          categoryMs={categoryMs}
        />
      ),
    },
    {
      icon: TableCellsIcon,
      name: t("step_catalogue.name"),
      desc: t("step_catalogue.desc"),
      content: (
        <CatalogueProvider
          dataset={dataset}
          urls={{
            csv: data.link_csv,
            parquet: data.link_parquet,
          }}
        >
          <StepCatalogue
            data={data}
            setData={setData}
            validation={validation}
            setValidation={setValidation}
            onPublish={json => {
              publishDataCatalogue({
                fileName: `${data["file_name"]}.json`,
                data: window.btoa(json),
              });
            }}
          />
        </CatalogueProvider>
      ),
    },
  ];

  if (publishStatus !== null) {
    return (
      <PublishDataCatalogueModal
        status={publishStatus}
        onClickCreateAnotherPage={() => {
          resetPublish();
          // TODO: Properly reset state
          router.replace(routes.GUI_CATALOGUE);
        }}
      />
    );
  }

  return (
    <GUIDCLayout
      currentIndex={index}
      setIndex={setIndex}
      steps={STEPS}
      reset={
        <Button
          onClick={() => {
            setIndex(1);
            reset();
          }}
          variant="default"
          className="w-fit"
        >
          {t("reset")}
        </Button>
      }
    >
      {STEPS[index].content}
    </GUIDCLayout>
  );
};

export default GUIDCLanding;
