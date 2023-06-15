import { useState as e, useEffect as o } from "react";
import { disposables as t } from "../utils/disposables.js";
function i() {
  let [s] = e(t);
  return o(() => () => s.dispose(), [s]), s;
}
export { i as useDisposables };
