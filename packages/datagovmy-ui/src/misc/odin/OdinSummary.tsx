import { FunctionComponent, MutableRefObject } from "react";
import { Dropdown, Section } from "../../components";
import Bar from "../../charts/bar";
import { AKSARA_COLOR } from "../../lib/constants";
import { useData } from "../../hooks/useData";
import { useTranslation } from "../../hooks/useTranslation";
import { numFormat } from "../../lib/helpers";

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
  scores: any;
  scrollRef: MutableRefObject<Record<string, HTMLElement | null>>;
  title: string;
};

const OdinSummary: FunctionComponent<OdinSummaryProps> = ({ bar, scores, title, scrollRef }) => {
  const { t } = useTranslation(["odin", "common"]);

  const { data, setData } = useData({
    category: "overall",
    subcategory: "",
    score: scores.overall.overall.overall,
    bar: bar.overall.overall.overall,
  });

  const CATEGORY_OPTIONS = ["overall", ...Object.keys(scores).filter(e => e !== "overall")].map(
    category => ({
      label: t(category),
      value: category,
    })
  );

  const SUBCATEGORY_OPTIONS = data.category
    ? ["overall", ...Object.keys(scores[data.category]).filter(e => e !== "overall")].map(
        subcategory => ({
          label: t(`subcategory.${subcategory}`),
          value: subcategory,
        })
      )
    : [];

  function calcAvgScore(arr: Array<number | null>) {
    const total = arr.reduce((acc: number, curr) => (curr !== null ? acc + curr : acc), 0);
    const length = arr.reduce((acc: number, curr) => (curr !== null ? acc + 1 : acc), 0);
    return total / length;
  }

  const className = {
    titles: "flex w-full flex-col items-center gap-3 sm:flex-row",
    scores: "w-full flex flex-col max-sm:items-center gap-y-1.5 text-dim",
  };

  return (
    <Section className="scroll-mt-14 py-8 lg:py-12" ref={ref => (scrollRef.current[title] = ref)}>
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
                setData("score", scores[data.category][e.value].overall);
              }}
            />
          </div>
        </div>

        {/* Scores */}
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
                {numFormat(calcAvgScore(data.bar.coverage.overall), "standard", 0)}
              </p>
              <p>{t("out_of", { max: data.score.coverage.maximum })}</p>
            </div>
          </div>
          <div className={className.scores}>
            <p className="font-medium uppercase">{t("openness_score")}</p>
            <div className="flex items-center gap-1.5">
              <p className="text-primary dark:text-primary-dark text-[42px] font-bold leading-[50px]">
                {numFormat(calcAvgScore(data.bar.openness.overall), "standard", 0)}
              </p>
              <p>{t("out_of", { max: data.score.openness.maximum })}</p>
            </div>
          </div>
        </div>

        {/* Bar Chart */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:gap-12">
          <Bar
            title={t("breakdown_coverage")}
            id="bar-coverage-score-breakdown"
            className="h-[280px] w-full"
            layout="horizontal"
            enableGridY={false}
            enableGridX={true}
            maxX={data.bar.coverage.maximum[0]}
            precision={0}
            data={{
              labels: data.bar.coverage.subelement.map((e: string) => t(e)),
              datasets: [
                {
                  label: t("score"),
                  data: data.bar.coverage.overall,
                  barThickness: 32,
                  backgroundColor: AKSARA_COLOR.ORANGE_H,
                  borderColor: AKSARA_COLOR.ORANGE,
                  borderWidth: 0.5,
                },
              ],
            }}
            datalabels={{
              align: "start",
              anchor: "end",
              color: AKSARA_COLOR.ORANGE,
              display: (context: any) => context.dataset.data[context.dataIndex] > 5,
              formatter: value => numFormat(value, "standard", 0),
            }}
          />
          <Bar
            id="bar-openness-score-breakdown"
            title={t("breakdown_openness")}
            className="h-[280px] w-full"
            layout="horizontal"
            enableGridY={false}
            enableGridX={true}
            maxX={data.bar.openness.maximum[0]}
            precision={0}
            data={{
              labels: data.bar.openness.subelement.map((e: string) => t(e)),
              datasets: [
                {
                  label: t("score"),
                  data: data.bar.openness.overall,
                  barThickness: 32,
                  backgroundColor: AKSARA_COLOR.PRIMARY_H,
                  borderColor: AKSARA_COLOR.PRIMARY,
                  borderWidth: 0.5,
                },
              ],
            }}
            datalabels={{
              align: "start",
              anchor: "end",
              color: AKSARA_COLOR.PRIMARY,
              display: (context: any) => context.dataset.data[context.dataIndex] > 5,
              formatter: value => numFormat(value, "standard", 0),
            }}
          />
        </div>
      </div>
    </Section>
  );
};

export default OdinSummary;
