import { ResponsiveChoropleth } from "@nivo/geo";
import { FunctionComponent, ReactElement, useState } from "react";
import { default as ChartHeader } from "@components/Chart/ChartHeader";
import WorldDesktop from "@lib/geojson/world_desktop.json";
import { numFormat } from "@lib/helpers";

/**
 * World choropleth.
 * @todo Revamp or combine with <Choropleth />. If combine, lazy import the geojsons
 * @deprecated To be removed
 */
interface ChoroplethProps {
  className?: string;
  menu?: ReactElement;
  title?: string;
  controls?: ReactElement;
  data?: any;
  xKey?: string;
  unitY?: string;
  enableScale?: boolean;
  projectionScaleSetting?: number;
  projectionTranslationSetting?: [number, number];
}

/**
 * KKMNOW stuff. Refer above @todo.
 * @deprecate ChoroplethWorld.
 */
const ChoroplethWorld: FunctionComponent<ChoroplethProps> = ({
  className = "w-full h-[400px]",
  controls,
  menu,
  title,
  data = dummyData,
  unitY,
  enableScale = true,
  projectionScaleSetting = 125,
  projectionTranslationSetting = [0.5, 0.68],
  xKey,
}) => {
  const [feature, setState] = useState(WorldDesktop.features);
  const config = {
    colors: "blues",
    projectionScale: projectionScaleSetting,
    projectionTranslation: projectionTranslationSetting,
    borderWidth: 0.25,
    borderColor: "#13293d",
  };
  return (
    <div>
      <ChartHeader title={title} menu={menu} controls={controls} />
      <div className={className}>
        <ResponsiveChoropleth
          data={data}
          features={feature}
          margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
          label={xKey}
          colors={"blues"}
          domain={[
            Math.min.apply(
              Math,
              data.map((item: any) => item.value)
            ),
            Math.max.apply(
              Math,
              data.map((item: any) => item.value)
            ),
          ]}
          unknownColor="#fff"
          projectionType="mercator"
          projectionScale={config.projectionScale}
          projectionTranslation={config.projectionTranslation}
          projectionRotation={[0, 0, 0]}
          borderWidth={config.borderWidth}
          borderColor={config.borderColor}
          tooltip={({ feature: { data, label } }) => {
            return data?.id ? (
              <div className="nivo-tooltip">
                {label}: {numFormat(data.value_real, "standard")} {unitY}
              </div>
            ) : (
              <></>
            );
          }}
        />
      </div>
      {/* {enableScale && <ChoroplethScale data={data} colors={"blues"}></ChoroplethScale>} */}
    </div>
  );
};

/**
 * Choropleth Scale Component
 */
interface ChoroplethScaleProps {
  colors: string[];
  data: any;
}
const ChoroplethScale: FunctionComponent<ChoroplethScaleProps> = ({ colors, data }) => {
  const [min, max] = [colors[0], colors[colors.length - 1]];

  return (
    <div>
      <div
        className="h-3 w-full border border-black lg:ml-auto lg:max-w-[280px]"
        style={{ backgroundImage: `linear-gradient(to right, ${min}, ${max})` }}
      ></div>
      <div className="flex w-full justify-between lg:ml-auto lg:max-w-[280px]">
        <small>
          {Math.min.apply(
            Math,
            data.map((item: any) => item.value_real)
          )}
        </small>
        <small>
          {Math.max.apply(
            Math,
            data.map((item: any) => item.value_real)
          )}
        </small>
      </div>
    </div>
  );
};

const dummyData = [
  {
    id: "MYS",
    value: 416502,
  },
  {
    id: "AGO",
    value: 416502,
  },
];

export default ChoroplethWorld;
