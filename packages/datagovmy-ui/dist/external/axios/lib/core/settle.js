import { A as l } from "./AxiosError.js";
var i, u;
function S() {
  if (u) return i;
  u = 1;
  var a = l;
  return (
    (i = function (e, f, t) {
      var r = t.config.validateStatus;
      !t.status || !r || r(t.status)
        ? e(t)
        : f(
            new a(
              "Request failed with status code " + t.status,
              [a.ERR_BAD_REQUEST, a.ERR_BAD_RESPONSE][Math.floor(t.status / 100) - 4],
              t.config,
              t.request,
              t
            )
          );
    }),
    i
  );
}
export { S as __require };
