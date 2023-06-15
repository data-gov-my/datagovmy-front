import { b as B } from "./helpers/bind.js";
var F = B,
  s = Object.prototype.toString,
  l = (function (r) {
    return function (e) {
      var t = s.call(e);
      return r[t] || (r[t] = t.slice(8, -1).toLowerCase());
    };
  })(/* @__PURE__ */ Object.create(null));
function u(r) {
  return (
    (r = r.toLowerCase()),
    function (t) {
      return l(t) === r;
    }
  );
}
function p(r) {
  return Array.isArray(r);
}
function a(r) {
  return typeof r > "u";
}
function A(r) {
  return (
    r !== null &&
    !a(r) &&
    r.constructor !== null &&
    !a(r.constructor) &&
    typeof r.constructor.isBuffer == "function" &&
    r.constructor.isBuffer(r)
  );
}
var g = u("ArrayBuffer");
function w(r) {
  var e;
  return (
    typeof ArrayBuffer < "u" && ArrayBuffer.isView
      ? (e = ArrayBuffer.isView(r))
      : (e = r && r.buffer && g(r.buffer)),
    e
  );
}
function S(r) {
  return typeof r == "string";
}
function v(r) {
  return typeof r == "number";
}
function O(r) {
  return r !== null && typeof r == "object";
}
function o(r) {
  if (l(r) !== "object") return !1;
  var e = Object.getPrototypeOf(r);
  return e === null || e === Object.prototype;
}
var h = u("Date"),
  b = u("File"),
  P = u("Blob"),
  D = u("FileList");
function d(r) {
  return s.call(r) === "[object Function]";
}
function L(r) {
  return O(r) && d(r.pipe);
}
function U(r) {
  var e = "[object FormData]";
  return (
    r &&
    ((typeof FormData == "function" && r instanceof FormData) ||
      s.call(r) === e ||
      (d(r.toString) && r.toString() === e))
  );
}
var x = u("URLSearchParams");
function N(r) {
  return r.trim ? r.trim() : r.replace(/^\s+|\s+$/g, "");
}
function V() {
  return typeof navigator < "u" &&
    (navigator.product === "ReactNative" ||
      navigator.product === "NativeScript" ||
      navigator.product === "NS")
    ? !1
    : typeof window < "u" && typeof document < "u";
}
function y(r, e) {
  if (!(r === null || typeof r > "u"))
    if ((typeof r != "object" && (r = [r]), p(r)))
      for (var t = 0, f = r.length; t < f; t++) e.call(null, r[t], t, r);
    else for (var n in r) Object.prototype.hasOwnProperty.call(r, n) && e.call(null, r[n], n, r);
}
function c() {
  var r = {};
  function e(n, i) {
    o(r[i]) && o(n)
      ? (r[i] = c(r[i], n))
      : o(n)
      ? (r[i] = c({}, n))
      : p(n)
      ? (r[i] = n.slice())
      : (r[i] = n);
  }
  for (var t = 0, f = arguments.length; t < f; t++) y(arguments[t], e);
  return r;
}
function E(r, e, t) {
  return (
    y(e, function (n, i) {
      t && typeof n == "function" ? (r[i] = F(n, t)) : (r[i] = n);
    }),
    r
  );
}
function R(r) {
  return r.charCodeAt(0) === 65279 && (r = r.slice(1)), r;
}
function C(r, e, t, f) {
  (r.prototype = Object.create(e.prototype, f)),
    (r.prototype.constructor = r),
    t && Object.assign(r.prototype, t);
}
function T(r, e, t) {
  var f,
    n,
    i,
    m = {};
  e = e || {};
  do {
    for (f = Object.getOwnPropertyNames(r), n = f.length; n-- > 0; )
      (i = f[n]), m[i] || ((e[i] = r[i]), (m[i] = !0));
    r = Object.getPrototypeOf(r);
  } while (r && (!t || t(r, e)) && r !== Object.prototype);
  return e;
}
function M(r, e, t) {
  (r = String(r)), (t === void 0 || t > r.length) && (t = r.length), (t -= e.length);
  var f = r.indexOf(e, t);
  return f !== -1 && f === t;
}
function W(r) {
  if (!r) return null;
  var e = r.length;
  if (a(e)) return null;
  for (var t = new Array(e); e-- > 0; ) t[e] = r[e];
  return t;
}
var $ = (function (r) {
    return function (e) {
      return r && e instanceof r;
    };
  })(typeof Uint8Array < "u" && Object.getPrototypeOf(Uint8Array)),
  K = {
    isArray: p,
    isArrayBuffer: g,
    isBuffer: A,
    isFormData: U,
    isArrayBufferView: w,
    isString: S,
    isNumber: v,
    isObject: O,
    isPlainObject: o,
    isUndefined: a,
    isDate: h,
    isFile: b,
    isBlob: P,
    isFunction: d,
    isStream: L,
    isURLSearchParams: x,
    isStandardBrowserEnv: V,
    forEach: y,
    merge: c,
    extend: E,
    trim: N,
    stripBOM: R,
    inherits: C,
    toFlatObject: T,
    kindOf: l,
    kindOfTest: u,
    endsWith: M,
    toArray: W,
    isTypedArray: $,
    isFileList: D,
  };
export { K as u };
