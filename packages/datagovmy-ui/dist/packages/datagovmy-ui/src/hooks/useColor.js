import m from "../../../../external/d3-scale-chromatic/src/sequential-single/Blues.js";
import n from "../../../../external/d3-scale-chromatic/src/diverging/BrBG.js";
import l from "../../../../external/d3-scale-chromatic/src/sequential-multi/BuGn.js";
import a from "../../../../external/d3-scale-chromatic/src/sequential-multi/BuPu.js";
import f from "../../../../external/d3-scale-chromatic/src/sequential-multi/cividis.js";
import u, {
  cool as s,
  warm as G,
} from "../../../../external/d3-scale-chromatic/src/sequential-multi/rainbow.js";
import B from "../../../../external/d3-scale-chromatic/src/sequential-multi/cubehelix.js";
import d from "../../../../external/d3-scale-chromatic/src/sequential-multi/GnBu.js";
import R from "../../../../external/d3-scale-chromatic/src/sequential-single/Greens.js";
import b from "../../../../external/d3-scale-chromatic/src/sequential-single/Greys.js";
import P, {
  inferno as c,
  magma as Y,
  plasma as g,
} from "../../../../external/d3-scale-chromatic/src/sequential-multi/viridis.js";
import y from "../../../../external/d3-scale-chromatic/src/sequential-multi/OrRd.js";
import O from "../../../../external/d3-scale-chromatic/src/sequential-single/Oranges.js";
import w from "../../../../external/d3-scale-chromatic/src/diverging/PRGn.js";
import x from "../../../../external/d3-scale-chromatic/src/diverging/PiYG.js";
import C from "../../../../external/d3-scale-chromatic/src/sequential-multi/PuBu.js";
import h from "../../../../external/d3-scale-chromatic/src/sequential-multi/PuBuGn.js";
import D from "../../../../external/d3-scale-chromatic/src/diverging/PuOr.js";
import S from "../../../../external/d3-scale-chromatic/src/sequential-multi/PuRd.js";
import z from "../../../../external/d3-scale-chromatic/src/sequential-single/Purples.js";
import T from "../../../../external/d3-scale-chromatic/src/diverging/RdBu.js";
import V from "../../../../external/d3-scale-chromatic/src/diverging/RdGy.js";
import j from "../../../../external/d3-scale-chromatic/src/sequential-multi/RdPu.js";
import k from "../../../../external/d3-scale-chromatic/src/diverging/RdYlBu.js";
import q from "../../../../external/d3-scale-chromatic/src/diverging/RdYlGn.js";
import v from "../../../../external/d3-scale-chromatic/src/sequential-single/Reds.js";
import A from "../../../../external/d3-scale-chromatic/src/sequential-multi/sinebow.js";
import E from "../../../../external/d3-scale-chromatic/src/diverging/Spectral.js";
import F from "../../../../external/d3-scale-chromatic/src/sequential-multi/turbo.js";
import H from "../../../../external/d3-scale-chromatic/src/sequential-multi/YlGn.js";
import I from "../../../../external/d3-scale-chromatic/src/sequential-multi/YlGnBu.js";
import J from "../../../../external/d3-scale-chromatic/src/sequential-multi/YlOrBr.js";
import K from "../../../../external/d3-scale-chromatic/src/sequential-multi/YlOrRd.js";
const wr = (t, o) => {
  const e = {
      blues: m,
      brBG: n,
      buGn: l,
      buPu: a,
      cividis: f,
      cool: s,
      cubehelixDefault: B,
      gnBu: d,
      greens: R,
      greys: b,
      inferno: c,
      magma: Y,
      orRd: y,
      oranges: O,
      pRGn: w,
      piYG: x,
      plasma: g,
      puBu: C,
      puBuGn: h,
      puOr: D,
      puRd: S,
      purples: z,
      rainbow: u,
      rdBu: T,
      rgGy: V,
      rdPu: j,
      rdYlBu: k,
      rdYlGn: q,
      reds: v,
      sinebow: A,
      spectral: E,
      turbo: F,
      viridis: P,
      warm: G,
      ylGn: H,
      ylGnBu: I,
      ylGnBr: J,
      ylOrRd: K,
    },
    i = r => (r - o[0]) / (o[1] - o[0]);
  return {
    interpolate: (r, p = !1) => (r === null || !r ? "#ffffff00" : p ? e[t](r) : e[t](i(r))),
  };
};
export { wr as useColor };
