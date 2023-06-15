import { _ as $ } from "../internals/export.js";
import { g as b } from "../internals/get-built-in.js";
import { f as d } from "../internals/function-apply.js";
import { f as O } from "../internals/function-call.js";
import { f as C } from "../internals/function-uncurry-this.js";
import { f as A } from "../internals/fails.js";
import { i as I } from "../internals/is-callable.js";
import { i as N } from "../internals/is-symbol.js";
import { a as _ } from "../internals/array-slice.js";
import { g as h } from "../internals/get-json-replacer-function.js";
import { s as x } from "../internals/symbol-constructor-detection.js";
var B = $,
  y = b,
  S = d,
  E = O,
  u = C,
  F = A,
  s = I,
  l = N,
  D = _,
  R = h,
  L = x,
  T = String,
  t = y("JSON", "stringify"),
  f = u(/./.exec),
  c = u("".charAt),
  J = u("".charCodeAt),
  M = u("".replace),
  U = u((1).toString),
  V = /[\uD800-\uDFFF]/g,
  v = /^[\uD800-\uDBFF]$/,
  m = /^[\uDC00-\uDFFF]$/,
  p =
    !L ||
    F(function () {
      var r = y("Symbol")();
      return t([r]) != "[null]" || t({ a: r }) != "{}" || t(Object(r)) != "{}";
    }),
  g = F(function () {
    return t("\uDF06\uD834") !== '"\\udf06\\ud834"' || t("\uDEAD") !== '"\\udead"';
  }),
  W = function (r, e) {
    var i = D(arguments),
      n = R(e);
    if (!(!s(n) && (r === void 0 || l(r))))
      return (
        (i[1] = function (o, a) {
          if ((s(n) && (a = E(n, this, T(o), a)), !l(a))) return a;
        }),
        S(t, null, i)
      );
  },
  Y = function (r, e, i) {
    var n = c(i, e - 1),
      o = c(i, e + 1);
    return (f(v, r) && !f(m, o)) || (f(m, r) && !f(v, n)) ? "\\u" + U(J(r, 0), 16) : r;
  };
t &&
  B(
    { target: "JSON", stat: !0, arity: 3, forced: p || g },
    {
      // eslint-disable-next-line no-unused-vars -- required for `.length`
      stringify: function (e, i, n) {
        var o = D(arguments),
          a = S(p ? W : t, null, o);
        return g && typeof a == "string" ? M(a, V, Y) : a;
      },
    }
  );
