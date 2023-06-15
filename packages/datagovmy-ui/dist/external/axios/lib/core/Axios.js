import { u as C } from "../utils.js";
import { b as I } from "../helpers/buildURL.js";
import { I as P } from "./InterceptorManager.js";
import { d as R } from "./dispatchRequest.js";
import { m as E } from "./mergeConfig.js";
import { b as M } from "./buildFullPath.js";
import { v as $ } from "../helpers/validator.js";
var b = C,
  L = I,
  v = P,
  y = R,
  f = E,
  A = M,
  c = $,
  n = c.validators;
function h(l) {
  (this.defaults = l),
    (this.interceptors = {
      request: new v(),
      response: new v(),
    });
}
h.prototype.request = function (e, t) {
  typeof e == "string" ? ((t = t || {}), (t.url = e)) : (t = e || {}),
    (t = f(this.defaults, t)),
    t.method
      ? (t.method = t.method.toLowerCase())
      : this.defaults.method
      ? (t.method = this.defaults.method.toLowerCase())
      : (t.method = "get");
  var s = t.transitional;
  s !== void 0 &&
    c.assertOptions(
      s,
      {
        silentJSONParsing: n.transitional(n.boolean),
        forcedJSONParsing: n.transitional(n.boolean),
        clarifyTimeoutError: n.transitional(n.boolean),
      },
      !1
    );
  var i = [],
    p = !0;
  this.interceptors.request.forEach(function (a) {
    (typeof a.runWhen == "function" && a.runWhen(t) === !1) ||
      ((p = p && a.synchronous), i.unshift(a.fulfilled, a.rejected));
  });
  var o = [];
  this.interceptors.response.forEach(function (a) {
    o.push(a.fulfilled, a.rejected);
  });
  var r;
  if (!p) {
    var u = [y, void 0];
    for (Array.prototype.unshift.apply(u, i), u = u.concat(o), r = Promise.resolve(t); u.length; )
      r = r.then(u.shift(), u.shift());
    return r;
  }
  for (var m = t; i.length; ) {
    var q = i.shift(),
      w = i.shift();
    try {
      m = q(m);
    } catch (d) {
      w(d);
      break;
    }
  }
  try {
    r = y(m);
  } catch (d) {
    return Promise.reject(d);
  }
  for (; o.length; ) r = r.then(o.shift(), o.shift());
  return r;
};
h.prototype.getUri = function (e) {
  e = f(this.defaults, e);
  var t = A(e.baseURL, e.url);
  return L(t, e.params, e.paramsSerializer);
};
b.forEach(["delete", "get", "head", "options"], function (e) {
  h.prototype[e] = function (t, s) {
    return this.request(
      f(s || {}, {
        method: e,
        url: t,
        data: (s || {}).data,
      })
    );
  };
});
b.forEach(["post", "put", "patch"], function (e) {
  function t(s) {
    return function (p, o, r) {
      return this.request(
        f(r || {}, {
          method: e,
          headers: s
            ? {
                "Content-Type": "multipart/form-data",
              }
            : {},
          url: p,
          data: o,
        })
      );
    };
  }
  (h.prototype[e] = t()), (h.prototype[e + "Form"] = t(!0));
});
var W = h;
export { W as A };
