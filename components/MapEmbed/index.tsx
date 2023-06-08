import { FunctionComponent, useMemo } from "react";
interface MapEmbedProps {
  className?: string;
  lat?: number;
  lon?: number;
  place?: string;
}

const MapEmbed: FunctionComponent<MapEmbedProps> = ({ className, lat, lon, place }) => {
  const url = useMemo(
    () => `https://www.google.com/maps/embed/v1/place?key=${process.env.NEXT_PUBLIC_GMAP_API_KEY}
    &q=${place ? encodeURIComponent(place as string) : `${lat},${lon}`}&language=en`,
    [lat, lon, place]
  );
  return (
    <div className={className}>
      <iframe
        width="100%"
        height="100%"
        className="border-0"
        loading="lazy"
        allowFullScreen
        src={url}
      />
    </div>
  );
};

export default MapEmbed;
