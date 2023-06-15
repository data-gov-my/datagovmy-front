import y, { extend as $ } from "./define.js";
function b() {}
var c = 0.7,
  m = 1 / c,
  h = "\\s*([+-]?\\d+)\\s*",
  o = "\\s*([+-]?\\d*\\.?\\d+(?:[eE][+-]?\\d+)?)\\s*",
  i = "\\s*([+-]?\\d*\\.?\\d+(?:[eE][+-]?\\d+)?)%\\s*",
  _ = /^#([0-9a-f]{3,8})$/,
  C = new RegExp("^rgb\\(" + [h, h, h] + "\\)$"),
  I = new RegExp("^rgb\\(" + [i, i, i] + "\\)$"),
  S = new RegExp("^rgba\\(" + [h, h, h, o] + "\\)$"),
  j = new RegExp("^rgba\\(" + [i, i, i, o] + "\\)$"),
  O = new RegExp("^hsl\\(" + [o, i, i] + "\\)$"),
  z = new RegExp("^hsla\\(" + [o, i, i, o] + "\\)$"),
  v = {
    aliceblue: 15792383,
    antiquewhite: 16444375,
    aqua: 65535,
    aquamarine: 8388564,
    azure: 15794175,
    beige: 16119260,
    bisque: 16770244,
    black: 0,
    blanchedalmond: 16772045,
    blue: 255,
    blueviolet: 9055202,
    brown: 10824234,
    burlywood: 14596231,
    cadetblue: 6266528,
    chartreuse: 8388352,
    chocolate: 13789470,
    coral: 16744272,
    cornflowerblue: 6591981,
    cornsilk: 16775388,
    crimson: 14423100,
    cyan: 65535,
    darkblue: 139,
    darkcyan: 35723,
    darkgoldenrod: 12092939,
    darkgray: 11119017,
    darkgreen: 25600,
    darkgrey: 11119017,
    darkkhaki: 12433259,
    darkmagenta: 9109643,
    darkolivegreen: 5597999,
    darkorange: 16747520,
    darkorchid: 10040012,
    darkred: 9109504,
    darksalmon: 15308410,
    darkseagreen: 9419919,
    darkslateblue: 4734347,
    darkslategray: 3100495,
    darkslategrey: 3100495,
    darkturquoise: 52945,
    darkviolet: 9699539,
    deeppink: 16716947,
    deepskyblue: 49151,
    dimgray: 6908265,
    dimgrey: 6908265,
    dodgerblue: 2003199,
    firebrick: 11674146,
    floralwhite: 16775920,
    forestgreen: 2263842,
    fuchsia: 16711935,
    gainsboro: 14474460,
    ghostwhite: 16316671,
    gold: 16766720,
    goldenrod: 14329120,
    gray: 8421504,
    green: 32768,
    greenyellow: 11403055,
    grey: 8421504,
    honeydew: 15794160,
    hotpink: 16738740,
    indianred: 13458524,
    indigo: 4915330,
    ivory: 16777200,
    khaki: 15787660,
    lavender: 15132410,
    lavenderblush: 16773365,
    lawngreen: 8190976,
    lemonchiffon: 16775885,
    lightblue: 11393254,
    lightcoral: 15761536,
    lightcyan: 14745599,
    lightgoldenrodyellow: 16448210,
    lightgray: 13882323,
    lightgreen: 9498256,
    lightgrey: 13882323,
    lightpink: 16758465,
    lightsalmon: 16752762,
    lightseagreen: 2142890,
    lightskyblue: 8900346,
    lightslategray: 7833753,
    lightslategrey: 7833753,
    lightsteelblue: 11584734,
    lightyellow: 16777184,
    lime: 65280,
    limegreen: 3329330,
    linen: 16445670,
    magenta: 16711935,
    maroon: 8388608,
    mediumaquamarine: 6737322,
    mediumblue: 205,
    mediumorchid: 12211667,
    mediumpurple: 9662683,
    mediumseagreen: 3978097,
    mediumslateblue: 8087790,
    mediumspringgreen: 64154,
    mediumturquoise: 4772300,
    mediumvioletred: 13047173,
    midnightblue: 1644912,
    mintcream: 16121850,
    mistyrose: 16770273,
    moccasin: 16770229,
    navajowhite: 16768685,
    navy: 128,
    oldlace: 16643558,
    olive: 8421376,
    olivedrab: 7048739,
    orange: 16753920,
    orangered: 16729344,
    orchid: 14315734,
    palegoldenrod: 15657130,
    palegreen: 10025880,
    paleturquoise: 11529966,
    palevioletred: 14381203,
    papayawhip: 16773077,
    peachpuff: 16767673,
    peru: 13468991,
    pink: 16761035,
    plum: 14524637,
    powderblue: 11591910,
    purple: 8388736,
    rebeccapurple: 6697881,
    red: 16711680,
    rosybrown: 12357519,
    royalblue: 4286945,
    saddlebrown: 9127187,
    salmon: 16416882,
    sandybrown: 16032864,
    seagreen: 3050327,
    seashell: 16774638,
    sienna: 10506797,
    silver: 12632256,
    skyblue: 8900331,
    slateblue: 6970061,
    slategray: 7372944,
    slategrey: 7372944,
    snow: 16775930,
    springgreen: 65407,
    steelblue: 4620980,
    tan: 13808780,
    teal: 32896,
    thistle: 14204888,
    tomato: 16737095,
    turquoise: 4251856,
    violet: 15631086,
    wheat: 16113331,
    white: 16777215,
    whitesmoke: 16119285,
    yellow: 16776960,
    yellowgreen: 10145074,
  };
