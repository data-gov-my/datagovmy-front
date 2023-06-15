import { f as r } from "./fails.js";
var t = r,
  f = !t(function () {
    return (
      Object.defineProperty({}, 1, {
        get: function () {
          return 7;
        },
      })[1] != 7
    );
  });
export { f as d };
