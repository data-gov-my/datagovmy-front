import { FunctionComponent, useMemo } from "react";
import dynamic from "next/dynamic";
import { WithData } from "datagovmy-ui/types";
import { HeatmapData, HeatmapDatum } from "datagovmy-ui/charts/heatmap";
import { useTranslation } from "datagovmy-ui/hooks";
import { Section } from "datagovmy-ui/components";

const Heatmap = dynamic(() => import("datagovmy-ui/charts/heatmap"), { ssr: false });

interface HeatmapProps {
  heatmap: WithData<HeatmapData>;
}

const LifeExpectancyHeatmap: FunctionComponent<HeatmapProps> = ({ heatmap }) => {
  const { t } = useTranslation(["dashboard-life-expectancy"]);

  const data = useMemo<HeatmapData>(
    () =>
      heatmap.data.map((item: HeatmapDatum) => ({
        x: item.y,
        y: t(`keys.${item.x}`),
        z: item.z,
      })),
    []
  );

  return (
    <Section title={t("section_heatmap.title")} date={heatmap.data_as_of}>
      <Heatmap
        className="flex h-full lg:justify-center"
        height={600}
        color="blues"
        precision={[1, 1]}
        data={data}
      />
    </Section>
  );
};

export default LifeExpectancyHeatmap;
