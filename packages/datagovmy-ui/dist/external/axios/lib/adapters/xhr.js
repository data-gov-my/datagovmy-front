import { u as N } from "../utils.js";
import { __require as k } from "../core/settle.js";
import { __require as S } from "../helpers/cookies.js";
import { b as B } from "../helpers/buildURL.js";
import { b as M } from "../core/buildFullPath.js";
import { __require as X } from "../helpers/parseHeaders.js";
import { __require as F } from "../helpers/isURLSameOrigin.js";
import { t as I } from "../defaults/transitional.js";
import { A as $ } from "../core/AxiosError.js";
import { __require as z } from "../cancel/CanceledError.js";
import { __require as K } from "../helpers/parseProtocol.js";
var E, T;
function ae() {
  if (T) return E;
  T = 1;
  var u = N,
    _ = k(),
    b = S(),
    w = B,
    C = M,
    x = X(),
    U = F(),
    L = I,
    a = $,
    P = z(),
    y = K();
  return (
    (E = function (e) {
      return new Promise(function (A, o) {
        var d = e.data,
          l = e.headers,
          p = e.responseType,
          n;
        function q() {
          e.cancelToken && e.cancelToken.unsubscribe(n),
            e.signal && e.signal.removeEventListener("abort", n);
        }
        u.isFormData(d) && u.isStandardBrowserEnv() && delete l["Content-Type"];
        var r = new XMLHttpRequest();
        if (e.auth) {
          var H = e.auth.username || "",
            D = e.auth.password ? unescape(encodeURIComponent(e.auth.password)) : "";
          l.Authorization = "Basic " + btoa(H + ":" + D);
        }
        var m = C(e.baseURL, e.url);
        r.open(e.method.toUpperCase(), w(m, e.params, e.paramsSerializer), !0),
          (r.timeout = e.timeout);
        function R() {
          if (r) {
            var t = "getAllResponseHeaders" in r ? x(r.getAllResponseHeaders()) : null,
              i = !p || p === "text" || p === "json" ? r.responseText : r.response,
              s = {
                data: i,
                status: r.status,
                statusText: r.statusText,
                headers: t,
                config: e,
                request: r,
              };
            _(
              function (h) {
                A(h), q();
              },
              function (h) {
                o(h), q();
              },
              s
            ),
              (r = null);
          }
        }
        if (
          ("onloadend" in r
            ? (r.onloadend = R)
            : (r.onreadystatechange = function () {
                !r ||
                  r.readyState !== 4 ||
                  (r.status === 0 && !(r.responseURL && r.responseURL.indexOf("file:") === 0)) ||
                  setTimeout(R);
              }),
          (r.onabort = function () {
            r && (o(new a("Request aborted", a.ECONNABORTED, e, r)), (r = null));
          }),
          (r.onerror = function () {
            o(new a("Network Error", a.ERR_NETWORK, e, r, r)), (r = null);
          }),
          (r.ontimeout = function () {
            var i = e.timeout ? "timeout of " + e.timeout + "ms exceeded" : "timeout exceeded",
              s = e.transitional || L;
            e.timeoutErrorMessage && (i = e.timeoutErrorMessage),
              o(new a(i, s.clarifyTimeoutError ? a.ETIMEDOUT : a.ECONNABORTED, e, r)),
              (r = null);
          }),
          u.isStandardBrowserEnv())
        ) {
          var f =
            (e.withCredentials || U(m)) && e.xsrfCookieName ? b.read(e.xsrfCookieName) : void 0;
          f && (l[e.xsrfHeaderName] = f);
        }
        "setRequestHeader" in r &&
          u.forEach(l, function (i, s) {
            typeof d > "u" && s.toLowerCase() === "content-type"
              ? delete l[s]
              : r.setRequestHeader(s, i);
          }),
          u.isUndefined(e.withCredentials) || (r.withCredentials = !!e.withCredentials),
          p && p !== "json" && (r.responseType = e.responseType),
          typeof e.onDownloadProgress == "function" &&
            r.addEventListener("progress", e.onDownloadProgress),
          typeof e.onUploadProgress == "function" &&
            r.upload &&
            r.upload.addEventListener("progress", e.onUploadProgress),
          (e.cancelToken || e.signal) &&
            ((n = function (t) {
              r && (o(!t || (t && t.type) ? new P() : t), r.abort(), (r = null));
            }),
            e.cancelToken && e.cancelToken.subscribe(n),
            e.signal && (e.signal.aborted ? n() : e.signal.addEventListener("abort", n))),
          d || (d = null);
        var v = y(m);
        if (v && ["http", "https", "file"].indexOf(v) === -1) {
          o(new a("Unsupported protocol " + v + ":", a.ERR_BAD_REQUEST, e));
          return;
        }
        r.send(d);
      });
    }),
    E
  );
}
export { ae as __require };
