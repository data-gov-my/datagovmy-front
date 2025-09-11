import { useTranslation } from "datagovmy-ui/hooks";
import { FunctionComponent, useState } from "react";
import { CheckCircleIcon, NewspaperIcon, UserIcon } from "@heroicons/react/20/solid";
import { At } from "datagovmy-ui/components";
import { routes } from "@lib/routes";
import GUIDCLayout from "./layout";
import StepAuth from "./step-auth";
import StepBasic from "./step-basic";

/**
 * GUI Data Catalogue Landing Page
 * @overview Status: Live
 */

interface GUIDCLandingProps {
  sources: string[];
}

const GUIDCLanding: FunctionComponent<GUIDCLandingProps> = ({ sources }) => {
  const { t } = useTranslation("publication-subscription");
  const [index, setIndex] = useState(0);

  const STEPS = [
    {
      icon: CheckCircleIcon,
      name: t("step_auth.name"),
      desc: t("step_auth.desc"),
      content: <StepAuth setIndex={setIndex} />,
    },
    {
      icon: UserIcon,
      name: t("step_basic.name"),
      desc: t("step_basic.desc"),
      content: <StepBasic setIndex={setIndex} sources={sources} />,
    },
    {
      icon: NewspaperIcon,
      name: t("step_gui.name"),
      desc: t("step_gui.desc"),
      content: null,
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
    <GUIDCLayout header={t("header")} currentIndex={index} steps={STEPS}>
      {STEPS[index].content}
    </GUIDCLayout>
  );
};

export default GUIDCLanding;
