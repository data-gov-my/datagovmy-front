import { Color, useColor } from "@hooks/useColor";
import { MapControl, MapControlRef } from "@hooks/useMap";
import { useTranslation } from "@hooks/useTranslation";
import { numFormat } from "@lib/helpers";
import type { FeatureCollection } from "geojson";
import { LatLng, LatLngBounds, LatLngExpression, LatLngTuple } from "leaflet";
import { useTheme } from "next-themes";
import {
  ForwardedRef,
  FunctionComponent,
  ReactElement,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from "react";
import { GeoJSON, MapContainer, TileLayer, Tooltip } from "react-leaflet";
import type { ChoroplethData } from ".";
import ChartHeader, { ChartHeaderProps } from "../ChartHeader";

export interface GeoChoroplethRef {
  print: (text: string) => void;
}
interface GeoChoroplethProps extends ChartHeaderProps {
  id?: string;
  className?: string;
  type?: "state" | "parlimen" | "dun" | "district";
  color?: Color;
  unit?: string;
  precision?: number | [number, number];
  data?: ChoroplethData;
  position?: LatLngExpression;
  enableZoom?: boolean;
  zoom?: number;
  _ref?: ForwardedRef<GeoChoroplethRef>;
  onReady?: (value: true) => void;
}

type MarkerProp = {
  position: LatLngExpression;
  name?: string | ReactElement;
};

const GeoChoropleth: FunctionComponent<GeoChoroplethProps> = ({
  id,
  className = "h-full w-full",
  title,
  menu,
  controls,
  type = "state",
  position = [5.1420589, 109.618149], // default - Malaysia
  data = dummyData,
  color = "reds",
  precision = 1,
  unit,
  enableZoom = true,
  zoom = 5,
  onReady,
  _ref,
}) => {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const ref = useRef<MapControlRef>(null);
  const [choromap, setChoromap] = useState<FeatureCollection | undefined>(undefined);

  const [min, max] = useMemo<[number, number]>(() => {
    let min: number = data.values[0];
    let max: number = data.values[0];
    for (let num of data.values) {
      if (num !== null) {
        if (num < min) {
          min = num;
        }
        if (num > max) {
          max = num;
        }
      }
    }

    return [min, max];
  }, [data]);

  const { interpolate } = useColor(color, [min, max]);

  useEffect(() => {
    import(`@lib/geojson/${type}/_map`).then(item => {
      setChoromap(item.default as unknown as FeatureCollection);
      if (onReady) onReady(true);
    });
  }, [type]);

  useImperativeHandle(
    _ref,
    () => {
      return {
        print: (text: string) => ref.current?.printAsImage(text),
      };
    },
    [ref]
  );

  return (
    <div className={className}>
      <ChartHeader title={title} menu={menu} controls={controls} />
      <MapContainer
        id={id}
        className={className}
        center={position as LatLngTuple}
        zoom={zoom}
        zoomControl={enableZoom}
        scrollWheelZoom={true}
        minZoom={6}
        maxBounds={new LatLngBounds(new LatLng(0.8, 97), new LatLng(10, 122))}
        maxBoundsViscosity={1}
      >
        {/* Map Controls */}
        <MapControl ref={ref} />

        {/* GeoChoropleth */}
        <>
          {data &&
            choromap?.features.map(feature => {
              const value = data.values[data.labels.indexOf(feature.properties![type])];

              return (
                <GeoJSON
                  key={feature.id}
                  data={feature}
                  style={{
                    color: "#0000001A",
                    fillColor: interpolate(value),
                    fillOpacity: 0.6,
                  }}
                  onEachFeature={(_, layer) => {
                    layer.on({
                      mouseover: ref.current?.highlightFeature,
                      mouseout: ref.current?.resetHighlight,
                      click: ref.current?.zoomToFeature,
                    });
                  }}
                >
                  <Tooltip key={value} sticky>
                    {feature.properties![type]}:{" "}
                    {value !== null
                      ? numFormat(value, "standard", precision).concat(unit ?? "")
                      : t("common.no_data")}
                  </Tooltip>
                </GeoJSON>
              );
            })}
        </>
        <TileLayer
          key={theme}
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url={`${process.env.NEXT_PUBLIC_TILESERVER_URL}/styles/${theme}/{z}/{x}/{y}.png`}
        />
      </MapContainer>
    </div>
  );
};

const dummyData = {
  labels: [
    "Johor",
    "Kedah",
    "Kelantan",
    "Melaka",
    "Negeri Sembilan",
    "Pahang",
    "Pulau Pinang",
    "Perak",
    "Perlis",
    "Selangor",
    "Terengganu",
    "Sabah",
    "Sarawak",
    "W.P. Kuala Lumpur",
    "W.P. Labuan",
    "W.P. Putrajaya",
  ],
  values: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16],
};

const dummyMarker: MarkerProp[] = [
  {
    position: [51.505, -0.09],
    name: "A pretty CSS3 popup. <br> Easily customizable.",
  },
  {
    position: [51.51, -0.1],
    name: "Another pretty CSS3 popup. <br> Easily customizable.",
  },
];

export default GeoChoropleth;
