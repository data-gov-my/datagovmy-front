import { __exports as r } from "../../../_virtual/es.regexp.exec.js";
import { _ as o } from "../internals/export.js";
import { __require as t } from "../internals/regexp-exec.js";
var x;
function c() {
  if (x) return r;
  x = 1;
  var _ = o,
    e = t();
  return (
    _(
      { target: "RegExp", proto: !0, forced: /./.exec !== e },
      {
        exec: e,
      }
    ),
    r
  );
}
export { c as __require };
