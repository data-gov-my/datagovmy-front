function o(e) {
  throw new Error("Unexpected object: " + e);
}
var u = (e => (
  (e[(e.First = 0)] = "First"),
  (e[(e.Previous = 1)] = "Previous"),
  (e[(e.Next = 2)] = "Next"),
  (e[(e.Last = 3)] = "Last"),
  (e[(e.Specific = 4)] = "Specific"),
  (e[(e.Nothing = 5)] = "Nothing"),
  e
))(u || {});
function v(e, s) {
  let r = s.resolveItems();
  if (r.length <= 0) return null;
  let n = s.resolveActiveIndex(),
    i = n ?? -1,
    c = (() => {
      switch (e.focus) {
        case 0:
          return r.findIndex(t => !s.resolveDisabled(t));
        case 1: {
          let t = r
            .slice()
            .reverse()
            .findIndex((l, d, a) =>
              i !== -1 && a.length - d - 1 >= i ? !1 : !s.resolveDisabled(l)
            );
          return t === -1 ? t : r.length - 1 - t;
        }
        case 2:
          return r.findIndex((t, l) => (l <= i ? !1 : !s.resolveDisabled(t)));
        case 3: {
          let t = r
            .slice()
            .reverse()
            .findIndex(l => !s.resolveDisabled(l));
          return t === -1 ? t : r.length - 1 - t;
        }
        case 4:
          return r.findIndex(t => s.resolveId(t) === e.id);
        case 5:
          return null;
        default:
          o(e);
      }
    })();
  return c === -1 ? n : c;
}
export { u as Focus, v as calculateActiveIndex };
