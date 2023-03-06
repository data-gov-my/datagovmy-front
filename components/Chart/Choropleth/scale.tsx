import { FunctionComponent } from "react";
import { useTranslation } from "@hooks/useTranslation";
import { sequentialColorSchemes, colorSchemes } from "@nivo/colors";
import type { ChoroplethColors } from "@lib/types";
import { numFormat } from "@lib/helpers";

/**
 * Choropleth Scale Component
 * @todo Needs rework.
 */
interface ChoroplethScaleProps {
  colors: ChoroplethColors;
  domain?: [number, number];
  unit?: string;
}
const ChoroplethScale: FunctionComponent<ChoroplethScaleProps> = ({
  colors,
  domain,
  unit = "",
}) => {
  const { t } = useTranslation();
  //   const color: string[] = Object.assign(
  //     [],
  //     sequentialColorSchemes[colors][sequentialColorSchemes[colors].length - 1]
  //   );
  //   const [min, max] = [color[0], color[color.length - 1]];

  return (
    <div className="absolute bottom-1 right-1 w-full lg:ml-auto lg:w-[280px]">
      <div
        className="h-3 w-full border border-black bg-white"
        // style={{ backgroundImage: `linear-gradient(to right, ${min}, ${max})` }}
      />
      <div className="flex w-full justify-between">
        <small>{domain ? numFormat(domain[0], "standard") + unit : t("common.minimum")}</small>
        <small>{domain ? numFormat(domain[1], "standard") + unit : t("common.maximum")}</small>
      </div>
    </div>
  );
};

export default ChoroplethScale;
