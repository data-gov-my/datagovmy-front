import { FunctionComponent, MutableRefObject } from "react";
import { Section } from "../../components";
import Bar from "../../charts/bar";
import { AKSARA_COLOR } from "../../lib/constants";

type OdinSummaryProps = {
  title: string;
  scrollRef: MutableRefObject<Record<string, HTMLElement | null>>;
};

const BarChartDummy = {
  x: ["Indicators", "Last 5 Years", "Last 10 Years", "State-Level", "District-Level"],
  y: [4, 46, 56, 57, 78],
};

const OdinSummary: FunctionComponent<OdinSummaryProps> = ({ title, scrollRef }) => {
  return (
    <Section className="border-b py-8 lg:py-12" ref={ref => (scrollRef.current[title] = ref)}>
      <div className="flex flex-col gap-6">
        <div className="flex items-center gap-3">
          <h4>{title}:</h4>
          <p>dropdown</p>
        </div>
        <div className="flex items-center gap-8 pb-6">
          <div className="flex flex-1 flex-col gap-1.5">
            <p className="text-dim font-medium uppercase">overall score</p>
            <div className="flex items-center gap-1.5">
              <h1 className="text-[42px]">100</h1>
              <p className="text-dim">out of 100</p>
            </div>
          </div>
          <div className="flex flex-1 flex-col gap-1.5">
            <p className="text-dim font-medium uppercase">overall score</p>
            <div className="flex items-center gap-1.5">
              <h1 className="text-[42px] text-orange-500">100</h1>
              <p className="text-dim">out of 100</p>
            </div>
          </div>
          <div className="flex flex-1 flex-col gap-1.5">
            <p className="text-dim font-medium uppercase">overall score</p>
            <div className="flex items-center gap-1.5">
              <h1 className="text-primary text-[42px]">100</h1>
              <p className="text-dim">out of 100</p>
            </div>
          </div>
        </div>
        <div className="md: grid grid-cols-1 md:grid-cols-2">
          <Bar
            id="bar-coverage-score-breakdown"
            className="h-[280px]"
            layout="horizontal"
            enableGridY={false}
            enableGridX={true}
            maxX={100}
            data={{
              labels: BarChartDummy.x,
              datasets: [
                {
                  label: `Value`,
                  data: BarChartDummy.y,
                  borderRadius: 0,
                  barThickness: 40,
                  backgroundColor: AKSARA_COLOR.ORANGE_H,
                  borderColor: AKSARA_COLOR.ORANGE,
                  borderWidth: 0.5,
                },
              ],
            }}
          />
          <Bar
            id="bar-opennes-score-breakdown"
            className="h-[280px]"
            layout="horizontal"
            enableGridY={false}
            enableGridX={true}
            maxX={100}
            data={{
              labels: BarChartDummy.x,
              datasets: [
                {
                  label: `Value`,
                  data: BarChartDummy.y,
                  borderRadius: 0,
                  barThickness: 40,
                  backgroundColor: AKSARA_COLOR.PRIMARY_H,
                  borderColor: AKSARA_COLOR.PRIMARY,
                  borderWidth: 0.5,
                },
              ],
            }}
          />
        </div>
      </div>
    </Section>
  );
};

export default OdinSummary;
