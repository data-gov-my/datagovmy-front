import { useReducer } from "react";

/**
 * Universal state hook. General purpose state management
 * @param data State
 * @returns data, setData
 */
export const useData = (data: Record<string, any> = {}) => {
  const reducer = (state: any, action: { type: "SET"; key: string; value: any }) => {
    switch (action.type) {
      case "SET":
        return Object.assign({}, state, { [action.key]: action.value });
      default:
        throw new Error("Unrecognized dispatch command");
    }
  };

  const [state, dispatch] = useReducer(reducer, data);

  const setData = (key: string, value: any) => {
    dispatch({ type: "SET", key, value });
  };

  return {
    data: state,
    setData,
  };
};
