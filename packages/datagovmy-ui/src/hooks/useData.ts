import { useReducer, useRef } from "react";

type SingleMutator = {
  key: string;
  value: any;
};

type MultipleMutator = Record<string, any>;
type MutatorType = "SET" | "RESET";

/**
 * Universal state hook. General purpose state management
 * @param data State
 * @returns data, setData
 */
export const useData = (data: Record<string, any> = {}) => {
  const reducer = (
    state: any,
    action: { type: MutatorType; payload: SingleMutator | MultipleMutator }
  ) => {
    switch (action.type) {
      case "SET":
        return Object.assign({}, state, { [action.payload.key]: action.payload.value });
      case "RESET":
        return Object.assign({}, state, action.payload);
      default:
        throw new Error("Unrecognized dispatch command");
    }
  };

  const original = useRef<Record<string, any>>(data);

  const [state, dispatch] = useReducer(reducer, data);

  const setData = (key: string, value: any) => {
    dispatch({ type: "SET", payload: { key, value } });
  };

  const reset = (overridingState?: Record<string, any>) => {
    if (overridingState) dispatch({ type: "RESET", payload: overridingState });
    else dispatch({ type: "RESET", payload: data });
  };

  return {
    data: state,
    setData,
    reset,
  };
};
