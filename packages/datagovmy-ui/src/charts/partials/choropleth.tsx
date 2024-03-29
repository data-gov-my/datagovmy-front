import { CatalogueContext } from "../../contexts/catalogue";
import { default as dynamic } from "next/dynamic";
import { FunctionComponent, useContext } from "react";

const Choropleth = dynamic(() => import("../choropleth"), {
  ssr: false,
});

interface CatalogueChoroplethProps {
  className?: string;
  config: any;
  isPreview?: boolean;
}

const CatalogueChoropleth: FunctionComponent<CatalogueChoroplethProps> = ({
  className = "h-[350px] w-full lg:h-[450px]",
  config,
  isPreview = false,
}) => {
  const { bind, dataset } = useContext(CatalogueContext);

  return (
    <Choropleth
      _ref={_ref => bind.chartjs(_ref)}
      className={className}
      enableTooltip={isPreview ? false : true}
      data={{
        labels: dataset.chart.x,
        values: dataset.chart.y,
      }}
      precision={config.precision}
      color={config.color}
      type={config.geojson}
    />
  );
};

export default CatalogueChoropleth;