y(b, N, {
  copy: function (e) {
    return Object.assign(new this.constructor(), this, e);
  },
  displayable: function () {
    return this.rgb().displayable();
  },
  hex: M,
  // Deprecated! Use color.formatHex.
  formatHex: M,
  formatHsl: L,
  formatRgb: k,
  toString: k,
});
function M() {
  return this.rgb().formatHex();
}
function L() {
  return P(this).formatHsl();
}
function k() {
  return this.rgb().formatRgb();
}
function N(e) {
  var f, r;
  return (
    (e = (e + "").trim().toLowerCase()),
    (f = _.exec(e))
      ? ((r = f[1].length),
        (f = parseInt(f[1], 16)),
        r === 6
          ? R(f)
          : r === 3
          ? new a(
              ((f >> 8) & 15) | ((f >> 4) & 240),
              ((f >> 4) & 15) | (f & 240),
              ((f & 15) << 4) | (f & 15),
              1
            )
          : r === 8
          ? g((f >> 24) & 255, (f >> 16) & 255, (f >> 8) & 255, (f & 255) / 255)
          : r === 4
          ? g(
              ((f >> 12) & 15) | ((f >> 8) & 240),
              ((f >> 8) & 15) | ((f >> 4) & 240),
              ((f >> 4) & 15) | (f & 240),
              (((f & 15) << 4) | (f & 15)) / 255
            )
          : null)
      : (f = C.exec(e))
      ? new a(f[1], f[2], f[3], 1)
      : (f = I.exec(e))
      ? new a((f[1] * 255) / 100, (f[2] * 255) / 100, (f[3] * 255) / 100, 1)
      : (f = S.exec(e))
      ? g(f[1], f[2], f[3], f[4])
      : (f = j.exec(e))
      ? g((f[1] * 255) / 100, (f[2] * 255) / 100, (f[3] * 255) / 100, f[4])
      : (f = O.exec(e))
      ? E(f[1], f[2] / 100, f[3] / 100, 1)
      : (f = z.exec(e))
      ? E(f[1], f[2] / 100, f[3] / 100, f[4])
      : v.hasOwnProperty(e)
      ? R(v[e])
      : e === "transparent"
      ? new a(NaN, NaN, NaN, 0)
      : null
  );
}
function R(e) {
  return new a((e >> 16) & 255, (e >> 8) & 255, e & 255, 1);
}
function g(e, f, r, t) {
  return t <= 0 && (e = f = r = NaN), new a(e, f, r, t);
}
function A(e) {
  return (
    e instanceof b || (e = N(e)), e ? ((e = e.rgb()), new a(e.r, e.g, e.b, e.opacity)) : new a()
  );
}
function B(e, f, r, t) {
  return arguments.length === 1 ? A(e) : new a(e, f, r, t ?? 1);
}
function a(e, f, r, t) {
  (this.r = +e), (this.g = +f), (this.b = +r), (this.opacity = +t);
}
y(
  a,
  B,
  $(b, {
    brighter: function (e) {
      return (
        (e = e == null ? m : Math.pow(m, e)),
        new a(this.r * e, this.g * e, this.b * e, this.opacity)
      );
    },
    darker: function (e) {
      return (
        (e = e == null ? c : Math.pow(c, e)),
        new a(this.r * e, this.g * e, this.b * e, this.opacity)
      );
    },
    rgb: function () {
      return this;
    },
    displayable: function () {
      return (
        -0.5 <= this.r &&
        this.r < 255.5 &&
        -0.5 <= this.g &&
        this.g < 255.5 &&
        -0.5 <= this.b &&
        this.b < 255.5 &&
        0 <= this.opacity &&
        this.opacity <= 1
      );
    },
    hex: H,
    // Deprecated! Use color.formatHex.
    formatHex: H,
    formatRgb: q,
    toString: q,
  })
);
function H() {
  return "#" + p(this.r) + p(this.g) + p(this.b);
}
function q() {
  var e = this.opacity;
  return (
    (e = isNaN(e) ? 1 : Math.max(0, Math.min(1, e))),
    (e === 1 ? "rgb(" : "rgba(") +
      Math.max(0, Math.min(255, Math.round(this.r) || 0)) +
      ", " +
      Math.max(0, Math.min(255, Math.round(this.g) || 0)) +
      ", " +
      Math.max(0, Math.min(255, Math.round(this.b) || 0)) +
      (e === 1 ? ")" : ", " + e + ")")
  );
}
function p(e) {
  return (e = Math.max(0, Math.min(255, Math.round(e) || 0))), (e < 16 ? "0" : "") + e.toString(16);
}
function E(e, f, r, t) {
  return (
    t <= 0 ? (e = f = r = NaN) : r <= 0 || r >= 1 ? (e = f = NaN) : f <= 0 && (e = NaN),
    new n(e, f, r, t)
  );
}
function P(e) {
  if (e instanceof n) return new n(e.h, e.s, e.l, e.opacity);
  if ((e instanceof b || (e = N(e)), !e)) return new n();
  if (e instanceof n) return e;
  e = e.rgb();
  var f = e.r / 255,
    r = e.g / 255,
    t = e.b / 255,
    x = Math.min(f, r, t),
    l = Math.max(f, r, t),
    d = NaN,
    s = l - x,
    u = (l + x) / 2;
  return (
    s
      ? (f === l
          ? (d = (r - t) / s + (r < t) * 6)
          : r === l
          ? (d = (t - f) / s + 2)
          : (d = (f - r) / s + 4),
        (s /= u < 0.5 ? l + x : 2 - l - x),
        (d *= 60))
      : (s = u > 0 && u < 1 ? 0 : d),
    new n(d, s, u, e.opacity)
  );
}
function D(e, f, r, t) {
  return arguments.length === 1 ? P(e) : new n(e, f, r, t ?? 1);
}
function n(e, f, r, t) {
  (this.h = +e), (this.s = +f), (this.l = +r), (this.opacity = +t);
}
y(
  n,
  D,
  $(b, {
    brighter: function (e) {
      return (e = e == null ? m : Math.pow(m, e)), new n(this.h, this.s, this.l * e, this.opacity);
    },
    darker: function (e) {
      return (e = e == null ? c : Math.pow(c, e)), new n(this.h, this.s, this.l * e, this.opacity);
    },
    rgb: function () {
      var e = (this.h % 360) + (this.h < 0) * 360,
        f = isNaN(e) || isNaN(this.s) ? 0 : this.s,
        r = this.l,
        t = r + (r < 0.5 ? r : 1 - r) * f,
        x = 2 * r - t;
      return new a(
        w(e >= 240 ? e - 240 : e + 120, x, t),
        w(e, x, t),
        w(e < 120 ? e + 240 : e - 120, x, t),
        this.opacity
      );
    },
    displayable: function () {
      return (
        ((0 <= this.s && this.s <= 1) || isNaN(this.s)) &&
        0 <= this.l &&
        this.l <= 1 &&
        0 <= this.opacity &&
        this.opacity <= 1
      );
    },
    formatHsl: function () {
      var e = this.opacity;
      return (
        (e = isNaN(e) ? 1 : Math.max(0, Math.min(1, e))),
        (e === 1 ? "hsl(" : "hsla(") +
          (this.h || 0) +
          ", " +
          (this.s || 0) * 100 +
          "%, " +
          (this.l || 0) * 100 +
          "%" +
          (e === 1 ? ")" : ", " + e + ")")
      );
    },
  })
);
function w(e, f, r) {
  return (
    (e < 60 ? f + ((r - f) * e) / 60 : e < 180 ? r : e < 240 ? f + ((r - f) * (240 - e)) / 60 : f) *
    255
  );
}
export {
  b as Color,
  a as Rgb,
  m as brighter,
  c as darker,
  N as default,
  D as hsl,
  P as hslConvert,
  B as rgb,
  A as rgbConvert,
};
