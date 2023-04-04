import {
  ForwardedRef,
  FunctionComponent,
  ReactElement,
  useEffect,
  useImperativeHandle,
  useRef,
} from "react";
import { LatLng, LatLngBounds, LatLngTuple } from "leaflet";
import { MapContainer, TileLayer, useMap, Marker, Popup, GeoJSON } from "react-leaflet";
import type { GeoJsonObject } from "geojson";
import bbox from "geojson-bbox";
import { useTheme } from "next-themes";
import { MapControl, MapControlRef } from "@hooks/useMap";

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

export type MarkerData = Array<{
  position: LatLngTuple;
  name?: string | ReactElement;
}>;

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
  const ref = useRef<MapControlRef>(null);

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
    <MapContainer
      id={id}
      key={markers?.length} // random uid required to refresh change in geojson
      className={className}
      center={position}
      zoom={zoom}
      zoomControl={enableZoom}
      scrollWheelZoom={true}
      minZoom={6}
      maxBounds={new LatLngBounds(new LatLng(1, 97), new LatLng(10, 122))}
      maxBoundsViscosity={1}
    >
      <MapControl ref={ref} />

      {geojson && (
        <>
          <GeoJSONControl position={position} zoom={zoom} geojson={geojson} />
          <GeoJSON
            key={Math.random() * 10} // random uid required to refresh change in geojson
            data={geojson}
            style={{
              color: "#000",
              fill: false,
              weight: 1,
            }}
          />
        </>
      )}
      <TileLayer
        key={theme}
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url={`${process.env.NEXT_PUBLIC_TILESERVER_URL}/styles/${theme}/{z}/{x}/{y}.png`}
      />
      {markers?.map((item: any) => (
        <Marker key={item.name} position={item.position} autoPan draggable>
          <Popup>{item.name}</Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

interface GeoJSONControl {
  position: LatLngTuple;
  zoom?: number;
  geojson?: GeoJsonObject;
}

const GeoJSONControl: FunctionComponent<GeoJSONControl> = ({ geojson }) => {
  const map = useMap();
  useEffect(() => {
    if (geojson) {
      const bound: [number, number, number, number] = bbox(geojson);
      map.fitBounds([
        [bound[1], bound[0]],
        [bound[3], bound[2]],
      ]);
      setTimeout(() => {
        map.panBy([-100, 0]);
      }, 150);
    }
  }, [geojson]);

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
