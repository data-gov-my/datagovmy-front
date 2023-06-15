import { f as n } from "./fails.js";
var o = n,
  f = !o(function () {
    var t = function () {}.bind();
    return typeof t != "function" || t.hasOwnProperty("prototype");
  });
export { f };
