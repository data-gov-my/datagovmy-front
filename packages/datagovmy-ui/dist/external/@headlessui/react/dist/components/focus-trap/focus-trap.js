import E, { useRef as T } from "react";
import { forwardRefWithAs as I, render as N } from "../../utils/render.js";
import { useServerHandoffComplete as O } from "../../hooks/use-server-handoff-complete.js";
import { useSyncRefs as C } from "../../hooks/use-sync-refs.js";
import { Hidden as D, Features as k } from "../../internal/hidden.js";
import {
  focusIn as F,
  Focus as p,
  focusElement as l,
  FocusResult as W,
} from "../../utils/focus-management.js";
import { match as h } from "../../utils/match.js";
import { useEvent as H } from "../../hooks/use-event.js";
import { useTabDirection as _, Direction as w } from "../../hooks/use-tab-direction.js";
import { useIsMounted as M } from "../../hooks/use-is-mounted.js";
import { useOwnerDocument as j } from "../../hooks/use-owner.js";
import { useEventListener as x } from "../../hooks/use-event-listener.js";
import { microTask as $ } from "../../utils/micro-task.js";
import { useWatch as L } from "../../hooks/use-watch.js";
import { useDisposables as X } from "../../hooks/use-disposables.js";
import { onDocumentReady as q } from "../../utils/document-ready.js";
import { useOnUnmount as z } from "../../hooks/use-on-unmount.js";
function B(e) {
  if (!e) return /* @__PURE__ */ new Set();
  if (typeof e == "function") return new Set(e());
  let r = /* @__PURE__ */ new Set();
  for (let t of e.current) t.current instanceof HTMLElement && r.add(t.current);
  return r;
}
let G = "div";
var R = (e => (
  (e[(e.None = 1)] = "None"),
  (e[(e.InitialFocus = 2)] = "InitialFocus"),
  (e[(e.TabLock = 4)] = "TabLock"),
  (e[(e.FocusLock = 8)] = "FocusLock"),
  (e[(e.RestoreFocus = 16)] = "RestoreFocus"),
  (e[(e.All = 30)] = "All"),
  e
))(R || {});
function J(e, r) {
  let t = T(null),
    n = C(t, r),
    { initialFocus: c, containers: m, features: o = 30, ...u } = e;
  O() || (o = 1);
  let f = j(t);
  U({ ownerDocument: f }, !!(o & 16));
  let i = V({ ownerDocument: f, container: t, initialFocus: c }, !!(o & 2));
  Y({ ownerDocument: f, container: t, containers: m, previousActiveElement: i }, !!(o & 8));
  let g = _(),
    y = H(a => {
      let d = t.current;
      d &&
        (v => v())(() => {
          h(g.current, {
            [w.Forwards]: () => {
              F(d, p.First, { skipElements: [a.relatedTarget] });
            },
            [w.Backwards]: () => {
              F(d, p.Last, { skipElements: [a.relatedTarget] });
            },
          });
        });
    }),
    S = X(),
    b = T(!1),
    P = {
      ref: n,
      onKeyDown(a) {
        a.key == "Tab" &&
          ((b.current = !0),
          S.requestAnimationFrame(() => {
            b.current = !1;
          }));
      },
      onBlur(a) {
        let d = B(m);
        t.current instanceof HTMLElement && d.add(t.current);
        let v = a.relatedTarget;
        v instanceof HTMLElement &&
          v.dataset.headlessuiFocusGuard !== "true" &&
          (A(d, v) ||
            (b.current
              ? F(
                  t.current,
                  h(g.current, { [w.Forwards]: () => p.Next, [w.Backwards]: () => p.Previous }) |
                    p.WrapAround,
                  { relativeTo: a.target }
                )
              : a.target instanceof HTMLElement && l(a.target)));
      },
    };
  return E.createElement(
    E.Fragment,
    null,
    !!(o & 4) &&
      E.createElement(D, {
        "as": "button",
        "type": "button",
        "data-headlessui-focus-guard": !0,
        "onFocus": y,
        "features": k.Focusable,
      }),
    N({ ourProps: P, theirProps: u, defaultTag: G, name: "FocusTrap" }),
    !!(o & 4) &&
      E.createElement(D, {
        "as": "button",
        "type": "button",
        "data-headlessui-focus-guard": !0,
        "onFocus": y,
        "features": k.Focusable,
      })
  );
}
let K = I(J),
  Ee = Object.assign(K, { features: R }),
  s = [];
q(() => {
  function e(r) {
    r.target instanceof HTMLElement &&
      r.target !== document.body &&
      s[0] !== r.target &&
      (s.unshift(r.target), (s = s.filter(t => t != null && t.isConnected)), s.splice(10));
  }
  window.addEventListener("click", e, { capture: !0 }),
    window.addEventListener("mousedown", e, { capture: !0 }),
    window.addEventListener("focus", e, { capture: !0 }),
    document.body.addEventListener("click", e, { capture: !0 }),
    document.body.addEventListener("mousedown", e, { capture: !0 }),
    document.body.addEventListener("focus", e, { capture: !0 });
});
function Q(e = !0) {
  let r = T(s.slice());
  return (
    L(
      ([t], [n]) => {
        n === !0 &&
          t === !1 &&
          $(() => {
            r.current.splice(0);
          }),
          n === !1 && t === !0 && (r.current = s.slice());
      },
      [e, s, r]
    ),
    H(() => {
      var t;
      return (t = r.current.find(n => n != null && n.isConnected)) != null ? t : null;
    })
  );
}
function U({ ownerDocument: e }, r) {
  let t = Q(r);
  L(() => {
    r || ((e == null ? void 0 : e.activeElement) === (e == null ? void 0 : e.body) && l(t()));
  }, [r]),
    z(() => {
      r && l(t());
    });
}
function V({ ownerDocument: e, container: r, initialFocus: t }, n) {
  let c = T(null),
    m = M();
  return (
    L(() => {
      if (!n) return;
      let o = r.current;
      o &&
        $(() => {
          if (!m.current) return;
          let u = e == null ? void 0 : e.activeElement;
          if (t != null && t.current) {
            if ((t == null ? void 0 : t.current) === u) {
              c.current = u;
              return;
            }
          } else if (o.contains(u)) {
            c.current = u;
            return;
          }
          t != null && t.current
            ? l(t.current)
            : F(o, p.First) === W.Error &&
              console.warn("There are no focusable elements inside the <FocusTrap />"),
            (c.current = e == null ? void 0 : e.activeElement);
        });
    }, [n]),
    c
  );
}
function Y({ ownerDocument: e, container: r, containers: t, previousActiveElement: n }, c) {
  let m = M();
  x(
    e == null ? void 0 : e.defaultView,
    "focus",
    o => {
      if (!c || !m.current) return;
      let u = B(t);
      r.current instanceof HTMLElement && u.add(r.current);
      let f = n.current;
      if (!f) return;
      let i = o.target;
      i && i instanceof HTMLElement
        ? A(u, i)
          ? ((n.current = i), l(i))
          : (o.preventDefault(), o.stopPropagation(), l(f))
        : l(n.current);
    },
    !0
  );
}
function A(e, r) {
  for (let t of e) if (t.contains(r)) return !0;
  return !1;
}
export { Ee as FocusTrap };
