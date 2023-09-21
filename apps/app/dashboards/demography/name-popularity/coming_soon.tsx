import { FunctionComponent } from "react";
import { useTranslation } from "datagovmy-ui/hooks";

import { DateTime } from "luxon";

const ComingSoon: FunctionComponent = () => {
  const { t, i18n } = useTranslation(["dashboard-name-popularity"]);
  const event = new Date(Date.UTC(2023, 9, 12, 0, 0, 0));

  return (
    <div className="flex h-[400px] items-center justify-center">
      <div className="text-dim dark:border-washed-dark mx-auto flex max-w-prose flex-col gap-y-6 rounded-xl border px-3 py-6 sm:px-9">
        <h4 className="mx-auto">{t("coming_soon.index")}</h4>
        <span>
          <span className="text-primary dark:text-primary-dark">{t("header")}</span>
          {t("coming_soon.text_1")}
        </span>
        <span>
          {t("coming_soon.text_2")}
          <span className="font-medium text-black dark:text-white">
            {DateTime.fromJSDate(event).setLocale(i18n.language).toFormat("dd MMM yyyy (cccc)")}
          </span>
        </span>
        <span className="mx-auto">{t("coming_soon.stay_tuned")}</span>
      </div>
    </div>
  );
};

export default ComingSoon;
