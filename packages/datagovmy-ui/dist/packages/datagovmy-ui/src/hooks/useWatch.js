import { useRef as s, useEffect as u } from "react";
const n = (r, t = [], f = !1) => {
  const e = s(!0);
  u(() => {
    if (!f && e.current) {
      e.current = !1;
      return;
    }
    r();
  }, t);
};
export { n as useWatch };
