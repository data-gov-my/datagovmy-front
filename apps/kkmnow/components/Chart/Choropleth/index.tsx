import { FeatureAccessor, ResponsiveChoropleth } from "@nivo/geo";
import { FunctionComponent, ReactElement, useMemo, useState } from "react";
import { ChartHeader } from "@components/index";
import ParliamentDesktop from "@lib/geojson/parlimen_desktop.json";
import ParliamentMobile from "@lib/geojson/parlimen_mobile.json";
import DunDesktop from "@lib/geojson/dun_desktop.json";
import DunMobile from "@lib/geojson/dun_mobile.json";
import StateDesktop from "@lib/geojson/state_desktop.json";
import StateMobile from "@lib/geojson/state_mobile.json";
import { numFormat } from "@lib/helpers";
import { BREAKPOINTS } from "@lib/constants";
import { ColorInterpolatorId } from "@nivo/colors";
import { useWindowWidth } from "@hooks/useWindowWidth";
import { useTranslation } from "next-i18next";

/**
 * Choropleth component
 */

interface ChoroplethProps {
  className?: string;
  menu?: ReactElement;
  title?: string;
  controls?: ReactElement;
  data?: any;
  unitY?: string;
  enableScale?: boolean;
  graphChoice?: "state" | "parliament" | "dun";
  colorScale?: ColorInterpolatorId | string[] | FeatureAccessor<any, string> | string;
  borderWidth?: any;
  borderColor?: any;
  projectionTranslation?: any;
  projectionScaleSetting?: number;
}

const Choropleth: FunctionComponent<ChoroplethProps> = ({
  className = "h-[400px]",
  controls,
  menu,
  title,
  data = dummyData,
  unitY,
  graphChoice = "state",
  colorScale,
  borderWidth = 0.25,
  borderColor = "#13293d",
}) => {
  const { t } = useTranslation();
  const windowWidth = useWindowWidth();
  const presets = useMemo(
    () => ({
      parliament: {
        feature:
          windowWidth < BREAKPOINTS.MD ? ParliamentMobile.features : ParliamentDesktop.features,
        projectionScale: 3500,
        projectionTranslation: [0.65, 0.9] as [number, number],
        margin: { top: 0, right: 0, bottom: 0, left: 0 },
      },
      dun: {
        feature: windowWidth < BREAKPOINTS.MD ? DunMobile.features : DunDesktop.features,
        projectionScale: 3500,
        projectionTranslation: [0.65, 0.9] as [number, number],
        margin: { top: 0, right: 0, bottom: 0, left: 0 },
      },
      state: {
        feature: windowWidth < BREAKPOINTS.MD ? StateMobile.features : StateDesktop.features,
        projectionScale: windowWidth < BREAKPOINTS.MD ? windowWidth * 4.5 : 3500,
        projectionTranslation:
          windowWidth < BREAKPOINTS.MD
            ? ([0.5, 1.0] as [number, number])
            : ([0.65, 1.0] as [number, number]),
        margin:
          windowWidth < BREAKPOINTS.MD
            ? { top: -30, right: 0, bottom: 0, left: 0 }
            : { top: 0, right: 0, bottom: 0, left: 0 },
      },
    }),
    [windowWidth]
  );

  const config = useMemo(
    () => ({
      feature: presets[graphChoice].feature,
      colors: colorScale,
      margin: presets[graphChoice].margin,
      projectionScale: presets[graphChoice].projectionScale,
      projectionTranslation: presets[graphChoice].projectionTranslation,
      borderWidth: borderWidth,
      borderColor: borderColor,
    }),
    [colorScale, borderWidth, borderColor, windowWidth]
  );

  return (
    <div>
      <ChartHeader title={title} menu={menu} controls={controls} />
      <div className={className}>
        <ResponsiveChoropleth
          data={data}
          features={config.feature}
          margin={config.margin}
          colors={config.colors}
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
          projectionRotation={[-114, 0, 0]}
          borderWidth={config.borderWidth}
          borderColor={config.borderColor}
          tooltip={({ feature: { data } }) => {
            return data?.id ? (
              <div className="nivo-tooltip">
                {data.id}:{" "}
                {data.value === -1 ? (
                  t("common.no_data")
                ) : data.value_real ? (
                  <>
                    {numFormat(data.value_real, "standard")} {unitY}
                  </>
                ) : (
                  <>
                    {numFormat(data.value, "standard")}
                    {unitY}
                  </>
                )}
              </div>
            ) : (
              <></>
            );
          }}
        />
      </div>
      {/* {enableScale && <ChoroplethScale colors={colorScale}></ChoroplethScale>} */}
    </div>
  );
};

/**
 * Choropleth Scale Component
 */
interface ChoroplethScaleProps {
  colors: string[];
}
const ChoroplethScale: FunctionComponent<ChoroplethScaleProps> = ({ colors }) => {
  const [min, max] = [colors[0], colors[colors.length - 1]];

  return (
    <div>
      <div
        className="h-3 w-full border border-black lg:ml-auto lg:max-w-[280px]"
        style={{ backgroundImage: `linear-gradient(to right, ${min}, ${max})` }}
      ></div>
      <div className="flex w-full justify-between lg:ml-auto lg:max-w-[280px]">
        <small>Minimum</small>
        <small>Maximum</small>
      </div>
    </div>
  );
};

const dummyData = [
  {
    id: "MYS",
    value: 416502,
  },
];

export default Choropleth;
