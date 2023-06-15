import { _ as n } from "../internals/export.js";
import { d as c } from "../internals/descriptors.js";
import { o as m } from "../internals/own-keys.js";
import { t as v } from "../internals/to-indexed-object.js";
import "../internals/object-get-own-property-descriptor.js";
import { c as d } from "../internals/create-property.js";
import { __exports as y } from "../../../_virtual/object-get-own-property-descriptor.js";
var f = n,
  O = c,
  w = m,
  P = v,
  g = y,
  u = d;
f(
  { target: "Object", stat: !0, sham: !O },
  {
    getOwnPropertyDescriptors: function (s) {
      for (var e = P(s), i = g.f, t = w(e), o = {}, a = 0, p, r; t.length > a; )
        (r = i(e, (p = t[a++]))), r !== void 0 && u(o, p, r);
      return o;
    },
  }
);
