import { _ as Z } from "../internals/export.js";
import { g as k } from "../internals/global.js";
import { f as A } from "../internals/function-call.js";
import { f as rr } from "../internals/function-uncurry-this.js";
import { d as er } from "../internals/descriptors.js";
import { s as tr } from "../internals/symbol-constructor-detection.js";
import { f as or } from "../internals/fails.js";
import { h as ar } from "../internals/has-own-property.js";
import { o as nr } from "../internals/object-is-prototype-of.js";
import { a as ir } from "../internals/an-object.js";
import { t as sr } from "../internals/to-indexed-object.js";
import { t as fr } from "../internals/to-property-key.js";
import { t as pr } from "../internals/to-string.js";
import { c as mr } from "../internals/create-property-descriptor.js";
import { o as ur } from "../internals/object-create.js";
import { o as lr } from "../internals/object-keys.js";
import "../internals/object-get-own-property-names.js";
import "../internals/object-get-own-property-names-external.js";
import "../internals/object-get-own-property-symbols.js";
import "../internals/object-get-own-property-descriptor.js";
import "../internals/object-define-property.js";
import "../internals/object-define-properties.js";
import "../internals/object-property-is-enumerable.js";
import { d as cr } from "../internals/define-built-in.js";
import { d as vr } from "../internals/define-built-in-accessor.js";
import { s as yr } from "../internals/shared.js";
import { s as dr } from "../internals/shared-key.js";
import { h as br } from "../internals/hidden-keys.js";
import { u as Pr } from "../internals/uid.js";
import { w as Sr } from "../internals/well-known-symbol.js";
import "../internals/well-known-symbol-wrapped.js";
import { w as gr } from "../internals/well-known-symbol-define.js";
import { s as wr } from "../internals/symbol-define-to-primitive.js";
import { s as hr } from "../internals/set-to-string-tag.js";
import { i as Or } from "../internals/internal-state.js";
import { a as $r } from "../internals/array-iteration.js";
import { __exports as jr } from "../../../_virtual/object-get-own-property-names.js";
import { __exports as _r } from "../../../_virtual/object-get-own-property-descriptor.js";
import { __exports as Er } from "../../../_virtual/object-define-property.js";
import { __exports as Ir } from "../../../_virtual/object-get-own-property-names-external.js";
import { __exports as Dr } from "../../../_virtual/object-get-own-property-symbols.js";
import { __exports as Tr } from "../../../_virtual/object-define-properties.js";
import { __exports as Kr } from "../../../_virtual/well-known-symbol-wrapped.js";
import { __exports as xr } from "../../../_virtual/object-property-is-enumerable.js";
var P = Z,
  K = k,
  x = A,
  Mr = rr,
  l = er,
  c = tr,
  Nr = or,
  n = ar,
  Br = nr,
  _ = ir,
  S = sr,
  M = fr,
  Cr = pr,
  E = mr,
  y = ur,
  R = lr,
  Gr = jr,
  W = Ir,
  Rr = Dr,
  Y = _r,
  L = Er,
  Wr = Tr,
  Q = xr,
  O = cr,
  Yr = vr,
  N = yr,
  Lr = dr,
  U = br,
  C = Pr,
  Qr = Sr,
  Ur = Kr,
  Fr = gr,
  Hr = wr,
  Jr = hr,
  F = Or,
  g = $r.forEach,
  i = Lr("hidden"),
  w = "Symbol",
  d = "prototype",
  Vr = F.set,
  G = F.getterFor(w),
  s = Object[d],
  u = K.Symbol,
  v = u && u[d],
  qr = K.TypeError,
  $ = K.QObject,
  H = Y.f,
  m = L.f,
  J = W.f,
  zr = Q.f,
  V = Mr([].push),
  f = N("symbols"),
  b = N("op-symbols"),
  Xr = N("wks"),
  I = !$ || !$[d] || !$[d].findChild,
  D =
    l &&
    Nr(function () {
      return (
        y(
          m({}, "a", {
            get: function () {
              return m(this, "a", { value: 7 }).a;
            },
          })
        ).a != 7
      );
    })
      ? function (o, r, t) {
          var e = H(s, r);
          e && delete s[r], m(o, r, t), e && o !== s && m(s, r, e);
        }
      : m,
  j = function (o, r) {
    var t = (f[o] = y(v));
    return (
      Vr(t, {
        type: w,
        tag: o,
        description: r,
      }),
      l || (t.description = r),
      t
    );
  },
  h = function (r, t, e) {
    r === s && h(b, t, e), _(r);
    var a = M(t);
    return (
      _(e),
      n(f, a)
        ? (e.enumerable
            ? (n(r, i) && r[i][a] && (r[i][a] = !1), (e = y(e, { enumerable: E(0, !1) })))
            : (n(r, i) || m(r, i, E(1, {})), (r[i][a] = !0)),
          D(r, a, e))
        : m(r, a, e)
    );
  },
  B = function (r, t) {
    _(r);
    var e = S(t),
      a = R(e).concat(X(e));
    return (
      g(a, function (p) {
        (!l || x(T, e, p)) && h(r, p, e[p]);
      }),
      r
    );
  },
  Zr = function (r, t) {
    return t === void 0 ? y(r) : B(y(r), t);
  },
  T = function (r) {
    var t = M(r),
      e = x(zr, this, t);
    return this === s && n(f, t) && !n(b, t)
      ? !1
      : e || !n(this, t) || !n(f, t) || (n(this, i) && this[i][t])
      ? e
      : !0;
  },
  q = function (r, t) {
    var e = S(r),
      a = M(t);
    if (!(e === s && n(f, a) && !n(b, a))) {
      var p = H(e, a);
      return p && n(f, a) && !(n(e, i) && e[i][a]) && (p.enumerable = !0), p;
    }
  },
  z = function (r) {
    var t = J(S(r)),
      e = [];
    return (
      g(t, function (a) {
        !n(f, a) && !n(U, a) && V(e, a);
      }),
      e
    );
  },
  X = function (o) {
    var r = o === s,
      t = J(r ? b : S(o)),
      e = [];
    return (
      g(t, function (a) {
        n(f, a) && (!r || n(s, a)) && V(e, f[a]);
      }),
      e
    );
  };
