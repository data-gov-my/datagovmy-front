import { FunctionComponent, MutableRefObject } from "react";
import { At, Panel, Section, Tabs } from "../../components";
import { useData, useTranslation } from "../../hooks";
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

  const { data, setData } = useData({
    indicator: "overall",
    score: scores ? scores.overall : null,
    table: null,
    tab_idx: 0,
  });

  const indicators = ["overall", ...Object.keys(table).filter(e => e !== "overall")];
  const classNames = {
    tr: "border-outline dark:border-washed-dark",
    td: "px-2 py-2.5 text-center text-sm font-medium text-start",
  };

  return (
    <Section className="scroll-mt-14 py-8 lg:py-12" ref={ref => (scrollRef.current[title] = ref)}>
      <div className="flex flex-col gap-6">
        <h4>{title}</h4>

        <Tabs
          className="justify-center"
          onChange={i => {
            setData("tab_idx", i);
            setData("score", scores ? scores[indicators[i]] : null);
            setData("table", indicators[i] in table ? table[indicators[i]] : null);
          }}
        >
          {indicators.map(indicator => (
            <Panel key={indicator} name={t(`indicator.${indicator}`)}>
              <div className="flex flex-col gap-y-6">
                {/* Scores */}
                {data.score ? (
                  <div className="flex flex-col gap-8 sm:flex-row sm:items-center">
                    <div className="text-dim flex w-full flex-col gap-y-1.5 max-sm:items-center">
                      <p className="font-medium uppercase">{t("overall_score")}</p>
                      <div className="flex items-center gap-1.5">
                        <p className="text-2xl font-bold text-black dark:text-white">
                          {data.score.overall.overall}
                        </p>
                        <p>{t("out_of", { max: data.score.overall.maximum })}</p>
                      </div>
                    </div>
                    <div className="text-dim flex w-full flex-col gap-y-1.5 max-sm:items-center">
                      <p className="font-medium uppercase">{t("coverage_score")}</p>
                      <div className="flex items-center gap-1.5">
                        <p className="text-2xl font-bold text-[#FF820E]">
                          {data.score.coverage.overall}
                        </p>
                        <p>{t("out_of", { max: data.score.coverage.maximum })}</p>
                      </div>
                    </div>
                    <div className="text-dim flex w-full flex-col gap-y-1.5 max-sm:items-center">
                      <p className="font-medium uppercase">{t("openness_score")}</p>
                      <div className="flex items-center gap-1.5">
                        <p className="text-primary dark:text-primary-dark text-2xl font-bold">
                          {data.score.openness.overall}
                        </p>
                        <p>{t("out_of", { max: data.score.openness.maximum })}</p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <></>
                )}

                {/* Table */}
                {data.table ? (
                  <div className="w-full">
                    <div className="overflow-x-auto">
                      <table className="relative mx-auto w-full table-auto border-spacing-0">
                        <thead>
                          <tr className={clx(classNames.tr, "border-b-2")}>
                            <th className={classNames.td}>{t("element")}</th>
                            <th className={classNames.td}>{t("subelement")}</th>
                            <th className={clx(classNames.td, "text-center")}>{t("score")}</th>
                            <th className={classNames.td}>{t("justification")}</th>
                          </tr>
                        </thead>
                        <tbody>
                          {data.table.coverage.map(
                            (
                              row: { subelement: string; score: number; justification: string },
                              i: number
                            ) => (
                              <tr className={clx(classNames.tr, "border-b")}>
                                {i === 0 ? (
                                  <th
                                    rowSpan={5}
                                    className={clx(
                                      classNames.tr,
                                      classNames.td,
                                      "min-w-[150px] border-r align-text-top text-[#FF820E]"
                                    )}
                                  >
                                    {t("coverage", {
                                      n: data.table.coverage.reduce(
                                        (acc: number, subelement: { score: number }) =>
                                          acc + subelement.score,
                                        0
                                      ),
                                    })}
                                  </th>
                                ) : (
                                  <></>
                                )}
                                <td
                                  className={clx(
                                    classNames.td,
                                    "max-w-[250px] align-text-top sm:min-w-[150px]"
                                  )}
                                >
                                  {t(row.subelement)}
                                </td>
                                <td
                                  className={clx(
                                    classNames.td,
                                    "max-w-[100px] text-center align-text-top"
                                  )}
                                >
                                  {row.score}
                                </td>
                                <td className={clx(classNames.td, "align-text-top")}>
                                  {row.justification}
                                </td>
                              </tr>
                            )
                          )}
                          {data.table.openness.map(
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
                                      "text-primary dark:text-primary-dark border-outline dark:border-washed-dark max-w-[150px] border-r align-text-top"
                                    )}
                                  >
                                    {t("openness", {
                                      n: data.table.openness.reduce(
                                        (acc: number, subelement: { score: number }) =>
                                          acc + subelement.score,
                                        0
                                      ),
                                    })}
                                  </th>
                                ) : (
                                  <></>
                                )}
                                <td
                                  className={clx(classNames.td, "align-text-top sm:max-w-[250px]")}
                                >
                                  {t(row.subelement)}
                                </td>
                                <td
                                  className={clx(
                                    classNames.td,
                                    "max-w-[100px] text-center align-text-top"
                                  )}
                                >
                                  {row.score}
                                </td>
                                <td className={clx(classNames.td, "align-text-top")}>
                                  {row.justification}
                                </td>
                              </tr>
                            )
                          )}
                        </tbody>
                      </table>
                    </div>
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
