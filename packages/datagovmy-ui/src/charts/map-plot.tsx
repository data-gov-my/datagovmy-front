import { MapControl, MapControlRef, blueMarker, redMarker } from "../hooks/useMap";
import type { GeoJsonObject } from "geojson";
import { LatLng, LatLngBounds, LatLngTuple } from "leaflet";
import { useTheme } from "next-themes";
import { ForwardedRef, FunctionComponent, useEffect, useImperativeHandle, useRef } from "react";
import { MapContainer, Marker, Popup, TileLayer, useMap, GeoJSON } from "react-leaflet";
import Markercluster from "./markercluster";
import bbox from "geojson-bbox";
import L from "leaflet";

type MapPlotProps = {
  id?: string;
  _ref?: ForwardedRef<MapPlotRef>;
  className?: string;
  position?: LatLngTuple; // [lat: number, lng: number]
  tileTheme?: "light" | "dark" | "terrain";
  enableZoom?: boolean;
  zoom?: number;
  geojson?: GeoJsonObject;
  markers?: MarkerData;
};

export interface MapPlotRef {
  print: (text: string) => void;
}

type MarkerDatum = {
  onMarkerClick?: () => void;
  position: [number, number];
  icon?: "red";
  tooltip: {
    [key: string]: string | number;
  };
};

export type MarkerData = MarkerDatum[];

const MapPlot: FunctionComponent<MapPlotProps> = ({
  id,
  className = "h-full lg:h-[500px] w-full",
  position = [5.1420589, 109.618149], // default: Malaysia
  tileTheme,
  enableZoom = true,
  zoom = 5,
  markers,
  geojson,
  _ref,
}) => {
  const { theme } = useTheme();
  const controlRef = useRef<MapControlRef>(null);
  const _theme = tileTheme ?? theme;
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

  // https://stackoverflow.com/questions/64665827/
  const ChangeView = ({ center }: { center: LatLngTuple }) => {
    const map = useMap();
    map.setView(center);
    return null;
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
      {geojson ? (
        <>
          <GeoJSONControl geojson={geojson} position={position} />
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
      ) : (
        <ChangeView center={position} />
      )}

      <TileLayer
        key={_theme}
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url={`${process.env.NEXT_PUBLIC_TILESERVER_URL}/styles/${_theme}/{z}/{x}/{y}.png`}
      />

      {markers && (
        <Markercluster chunkedLoading removeOutsideVisibleBounds chunkDelay={0} chunkInterval={50}>
          {markers.map((item: MarkerDatum, index) => {
            return (
              <Marker
                key={index}
                position={item.position}
                eventHandlers={
                  item.onMarkerClick && {
                    click: item.onMarkerClick,
                  }
                }
                icon={item.icon === "red" ? redMarker : blueMarker}
              >
                <Popup>{printMarker(item.tooltip)}</Popup>
              </Marker>
            );
          })}
        </Markercluster>
      )}
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
        map.panBy([-50, 0]);
      }, 150);
    }
  }, [geojson]);

  return null;
};

const dummy: MarkerData = [
  {
    position: [5.1420589, 109.618149],
    tooltip: { name: "A pretty CSS3 popup. <br> Easily customizable." },
  },
  {
    position: [5.1420589, 109.618149],
    tooltip: { name: "Another pretty CSS3 popup. <br> Easily customizable." },
  },
];

export default MapPlot;
