import h, {
  createContext as g,
  useContext as m,
  useRef as P,
  useMemo as p,
  useState as C,
  useEffect as d,
  Fragment as E,
} from "react";
import { createPortal as O } from "react-dom";
import { forwardRefWithAs as b, render as y } from "../../utils/render.js";
import { useIsoMorphicEffect as c } from "../../hooks/use-iso-morphic-effect.js";
import { usePortalRoot as A } from "../../internal/portal-force-root.js";
import { useServerHandoffComplete as D } from "../../hooks/use-server-handoff-complete.js";
import { useSyncRefs as R, optionalRef as I } from "../../hooks/use-sync-refs.js";
import { useOnUnmount as T } from "../../hooks/use-on-unmount.js";
import { useOwnerDocument as S } from "../../hooks/use-owner.js";
import { env as $ } from "../../utils/env.js";
import { useEvent as v } from "../../hooks/use-event.js";
function j(a) {
  let n = A(),
    u = m(x),
    e = S(a),
    [o, l] = C(() => {
      if ((!n && u !== null) || $.isServer) return null;
      let r = e == null ? void 0 : e.getElementById("headlessui-portal-root");
      if (r) return r;
      if (e === null) return null;
      let t = e.createElement("div");
      return t.setAttribute("id", "headlessui-portal-root"), e.body.appendChild(t);
    });
  return (
    d(() => {
      o !== null && ((e != null && e.body.contains(o)) || e == null || e.body.appendChild(o));
    }, [o, e]),
    d(() => {
      n || (u !== null && l(u.current));
    }, [u, l, n]),
    o
  );
}
let w = E;
function F(a, n) {
  let u = a,
    e = P(null),
    o = R(
      I(s => {
        e.current = s;
      }),
      n
    ),
    l = S(e),
    r = j(e),
    [t] = C(() => {
      var s;
      return $.isServer
        ? null
        : (s = l == null ? void 0 : l.createElement("div")) != null
        ? s
        : null;
    }),
    i = m(f),
    N = D();
  return (
    c(() => {
      !r || !t || r.contains(t) || (t.setAttribute("data-headlessui-portal", ""), r.appendChild(t));
    }, [r, t]),
    c(() => {
      if (t && i) return i.register(t);
    }, [i, t]),
    T(() => {
      var s;
      !r ||
        !t ||
        (t instanceof Node && r.contains(t) && r.removeChild(t),
        r.childNodes.length <= 0 && ((s = r.parentElement) == null || s.removeChild(r)));
    }),
    N
      ? !r || !t
        ? null
        : O(y({ ourProps: { ref: o }, theirProps: u, defaultTag: w, name: "Portal" }), t)
      : null
  );
}
let G = E,
  x = g(null);
function M(a, n) {
  let { target: u, ...e } = a,
    o = { ref: R(n) };
  return h.createElement(
    x.Provider,
    { value: u },
    y({ ourProps: o, theirProps: e, defaultTag: G, name: "Popover.Group" })
  );
}
let f = g(null);
function V() {
  let a = m(f),
    n = P([]),
    u = v(l => (n.current.push(l), a && a.register(l), () => e(l))),
    e = v(l => {
      let r = n.current.indexOf(l);
      r !== -1 && n.current.splice(r, 1), a && a.unregister(l);
    }),
    o = p(() => ({ register: u, unregister: e, portals: n }), [u, e, n]);
  return [
    n,
    p(
      () =>
        function ({ children: l }) {
          return h.createElement(f.Provider, { value: o }, l);
        },
      [o]
    ),
  ];
}
let U = b(F),
  _ = b(M),
  Y = Object.assign(U, { Group: _ });
export { Y as Portal, V as useNestedPortals };
