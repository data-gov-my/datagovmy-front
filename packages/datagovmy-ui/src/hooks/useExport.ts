import { useState, useEffect } from "react";
import domtoimage from "dom-to-image";
/**
 * Exports any HTMLElement to inline-data 'png' or 'svg'. Only used in <GeoChoropleth /> & <MapPlot />
 * @param {boolean} mounted Hook to check if the target element is mounted.
 * @param id Id of the HTMLElement to export
 * @returns { {png: string | undefined, svg: string |undefined}}
 */
export const useExport = (
  mounted: boolean,
  id: string
): { png: string | undefined; svg: string | undefined } => {
  const [png, setPNG] = useState<string | undefined>(undefined);
  const [svg, setSvg] = useState<string | undefined>(undefined);
  useEffect(() => {
    const element = document.getElementById(id);
    if (element !== null) {
      domtoimage.toPng(element).then(dataURL => setPNG(dataURL));
      domtoimage.toSvg(element).then(dataURL => setSvg(dataURL));
    }
  }, [mounted, id]);

  return {
    png,
    svg,
  };
};
