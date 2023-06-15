import l from "../../../../external/lodash/debounce.js";
import { useRouter as h } from "next/router";
import { useMemo as a, useCallback as j } from "react";
import { useData as q } from "./useData.js";
import { useWatch as $ } from "./useWatch.js";
const F = (m = {}, c = {}) => {
  const { data: o, setData: p } = q(m),
    n = h(),
    s = a(() => Object.entries(o).filter(([i, r]) => r != null && r.length !== 0 && r !== ""), [o]),
    f = a(
      () =>
        `?${s
          .map(([r, t]) =>
            !t && Array.isArray(t)
              ? `${r}=${t.map(e => e.value).join(",")}`
              : `${r}=${t.value ?? t}`
          )
          .join("&")}`,
      [o]
    ),
    u = j(
      l(i => {
        const r = i.map(([t, e]) => [
          t,
          Array.isArray(e) ? e.map(y => y.value).join(",") : typeof e == "string" ? e : e.value,
        ]);
        n.replace(
          {
            pathname: n.pathname,
            query: {
              ...c,
              ...Object.fromEntries(r),
            },
          },
          void 0,
          { scroll: !1 }
        );
      }, 500),
      []
    );
  return (
    $(() => {
      u(s);
    }, [o]),
    {
      filter: o,
      setFilter: p,
      queries: f,
      actives: s,
    }
  );
};
export { F as useFilter };
