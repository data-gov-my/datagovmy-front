import { ResponsiveChoropleth } from "@nivo/geo";
import { FunctionComponent, useMemo, useRef, useEffect } from "react";
import { default as ChartHeader, ChartHeaderProps } from "@components/Chart/ChartHeader";
import ParliamentDesktop from "@lib/geojson/parlimen_desktop.json";
import ParliamentMobile from "@lib/geojson/parlimen_mobile.json";
import DistrictDesktop from "@lib/geojson/district_desktop.json";
import DistrictMobile from "@lib/geojson/district_mobile.json";
import DunDesktop from "@lib/geojson/dun_desktop.json";
import DunMobile from "@lib/geojson/dun_mobile.json";
import StateDesktop from "@lib/geojson/state_desktop.json";
import StateMobile from "@lib/geojson/state_mobile.json";
import { numFormat } from "@lib/helpers";
import { BREAKPOINTS } from "@lib/constants";
import { useWindowWidth } from "@hooks/useWindowWidth";
import { useTranslation } from "@hooks/useTranslation";
import { useZoom } from "@hooks/useZoom";
import { ArrowPathIcon, MinusSmallIcon, PlusSmallIcon } from "@heroicons/react/24/outline";
import type { ChoroplethColors } from "@lib/types";
import ChoroplethScale from "./scale";

/**
 * Choropleth component
 */

interface ChoroplethProps extends ChartHeaderProps {
  className?: string;
  data?: any;
  prefixY?: string;
  unitY?: string;
  precision?: number | [number, number];
  enableZoom?: boolean;
  enableScale?: boolean;
  graphChoice?: "state" | "parlimen" | "dun" | "district";
  colorScale?: ChoroplethColors | "white" | string[];
  hideValue?: boolean;
  borderWidth?: any;
  borderColor?: any;
  projectionTranslation?: any;
  projectionScaleSetting?: number;
  onReady?: (status: boolean) => void;
}

const Choropleth: FunctionComponent<ChoroplethProps> = ({
  className = "h-[460px]",
  controls,
  menu,
  title,
  data = dummyData,
  prefixY,
  precision = 1,
  unitY,
  graphChoice = "state",
  enableScale = false,
  colorScale,
  borderWidth = 0.25,
  borderColor = "#13293d",
  enableZoom = true,
  hideValue = false,
  onReady,
}) => {
  const { t } = useTranslation();

  const zoomRef = useRef(null);
  const { onWheel, onMove, onDown, onUp, onReset, zoomIn, zoomOut } = useZoom(enableZoom, zoomRef);
  const domain: [number, number] = [
    Math.min.apply(
      Math,
      data.map((item: any) => item.value)
    ),
    Math.max.apply(
      Math,
      data.map((item: any) => item.value)
    ),
  ];
  const windowWidth = useWindowWidth();
  const presets = useMemo(
    () => ({
      parlimen: {
        feature:
          windowWidth < BREAKPOINTS.MD ? ParliamentMobile.features : ParliamentDesktop.features,
        projectionScale: windowWidth < BREAKPOINTS.MD ? 1800 : 3400,
        projectionTranslation:
          windowWidth < BREAKPOINTS.MD
            ? ([0.5, 0.9] as [number, number])
            : ([0.67, 1.05] as [number, number]),
        margin: { top: 0, right: 0, bottom: 0, left: 0 },
      },
      dun: {
        feature: windowWidth < BREAKPOINTS.MD ? DunMobile.features : DunDesktop.features,
        projectionScale: windowWidth < BREAKPOINTS.MD ? 1800 : 3400,
        projectionTranslation:
          windowWidth < BREAKPOINTS.MD
            ? ([0.5, 0.9] as [number, number])
            : ([0.67, 1.05] as [number, number]),
        margin: { top: 0, right: 0, bottom: 0, left: 0 },
      },
      district: {
        feature: windowWidth < BREAKPOINTS.MD ? DistrictMobile.features : DistrictDesktop.features,
        projectionScale: windowWidth < BREAKPOINTS.MD ? windowWidth * 4.5 : 3500,
        projectionTranslation:
          windowWidth < BREAKPOINTS.MD
            ? ([0.5, 0.9] as [number, number])
            : ([0.6, 1.0] as [number, number]),
        margin: { top: 0, right: 0, bottom: 0, left: 0 },
      },
      state: {
        feature: windowWidth < BREAKPOINTS.MD ? StateMobile.features : StateDesktop.features,
        projectionScale: windowWidth < BREAKPOINTS.MD ? windowWidth * 4.5 : 3500,
        projectionTranslation:
          windowWidth < BREAKPOINTS.MD
            ? ([0.5, 0.9] as [number, number])
            : ([0.6, 1.0] as [number, number]),
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
      colors: colorScale === "white" ? ["#fff"] : colorScale,
      margin: presets[graphChoice].margin,
      projectionScale: presets[graphChoice].projectionScale,
      projectionTranslation: presets[graphChoice].projectionTranslation,
      borderWidth: borderWidth,
      borderColor: borderColor,
    }),
    [colorScale, borderWidth, borderColor, windowWidth]
  );

  const tooltip = (y: number, x?: string) => {
    if (!x) return <></>;
    if (!y)
      return (
        <div className="nivo-tooltip">
          {x} : {t("common.no_data")}
        </div>
      );

    const special_code: Record<string, any> = {
      "-1": ": " + t("common.no_data"),
      "-1.1": <></>,
    };
    return (
      <div className="nivo-tooltip">
        {x}
        {hideValue ? (
          <></>
        ) : special_code[y.toString()] ? (
          special_code[y.toString()]
        ) : (
          `: ${prefixY ?? ""}${numFormat(y, "standard", precision)}${unitY ?? ""}`
        )}
      </div>
    );
  };

  useEffect(() => {
    if (onReady) onReady(true);
  }, []);
  return (
    <div className="relative">
      <ChartHeader title={title} menu={menu} controls={controls} />

      <div
        className={`border border-outline border-opacity-0 transition-all active:border-opacity-100 ${className}`}
        ref={zoomRef}
        // onWheel={onWheel}
        onMouseMove={onMove}
        onMouseDown={onDown}
        onMouseUp={onUp}
        onTouchStart={onDown}
        onTouchEnd={onUp}
        onTouchMove={onMove}
        // onMouseOut={onUp}
      >
        <ResponsiveChoropleth
          data={data}
          features={config.feature}
          margin={config.margin}
          colors={config.colors}
          domain={domain}
          unknownColor="#fff"
          projectionType="mercator"
          projectionScale={config.projectionScale}
          projectionTranslation={config.projectionTranslation}
          projectionRotation={[-114, 0, 0]}
          borderWidth={config.borderWidth}
          borderColor={config.borderColor}
          tooltip={({ feature: { data } }) => tooltip(data?.value, data?.id)}
        />
      </div>
      {enableZoom && (
        <div className="absolute right-1 top-1 z-10 flex w-fit justify-end gap-2">
          <button className="rounded border bg-white p-1 active:bg-outline" onClick={onReset}>
            <ArrowPathIcon className="h-4 w-4 p-0.5" />
          </button>
          <div>
            <button
              className="rounded rounded-r-none border bg-white p-1 active:bg-outline"
              onClick={zoomIn}
            >
              <PlusSmallIcon className="h-4 w-4" />
            </button>
            <button
              className="rounded rounded-l-none border border-l-0 bg-white p-1 active:bg-outline"
              onClick={zoomOut}
            >
              <MinusSmallIcon className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* {enableScale && <ChoroplethScale colors={colorScale} domain={domain} />} */}
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
