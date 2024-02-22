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

  const collection = {
    ["summary"]: {},
    ["social"]: {
      ["population"]: [],
      // ["edu_facilities"]: [],
      // ["edu_outcomes"]: [],
      // ["health_facilities"]: [],
      // ["health_outcomes"]: [],
      // ["reproductive_health"]: [],
      // ["food_security"]: [],
      // ["gender_stats"]: [],
      // ["crime_stats"]: [],
      // ["poverty"]: [],
    },
    ["economy"]: {
      ["national_accounts"]: [],
      // ["labour_stats"]: [],
      // ["price_indices"]: [],
      // ["gov_finances"]: [],
      // ["money"]: [],
      // ["international_trade"]: [],
      // ["balance_of_payments"]: [],
    },
    ["environment"]: {
      ["agriculture"]: [],
      // ["resource_use"]: [],
      // ["energy"]: [],
      // ["pollution"]: [],
      // ["built_environment"]: [],
    },
  };

  const coll: Array<[category: string, subcategory: string[]]> = Object.entries(collection).map(
    ([category, subcategory]) => [category, Object.keys(subcategory)]
  );

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
      categories={coll}
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
          <li key={`${category}: ${subcategory[0]}`} title={category}>
            <Button
              className={clx(
                index === 0 ? styles.subcategory : styles.header,
                selected === `${category}` && styles.active
              )}
              onClick={() => {
                if (index === 0) {
                  setSelected(`${category}`);
                  onSelect(
                    subcategory.length > 0 ? `${category}: ${subcategory[0]}` : `${category}`
                  );
                }
              }}
            >
              {t(category)}
            </Button>
            <ul className="space-y-1.5">
              {Boolean(subcategory.length) &&
                subcategory.map(title => (
                  <li key={title} title={title}>
                    <Button
                      className={clx(
                        styles.subcategory,
                        selected === `${category}: ${title}` && styles.active
                      )}
                      onClick={() => {
                        setSelected(`${category}: ${title}`);
                        onSelect(`${category}: ${title}`);
                      }}
                    >
                      {t(`subcategory.${title}`)}
                    </Button>
                  </li>
                ))}
            </ul>
          </li>
        ))
      }
    >
      <div className="md:px-4.5 divide-outline dark:divide-washed-dark divide-y pb-8 pt-4 sm:px-3 lg:px-6 lg:pb-12 lg:pt-0">
        <OdinSummary bar={bar_chart} scores={keystats} title="summary" scrollRef={scrollRef} />
        {coll.map((item, i) => {
          if (i === 0) return;
          else
            return (
              Boolean(item[1].length) &&
              item[1].map(title => (
                <OdinMetric
                  links={links[item[0]][title]}
                  scores={keystats[item[0]][title]}
                  table={table[item[0]][title]}
                  title={`${t(item[0])}: ${t(`subcategory.${title}`)}`}
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