c ||
  ((u = function () {
    if (Br(v, this)) throw qr("Symbol is not a constructor");
    var r = !arguments.length || arguments[0] === void 0 ? void 0 : Cr(arguments[0]),
      t = C(r),
      e = function (a) {
        this === s && x(e, b, a),
          n(this, i) && n(this[i], t) && (this[i][t] = !1),
          D(this, t, E(1, a));
      };
    return l && I && D(s, t, { configurable: !0, set: e }), j(t, r);
  }),
  (v = u[d]),
  O(v, "toString", function () {
    return G(this).tag;
  }),
  O(u, "withoutSetter", function (o) {
    return j(C(o), o);
  }),
  (Q.f = T),
  (L.f = h),
  (Wr.f = B),
  (Y.f = q),
  (Gr.f = W.f = z),
  (Rr.f = X),
  (Ur.f = function (o) {
    return j(Qr(o), o);
  }),
  l &&
    (Yr(v, "description", {
      configurable: !0,
      get: function () {
        return G(this).description;
      },
    }),
    O(s, "propertyIsEnumerable", T, { unsafe: !0 })));
P(
  { global: !0, constructor: !0, wrap: !0, forced: !c, sham: !c },
  {
    Symbol: u,
  }
);
g(R(Xr), function (o) {
  Fr(o);
});
P(
  { target: w, stat: !0, forced: !c },
  {
    useSetter: function () {
      I = !0;
    },
    useSimple: function () {
      I = !1;
    },
  }
);
P(
  { target: "Object", stat: !0, forced: !c, sham: !l },
  {
    // `Object.create` method
    // https://tc39.es/ecma262/#sec-object.create
    create: Zr,
    // `Object.defineProperty` method
    // https://tc39.es/ecma262/#sec-object.defineproperty
    defineProperty: h,
    // `Object.defineProperties` method
    // https://tc39.es/ecma262/#sec-object.defineproperties
    defineProperties: B,
    // `Object.getOwnPropertyDescriptor` method
    // https://tc39.es/ecma262/#sec-object.getownpropertydescriptors
    getOwnPropertyDescriptor: q,
  }
);
P(
  { target: "Object", stat: !0, forced: !c },
  {
    // `Object.getOwnPropertyNames` method
    // https://tc39.es/ecma262/#sec-object.getownpropertynames
    getOwnPropertyNames: z,
  }
);
Hr();
Jr(u, w);
U[i] = !0;
