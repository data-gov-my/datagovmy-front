import { f as u } from "./function-uncurry-this.js";
import { f } from "./fails.js";
import { i as l } from "./is-callable.js";
import { c as v } from "./classof.js";
import { g as p } from "./get-built-in.js";
import { i as m } from "./inspect-source.js";
var C = u,
  y = f,
  s = l,
  h = v,
  x = p,
  R = m,
  e = function () {},
  T = [],
  n = x("Reflect", "construct"),
  o = /^\s*(?:class|function)\b/,
  $ = C(o.exec),
  b = !o.exec(e),
  t = function (r) {
    if (!s(r)) return !1;
    try {
      return n(e, T, r), !0;
    } catch {
      return !1;
    }
  },
  a = function (r) {
    if (!s(r)) return !1;
    switch (h(r)) {
      case "AsyncFunction":
      case "GeneratorFunction":
      case "AsyncGeneratorFunction":
        return !1;
    }
    try {
      return b || !!$(o, R(r));
    } catch {
      return !0;
    }
  };
a.sham = !0;
var g =
  !n ||
  y(function () {
    var c;
    return (
      t(t.call) ||
      !t(Object) ||
      !t(function () {
        c = !0;
      }) ||
      c
    );
  })
    ? a
    : t;
export { g as i };
