import { transition as p } from "../components/transitions/utils/transition.js";
import { disposables as d } from "../utils/disposables.js";
import { useDisposables as m } from "./use-disposables.js";
import { useIsMounted as f } from "./use-is-mounted.js";
import { useIsoMorphicEffect as l } from "./use-iso-morphic-effect.js";
import { useLatestValue as b } from "./use-latest-value.js";
function y({ container: o, direction: s, classes: n, onStart: i, onStop: a }) {
  let u = f(),
    c = m(),
    e = b(s);
  l(() => {
    let r = d();
    c.add(r.dispose);
    let t = o.current;
    if (t && e.current !== "idle" && u.current)
      return (
        r.dispose(),
        i.current(e.current),
        r.add(
          p(t, n.current, e.current === "enter", () => {
            r.dispose(), a.current(e.current);
          })
        ),
        r.dispose
      );
  }, [s]);
}
export { y as useTransition };
