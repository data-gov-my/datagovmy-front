import { At } from "datagovmy-ui/components";
import { FunctionComponent } from "react";
import { useTranslation } from "datagovmy-ui/hooks";

const RapidBusRailComingSoon: FunctionComponent = () => {
  const { t, i18n } = useTranslation(["dashboard-rapid-bus-and-rail-explorer", "common"]);
  const event = new Date(Date.UTC(2023, 8, 22, 0, 0, 0));

  return (
    <div className="flex h-[400px] items-center justify-center">
      <div className="text-dim mx-auto flex max-w-prose flex-col gap-y-6 rounded-xl border px-3 py-6 sm:px-9">
        <h4 className="mx-auto">{t("coming_soon")}</h4>
        <span>
          {t("the")}
          <span className="text-primary dark:text-primary-dark">{t("header")}</span>
          {t("overview")}
        </span>
        <span>
          {t("on")}
          <span className="font-medium text-black dark:text-white">
            {`${event.toLocaleDateString(i18n.language, {
              year: "numeric",
              month: "long",
              day: "numeric",
            })} (${event.toLocaleDateString(i18n.language, { weekday: "long" })})`}
          </span>
          {", "}
          <At href="/" className="link-primary">
            data.gov.my
          </At>
          {t("live")}
        </span>
        <span className="mx-auto">{t("stay_tuned")}</span>
      </div>
    </div>
  );
};

export default RapidBusRailComingSoon;
