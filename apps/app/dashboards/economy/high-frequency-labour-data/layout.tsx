import Progress from "@components/Progress";
import { routes } from "@lib/routes";
import { At, AgencyBadge, Hero } from "datagovmy-ui/components";
import { clx } from "datagovmy-ui/helpers";
import { useTranslation } from "datagovmy-ui/hooks";
import { useRouter } from "next/router";
import { FunctionComponent, ReactNode } from "react";

/**
 * High Frequency Labour Data Layout
 * @overview Status: Live
 */

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
    <>
      {/* <Progress /> */}
      <Hero
        background="blue"
        category={[t("common:categories.economy"), "text-primary dark:text-primary-dark"]}
        header={[t("header")]}
        description={[t("description")]}
        last_updated={last_updated}
        agencyBadge={<AgencyBadge agency="perkeso" />}
      />

      {/* Navigations */}
      <nav className="border-b-outline dark:border-b-washed-dark sticky top-14 z-20 flex overflow-hidden border-b bg-white dark:bg-black min-[350px]:justify-center lg:static">
        <div
          className={clx(
            "hide-scrollbar flex snap-x snap-mandatory scroll-px-9 flex-nowrap overflow-x-auto max-[420px]:justify-center",
            pathname.endsWith("/job-seekers") && "max-[350px]:justify-center",
            pathname.endsWith("/job-vacancies") && "max-[350px]:justify-end"
          )}
        >
          {labour_navs.map(nav =>
            nav.url.endsWith("/job-losses") ? (
              <div key={nav.url} className="snap-start">
                <At
                  className="flex h-full min-w-[56px] cursor-pointer items-center justify-center px-3 outline-none"
                  href={nav.url}
                  scrollTop={false}
                >
                  <div className="relative flex h-full flex-col items-center justify-center py-4">
                    <div
                      className={clx(
                        "flex items-center gap-2",
                        pathname.startsWith(nav.url) ? "text-black dark:text-white" : "text-dim"
                      )}
                    >
                      <span className="whitespace-nowrap text-base font-medium">{nav.name}</span>
                    </div>
                    {pathname.startsWith(nav.url) && (
                      <div className="bg-primary dark:bg-primary-dark absolute bottom-0 inline-flex h-1 w-full min-w-[56px] rounded-full"></div>
                    )}
                  </div>
                </At>
              </div>
            ) : (
              <div
                className={clx(
                  "text-dim flex snap-start flex-row items-center gap-1 whitespace-nowrap px-2 py-3 text-center font-medium transition lg:p-4"
                )}
                key={nav.url}
              >
                {nav.name}
              </div>
            )
          )}
        </div>
      </nav>
      {/* Content */}
      {children}
    </>
  );
};

export default LabourLayout;
