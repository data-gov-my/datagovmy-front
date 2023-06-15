import { DateTime as l } from "luxon";
import { createElement as u } from "react";
import { CountryAndStates as m } from "./packages/datagovmy-ui/src/lib/constants.js";
import f from "./external/dom-to-image/src/dom-to-image.js";
const F = (...r) => r.filter(Boolean).join(" "),
  M = (r, t) => r.reduce((n, o) => (n[t] > o[t] ? n : o)),
  b = (r, t) => r.reduce((n, o) => (n[t] < o[t] ? n : o)),
  D = (r, t = 100) => (r ? Math.min(Math.max(r, 0), t) : 0),
  A = r => {
    let t = 0,
      n = 0;
    for (let o of r) o !== null && (o < t && (t = o), o > n && (n = o));
    return [t, n];
  },
  d = (r, t = "compact", n = 1, o = "short", i = "en", e = !1) => {
    const [a, s] = Array.isArray(n) ? n : [n, 0];
    if (e === !0) {
      let c;
      return (
        r < 1e6 && r > -1e6
          ? (c = Intl.NumberFormat(i, {
              notation: t,
              maximumFractionDigits: a,
              minimumFractionDigits: s,
              compactDisplay: "short",
            }))
          : (c = Intl.NumberFormat(i, {
              notation: t,
              maximumFractionDigits: a,
              minimumFractionDigits: s,
              compactDisplay: o,
            })),
        c
          .format(r)
          .replace("trillion", "tril")
          .replace("trilion", "tril")
          .replace("billion", "bil")
          .replace("bilion", "bil")
          .replace("million", "mil")
      );
    } else
      return Intl.NumberFormat(i, {
        notation: t,
        maximumFractionDigits: a,
        minimumFractionDigits: s,
        compactDisplay: o,
      }).format(r);
  };
function N({ value: r, type: t = "compact", precision: n = 1, locale: o }) {
  return d(r, t, n, "long", o, !0);
}
const C = (r, t = "dd MMM yyyy", n = "en-GB") => {
    const i = (typeof r == "number" ? l.fromMillis(r) : l.fromSQL(r)).setLocale(n).toFormat(t);
    return i !== "Invalid DateTime" ? i : "N/A";
  },
  I = (r, t) =>
    r.sort((n, o) =>
      t
        ? n[t] === "mys"
          ? -1
          : m[n[t]].localeCompare(m[o[t]])
        : n === "mys"
        ? -1
        : m[n].localeCompare(m[o])
    ),
  w = (r, t) => r.sort((n, o) => n[t].localeCompare(o[t])),
  B = (r, t, n) => {
    const o = Array.from(r[t].keys()).sort((i, e) => n(r[t][i], r[t][e]));
    return Object.fromEntries(Object.entries(r).map(([i, e]) => [i, o.map(a => e[a])]));
  },
  E = async r => {
    try {
      await navigator.clipboard.writeText(r);
    } catch (t) {
      console.error("Failed to copy: ", t);
    }
  },
  O = (r, t, n = !1) => {
    const o = r.map((e, a) => [e, a]);
    return o.sort((e, a) => (n ? a[0] - e[0] : e[0] - a[0])), o.slice(0, t).map(e => e[1]);
  },
  S = (r, t) => {
    let n = document.createElement("a");
    (n.href = r), (n.target = "_blank"), (n.download = t), n.click();
  },
  T = r => Object.fromEntries(Object.entries(r).map(([t, n]) => [n, t])),
  P = (r, t) => {
    const n = Math.ceil(r.length / t),
      o = Array(n);
    let i = 0;
    for (let e = 0; e < n; e++) (o[e] = r.substring(i, t)), (i += t);
    return o;
  },
  _ = async (r, t) => (r === "svg" ? f.toSvg(t) : f.toPng(t)),
  j = r => {
    const t = /\[(.*?)\)/;
    let n = r.split(t);
    return n.length <= 1
      ? r
      : n.map(o => {
          const i = o.split("](");
          if (i.length <= 1) return u("span", { className: "text-inherit" }, o);
          const [e, a] = i;
          return u(
            "a",
            {
              href: a,
              className: "text-primary dark:text-primary-dark hover:underline inline",
              target: "_blank",
            },
            e
          );
        });
  },
  p = r => r.reduce((t, n) => t + n) / r.length,
  v = r => {
    const t = p(r),
      n = p(r.map(o => Math.pow(o - t, 2)));
    return Math.sqrt(n);
  },
  z = (r, t, n) => (r - t) / (n - t);
export {
  p as average,
  P as chunkSplit,
  F as clx,
  E as copyClipboard,
  S as download,
  _ as exportAs,
  T as flip,
  O as getTopIndices,
  j as interpolate,
  D as limitMax,
  M as maxBy,
  b as minBy,
  A as minMax,
  z as normalize,
  d as numFormat,
  N as smartNumFormat,
  w as sortAlpha,
  I as sortMsiaFirst,
  B as sortMulti,
  v as standardDeviation,
  C as toDate,
};
