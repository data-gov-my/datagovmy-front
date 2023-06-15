import { __exports as s } from "../../../_virtual/object-define-properties.js";
import { d as f } from "./descriptors.js";
import { v as n } from "./v8-prototype-define-bug.js";
import "./object-define-property.js";
import { a as m } from "./an-object.js";
import { t as v } from "./to-indexed-object.js";
import { o as d } from "./object-keys.js";
import { __exports as c } from "../../../_virtual/object-define-property.js";
var b = f,
  j = n,
  P = c,
  y = m,
  _ = v,
  x = d;
s.f =
  b && !j
    ? Object.defineProperties
    : function (e, r) {
        y(e);
        for (var i = _(r), o = x(r), p = o.length, t = 0, a; p > t; ) P.f(e, (a = o[t++]), i[a]);
        return e;
      };
export { s as default };
