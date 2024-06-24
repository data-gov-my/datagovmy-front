import { FunctionComponent } from "react";
import dynamic from "next/dynamic";
import { WithData } from "datagovmy-ui/types";
import { HeatmapData, HeatmapDatum } from "datagovmy-ui/charts/heatmap";
import { useTranslation } from "datagovmy-ui/hooks";
import { Section } from "datagovmy-ui/components";

const Heatmap = dynamic(() => import("datagovmy-ui/charts/heatmap"), { ssr: false });

export interface WellbeingHeatmapProps {
  heatmap: WithData<HeatmapData>;
}

/**
 * Wellbeing Dashboard - Heatmap
 * @overview Status: Live
 */

const WellbeingHeatmap: FunctionComponent<WellbeingHeatmapProps> = ({ heatmap }) => {
  const { t } = useTranslation("dashboard-wellbeing");

  return (
    <Section title={t("heatmap_title")} date={heatmap.data_as_of}>
      <Heatmap
        className="flex h-full xl:justify-center"
        width={1280}
        height={720}
        color="blues"
        precision={1}
        data={heatmap.data
          .sort((a, b) => {
            if (a.y === b.y) {
              return b.z - a.z;
            } else {
              return (b.y as number) - (a.y as number);
            }
          })
          .map((item: HeatmapDatum) => ({
            x: item.y,
            y: t(`keys.${(item.x as string).slice(3)}`),
            z: item.z,
          }))}
      />
    </Section>
  );
};

export default WellbeingHeatmap;
