import { At, AgencyBadge, Hero } from "@components/index";
import { SOCSOIcon } from "@components/Icon/agency";
import Progress from "@components/Progress";
import { useTranslation } from "@hooks/useTranslation";
import { clx } from "@lib/helpers";
import { routes } from "@lib/routes";
import { useRouter } from "next/router";
import { FunctionComponent, ReactNode } from "react";

interface LabourLayoutProps {
  children: ReactNode;
  last_updated: string;
}

const LabourLayout: FunctionComponent<LabourLayoutProps> = ({ children, last_updated }) => {
  const { t } = useTranslation(["dashboard-high-frequency-labour-data", "common"]);
  const { pathname } = useRouter();

  const labour_navs = [
    {
      name: t("job_losses"),
      url: routes.HIGH_FREQUENCY_LABOUR_DATA.concat("/job-losses"),
    },
    {
      name: t("job_placements"),
      url: routes.HIGH_FREQUENCY_LABOUR_DATA.concat("/job-placements"),
    },
    {
      name: t("job_seekers"),
      url: routes.HIGH_FREQUENCY_LABOUR_DATA.concat("/job-seekers"),
    },
    {
      name: t("job_vacancies"),
      url: routes.HIGH_FREQUENCY_LABOUR_DATA.concat("/job-vacancies"),
    },
  ];

  return (
    <div>
      <Progress />
      <Hero
        background="blue"
        category={[t("common:categories.economy"), "text-primary dark:text-primary-dark"]}
        header={[t("header")]}
        description={[t("description")]}
        last_updated={last_updated}
        agencyBadge={
          <AgencyBadge
            agency={t("agencies:perkeso.full")}
            link="https://www.perkeso.gov.my/en/"
            icon={<SOCSOIcon />}
          />
        }
      />

      {/* Navigations */}
      <div
        className={clx(
          "border-b-outline dark:border-b-washed-dark hide-scrollbar sticky top-14 z-20 flex flex-row gap-2 overflow-x-auto border-b bg-white px-3 dark:bg-black sm:justify-center md:pl-0 lg:static"
        )}
      >
        {labour_navs.map(nav => (
          <At
            className={clx(
              "flex flex-row items-center gap-1 whitespace-nowrap px-2 py-3 text-center text-base font-medium transition lg:p-4",
              pathname.startsWith(nav.url)
                ? "border-primary dark:border-primary-dark border-b-2 text-black dark:text-white"
                : "text-dim"
            )}
            key={nav.url}
            href={nav.url}
            scrollTop={false}
          >
            {nav.name}
          </At>
        ))}
      </div>

      {/* Content */}
      {children}
    </div>
  );
};

export default LabourLayout;
