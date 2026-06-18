import { RefObject, useEffect } from "react";

export const useActiveSection = (
  sectionRefs: RefObject<Record<string, HTMLElement | null>> | undefined,
  offset: number,
  onActive: (id: string) => void
) => {
  useEffect(() => {
    if (!sectionRefs?.current) return;

    const idByElement = new Map<Element, string>();
    Object.entries(sectionRefs.current).forEach(([id, el]) => el && idByElement.set(el, id));
    if (idByElement.size === 0) return;

    const pick = () => {
      let crossed: Element | undefined; // last section whose top has passed the line
      let crossedTop = -Infinity;
      let topmost: Element | undefined; // first section, when none has crossed yet
      let topmostTop = Infinity;
      idByElement.forEach((_, el) => {
        const top = el.getBoundingClientRect().top;
        if (top <= offset + 1 && top > crossedTop) {
          crossedTop = top;
          crossed = el;
        }
        if (top < topmostTop) {
          topmostTop = top;
          topmost = el;
        }
      });
      const active = crossed ?? topmost;
      if (active) onActive(idByElement.get(active)!);
    };

    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        pick();
        ticking = false;
      });
    };

    pick();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [sectionRefs, offset, onActive]);
};
