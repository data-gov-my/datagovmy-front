import { CustomerServiceIcon } from "@icons/division";
import { AgencyBadge, Hero } from "datagovmy-ui/components";
import { AKSARA_COLOR } from "datagovmy-ui/constants";
import { clx } from "datagovmy-ui/helpers";
import { useTranslation } from "datagovmy-ui/hooks";
import { OptionType } from "datagovmy-ui/types";
import { FunctionComponent, ReactNode, useState } from "react";

/**
 * Digital Economy Layout
 * @overview Status: Live
 */

interface DigitalEconomyLayoutProps {
  children: (tab: string) => ReactNode;
  last_updated: string;
  next_update: string;
}

const DigitalEconomyLayout: FunctionComponent<DigitalEconomyLayoutProps> = ({
  children,
  last_updated,
  next_update,
}) => {
  const { t } = useTranslation("dashboard-digital-economy");

  const TAB_OPTIONS: Array<OptionType> = ["businesses", "households", "ecommerce"].map(tab => ({
    label: t(`tab.${tab}`),
    value: tab,
  }));

  const [tab, setTab] = useState(TAB_OPTIONS[0].value);

  return (
    <>
      <Hero
        background="blue"
        category={[t("common:categories.economy"), "text-primary dark:text-primary-dark"]}
        header={[t("header")]}
        description={[t("description")]}
        last_updated={last_updated}
        next_update={next_update}
        agencyBadge={
          <AgencyBadge
            name={t("division:bpp.full")}
            icon={<CustomerServiceIcon fillColor={AKSARA_COLOR.PRIMARY} />}
            isDivision
          />
        }
      />

      <nav className="sticky top-14 z-20 flex overflow-hidden border-b border-b-outline bg-white dark:border-b-washed-dark dark:bg-black min-[350px]:justify-center lg:static">
        <div className="hide-scrollbar max-[420px]:justify-center, flex snap-x snap-mandatory scroll-px-9 flex-nowrap overflow-x-auto max-sm:justify-start">
          {TAB_OPTIONS.map(({ label, value }) => (
            <div key={value} className="snap-start">
              <div
                className="flex h-full min-w-[56px] cursor-pointer items-center justify-center px-3 outline-none"
                onClick={() => setTab(value)}
              >
                <div className="relative flex h-full flex-col items-center justify-center px-2 py-4">
                  <div
                    className={clx(
                      "flex items-center gap-2",
                      tab === value ? "text-black dark:text-white" : "text-dim"
                    )}
                  >
                    <span className="whitespace-nowrap text-base font-medium">{label}</span>
                  </div>
                  {tab === value && (
                    <div className="absolute bottom-0 inline-flex h-[2px] w-full min-w-[56px] rounded-full bg-primary dark:bg-primary-dark" />
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </nav>

      {children(tab)}
    </>
  );
};

export default DigitalEconomyLayout;

export const DIGITAL_ECONOMY_SECTORS = [
  "overall",
  "A",
  "B",
  "C",
  "F",
  "SS",
  "DE",
  "G",
  "H",
  "IA",
  "IF",
  "J",
  "K",
  "L",
  "M",
  "N",
  "P",
  "Q",
  "R",
  "S",
] as const;

export type DigitalEconomySector = (typeof DIGITAL_ECONOMY_SECTORS)[number];
