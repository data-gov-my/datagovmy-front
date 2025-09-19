import { useData, useTranslation } from "datagovmy-ui/hooks";
import { FunctionComponent, useMemo, useState } from "react";
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

interface GUIDCLandingProps {
  sources: string[];
  categoryEn: CatalogueCategory;
  categoryMs: CatalogueCategory;
}

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
  publication_en: "",
  publication_ms: "",
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

const GUIDCLanding: FunctionComponent<GUIDCLandingProps> = ({
  sources,
  categoryEn,
  categoryMs,
}) => {
  const { t } = useTranslation("gui-data-catalogue");
  const [index, setIndex] = useState(0);

  const { data, setData, reset } = useData({
    ...DEFAULT_STATE,
  });
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
          setIndex(1);
          reset(DEFAULT_STATE);
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
