import { LeafletMouseEvent } from "leaflet";
import {
  ForwardRefExoticComponent,
  ForwardedRef,
  forwardRef,
  useEffect,
  useImperativeHandle,
  useState,
} from "react";
import { useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet-easyprint";

interface MapControlProps {
  ref?: ForwardedRef<MapControlRef>;
}
export interface MapControlRef {
  zoomToFeature: (e: LeafletMouseEvent) => void;
  highlightFeature: (e: LeafletMouseEvent) => void;
  resetHighlight: (e: LeafletMouseEvent) => void;
  printAsImage: (text: string) => void;
}

export const MapControl: ForwardRefExoticComponent<MapControlProps> = forwardRef((_, ref) => {
  const map = useMap();
  const [print, setPrint] = useState<L.EasyPrint | undefined>(undefined);

  useEffect(() => {
    if (!print) {
      setPrint(
        L.easyPrint({
          hidden: true,
          exportOnly: true,
          sizeModes: ["Current"],
        })
      );
    } else {
      map.addControl(print);
    }
    return () => {
      print && map.removeControl(print);
    };
  }, [map, print]);

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

  const printAsImage = (text: string) => {
    if (!print) return;
    print.printMap("CurrentSize", text);
  };

  useImperativeHandle(
    ref,
    () => {
      return {
        zoomToFeature,
        highlightFeature,
        resetHighlight,
        printAsImage,
      };
    },
    [map, print]
  );

  return null;
});

MapControl.displayName = "MapControl";

export const redMarker = L.icon({
  iconUrl: "/static/images/icons/marker-red.png",
  iconRetinaUrl: "/static/images/icons/marker-red-2x.png",
  shadowUrl: "/static/images/icons/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  tooltipAnchor: [16, -28],
  shadowSize: [41, 41],
});

export const blueMarker = L.icon({
  iconUrl: "/static/images/icons/marker-icon.png",
  iconRetinaUrl: "/static/images/icons/marker-icon-2x.png",
  shadowUrl: "/static/images/icons/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  tooltipAnchor: [16, -28],
  shadowSize: [41, 41],
});
