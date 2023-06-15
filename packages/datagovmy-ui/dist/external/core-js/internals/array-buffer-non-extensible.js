import { f as e } from "./fails.js";
var a = e,
  i = a(function () {
    if (typeof ArrayBuffer == "function") {
      var r = new ArrayBuffer(8);
      Object.isExtensible(r) && Object.defineProperty(r, "a", { value: 8 });
    }
  });
export { i as a };
