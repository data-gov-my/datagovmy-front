import { __exports as r } from "../../../_virtual/es.promise.resolve.js";
import { _ } from "../internals/export.js";
import { g as u } from "../internals/get-built-in.js";
import { __require as a } from "../internals/promise-native-constructor.js";
import { __require as p } from "../internals/promise-constructor-detection.js";
import { __require as v } from "../internals/promise-resolve.js";
var e;
function O() {
  if (e) return r;
  e = 1;
  var o = _,
    i = u;
  a();
  var s = p().CONSTRUCTOR,
    t = v();
  return (
    i("Promise"),
    o(
      { target: "Promise", stat: !0, forced: s },
      {
        resolve: function (m) {
          return t(this, m);
        },
      }
    ),
    r
  );
}
export { O as __require };
