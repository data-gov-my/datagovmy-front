import { useMemo as t } from "react";
const n = (c, e) => {
  const o = t(
    () =>
      Object.entries(c).map(([s, r]) => [s, r.slice(e ? e[0] : 0, e ? e[1] + 1 : r.length - 1)]),
    [c, e]
  );
  return {
    coordinate: (() => Object.fromEntries(o))(),
  };
};
export { n as useSlice };
