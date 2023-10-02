import { OptionType } from "../../types";
import debounce from "lodash/debounce";
import { useRouter } from "next/router";
import { useCallback, useMemo, useRef } from "react";
import { useData } from "./useData";
import { useWatch } from "./useWatch";

/**
 * Filter hook. Contains logic for backend-driven query / filtering.
 * @param state Filter queries
 * @param params Required for URL with dynamic params.
 * @param sequential Only for DC pages
 * @returns filter, setFilter, queries, actives
 */
export const useFilter = (
  state: Record<string, any> = {},
  params = {},
  sequential: boolean = false
) => {
  const original = useRef(state);
  const { data, setData, reset } = useData(state);
  const router = useRouter();

  const actives: Array<[string, unknown]> = useMemo(
    () =>
      Object.entries(data).filter(
        ([_, value]) =>
          value !== undefined &&
          value !== null &&
          (value as Array<any>).length !== 0 &&
          value !== ""
      ),
    [data]
  );

  const queries: string = useMemo<string>(() => {
    const query = actives
      .map(([key, value]) => {
        if (!value) return "";
        if (Array.isArray(value))
          return `${key}=${value.map((item: OptionType) => item.value).join(",")}`;
        else return `${key}=${(value as OptionType).value ?? value}`;
      })
      .join("&");
    return `?${query}`;
  }, [actives]);

  const search: Function = useCallback(
    debounce(actives => {
      const query = actives.map(([key, value]: [string, unknown]) => [
        key,
        Array.isArray(value)
          ? value.map((item: OptionType) => item.value).join(",")
          : typeof value === "string"
          ? value
          : (value as OptionType).value,
      ]);

      router.replace(
        {
          pathname: router.pathname,
          query: {
            ...params,
            ...Object.fromEntries(query),
          },
        },
        undefined,
        { scroll: false }
      );
    }, 500),
    []
  );

  const _reset = () => {
    reset(original.current);
  };

  const _setData = (key: string, value: any) => {
    if (sequential) {
      let flag = false;
      for (const _key in data) {
        if (!flag && ["range", "date_slider"].includes(_key)) setData(_key, undefined);
        if (key === _key) {
          setData(key, value);
          flag = true;
        }
      }
    } else {
      setData(key, value);
    }
  };

  useWatch(() => {
    search(actives);
  }, [data]);

  return {
    filter: data,
    setFilter: _setData,
    reset: _reset,
    queries,
    actives,
  };
};
