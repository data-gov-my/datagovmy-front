import { useState, useMemo, useCallback } from "react";

/**
 * Exports the subject to 'png' or 'svg'
 * @param mounted Hook to check if the target element is mounted.
 * @returns { onRefChange, png, svg }
 */
export const useExport = (mounted: boolean) => {
  const [element, setElement] = useState<SVGSVGElement | undefined>();
  const [png, setPNG] = useState<string | undefined>(undefined);
  const onRefChange = useCallback(
    (node: any) => {
      if (node !== null) {
        const svg = node.querySelector("svg");

        setElement(svg);
        if (svg !== null) {
          convertSVGtoPNG(svg).then(item => setPNG(item));
        }
      }
    },
    [mounted]
  );

  const convertSVGtoPNG = async (svgElement: SVGSVGElement): Promise<string | undefined> => {
    return new Promise(resolve => {
      const base64 =
        "data:image/svg+xml;base64," +
        Buffer.from(new XMLSerializer().serializeToString(svgElement)).toString("base64");

      let img = document.createElement("img");
      img.onload = function () {
        document.body.appendChild(img);
        let canvas = document.createElement("canvas");
        document.body.removeChild(img);
        canvas.width = svgElement!.clientWidth;
        canvas.height = svgElement!.clientHeight;
        let ctx = canvas.getContext("2d");
        if (ctx === null) return;
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        try {
          let data = canvas.toDataURL("image/png");
          resolve(data);
        } catch (e) {
          resolve(undefined);
        }
      };
      img.onerror = function () {
        resolve(undefined);
      };
      img.src = base64;
    });
  };

  const svg = useMemo(() => {
    return element
      ? "data:image/svg+xml;base64," +
          Buffer.from(new XMLSerializer().serializeToString(element)).toString("base64")
      : undefined;
  }, [element, mounted]);

  return {
    onRefChange,
    png: png,
    svg: svg,
  };
};
