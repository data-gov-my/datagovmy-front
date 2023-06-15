import o from "./formatDecimal.js";
import u from "./formatPrefixAuto.js";
import r from "./formatRounded.js";
const c = {
  "%": function (t, n) {
    return (t * 100).toFixed(n);
  },
  "b": function (t) {
    return Math.round(t).toString(2);
  },
  "c": function (t) {
    return t + "";
  },
  "d": o,
  "e": function (t, n) {
    return t.toExponential(n);
  },
  "f": function (t, n) {
    return t.toFixed(n);
  },
  "g": function (t, n) {
    return t.toPrecision(n);
  },
  "o": function (t) {
    return Math.round(t).toString(8);
  },
  "p": function (t, n) {
    return r(t * 100, n);
  },
  r,
  "s": u,
  "X": function (t) {
    return Math.round(t).toString(16).toUpperCase();
  },
  "x": function (t) {
    return Math.round(t).toString(16);
  },
};
export { c as default };
