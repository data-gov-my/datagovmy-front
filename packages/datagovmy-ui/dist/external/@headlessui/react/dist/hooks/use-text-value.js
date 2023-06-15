import { useRef as o } from "react";
import { getTextValue as f } from "../utils/get-text-value.js";
import { useEvent as m } from "./use-event.js";
function l(i) {
  let r = o(""),
    t = o("");
  return m(() => {
    let e = i.current;
    if (!e) return "";
    let u = e.innerText;
    if (r.current === u) return t.current;
    let n = f(e).trim().toLowerCase();
    return (r.current = u), (t.current = n), n;
  });
}
export { l as useTextValue };
