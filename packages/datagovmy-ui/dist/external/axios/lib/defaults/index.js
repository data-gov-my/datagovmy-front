import { u as l } from "../utils.js";
import { n as S } from "../helpers/normalizeHeaderName.js";
import { A as h } from "../core/AxiosError.js";
import { t as v } from "./transitional.js";
import { t as y } from "../helpers/toFormData.js";
import { __require as p } from "../adapters/xhr.js";
import { __require as N } from "../helpers/null.js";
var t = l,
  u = S,
  m = h,
  g = v,
  E = y,
  O = {
    "Content-Type": "application/x-www-form-urlencoded",
  };
function c(e, r) {
  !t.isUndefined(e) && t.isUndefined(e["Content-Type"]) && (e["Content-Type"] = r);
}
function T() {
  var e;
  return (
    typeof XMLHttpRequest < "u"
      ? (e = p())
      : typeof process < "u" &&
        Object.prototype.toString.call(process) === "[object process]" &&
        (e = p()),
    e
  );
}
function x(e, r, i) {
  if (t.isString(e))
    try {
      return (r || JSON.parse)(e), t.trim(e);
    } catch (n) {
      if (n.name !== "SyntaxError") throw n;
    }
  return (i || JSON.stringify)(e);
}
var f = {
  transitional: g,
  adapter: T(),
  transformRequest: [
    function (r, i) {
      if (
        (u(i, "Accept"),
        u(i, "Content-Type"),
        t.isFormData(r) ||
          t.isArrayBuffer(r) ||
          t.isBuffer(r) ||
          t.isStream(r) ||
          t.isFile(r) ||
          t.isBlob(r))
      )
        return r;
      if (t.isArrayBufferView(r)) return r.buffer;
      if (t.isURLSearchParams(r))
        return c(i, "application/x-www-form-urlencoded;charset=utf-8"), r.toString();
      var n = t.isObject(r),
        a = i && i["Content-Type"],
        s;
      if ((s = t.isFileList(r)) || (n && a === "multipart/form-data")) {
        var o = this.env && this.env.FormData;
        return E(s ? { "files[]": r } : r, o && new o());
      } else if (n || a === "application/json") return c(i, "application/json"), x(r);
      return r;
    },
  ],
  transformResponse: [
    function (r) {
      var i = this.transitional || f.transitional,
        n = i && i.silentJSONParsing,
        a = i && i.forcedJSONParsing,
        s = !n && this.responseType === "json";
      if (s || (a && t.isString(r) && r.length))
        try {
          return JSON.parse(r);
        } catch (o) {
          if (s)
            throw o.name === "SyntaxError"
              ? m.from(o, m.ERR_BAD_RESPONSE, this, null, this.response)
              : o;
        }
      return r;
    },
  ],
  /**
   * A timeout in milliseconds to abort a request. If set to 0 (default) a
   * timeout is not created.
   */
  timeout: 0,
  xsrfCookieName: "XSRF-TOKEN",
  xsrfHeaderName: "X-XSRF-TOKEN",
  maxContentLength: -1,
  maxBodyLength: -1,
  env: {
    FormData: N(),
  },
  validateStatus: function (r) {
    return r >= 200 && r < 300;
  },
  headers: {
    common: {
      Accept: "application/json, text/plain, */*",
    },
  },
};
t.forEach(["delete", "get", "head"], function (r) {
  f.headers[r] = {};
});
t.forEach(["post", "put", "patch"], function (r) {
  f.headers[r] = t.merge(O);
});
var P = f;
export { P as d };
