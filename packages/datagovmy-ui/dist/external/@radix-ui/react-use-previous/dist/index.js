import { useRef as u, useMemo as t } from "react";
function c(r) {
  const e = u({
    value: r,
    previous: r,
  });
  return t(
    () => (
      e.current.value !== r && ((e.current.previous = e.current.value), (e.current.value = r)),
      e.current.previous
    ),
    [r]
  );
}
export { c as usePrevious };
