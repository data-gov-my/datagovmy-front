import { commonjsRequire as i } from "../../../_virtual/_commonjs-dynamic-modules.js";
import { __module as r } from "../../../_virtual/fs.js";
import f from "../../../_virtual/___vite-browser-external.js";
var t;
function n() {
  return t
    ? r.exports
    : ((t = 1),
      (function (u, o) {
        if (typeof i < "u") {
          var e = f;
          e.default && (e = e.default), (o.default = e), (u.exports = o.default);
        }
      })(r, r.exports),
      r.exports);
}
export { n as __require };
