function o(r, t, ...n) {
  if (r in t) {
    let e = t[r];
    return typeof e == "function" ? e(...n) : e;
  }
  let a = new Error(
    `Tried to handle "${r}" but there is no handler defined. Only defined handlers are: ${Object.keys(
      t
    )
      .map(e => `"${e}"`)
      .join(", ")}.`
  );
  throw (Error.captureStackTrace && Error.captureStackTrace(a, o), a);
}
export { o as match };
