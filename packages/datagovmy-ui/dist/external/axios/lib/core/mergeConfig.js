import { u as v } from "../utils.js";
var t = v,
  b = function (a, r) {
    r = r || {};
    var u = {};
    function s(n, i) {
      return t.isPlainObject(n) && t.isPlainObject(i)
        ? t.merge(n, i)
        : t.isPlainObject(i)
        ? t.merge({}, i)
        : t.isArray(i)
        ? i.slice()
        : i;
    }
    function o(n) {
      if (t.isUndefined(r[n])) {
        if (!t.isUndefined(a[n])) return s(void 0, a[n]);
      } else return s(a[n], r[n]);
    }
    function d(n) {
      if (!t.isUndefined(r[n])) return s(void 0, r[n]);
    }
    function e(n) {
      if (t.isUndefined(r[n])) {
        if (!t.isUndefined(a[n])) return s(void 0, a[n]);
      } else return s(void 0, r[n]);
    }
    function f(n) {
      if (n in r) return s(a[n], r[n]);
      if (n in a) return s(void 0, a[n]);
    }
    var h = {
      url: d,
      method: d,
      data: d,
      baseURL: e,
      transformRequest: e,
      transformResponse: e,
      paramsSerializer: e,
      timeout: e,
      timeoutMessage: e,
      withCredentials: e,
      adapter: e,
      responseType: e,
      xsrfCookieName: e,
      xsrfHeaderName: e,
      onUploadProgress: e,
      onDownloadProgress: e,
      decompress: e,
      maxContentLength: e,
      maxBodyLength: e,
      beforeRedirect: e,
      transport: e,
      httpAgent: e,
      httpsAgent: e,
      cancelToken: e,
      socketPath: e,
      responseEncoding: e,
      validateStatus: f,
    };
    return (
      t.forEach(Object.keys(a).concat(Object.keys(r)), function (i) {
        var m = h[i] || o,
          l = m(i);
        (t.isUndefined(l) && m !== f) || (u[i] = l);
      }),
      u
    );
  };
export { b as m };
