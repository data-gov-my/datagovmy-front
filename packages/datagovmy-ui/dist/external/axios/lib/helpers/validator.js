import { __require as E } from "../env/data.js";
import { A as b } from "../core/AxiosError.js";
var w = E().version,
  a = b,
  u = {};
["object", "boolean", "number", "function", "string", "symbol"].forEach(function (n, t) {
  u[n] = function (o) {
    return typeof o === n || "a" + (t < 1 ? "n " : " ") + n;
  };
});
var v = {};
u.transitional = function (t, i, o) {
  function s(e, r) {
    return "[Axios v" + w + "] Transitional option '" + e + "'" + r + (o ? ". " + o : "");
  }
  return function (e, r, f) {
    if (t === !1) throw new a(s(r, " has been removed" + (i ? " in " + i : "")), a.ERR_DEPRECATED);
    return (
      i &&
        !v[r] &&
        ((v[r] = !0),
        console.warn(
          s(r, " has been deprecated since v" + i + " and will be removed in the near future")
        )),
      t ? t(e, r, f) : !0
    );
  };
};
function _(n, t, i) {
  if (typeof n != "object") throw new a("options must be an object", a.ERR_BAD_OPTION_VALUE);
  for (var o = Object.keys(n), s = o.length; s-- > 0; ) {
    var e = o[s],
      r = t[e];
    if (r) {
      var f = n[e],
        c = f === void 0 || r(f, e, n);
      if (c !== !0) throw new a("option " + e + " must be " + c, a.ERR_BAD_OPTION_VALUE);
      continue;
    }
    if (i !== !0) throw new a("Unknown option " + e, a.ERR_BAD_OPTION);
  }
}
var l = {
  assertOptions: _,
  validators: u,
};
export { l as v };
