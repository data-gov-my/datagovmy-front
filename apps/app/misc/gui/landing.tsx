import { useData, useTranslation } from "datagovmy-ui/hooks";
import { FunctionComponent, useState } from "react";
import { CheckCircleIcon, LinkIcon, TableCellsIcon, UserIcon } from "@heroicons/react/20/solid";
import { At, Button } from "datagovmy-ui/components";
import { routes } from "@lib/routes";
import GUIDCLayout from "./layout";
import StepAuth from "./step-auth";
import StepBasic from "./step-basic";
import { DateTime } from "luxon";
import StepCatalogue from "./step-catalogue";

/**
 * GUI Data Catalogue Landing Page
 * @overview Status: Live
 */

interface GUIDCLandingProps {
  sources: string[];
}

const GUIDCLanding: FunctionComponent<GUIDCLandingProps> = ({ sources }) => {
  const { t } = useTranslation("gui-data-catalogue");
  const [index, setIndex] = useState(0);

  const { data, setData, reset } = useData({
    link_csv: "",
    link_parquet: "",
    link_preview: "",
    title_en: "",
    title_ms: "",
    description_en: "",
    description_ms: "",
    file_name: "",
    frequency: "",
    demography: [],
    geography: [],
    dataset_start: DateTime.now().year,
    dataset_end: DateTime.now().year,
    data_source: [],
  });
  const { data: validation, setData: setValidation } = useData(
    Object.fromEntries(Object.entries(data).map(([key]) => [key, false]))
  );

  const STEPS = [
    {
      icon: UserIcon,
      name: t("step_auth.name"),
      desc: t("step_auth.desc"),
      content: <StepAuth setIndex={setIndex} />,
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
        />
      ),
    },
    {
      icon: TableCellsIcon,
      name: t("step_catalogue.name"),
      desc: t("step_catalogue.desc"),
      content: (
        <StepCatalogue
          setIndex={setIndex}
          sources={sources}
          data={data}
          setData={setData}
          validation={validation}
          setValidation={setValidation}
        />
      ),
    },
  ];

  if (index === 3) {
    return (
      <div className="p-4.5 flex min-h-[90dvh] flex-col items-center justify-center gap-6 sm:gap-8">
        <div className="flex flex-col items-center gap-y-6">
          <CheckCircleIcon className="size-[72px] text-green-600" />
          <div className="space-y-3 text-center sm:w-[450px]">
            <h2 className="text-black dark:text-white">{t("success")}</h2>
            <p className="text-dim text-sm">
              {t("success_desc")}{" "}
              <span className="text-primary dark:text-primary-dark">notif@opendosm.my</span>.
            </p>
          </div>
        </div>
        <At
          className="btn-primary shadow-button w-full justify-center sm:w-fit"
          href={routes.GUI_CATALOGUE}
        >
          {t("return")}
        </At>
      </div>
    );
  }

  return (
    <GUIDCLayout
      currentIndex={index}
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
