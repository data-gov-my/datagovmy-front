import { FunctionComponent, ReactElement, useEffect } from "react";
import { LatLngExpression } from "leaflet";
import { MapContainer, TileLayer, useMap, Marker, Popup } from "react-leaflet";

type OSMapWrapperProps = {
  className?: string;
  title?: string | ReactElement;
  date?: string;
  position?: LatLngExpression;
  zoom?: number;
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
  zoom = 5,
  markers = dummy,
}) => {
  return (
    <div>
      <div className="flex items-baseline justify-between pb-5">
        <h4>{title}</h4>
        {date && <p className="text-sm text-dim">{date}</p>}
      </div>

      <MapContainer
        className={`rounded-xl ${className} z-0`}
        center={position}
        zoom={zoom}
        scrollWheelZoom={true}
      >
        <OSMapControl position={position} zoom={zoom} />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url={`https://api.maptiler.com/maps/pastel/{z}/{x}/{y}.png?key=${process.env.NEXT_PUBLIC_MAPTILER_API_KEY}`}
        />
        {markers.map((item: any) => (
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
}

const OSMapControl: FunctionComponent<OSMapControl> = ({ position, zoom = 5 }) => {
  const map = useMap();
  useEffect(() => {
    map.setView(position, zoom, { animate: true });
  }, [zoom, position]);
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
