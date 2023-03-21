import {
  ForwardedRef,
  forwardRef,
  ForwardRefExoticComponent,
  FunctionComponent,
  ReactElement,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from "react";
import { LatLng, LatLngBounds, LatLngExpression, LeafletMouseEvent } from "leaflet";
import { MapContainer, TileLayer, useMap, GeoJSON, Tooltip } from "react-leaflet";
import type { FeatureCollection } from "geojson";
import { useTheme } from "next-themes";
import ChartHeader, { ChartHeaderProps } from "../ChartHeader";
import type { ChoroplethData } from ".";
import { useColor, Color } from "@hooks/useColor";
import { numFormat } from "@lib/helpers";
import { useTranslation } from "@hooks/useTranslation";

interface GeoChoroplethProps extends ChartHeaderProps {
  className?: string;
  type?: "state" | "parlimen" | "dun" | "district";
  color?: Color;
  unit?: string;
  precision?: number | [number, number];
  data?: ChoroplethData;
  position?: LatLngExpression;
  enableZoom?: boolean;
  zoom?: number;
}

type MarkerProp = {
  position: LatLngExpression;
  name?: string | ReactElement;
};

const GeoChoropleth: FunctionComponent<GeoChoroplethProps> = ({
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
}) => {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const ref = useRef<GeoControlRef>(null);
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
    });
  }, [type]);

  return (
    <div className={className}>
      <ChartHeader title={title} menu={menu} controls={controls} />
      <MapContainer
        className={className}
        center={position}
        zoom={zoom}
        zoomControl={enableZoom}
        scrollWheelZoom={true}
        minZoom={6}
        maxBounds={new LatLngBounds(new LatLng(0.8, 97), new LatLng(10, 122))}
        maxBoundsViscosity={1}
      >
        <GeoControl ref={ref} />
        {/* GeoChoropleth */}
        <>
          {data &&
            choromap?.features.map(feature => {
              const value = data.values[data.labels.indexOf(feature.properties![type])];

              return (
                <GeoJSON
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
                  <Tooltip sticky>
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
          url={`http://localhost:8080/styles/${theme}/{z}/{x}/{y}.png`}
        />
        {/* {markers?.map((item: any) => (
          <Marker key={item.name} position={item.position} autoPan>
            <Popup>{item.name}</Popup>
          </Marker>
        ))} */}
      </MapContainer>
    </div>
  );
};

interface GeoControlProps {
  ref?: ForwardedRef<GeoControlRef>;
}
interface GeoControlRef {
  zoomToFeature: (e: LeafletMouseEvent) => void;
  highlightFeature: (e: LeafletMouseEvent) => void;
  resetHighlight: (e: LeafletMouseEvent) => void;
}

const GeoControl: ForwardRefExoticComponent<GeoControlProps> = forwardRef((_, ref) => {
  const map = useMap();

  const highlightFeature = (e: LeafletMouseEvent) => {
    let layer = e.target;

    layer.setStyle({
      weight: 2,
      color: "#00000080",
    });

    layer.bringToFront();
  };

  const resetHighlight = (e: LeafletMouseEvent) => {
    let layer = e.target;

    layer.setStyle({
      color: "#0000001A",
      fillOpacity: 0.6,
    });
  };
  const zoomToFeature = (e: LeafletMouseEvent) => {
    map.fitBounds(e.target.getBounds());
  };

  useImperativeHandle(
    ref,
    () => {
      return {
        zoomToFeature,
        highlightFeature,
        resetHighlight,
      };
    },
    [map]
  );

  //   useEffect(() => {
  //     if (geojson) {
  //       const bound: [number, number, number, number] = bbox(geojson);
  //       map.fitBounds([
  //         [bound[1], bound[0]],
  //         [bound[3], bound[2]],
  //       ]);
  //       setTimeout(() => {
  //         map.panBy([-100, 0]);
  //       }, 150);
  //     }
  //   }, [geojson]);

  return null;

  //   return {
  //     zoomToFeature,
  //   };
});

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
