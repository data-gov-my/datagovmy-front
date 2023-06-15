import { useRef as i, useEffect as u } from "react";
const l = (e, s) => {
  const n = i(null);
  u(() => {
    n.current && n.current.disconnect();
    const c = document.createElement("div");
    e == null || e.before(c),
      (n.current = new IntersectionObserver(([o]) => {
        o.isIntersecting ? e == null || e.classList.remove(s) : e == null || e.classList.add(s);
      }));
    const { current: r } = n;
    return c && r.observe(c), () => r.disconnect();
  }, [e]);
};
export { l as useScrollIntersect };
