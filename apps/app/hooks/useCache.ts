import { useRef } from "react";

/**
 * Cache hook. Simple caching mechanism using Map
 * @param data data
 * @returns {{cache: Map<string, any>}} cache
 */
export const useCache = (data: Record<string, any> = {}): { cache: Map<string, any> } => {
  const cache = useRef<Map<string, any>>(new Map<string, any>(Object.entries(data)));

  return {
    cache: cache.current,
  };
};
