import { __exports as f } from "../../../_virtual/utils2.js";
var o;
function m() {
  if (o) return f;
  (o = 1),
    Object.defineProperty(f, "__esModule", {
      value: !0,
    }),
    (f.debounce = g),
    (f.defaults = v),
    (f.getPath = _),
    (f.pushPath = P),
    (f.setPath = d);
  var l = [],
    c = l.forEach,
    h = l.slice;
  function v(t) {
    return (
      c.call(h.call(arguments, 1), function (a) {
        if (a) for (var r in a) t[r] === void 0 && (t[r] = a[r]);
      }),
      t
    );
  }
  function g(t, a, r) {
    var e;
    return function () {
      var i = this,
        n = arguments,
        u = function () {
          (e = null), r || t.apply(i, n);
        },
        O = r && !e;
      clearTimeout(e), (e = setTimeout(u, a)), O && t.apply(i, n);
    };
  }
  function s(t, a, r) {
    function e(u) {
      return u && u.indexOf("###") > -1 ? u.replace(/###/g, ".") : u;
    }
    for (var i = typeof a != "string" ? [].concat(a) : a.split("."); i.length > 1; ) {
      if (!t) return {};
      var n = e(i.shift());
      !t[n] && r && (t[n] = new r()), (t = t[n]);
    }
    return t
      ? {
          obj: t,
          k: e(i.shift()),
        }
      : {};
  }
  function d(t, a, r) {
    var e = s(t, a, Object),
      i = e.obj,
      n = e.k;
    i[n] = r;
  }
  function P(t, a, r, e) {
    var i = s(t, a, Object),
      n = i.obj,
      u = i.k;
    (n[u] = n[u] || []), e && (n[u] = n[u].concat(r)), e || n[u].push(r);
  }
  function _(t, a) {
    var r = s(t, a),
      e = r.obj,
      i = r.k;
    if (e) return e[i];
  }
  return f;
}
export { m as __require };
