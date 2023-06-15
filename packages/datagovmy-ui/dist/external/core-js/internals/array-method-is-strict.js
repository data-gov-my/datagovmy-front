import { f as u } from "./fails.js";
var r, e;
function f() {
  if (e) return r;
  e = 1;
  var a = u;
  return (
    (r = function (i, n) {
      var t = [][i];
      return (
        !!t &&
        a(function () {
          t.call(
            null,
            n ||
              function () {
                return 1;
              },
            1
          );
        })
      );
    }),
    r
  );
}
export { f as __require };
