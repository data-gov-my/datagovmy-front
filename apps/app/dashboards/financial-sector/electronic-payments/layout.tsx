import { AgencyBadge, Hero } from "datagovmy-ui/components";
import { clx } from "datagovmy-ui/helpers";
import { useData, useTranslation } from "datagovmy-ui/hooks";
import { OptionType } from "datagovmy-ui/types";
import { FunctionComponent, ReactNode } from "react";

/**
 * Electronic Payments Layout
 * @overview Status: Live
 */
interface ElectronicPaymentsLayoutProps {
  children: (tab_index: string) => ReactNode;
  last_updated: string;
}

const ElectronicPaymentsLayout: FunctionComponent<ElectronicPaymentsLayoutProps> = ({
  children,
  last_updated,
}) => {
  const { t } = useTranslation(["dashboard-electronic-payments"]);

  const TAB_OPTIONS: Array<OptionType> = [
    {
      label: t("keys.instruments"),
      value: "instruments",
    },
    {
      label: t("keys.systems"),
      value: "systems",
    },
    {
      label: t("keys.channels"),
      value: "channels",
    },
  ];

  const { data, setData } = useData({
    tab_index: TAB_OPTIONS[0].value,
  });

  return (
    <>
      <Hero
        background="blue"
        category={[t("common:categories.financial_sector"), "text-primary dark:text-primary-dark"]}
        header={[t("header")]}
        description={[t("description")]}
        last_updated={last_updated}
        agencyBadge={<AgencyBadge agency="bnm" />}
      />

      <nav className="border-b-outline dark:border-b-washed-dark sticky top-14 z-20 flex overflow-hidden border-b bg-white dark:bg-black min-[350px]:justify-center lg:static">
        <div className="hide-scrollbar max-[420px]:justify-center, flex snap-x snap-mandatory scroll-px-9 flex-nowrap overflow-x-auto max-sm:justify-start">
          {TAB_OPTIONS.map(tab => (
            <div key={tab.value} className="snap-start">
              <div
                className="flex h-full min-w-[56px] cursor-pointer items-center justify-center px-3 outline-none"
                onClick={() => setData("tab_index", tab.value)}
              >
                <div className="relative flex h-full flex-col items-center justify-center px-2 py-4">
                  <div
                    className={clx(
                      "flex items-center gap-2",
                      data.tab_index === tab.value ? "text-black dark:text-white" : "text-dim"
                    )}
                  >
                    <span className="whitespace-nowrap text-base font-medium">{tab.label}</span>
                  </div>
                  {data.tab_index === tab.value && (
                    <div className="bg-primary dark:bg-primary-dark absolute bottom-0 inline-flex h-[2px] w-full min-w-[56px] rounded-full" />
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </nav>

      {children(data.tab_index)}
    </>
  );
};

export default ElectronicPaymentsLayout;
