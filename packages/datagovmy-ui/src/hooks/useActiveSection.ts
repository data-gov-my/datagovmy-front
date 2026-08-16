import { RefObject, useEffect } from "react";

// Highlights the section crossing a 1px line `offset`px below the viewport top.
export const useActiveSection = (
  sectionRefs: RefObject<Record<string, HTMLElement | null>> | undefined,
  offset: number,
  onActive: (id: string) => void
) => {
  useEffect(() => {
    if (!sectionRefs?.current) return;
    const sections = Object.entries(sectionRefs.current).filter(([, el]) => el) as Array<
      [string, HTMLElement]
    >;
    if (sections.length === 0) return;

    const idByElement = new Map<Element, string>(sections.map(([id, el]) => [el, id]));

    let observer: IntersectionObserver;
    const setup = () => {
      observer?.disconnect();
      observer = new IntersectionObserver(
        entries => {
          const hit = entries.find(e => e.isIntersecting);
          if (hit) onActive(idByElement.get(hit.target)!);
        },
        { rootMargin: `-${offset}px 0px -${window.innerHeight - offset - 1}px 0px` }
      );
      idByElement.forEach((_, el) => observer.observe(el));
    };

    setup();
    window.addEventListener("resize", setup); // rootMargin is in px, recompute on resize
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", setup);
    };
  }, [sectionRefs, offset, onActive]);
};
