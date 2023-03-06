import { FunctionComponent, MutableRefObject, ReactElement, useEffect, useRef } from "react";
import { LatLngExpression, Map } from "leaflet";
import { MapContainer, TileLayer, useMap, Marker, Popup, GeoJSON } from "react-leaflet";
import type { GeoJsonObject } from "geojson";
import bbox from "geojson-bbox";

type OSMapWrapperProps = {
  className?: string;
  title?: string | ReactElement;
  date?: string;
  position?: LatLngExpression;
  enableZoom?: boolean;
  zoom?: number;
  geojson?: GeoJsonObject;
  markers?: MarkerProp[];
};

type MarkerProp = {
  position: LatLngExpression;
  name?: string | ReactElement;
};

const OSMapWrapper: FunctionComponent<OSMapWrapperProps> = ({
  className = "h-[400px] w-full",
  title,
  date,
  position = [5.1420589, 109.618149], // default - Malaysia
  enableZoom = true,
  zoom = 5,
  markers,
  geojson,
}) => {
  return (
    <div className={className}>
      <div className="flex items-baseline justify-between pb-5">
        <h4>{title}</h4>
        {date && <p className="text-sm text-dim">{date}</p>}
      </div>

      <MapContainer
        className={["rounded-xl", className].join(" ")}
        center={position}
        zoom={zoom}
        zoomControl={enableZoom}
        scrollWheelZoom={true}
      >
        <OSMapControl position={position} zoom={zoom} geojson={geojson} />
        {geojson && (
          <GeoJSON
            key={Math.random() * 10} // random uid required to refresh change in geojson
            data={geojson}
            style={{
              color: "#000",
              fill: false,
              weight: 1,
            }}
          />
        )}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url={`https://api.maptiler.com/maps/pastel/{z}/{x}/{y}.png?key=${process.env.NEXT_PUBLIC_MAPTILER_API_KEY}`}
        />
        {markers?.map((item: any) => (
          <Marker key={item.name} position={item.position} autoPan>
            <Popup>{item.name}</Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

interface OSMapControl {
  position: LatLngExpression;
  zoom?: number;
  geojson?: GeoJsonObject;
}

const OSMapControl: FunctionComponent<OSMapControl> = ({ geojson }) => {
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

const dummy: MarkerProp[] = [
  {
    position: [51.505, -0.09],
    name: "A pretty CSS3 popup. <br> Easily customizable.",
  },
  {
    position: [51.51, -0.1],
    name: "Another pretty CSS3 popup. <br> Easily customizable.",
  },
];

export default OSMapWrapper;
