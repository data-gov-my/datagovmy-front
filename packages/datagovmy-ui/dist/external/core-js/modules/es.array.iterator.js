import { t as d } from "../internals/to-indexed-object.js";
import { a as l } from "../internals/add-to-unscopables.js";
import { i as m } from "../internals/iterators.js";
import { i as u } from "../internals/internal-state.js";
import "../internals/object-define-property.js";
import { i as p } from "../internals/iterator-define.js";
import { c } from "../internals/create-iter-result-object.js";
import { d as I } from "../internals/descriptors.js";
import { __exports as y } from "../../../_virtual/object-define-property.js";
var g = d,
  o = l,
  s = m,
  f = u,
  A = y.f,
  R = p,
  a = c,
  b = I,
  v = "Array Iterator",
  x = f.set,
  O = f.getterFor(v),
  E = R(
    Array,
    "Array",
    function (r, e) {
      x(this, {
        type: v,
        target: g(r),
        // target
        index: 0,
        // next index
        kind: e,
        // kind
      });
    },
    function () {
      var r = O(this),
        e = r.target,
        n = r.kind,
        t = r.index++;
      return !e || t >= e.length
        ? ((r.target = void 0), a(void 0, !0))
        : n == "keys"
        ? a(t, !1)
        : n == "values"
        ? a(e[t], !1)
        : a([t, e[t]], !1);
    },
    "values"
  ),
  i = (s.Arguments = s.Array);
o("keys");
o("values");
o("entries");
if (b && i.name !== "values")
  try {
    A(i, "name", { value: "values" });
  } catch {}
export { E as e };
