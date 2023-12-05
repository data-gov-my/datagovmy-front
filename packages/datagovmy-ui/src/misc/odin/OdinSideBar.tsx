import { FunctionComponent, useRef } from "react";
import { Button, Section, Sidebar } from "../../components";
import { useTranslation } from "../../hooks";
import { clx } from "../../lib/helpers";
import Bar from "../../charts/bar";
import { AKSARA_COLOR } from "../../lib/constants";
import OdinSummary from "./OdinSummary";
import OdinMetric from "./OdinMetric";

const OdinSidebar: FunctionComponent = () => {
  const { t } = useTranslation();
  const scrollRef = useRef<Record<string, HTMLElement | null>>({});

  const collection = {
    [t("category.summary")]: {},
    [t("category.social")]: {
      [t("subcategory.population_stats")]: [],
      [t("subcategory.edu_facilities")]: [],
      [t("subcategory.edu_outcomes")]: [],
      [t("subcategory.health_facilities")]: [],
      [t("subcategory.health_outcomes")]: [],
      [t("subcategory.reproductive_health")]: [],
      [t("subcategory.food_security")]: [],
      [t("subcategory.gender_stats")]: [],
      [t("subcategory.crime_stats")]: [],
      [t("subcategory.poverty")]: [],
    },
    [t("category.economy")]: {
      [t("subcategory.national_accounts")]: [],
      [t("subcategory.labour_stats")]: [],
      [t("subcategory.price_indices")]: [],
      [t("subcategory.gov_finances")]: [],
      [t("subcategory.money")]: [],
      [t("subcategory.international_trade")]: [],
      [t("subcategory.balance_of_payments")]: [],
    },
    [t("category.environment")]: {
      [t("subcategory.agriculture")]: [],
      [t("subcategory.resource_use")]: [],
      [t("subcategory.energy")]: [],
      [t("subcategory.pollution")]: [],
      [t("subcategory.built_environment")]: [],
    },
  };

  const coll: Array<[category: string, subcategory: string[]]> = Object.entries(collection).map(
    ([category, subcategory]) => [category, Object.keys(subcategory)]
  );

  const styles = {
    header:
      "px-4 lg:px-5 py-1.5 w-full rounded-none text-start leading-tight text-base text-black font-bold mb-1.5 cursor-default",
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
          block: "center",
          inline: "end",
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
              {category}
            </Button>
            <ul className="space-y-1.5">
              {Boolean(subcategory.length) &&
                subcategory.map((title, subIndex) => (
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
                      {title}
                    </Button>
                  </li>
                ))}
            </ul>
          </li>
        ))
      }
    >
      <div className="mx-auto flex-1 p-2 py-6 pt-16 md:max-w-screen-md lg:max-w-screen-lg lg:px-0 lg:pb-6 lg:pt-0">
        {coll.map(item => {
          if (item[0] === t("category.summary")) {
            return <OdinSummary title={t("category.summary")} scrollRef={scrollRef} />;
          } else {
            return (
              Boolean(item[1].length) &&
              item[1].map(title => (
                <OdinMetric title={`${t(item[0])}: ${t(title)}`} scrollRef={scrollRef} />
              ))
            );
          }
        })}
      </div>
    </Sidebar>
  );
};

export default OdinSidebar;
