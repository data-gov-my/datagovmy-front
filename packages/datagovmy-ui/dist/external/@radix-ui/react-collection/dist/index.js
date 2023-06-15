import t from "react";
import { createContextScope as b } from "../../react-context/dist/index.js";
import { useComposedRefs as p } from "../../react-compose-refs/dist/index.js";
import { Slot as u } from "../../react-slot/dist/index.js";
function N(s) {
  const a = s + "CollectionProvider",
    [C, R] = b(a),
    [x, f] = C(a, {
      collectionRef: {
        current: null,
      },
      itemMap: /* @__PURE__ */ new Map(),
    }),
    M = r => {
      const { scope: e, children: l } = r,
        o = t.useRef(null),
        c = t.useRef(/* @__PURE__ */ new Map()).current;
      return /* @__PURE__ */ t.createElement(
        x,
        {
          scope: e,
          itemMap: c,
          collectionRef: o,
        },
        l
      );
    },
    $ = s + "CollectionSlot",
    I = /* @__PURE__ */ t.forwardRef((r, e) => {
      const { scope: l, children: o } = r,
        c = f($, l),
        n = p(e, c.collectionRef);
      return /* @__PURE__ */ t.createElement(
        u,
        {
          ref: n,
        },
        o
      );
    }),
    S = s + "CollectionItemSlot",
    d = "data-radix-collection-item",
    E = /* @__PURE__ */ t.forwardRef((r, e) => {
      const { scope: l, children: o, ...c } = r,
        n = t.useRef(null),
        m = p(e, n),
        i = f(S, l);
      return (
        t.useEffect(
          () => (
            i.itemMap.set(n, {
              ref: n,
              ...c,
            }),
            () => void i.itemMap.delete(n)
          )
        ),
        /* @__PURE__ */ t.createElement(
          u,
          {
            [d]: "",
            ref: m,
          },
          o
        )
      );
    });
  function A(r) {
    const e = f(s + "CollectionConsumer", r);
    return t.useCallback(() => {
      const o = e.collectionRef.current;
      if (!o) return [];
      const c = Array.from(o.querySelectorAll(`[${d}]`));
      return Array.from(e.itemMap.values()).sort(
        (i, _) => c.indexOf(i.ref.current) - c.indexOf(_.ref.current)
      );
    }, [e.collectionRef, e.itemMap]);
  }
  return [
    {
      Provider: M,
      Slot: I,
      ItemSlot: E,
    },
    A,
    R,
  ];
}
export { N as createCollection };
