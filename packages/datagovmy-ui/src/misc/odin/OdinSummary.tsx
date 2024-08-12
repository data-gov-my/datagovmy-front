import { Dropdown, Section } from "../../components";
import { AKSARA_COLOR } from "../../lib/constants";
import { useData } from "../../hooks/useData";
import { useTranslation } from "../../hooks/useTranslation";
import { numFormat } from "../../lib/helpers";
import dynamic from "next/dynamic";
import { FunctionComponent, MutableRefObject } from "react";

type Category = "economy" | "environment" | "overall" | "social";

type BarDatum = {
  subelement: string[];
  maximum: Array<number | null>;
  overall: Array<number | null>;
};

type OdinSummaryProps = {
  bar: Record<
    Category,
    Record<string, Record<string, Record<"coverage" | "openness" | "overall", BarDatum>>>
  >;
  scores: Record<
    Category,
    Record<
      string,
      Record<string, Record<"coverage" | "openness" | "overall", Omit<BarDatum, "subelement">>>
    >
  >;
  scrollRef: MutableRefObject<Record<string, HTMLElement | null>>;
  title: string;
};

const Bar = dynamic(() => import("../../charts/bar"), { ssr: false });

const OdinSummary: FunctionComponent<OdinSummaryProps> = ({ bar, scores, title, scrollRef }) => {
  const { t } = useTranslation(["odin", "common"]);

  const { data, setData } = useData({
    category: "overall",
    subcategory: "",
    score: scores.overall.overall.overall,
    bar: bar.overall.overall.overall,
  });

  const CATEGORY_OPTIONS = ["overall", "social", "economy", "environment"].map(category => ({
    label: t(category),
    value: category,
  }));

  const SUBCATEGORY_OPTIONS = data.category
    ? [
        "overall",
        ...Object.keys(scores[data.category as Category]).filter(e => e !== "overall"),
      ].map(subcategory => ({
        label: t(`subcategory.${subcategory}`),
        value: subcategory,
      }))
    : [];

  const className = {
    titles: "flex w-full flex-col items-center gap-3 sm:flex-row",
    scores: "w-full flex flex-col max-sm:items-center gap-y-1.5 text-dim",
  };

  return (
    <Section
      className="scroll-mt-14 py-8 lg:py-12"
      ref={ref => {
        scrollRef && (scrollRef.current[title] = ref);
      }}
    >
      <div className="flex flex-col gap-6">
        <div className={className.titles}>
          <h4>{title}:</h4>
          <div className={className.titles}>
            <Dropdown
              anchor="left"
              options={CATEGORY_OPTIONS}
              selected={CATEGORY_OPTIONS.find(item => item.value === data.category)}
              onChange={(e: { value: Category }) => {
                setData("category", e.value);
                setData("subcategory", e.value === "overall" ? "" : "overall");
                setData("bar", bar[e.value].overall.overall);
                setData("score", scores[e.value].overall.overall);
              }}
            />
            <Dropdown
              anchor="left"
              placeholder={t("choose_subcategory")}
              disabled={data.category === "overall" || !data.category}
              options={SUBCATEGORY_OPTIONS}
              selected={SUBCATEGORY_OPTIONS.find(item => item.value === data.subcategory)}
              onChange={e => {
                setData("subcategory", e.value);
                setData("bar", bar[data.category as Category][e.value].overall);
                setData("score", scores[data.category as Category][e.value].overall);
              }}
            />
          </div>
        </div>

        {/* Scores */}
        {data.score && (
          <div className="flex flex-col gap-8 pb-6 sm:flex-row">
            <div className={className.scores}>
              <p className="font-medium uppercase">{t("overall_score")}</p>
              <div className="flex items-center gap-1.5">
                <p className="text-[42px] font-bold leading-[50px] text-black dark:text-white">
                  {numFormat(data.score.overall.overall, "standard", 0)}
                </p>
                <p>{t("out_of", { max: data.score.overall.maximum })}</p>
              </div>
            </div>
            <div className={className.scores}>
              <p className="font-medium uppercase">{t("coverage_score")}</p>
              <div className="flex items-center gap-1.5">
                <p className="text-[42px] font-bold leading-[50px] text-[#FF820E]">
                  {numFormat(data.score.coverage.overall, "standard", 0)}
                </p>
                <p>{t("out_of", { max: data.score.coverage.maximum })}</p>
              </div>
            </div>
            <div className={className.scores}>
              <p className="font-medium uppercase">{t("openness_score")}</p>
              <div className="flex items-center gap-1.5">
                <p className="text-primary dark:text-primary-dark text-[42px] font-bold leading-[50px]">
                  {numFormat(data.score.openness.overall, "standard", 0)}
                </p>
                <p>{t("out_of", { max: data.score.openness.maximum })}</p>
              </div>
            </div>
          </div>
        )}

        {/* Bar Chart */}
        {data.bar && (
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:gap-12">
            {["coverage", "openness"].map((score, i) => {
              const scores = data.bar[score];
              return (
                <Bar
                  key={i}
                  title={t("breakdown_" + score)}
                  id={`bar-${score}-breakdown`}
                  className="h-[280px] w-full"
                  layout="horizontal"
                  enableGridY={false}
                  enableGridX={true}
                  maxX={scores.maximum[i + 1]}
                  precision={0}
                  data={{
                    labels: scores.subelement.slice(1).map((e: string) => t(e)),
                    datasets: [
                      {
                        label: t("score"),
                        data: scores.overall.slice(1),
                        barThickness: 32,
                        backgroundColor: i === 0 ? AKSARA_COLOR.ORANGE_H : AKSARA_COLOR.PRIMARY_H,
                        borderColor: i === 0 ? AKSARA_COLOR.ORANGE : AKSARA_COLOR.PRIMARY,
                        borderWidth: 0.5,
                      },
                    ],
                  }}
                  datalabels={{
                    align: "start",
                    anchor: "end",
                    color: i === 0 ? AKSARA_COLOR.ORANGE : AKSARA_COLOR.PRIMARY,
                    display: (context: any) => context.dataset.data[context.dataIndex] > 5,
                    formatter: value => numFormat(value, "standard", 0),
                  }}
                />
              );
            })}
          </div>
        )}
      </div>
    </Section>
  );
};

export default OdinSummary;
