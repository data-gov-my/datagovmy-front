import { MapControl, MapControlRef } from "@hooks/useMap";
import type { GeoJsonObject } from "geojson";
import { LatLng, LatLngBounds, LatLngTuple } from "leaflet";
import { useTheme } from "next-themes";
import { ForwardedRef, FunctionComponent, useImperativeHandle, useRef } from "react";
import { GeoJSON, MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import Markercluster from "./markercluster";

type MapPlotProps = {
  id?: string;
  _ref?: ForwardedRef<MapPlotRef>;
  className?: string;
  position?: LatLngTuple; // [lat: number, lng: number]
  enableZoom?: boolean;
  zoom?: number;
  geojson?: GeoJsonObject;
  markers?: MarkerData;
};

export interface MapPlotRef {
  print: (text: string) => void;
}

type MarkerDatum = {
  position: LatLngTuple;
  [key: string]: string | number | LatLngTuple;
};

export type MarkerData = MarkerDatum[];

const MapPlot: FunctionComponent<MapPlotProps> = ({
  id,
  className = "h-full lg:h-[500px] w-full",
  position = [5.1420589, 109.618149], // default: Malaysia
  enableZoom = true,
  zoom = 5,
  markers,
  geojson,
  _ref,
}) => {
  const { theme } = useTheme();
  const controlRef = useRef<MapControlRef>(null);

  useImperativeHandle(
    _ref,
    () => {
      return {
        print: (text: string) => controlRef.current?.printAsImage(text),
      };
    },
    [controlRef]
  );

  const printMarker = (item: Record<string, any>) => {
    let text = "";
    Object.entries(item).forEach(([key, value]) =>
      key === "position" ? null : (text += `${key}: ${value}\n`)
    );
    return text;
  };

  return (
    <MapContainer
      id={id}
      className={className}
      center={position}
      zoom={zoom}
      zoomControl={enableZoom}
      scrollWheelZoom={true}
      minZoom={6}
      maxBounds={new LatLngBounds(new LatLng(1, 97), new LatLng(10, 122))}
      maxBoundsViscosity={1}
    >
      <MapControl ref={controlRef} />

      <TileLayer
        key={theme}
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url={`${process.env.NEXT_PUBLIC_TILESERVER_URL}/styles/${theme}/{z}/{x}/{y}.png`}
      />
      <Markercluster chunkedLoading removeOutsideVisibleBounds chunkDelay={0} chunkInterval={50}>
        {markers?.map((item: MarkerDatum, index) => {
          return (
            <Marker key={index} position={item.position}>
              <Popup>{printMarker(item)}</Popup>
            </Marker>
          );
        })}
      </Markercluster>
    </MapContainer>
  );
};

interface GeoJSONControl {
  position: LatLngTuple;
  zoom?: number;
  geojson?: GeoJsonObject;
}

const GeoJSONControl: FunctionComponent<GeoJSONControl> = ({ geojson }) => {
  //   const map = useMap();
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
};

const dummy: MarkerData = [
  {
    position: [51.505, -0.09],
    name: "A pretty CSS3 popup. <br> Easily customizable.",
  },
  {
    position: [51.51, -0.1],
    name: "Another pretty CSS3 popup. <br> Easily customizable.",
  },
];

export default MapPlot;
