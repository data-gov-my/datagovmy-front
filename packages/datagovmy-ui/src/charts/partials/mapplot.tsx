import { default as dynamic } from "next/dynamic";
import { FunctionComponent, useContext, useMemo } from "react";
import { MarkerData } from "../map-plot";
import { CatalogueContext } from "../../contexts/catalogue";

const MapPlot = dynamic(() => import("../map-plot"), {
  ssr: false,
});
interface CatalogueMapPlotProps {
  className?: string;
}

const CatalogueMapPlot: FunctionComponent<CatalogueMapPlotProps> = ({
  className = "h-[350px] w-full lg:h-[450px]",
}) => {
  const { bind, dataset } = useContext(CatalogueContext);

  const markers = useMemo<MarkerData>(() => {
    const _markers: MarkerData = dataset.chart.map((e: any) => {
      const { position, ...tooltip } = e;
      return {
        position: position,
        tooltip: tooltip,
      };
    });
    return _markers;
  }, [dataset.chart]);

  return (
    <MapPlot
      _ref={bind.leaflet}
      id={dataset.meta.unique_id}
      className={className}
      markers={markers}
    />
  );
};

export default CatalogueMapPlot;
