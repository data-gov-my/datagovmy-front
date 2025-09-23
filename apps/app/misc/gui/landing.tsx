import { useCache, useData, useTranslation } from "datagovmy-ui/hooks";
import { FunctionComponent, useEffect, useMemo, useState } from "react";
import { LinkIcon, TableCellsIcon, UserIcon } from "@heroicons/react/20/solid";
import { Button } from "datagovmy-ui/components";
import GUIDCLayout from "./layout";
import StepAuth from "./step-auth";
import StepBasic from "./step-basic";
import { DateTime } from "luxon";
import StepCatalogue from "./step-catalogue";
import { CatalogueProvider, DatasetType } from "datagovmy-ui/contexts/catalogue";
import { PublishDataCatalogueModal, usePublishDataCatalogue } from "./publish";

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

interface GUIDCLandingProps {}

const DEFAULT_STATE = {
  link_csv: "",
  link_parquet: "",
  link_preview: "",
  title_en: "",
  title_ms: "",
  description_en: "",
  description_ms: "",
  title_sort: 1,
  exclude_openapi: false,
  manual_trigger: "",
  data_as_of: "",
  file_name: "",
  frequency: "",
  geography: [],
  demography: [],
  dataset_begin: DateTime.now().year,
  dataset_end: DateTime.now().year,
  data_source: [],
  methodology_en: "",
  methodology_ms: "",
  caveat_en: "",
  caveat_ms: "",
  publication_en: "N/A",
  publication_ms: "N/A",
  related_datasets: [],
  last_updated: DateTime.now().toSQL(),
  next_update: "-",
  fields: [],
  translations_en: {},
  translations_ms: {},
  site_category: [],
  dataviz: [],

  // Specific for render
  data: [],
  selected_category: "",
};

const GUIDCLanding: FunctionComponent<GUIDCLandingProps> = ({}) => {
  const { t } = useTranslation("gui-data-catalogue");
  const [index, setIndex] = useState(0);
  const [categoryEn, setCategoryEn] = useState(null);
  const [categoryMs, setCategoryMs] = useState(null);
  const [sources, setSources] = useState(null);
  const { cache } = useCache();

  const { data, setData, reset } = useData({
    ...DEFAULT_STATE,
  });
  const {
    data: validation,
    setData: setValidation,
    reset: resetValidation,
  } = useData(Object.fromEntries(Object.entries(data).map(([key]) => [key, false])));

  useEffect(() => {
    const fetchCategory = async () => {
      if (!categoryEn && !categoryMs) {
        try {
          const response = await fetch("/api/data-catalogue/fetch-category");
          if (response.ok) {
            const data = await response.json();
            setCategoryEn(data.en);
            setCategoryMs(data.ms);
            setSources(data.agencies_source);
          } else {
            console.error("Failed to fetch categories");
          }
        } catch (error) {
          console.error("Error fetching categories:", error);
        }
      }
    };

    fetchCategory();
  }, []);

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
          sources={sources || []}
          data={data}
          setData={setData}
          validation={validation}
          setValidation={setValidation}
          categoryEn={categoryEn || {}}
          categoryMs={categoryMs || {}}
          cache={cache}
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
                json,
              });
            }}
            resetData={reset}
            cache={cache}
          />
        </CatalogueProvider>
      ),
    },
  ];

  if (!categoryEn && !categoryMs && !sources) {
    return null;
  }

  if (publishStatus !== null) {
    return (
      <PublishDataCatalogueModal
        status={publishStatus}
        onClickCreateAnotherPage={() => {
          resetPublish();
          setIndex(1);
          reset(DEFAULT_STATE);
          resetValidation();
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
            reset(DEFAULT_STATE);
            resetValidation();
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
