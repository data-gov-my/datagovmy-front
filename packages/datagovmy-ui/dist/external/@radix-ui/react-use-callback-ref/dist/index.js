import { useRef as t, useEffect as u, useMemo as a } from "react";
function o(c) {
  const e = t(c);
  return (
    u(() => {
      e.current = c;
    }),
    a(
      () =>
        (...f) => {
          var r;
          return (r = e.current) === null || r === void 0 ? void 0 : r.call(e, ...f);
        },
      []
    )
  );
}
export { o as useCallbackRef };
