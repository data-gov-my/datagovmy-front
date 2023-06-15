import { g as p } from "../internals/global.js";
import { d as u } from "../internals/dom-iterables.js";
import { d as w } from "../internals/dom-token-list-prototype.js";
import { e as y } from "./es.array.iterator.js";
import { c as h } from "../internals/create-non-enumerable-property.js";
import { w as S } from "../internals/well-known-symbol.js";
var v = p,
  n = u,
  k = w,
  e = y,
  m = h,
  b = S,
  s = b("iterator"),
  i = b("toStringTag"),
  f = e.values,
  d = function (r, t) {
    if (r) {
      if (r[s] !== f)
        try {
          m(r, s, f);
        } catch {
          r[s] = f;
        }
      if ((r[i] || m(r, i, t), n[t])) {
        for (var a in e)
          if (r[a] !== e[a])
            try {
              m(r, a, e[a]);
            } catch {
              r[a] = e[a];
            }
      }
    }
  };
for (var o in n) d(v[o] && v[o].prototype, o);
d(k, "DOMTokenList");
