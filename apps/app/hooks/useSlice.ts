import { useCallback } from "react";

/**
 * Slice the the array based on the minmax indices given. To be used with <Slider />
 * @param {Record<string, number[]>} state Data to slice
 * @param {[number, number]} minmax [min index, max index]
 * @returns Sliced state
 */
export const useSlice = (state: Record<string, number[]>, minmax?: [number, number]) => {
  const slice = () => {
    const sliced = Object.entries(state).map(([key, data]) => [
      key,
      data.slice(minmax ? minmax[0] : 0, minmax ? minmax[1] + 1 : data.length - 1),
    ]);
    return Object.fromEntries(sliced);
  };

  return {
    coordinate: useCallback<() => typeof state>(slice, [minmax, state])(),
  } as const;
};
