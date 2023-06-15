import { __exports as e } from "../../../_virtual/es.promise.reject.js";
import { _ } from "../internals/export.js";
import { f as u } from "../internals/function-call.js";
import { __require as p } from "../internals/new-promise-capability.js";
import { __require as c } from "../internals/promise-constructor-detection.js";
var i;
function j() {
  if (i) return e;
  i = 1;
  var t = _,
    o = u,
    a = p(),
    s = c().CONSTRUCTOR;
  return (
    t(
      { target: "Promise", stat: !0, forced: s },
      {
        reject: function (m) {
          var r = a.f(this);
          return o(r.reject, void 0, m), r.promise;
        },
      }
    ),
    e
  );
}
export { j as __require };
