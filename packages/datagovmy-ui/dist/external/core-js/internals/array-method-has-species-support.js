import { f as n } from "./fails.js";
import { w as e } from "./well-known-symbol.js";
import { e as t } from "./engine-v8-version.js";
var s = n,
  i = e,
  f = t,
  c = i("species"),
  p = function (o) {
    return (
      f >= 51 ||
      !s(function () {
        var r = [],
          a = (r.constructor = {});
        return (
          (a[c] = function () {
            return { foo: 1 };
          }),
          r[o](Boolean).foo !== 1
        );
      })
    );
  };
export { p as a };
