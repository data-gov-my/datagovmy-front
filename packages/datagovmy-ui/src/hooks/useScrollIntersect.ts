import { useEffect, useRef } from "react";
/**
 * Language switcher hook.
 * @returns Page with current language
 */
export const useScrollIntersect = (target: Element | null, className: string) => {
  const observer = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    if (observer.current) observer.current.disconnect();

    const intercepter = document.createElement("div");
    target?.before(intercepter);

    observer.current = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) {
        target?.classList.add(className);
      } else {
        target?.classList.remove(className);
      }
    });
    const { current: currentObserver } = observer;

    if (intercepter) currentObserver.observe(intercepter);

    return () => currentObserver.disconnect();
  }, [target]);

  return;
};
