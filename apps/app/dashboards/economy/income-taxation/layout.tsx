import { At, AgencyBadge, Hero } from "@components/index";
import { LHDNIcon } from "@components/Icon/agency";
import Progress from "@components/Progress";
import { useTranslation } from "@hooks/useTranslation";
import { clx } from "@lib/helpers";
import { routes } from "@lib/routes";
import { useRouter } from "next/router";
import { FunctionComponent, ReactNode } from "react";

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
        agencyBadge={
          <AgencyBadge
            agency={t("agencies:lhdn.full")}
            link="https://www.hasil.gov.my"
            icon={<LHDNIcon fillColor="#71717A" />}
          />
        }
      />

      {/* Navigations */}
      <div
        className={clx(
          "border-b-outline dark:border-b-washed-dark hide-scrollbar sticky top-14 z-20 flex flex-row gap-2 overflow-x-auto border-b bg-white px-3 dark:bg-black sm:justify-center md:pl-0 lg:static",
          pathname.endsWith("/rank-me") ? "max-sm:justify-end" : "max-sm:justify-start"
        )}
      >
        {INCOME_TAXATION_NAVS.map(nav =>
          !nav.url.endsWith("/individual-taxes") ? (
            <At
              className={clx(
                "flex flex-row items-center gap-1 whitespace-nowrap px-2 py-3 text-center font-medium transition lg:p-4",
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

      {/* Content */}
      {children}
    </div>
  );
};

export default IncomeTaxationLayout;
