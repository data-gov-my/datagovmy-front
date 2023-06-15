import { useState as n, useEffect as f } from "react";
import s from "../../../../external/dom-to-image/src/dom-to-image.js";
const v = (m, o) => {
  const [r, g] = n(void 0),
    [c, u] = n(void 0);
  return (
    f(() => {
      const t = document.getElementById(o);
      t !== null && (s.toPng(t).then(e => g(e)), s.toSvg(t).then(e => u(e)));
    }, [m, o]),
    {
      png: r,
      svg: c,
    }
  );
};
export { v as useExport };
