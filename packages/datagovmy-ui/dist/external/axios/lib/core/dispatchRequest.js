import { u as m } from "../utils.js";
import { t as h } from "./transformData.js";
import { __require as p } from "../cancel/isCancel.js";
import { d as o } from "../defaults/index.js";
import { __require as n } from "../cancel/CanceledError.js";
var l = m,
  t = h,
  q = p(),
  R = o,
  v = n();
function s(r) {
  if ((r.cancelToken && r.cancelToken.throwIfRequested(), r.signal && r.signal.aborted))
    throw new v();
}
var I = function (e) {
  s(e),
    (e.headers = e.headers || {}),
    (e.data = t.call(e, e.data, e.headers, e.transformRequest)),
    (e.headers = l.merge(e.headers.common || {}, e.headers[e.method] || {}, e.headers)),
    l.forEach(["delete", "get", "head", "post", "put", "patch", "common"], function (a) {
      delete e.headers[a];
    });
  var u = e.adapter || R.adapter;
  return u(e).then(
    function (a) {
      return s(e), (a.data = t.call(e, a.data, a.headers, e.transformResponse)), a;
    },
    function (a) {
      return (
        q(a) ||
          (s(e),
          a &&
            a.response &&
            (a.response.data = t.call(
              e,
              a.response.data,
              a.response.headers,
              e.transformResponse
            ))),
        Promise.reject(a)
      );
    }
  );
};
export { I as d };
