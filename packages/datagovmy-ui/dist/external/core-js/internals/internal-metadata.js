import { __module as p } from "../../../_virtual/internal-metadata.js";
import { _ as l } from "./export.js";
import { f as y } from "./function-uncurry-this.js";
import { h as b } from "./hidden-keys.js";
import { i as d } from "./is-object.js";
import { h as x } from "./has-own-property.js";
import "./object-define-property.js";
import "./object-get-own-property-names.js";
import "./object-get-own-property-names-external.js";
import { o as O } from "./object-is-extensible.js";
import { u as g } from "./uid.js";
import { f as E } from "./freezing.js";
import { __exports as _ } from "../../../_virtual/object-define-property.js";
import { __exports as h } from "../../../_virtual/object-get-own-property-names.js";
import { __exports as w } from "../../../_virtual/object-get-own-property-names-external.js";
var P = l,
  j = y,
  D = b,
  N = d,
  n = x,
  M = _.f,
  m = h,
  k = w,
  s = O,
  I = g,
  F = E,
  u = !1,
  e = I("meta"),
  K = 0,
  f = function (r) {
    M(r, e, {
      value: {
        objectID: "O" + K++,
        // object ID
        weakData: {},
        // weak collections IDs
      },
    });
  },
  T = function (r, t) {
    if (!N(r)) return typeof r == "symbol" ? r : (typeof r == "string" ? "S" : "P") + r;
    if (!n(r, e)) {
      if (!s(r)) return "F";
      if (!t) return "E";
      f(r);
    }
    return r[e].objectID;
  },
  $ = function (r, t) {
    if (!n(r, e)) {
      if (!s(r)) return !0;
      if (!t) return !1;
      f(r);
    }
    return r[e].weakData;
  },
  z = function (r) {
    return F && u && s(r) && !n(r, e) && f(r), r;
  },
  A = function () {
    (G.enable = function () {}), (u = !0);
    var r = m.f,
      t = j([].splice),
      i = {};
    (i[e] = 1),
      r(i).length &&
        ((m.f = function (v) {
          for (var a = r(v), o = 0, c = a.length; o < c; o++)
            if (a[o] === e) {
              t(a, o, 1);
              break;
            }
          return a;
        }),
        P(
          { target: "Object", stat: !0, forced: !0 },
          {
            getOwnPropertyNames: k.f,
          }
        ));
  },
  G = (p.exports = {
    enable: A,
    fastKey: T,
    getWeakData: $,
    onFreeze: z,
  });
D[e] = !0;
var rr = p.exports;
export { rr as i };
