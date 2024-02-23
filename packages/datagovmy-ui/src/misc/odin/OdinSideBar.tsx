import { FunctionComponent, ReactNode, useRef } from "react";
import { Button, Sidebar } from "../../components";
import { useTranslation } from "../../hooks";
import { clx } from "../../lib/helpers";
import OdinSummary from "./OdinSummary";
import OdinMetric from "./OdinMetric";

type OdinSidebarProps = {
  bar_chart: any;
  keystats: any;
  links: any;
  table: any;
};

const OdinSidebar: FunctionComponent<OdinSidebarProps> = ({
  bar_chart,
  keystats,
  links,
  table,
}) => {
  const { t } = useTranslation("odin");
  const scrollRef = useRef<Record<string, HTMLElement | null>>({});

  const categories: Array<[category: string, subcategory: string[]]> = [
    ["summary", []],
    [
      "social",
      [
        "population",
        // "edu_facilities",
        // "edu_outcomes",
        // "health_facilities",
        // "health_outcomes",
        // "reproductive_health",
        // "food_security",
        // "gender_stats",
        // "crime_stats",
        // "poverty",
      ],
    ],
    [
      "economy",
      [
        "national_accounts",
        // "labour_stats",
        // "price_indices",
        // "gov_finances",
        // "money",
        // "international_trade",
        // "balance_of_payments",
      ],
    ],
    [
      "environment",
      [
        "agriculture",
        // "resource_use",
        // "energy",
        // "pollution",
        // "built_environment",
      ],
    ],
  ];

  const styles = {
    header:
      "px-4 lg:px-5 py-1.5 w-full rounded-none text-start leading-tight text-base text-black dark:text-white font-bold mb-1.5 cursor-default",
    subcategory:
      "px-4 lg:px-5 py-1.5 w-full rounded-none text-start leading-tight text-sm text-dim",
    active:
      "border-l-2 border-black bg-washed text-black dark:bg-washed-dark dark:text-white dark:border-white text-black",
  };

  return (
    <Sidebar
      categories={categories}
      onSelect={selected => {
        scrollRef.current[selected]?.scrollIntoView({
          behavior: "smooth",
          block: "start",
          inline: "nearest",
        });
      }}
      sidebarTitle=""
      mobileClassName="top-4"
      customList={(setSelected, onSelect, categories, selected) =>
        categories.map(([category, subcategory], index) => (
          <li key={category} title={category}>
            <Button
              className={clx(
                index === 0 ? styles.subcategory : styles.header,
                selected === category && styles.active
              )}
              onClick={() => {
                if (index === 0) {
                  setSelected(category);
                  onSelect(category);
                }
              }}
            >
              {t(category)}
            </Button>
            <ul className="space-y-1.5">
              {subcategory.length > 0 &&
                subcategory.map(title => {
                  const subcat = t("subcategory." + title);
                  const id = t(category) + ": " + subcat;
                  return (
                    <li key={id} title={title}>
                      <Button
                        className={clx(styles.subcategory, selected === id && styles.active)}
                        onClick={() => {
                          setSelected(id);
                          onSelect(id);
                        }}
                      >
                        {subcat}
                      </Button>
                    </li>
                  );
                })}
            </ul>
          </li>
        ))
      }
    >
      <div className="divide-outline dark:divide-washed-dark md:px-4.5 divide-y pb-8 pt-4 sm:px-3 lg:px-6 lg:pb-12 lg:pt-0">
        <OdinSummary bar={bar_chart} scores={keystats} title={t("summary")} scrollRef={scrollRef} />
        {categories.map((item, i) => {
          const category = item[0];
          const subcategories = item[1];
          if (i === 0) return;
          else
            return (
              subcategories.length > 0 &&
              subcategories.map(subcategory => (
                <OdinMetric
                  links={links[category][subcategory]}
                  scores={keystats[category][subcategory]}
                  table={table[category][subcategory]}
                  title={`${t(category)}: ${t(`subcategory.${subcategory}`)}`}
                  scrollRef={scrollRef}
                />
              ))
            );
        })}
      </div>
    </Sidebar>
  );
};

export default OdinSidebar;
