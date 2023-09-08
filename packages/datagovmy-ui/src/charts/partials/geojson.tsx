import { CatalogueContext } from "../../contexts/catalogue";
import { default as dynamic } from "next/dynamic";
import { FunctionComponent, useContext } from "react";

const GeoChoropleth = dynamic(() => import("../geochoropleth"), {
  ssr: false,
});

interface CatalogueGeojsonProps {
  className?: string;
  config: any;
}

const CatalogueGeojson: FunctionComponent<CatalogueGeojsonProps> = ({
  className = "h-[450px] w-full",
  config,
}) => {
  const { bind, dataset } = useContext(CatalogueContext);

  return (
    <GeoChoropleth
      _ref={bind.leaflet}
      id={dataset.meta.unique_id}
      className={className}
      type={config.geojson}
      color={config.color}
      enableFill={false}
    />
  );
};

export default CatalogueGeojson;
