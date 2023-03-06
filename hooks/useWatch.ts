import { DependencyList, useEffect, useRef } from "react";

/**
 * Alternative to useEffect. Default: will not run on initial render.
 * @param {Function} fn Callback function
 * @param {DependencyList} deps useEffect deps
 * @param {boolean} [runOnMount=false] Runs on initial render
 * @returns
 */
export const useWatch = (fn: Function, deps: DependencyList = [], runOnMount: boolean = false) => {
  const firstRender = useRef(true);

  return useEffect(() => {
    if (!runOnMount && firstRender.current) {
      firstRender.current = false;
      return;
    }
    fn();
  }, deps);
};
