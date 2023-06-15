import { __require as w } from "../../react-is/index.js";
var c, _;
function m() {
  if (_) return c;
  _ = 1;
  var u = w(),
    d = {
      childContextTypes: !0,
      contextType: !0,
      contextTypes: !0,
      defaultProps: !0,
      displayName: !0,
      getDefaultProps: !0,
      getDerivedStateFromError: !0,
      getDerivedStateFromProps: !0,
      mixins: !0,
      propTypes: !0,
      type: !0,
    },
    g = {
      name: !0,
      length: !0,
      prototype: !0,
      caller: !0,
      callee: !0,
      arguments: !0,
      arity: !0,
    },
    l = {
      $$typeof: !0,
      render: !0,
      defaultProps: !0,
      displayName: !0,
      propTypes: !0,
    },
    f = {
      $$typeof: !0,
      compare: !0,
      defaultProps: !0,
      displayName: !0,
      propTypes: !0,
      type: !0,
    },
    p = {};
  (p[u.ForwardRef] = l), (p[u.Memo] = f);
  function y(r) {
    return u.isMemo(r) ? f : p[r.$$typeof] || d;
  }
  var N = Object.defineProperty,
    R = Object.getOwnPropertyNames,
    v = Object.getOwnPropertySymbols,
    j = Object.getOwnPropertyDescriptor,
    n = Object.getPrototypeOf,
    T = Object.prototype;
  function O(r, e, o) {
    if (typeof e != "string") {
      if (T) {
        var i = n(e);
        i && i !== T && O(r, i, o);
      }
      var a = R(e);
      v && (a = a.concat(v(e)));
      for (var P = y(r), S = y(e), s = 0; s < a.length; ++s) {
        var t = a[s];
        if (!g[t] && !(o && o[t]) && !(S && S[t]) && !(P && P[t])) {
          var b = j(e, t);
          try {
            N(r, t, b);
          } catch {}
        }
      }
    }
    return r;
  }
  return (c = O), c;
}
export { m as __require };
