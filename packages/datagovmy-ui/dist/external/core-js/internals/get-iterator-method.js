import { c as o } from "./classof.js";
import { __require as t } from "./get-method.js";
import { __require as a } from "./is-null-or-undefined.js";
import { i } from "./iterators.js";
import { w as s } from "./well-known-symbol.js";
var l = o,
  e = t(),
  m = a(),
  f = i,
  n = s,
  u = n("iterator"),
  q = function (r) {
    if (!m(r)) return e(r, u) || e(r, "@@iterator") || f[l(r)];
  };
export { q as g };
