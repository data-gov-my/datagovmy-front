import { useReducer as n } from "react";
const u = (r = {}) => {
  const s = (t, e) => {
      switch (e.type) {
        case "SET":
          return Object.assign({}, t, { [e.key]: e.value });
        default:
          throw new Error("Unrecognized dispatch command");
      }
    },
    [a, c] = n(s, r);
  return {
    data: a,
    setData: (t, e) => {
      c({ type: "SET", key: t, value: e });
    },
  };
};
export { u as useData };
