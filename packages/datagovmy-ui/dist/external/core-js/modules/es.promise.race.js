import { __exports as o } from "../../../_virtual/es.promise.race.js";
import { _ as q } from "../internals/export.js";
import { f as C } from "../internals/function-call.js";
import { a as I } from "../internals/a-callable.js";
import { __require as P } from "../internals/new-promise-capability.js";
import { __require as R } from "../internals/perform.js";
import { i as b } from "../internals/iterate.js";
import { __require as E } from "../internals/promise-statics-incorrect-iteration.js";
var t;
function j() {
  if (t) return o;
  t = 1;
  var s = q,
    m = C,
    u = I,
    _ = P(),
    f = R(),
    p = b,
    l = E();
  return (
    s(
      { target: "Promise", stat: !0, forced: l },
      {
        race: function (c) {
          var r = this,
            e = _.f(r),
            a = e.reject,
            i = f(function () {
              var n = u(r.resolve);
              p(c, function (v) {
                m(n, r, v).then(e.resolve, a);
              });
            });
          return i.error && a(i.value), e.promise;
        },
      }
    ),
    o
  );
}
export { j as __require };
