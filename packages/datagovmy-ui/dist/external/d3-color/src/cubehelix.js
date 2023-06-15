import N, { extend as v } from "./define.js";
import { Rgb as C, rgbConvert as x, Color as y, brighter as p, darker as g } from "./color.js";
import { degrees as B, radians as D } from "./math.js";
var M = -0.14861,
  o = 1.78277,
  f = -0.29227,
  l = -0.90649,
  e = 1.97294,
  w = e * l,
  d = e * o,
  m = o * f - l * M;
function E(t) {
  if (t instanceof s) return new s(t.h, t.s, t.l, t.opacity);
  t instanceof C || (t = x(t));
  var i = t.r / 255,
    r = t.g / 255,
    n = t.b / 255,
    h = (m * n + w * i - d * r) / (m + w - d),
    a = n - h,
    u = (e * (r - h) - f * a) / l,
    b = Math.sqrt(u * u + a * a) / (e * h * (1 - h)),
    c = b ? Math.atan2(u, a) * B - 120 : NaN;
  return new s(c < 0 ? c + 360 : c, b, h, t.opacity);
}
function A(t, i, r, n) {
  return arguments.length === 1 ? E(t) : new s(t, i, r, n ?? 1);
}
function s(t, i, r, n) {
  (this.h = +t), (this.s = +i), (this.l = +r), (this.opacity = +n);
}
N(
  s,
  A,
  v(y, {
    brighter: function (t) {
      return (t = t == null ? p : Math.pow(p, t)), new s(this.h, this.s, this.l * t, this.opacity);
    },
    darker: function (t) {
      return (t = t == null ? g : Math.pow(g, t)), new s(this.h, this.s, this.l * t, this.opacity);
    },
    rgb: function () {
      var t = isNaN(this.h) ? 0 : (this.h + 120) * D,
        i = +this.l,
        r = isNaN(this.s) ? 0 : this.s * i * (1 - i),
        n = Math.cos(t),
        h = Math.sin(t);
      return new C(
        255 * (i + r * (M * n + o * h)),
        255 * (i + r * (f * n + l * h)),
        255 * (i + r * (e * n)),
        this.opacity
      );
    },
  })
);
export { s as Cubehelix, A as default };
