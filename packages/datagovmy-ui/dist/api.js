import a from "./external/axios/index.js";
const i = (e = "api", t = {}) => {
    const o = {
      baseURL:
        e === "api"
          ? process.env.NEXT_PUBLIC_API_URL
          : e === "local"
          ? process.env.NEXT_PUBLIC_APP_URL
          : e,
      headers: {
        Authorization: process.env.NEXT_PUBLIC_AUTHORIZATION_TOKEN,
        ...t,
      },
    };
    return a.create(o);
  },
  _ = (e, t, o = "api") =>
    new Promise((r, s) => {
      i(o)
        .get(e, { params: t })
        .then(n => r(n))
        .catch(n => s(n));
    }),
  P = (e, t, o = "api", r = {}) =>
    new Promise((s, n) => {
      i(o, r)
        .post(e, t)
        .then(c => s(c))
        .catch(c => n(c));
    });
export { _ as get, P as post };
