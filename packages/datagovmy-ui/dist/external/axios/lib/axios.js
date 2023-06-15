import { __module as t } from "../../../_virtual/axios.js";
import { u as p } from "./utils.js";
import { b as u } from "./helpers/bind.js";
import { A as f } from "./core/Axios.js";
import { m as l } from "./core/mergeConfig.js";
import { d as x } from "./defaults/index.js";
import { __require as _ } from "./cancel/CanceledError.js";
import { __require as c } from "./cancel/CancelToken.js";
import { __require as d } from "./cancel/isCancel.js";
import { __require as q } from "./env/data.js";
import { t as v } from "./helpers/toFormData.js";
import { A } from "./core/AxiosError.js";
import { __require as C } from "./helpers/spread.js";
import { __require as E } from "./helpers/isAxiosError.js";
var s = p,
  I = u,
  a = f,
  $ = l,
  b = x;
function m(i) {
  var e = new a(i),
    o = I(a.prototype.request, e);
  return (
    s.extend(o, a.prototype, e),
    s.extend(o, e),
    (o.create = function (n) {
      return m($(i, n));
    }),
    o
  );
}
var r = m(b);
r.Axios = a;
r.CanceledError = _();
r.CancelToken = c();
r.isCancel = d();
r.VERSION = q().version;
r.toFormData = v;
r.AxiosError = A;
r.Cancel = r.CanceledError;
r.all = function (e) {
  return Promise.all(e);
};
r.spread = C();
r.isAxiosError = E();
t.exports = r;
t.exports.default = r;
var z = t.exports;
export { z as a };
