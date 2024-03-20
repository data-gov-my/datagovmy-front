import { FunctionComponent, MutableRefObject, useState } from "react";
import { At, Panel, Section, Tabs } from "../../components";
import { useTranslation } from "../../hooks";
import { clx } from "../../lib/helpers";

type OdinMetricProps = {
  links: any;
  scores: any;
  table: any;
  title: string;
  scrollRef: MutableRefObject<Record<string, HTMLElement | null>>;
};

const OdinMetric: FunctionComponent<OdinMetricProps> = ({
  links,
  scores,
  table,
  title,
  scrollRef,
}) => {
  const { t } = useTranslation(["odin", "common"]);

  const [tab_idx, setTabIdx] = useState(0);

  const indicators = ["overall", ...Object.keys(table).filter(e => e !== "overall")];
  const classNames = {
    tr: "border-outline dark:border-washed-dark",
    td: "px-4 py-2.5 text-center text-sm font-medium text-start align-text-top",
  };

  function calcScore(arr: { score: number }[]) {
    return arr.reduce((acc: number, curr) => acc + curr.score, 0);
  }

  return (
    <Section className="scroll-mt-14 py-8 lg:py-12" ref={ref => (scrollRef.current[title] = ref)}>
      <div className="flex max-w-[1000px] flex-col gap-6">
        <h4>{title}</h4>

        <Tabs className="justify-center" onChange={i => setTabIdx(i)}>
          {indicators.map(indicator => (
            <Panel key={indicator} name={t(`indicator.${indicator}`)}>
              <div className="flex flex-col gap-y-6">
                {/* Scores */}
                {scores[indicator] ? (
                  <div className="flex flex-col gap-8 sm:flex-row sm:items-center sm:justify-around">
                    <div className="text-dim flex flex-col gap-y-1.5 max-sm:items-center">
                      <p className="font-medium uppercase">{t("overall_score")}</p>
                      <div className="flex items-center gap-1.5">
                        <p className="text-2xl font-bold text-black dark:text-white">
                          {scores[indicator].overall.overall}
                        </p>
                        <p>{t("out_of", { max: scores[indicator].overall.maximum })}</p>
                      </div>
                    </div>
                    <div className="text-dim flex flex-col gap-y-1.5 max-sm:items-center">
                      <p className="font-medium uppercase">{t("coverage_score")}</p>
                      <div className="flex items-center gap-1.5">
                        <p className="text-2xl font-bold text-[#FF820E]">
                          {tab_idx === 0
                            ? scores[indicator].coverage.overall
                            : calcScore(table[indicator].coverage)}
                        </p>
                        <p>
                          {t("out_of", {
                            max: tab_idx === 0 ? scores[indicator].coverage.maximum : 5,
                          })}
                        </p>
                      </div>
                    </div>
                    <div className="text-dim flex flex-col gap-y-1.5 max-sm:items-center">
                      <p className="font-medium uppercase">{t("openness_score")}</p>
                      <div className="flex items-center gap-1.5">
                        <p className="text-primary dark:text-primary-dark text-2xl font-bold">
                          {tab_idx === 0
                            ? scores[indicator].openness.overall
                            : calcScore(table[indicator].openness)}
                        </p>
                        <p>
                          {t("out_of", {
                            max: tab_idx === 0 ? scores[indicator].openness.maximum : 5,
                          })}
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <></>
                )}

                {/* Table */}
                {table[indicator] ? (
                  <div className="overflow-x-auto">
                    <table className="relative mx-auto table-auto border-spacing-0">
                      <thead>
                        <tr className={clx(classNames.tr, "border-b-2")}>
                          <th className={classNames.td}>{t("element")}</th>
                          <th className={classNames.td}>{t("subelement")}</th>
                          <th className={clx(classNames.td, "text-center")}>{t("score")}</th>
                          <th className={classNames.td}>{t("justification")}</th>
                        </tr>
                      </thead>
                      <tbody>
                        {table[indicator].coverage.map(
                          (
                            row: { subelement: string; score: number; justification: string },
                            i: number
                          ) => (
                            <tr className={clx(classNames.tr, "border-b")}>
                              {i === 0 ? (
                                <th
                                  rowSpan={5}
                                  className={clx(
                                    classNames.td,
                                    "min-w-[150px] border-r border-inherit text-[#FF820E]"
                                  )}
                                >
                                  {`${t("coverage")} (${calcScore(table[indicator].coverage)}/${
                                    tab_idx === 0 ? 50 : 5
                                  })`}
                                </th>
                              ) : (
                                <></>
                              )}
                              <td className={clx(classNames.td, "min-w-[150px] lg:min-w-[200px]")}>
                                {t(row.subelement)}
                              </td>
                              <td className={clx(classNames.td, "text-center lg:min-w-[150px]")}>
                                {row.score}
                              </td>
                              <td className={clx(classNames.td, "min-w-[300px]")}>
                                {row.justification}
                              </td>
                            </tr>
                          )
                        )}
                        {table[indicator].openness.map(
                          (
                            row: { subelement: string; score: number; justification: string },
                            i: number
                          ) => (
                            <tr className={clx(classNames.tr, "border-b")}>
                              {i === 0 ? (
                                <th
                                  rowSpan={5}
                                  className={clx(
                                    classNames.td,
                                    "text-primary dark:text-primary-dark max-w-[150px] border-r border-inherit"
                                  )}
                                >
                                  {`${t("openness")} (${calcScore(table[indicator].openness)}/${
                                    tab_idx === 0 ? 50 : 5
                                  })`}
                                </th>
                              ) : (
                                <></>
                              )}
                              <td className={clx(classNames.td, "min-w-[150px] lg:min-w-[200px]")}>
                                {t(row.subelement)}
                              </td>
                              <td className={clx(classNames.td, "text-center lg:min-w-[150px]")}>
                                {row.score}
                              </td>
                              <td className={clx(classNames.td, "min-w-[300px]")}>
                                {row.justification}
                              </td>
                            </tr>
                          )
                        )}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <>
                    <div className="bg-outline dark:bg-washed-dark mx-auto my-12 w-4/5 rounded-md px-3 py-1.5 sm:w-max">
                      <p>{t("click_indicator")}</p>
                    </div>
                  </>
                )}

                {/* Related Datasets */}
                {links ? (
                  <div className="flex flex-col gap-3 sm:flex-row sm:gap-6">
                    <p className="w-content text-sm font-medium">{t("reference_datasets")}:</p>
                    <div className="flex flex-col flex-wrap gap-y-6">
                      {Object.keys(links).map((indicator: string) => {
                        return (
                          <div className="flex gap-3">
                            {links[indicator].map((l: { link_title: string; url: string }) => (
                              <At
                                className="link-primary text-sm font-normal underline"
                                href={l.url}
                                target="_blank"
                              >
                                {l.link_title}
                              </At>
                            ))}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ) : (
                  <></>
                )}
              </div>
            </Panel>
          ))}
        </Tabs>
      </div>
    </Section>
  );
};

export default OdinMetric;
