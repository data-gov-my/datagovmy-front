import { __exports as m } from "../../../_virtual/es.promise.all.js";
import { _ as E } from "../internals/export.js";
import { f as T } from "../internals/function-call.js";
import { a as x } from "../internals/a-callable.js";
import { __require as y } from "../internals/new-promise-capability.js";
import { __require as S } from "../internals/perform.js";
import { i as $ } from "../internals/iterate.js";
import { __require as h } from "../internals/promise-statics-incorrect-iteration.js";
var u;
function B() {
  if (u) return m;
  u = 1;
  var v = E,
    n = T,
    f = x,
    _ = y(),
    p = S(),
    c = $,
    C = h();
  return (
    v(
      { target: "Promise", stat: !0, forced: C },
      {
        all: function (q) {
          var r = this,
            e = _.f(r),
            o = e.resolve,
            t = e.reject,
            l = p(function () {
              var I = f(r.resolve),
                a = [],
                d = 0,
                i = 1;
              c(q, function (P) {
                var R = d++,
                  s = !1;
                i++,
                  n(I, r, P).then(function (b) {
                    s || ((s = !0), (a[R] = b), --i || o(a));
                  }, t);
              }),
                --i || o(a);
            });
          return l.error && t(l.value), e.promise;
        },
      }
    ),
    m
  );
}
export { B as __require };
