import { a as p } from "./an-object.js";
import "./object-define-properties.js";
import { e as h } from "./enum-bug-keys.js";
import { h as O } from "./hidden-keys.js";
import { h as j } from "./html.js";
import { d as y } from "./document-create-element.js";
import { s as b } from "./shared-key.js";
import { __exports as P } from "../../../_virtual/object-define-properties.js";
var T = p,
  w = P,
  u = h,
  g = O,
  C = j,
  E = y,
  K = b,
  l = ">",
  s = "<",
  m = "prototype",
  c = "script",
  v = K("IE_PROTO"),
  i = function () {},
  f = function (e) {
    return s + c + l + e + s + "/" + c + l;
  },
  d = function (e) {
    e.write(f("")), e.close();
    var r = e.parentWindow.Object;
    return (e = null), r;
  },
  $ = function () {
    var e = E("iframe"),
      r = "java" + c + ":",
      t;
    return (
      (e.style.display = "none"),
      C.appendChild(e),
      (e.src = String(r)),
      (t = e.contentWindow.document),
      t.open(),
      t.write(f("document.F=Object")),
      t.close(),
      t.F
    );
  },
  n,
  o = function () {
    try {
      n = new ActiveXObject("htmlfile");
    } catch {}
    o = typeof document < "u" ? (document.domain && n ? d(n) : $()) : d(n);
    for (var e = u.length; e--; ) delete o[m][u[e]];
    return o();
  };
g[v] = !0;
var B =
  Object.create ||
  function (r, t) {
    var a;
    return (
      r !== null ? ((i[m] = T(r)), (a = new i()), (i[m] = null), (a[v] = r)) : (a = o()),
      t === void 0 ? a : w.f(a, t)
    );
  };
export { B as o };
