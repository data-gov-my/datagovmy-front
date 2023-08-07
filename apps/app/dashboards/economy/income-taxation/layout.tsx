import { At, AgencyBadge, Hero } from "datagovmy-ui/components";
import { LHDNIcon } from "datagovmy-ui/icons/agency";
import { useTranslation } from "datagovmy-ui/hooks";
import { clx } from "datagovmy-ui/helpers";
import { routes } from "@lib/routes";
import { useRouter } from "next/router";
import { FunctionComponent, ReactNode } from "react";

/**
 * Income Tax Layout
 * @overview Status: Live
 */

interface IncomeTaxationLayoutProps {
  children: ReactNode;
  last_updated: string;
}

const IncomeTaxationLayout: FunctionComponent<IncomeTaxationLayoutProps> = ({
  children,
  last_updated,
}) => {
  const { t } = useTranslation(["dashboard-income-taxation", "common"]);
  const { pathname } = useRouter();

  const INCOME_TAXATION_NAVS = [
    {
      name: t("overview"),
      url: routes.INCOME_TAXATION.concat("/overview"),
    },
    {
      name: t("individual_taxes"),
      url: routes.INCOME_TAXATION.concat("/individual-taxes"),
    },
    {
      name: t("rank_me"),
      url: routes.INCOME_TAXATION.concat("/rank-me"),
    },
  ];

  return (
    <div>
      <Hero
        background="gray"
        category={[t("common:categories.economy"), "text-dim"]}
        header={[t("header")]}
        description={[t("description")]}
        last_updated={last_updated}
        agencyBadge={<AgencyBadge agency="lhdn" icon={<LHDNIcon fillColor="#71717A" />} />}
      />

      {/* Navigations */}
      <nav className="border-b-outline dark:border-b-washed-dark sticky top-14 z-20 flex overflow-hidden border-b bg-white dark:bg-black min-[350px]:justify-center lg:static">
        <div
          className={clx(
            "hide-scrollbar flex snap-x snap-mandatory scroll-px-9 flex-nowrap overflow-x-auto max-[420px]:justify-center",
            pathname.endsWith("/rank-me") ? "max-sm:justify-end" : "max-sm:justify-start"
          )}
        >
          {INCOME_TAXATION_NAVS.map(nav =>
            !nav.url.endsWith("/individual-taxes") ? (
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
                  "text-dim flex flex-row items-center gap-1 whitespace-nowrap px-2 py-3 text-center font-medium transition lg:p-4"
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
    </div>
  );
};

export default IncomeTaxationLayout;
