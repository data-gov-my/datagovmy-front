import { useMemo } from "react";

/**
 * Slice the the array based on the minmax indices given. To be used with <Slider />
 * @param {Record<string, number[]>} state Data to slice
 * @param {[number, number]} minmax [min index, max index]
 * @returns Sliced state
 */
export const useSlice = (state: Record<string, number[]>, minmax?: [number, number]) => {
  const sliced = useMemo(() => {
    return Object.entries(state).map(([key, data]) => [
      key,
      data.slice(minmax ? minmax[0] : 0, minmax ? minmax[1] + 1 : data.length - 1),
    ]);
  }, [state, minmax]);

  return {
    coordinate: Object.fromEntries(sliced),
  } as const;
};
