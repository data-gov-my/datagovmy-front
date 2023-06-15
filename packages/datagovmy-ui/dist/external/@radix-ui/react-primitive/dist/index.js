import m from "../../../@babel/runtime/helpers/esm/extends.js";
import { forwardRef as s, useEffect as p, createElement as n } from "react";
import "react-dom";
import { Slot as d } from "../../react-slot/dist/index.js";
const l = [
    "a",
    "button",
    "div",
    "form",
    "h2",
    "h3",
    "img",
    "input",
    "label",
    "li",
    "nav",
    "ol",
    "p",
    "span",
    "svg",
    "ul",
  ],
  h = l.reduce((e, r) => {
    const t = /* @__PURE__ */ s((o, i) => {
      const { asChild: c, ...f } = o,
        a = c ? d : r;
      return (
        p(() => {
          window[Symbol.for("radix-ui")] = !0;
        }, []),
        /* @__PURE__ */ n(
          a,
          m({}, f, {
            ref: i,
          })
        )
      );
    });
    return (
      (t.displayName = `Primitive.${r}`),
      {
        ...e,
        [r]: t,
      }
    );
  }, {});
export { h as Primitive };
