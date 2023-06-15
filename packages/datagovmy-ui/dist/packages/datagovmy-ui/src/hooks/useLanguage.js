import { useRouter as l } from "next/router";
const r = () => {
  const { pathname: a, asPath: e, query: n, locale: o, push: u } = l();
  return {
    language: o,
    onLanguageChange: g => {
      u({ pathname: a, query: n }, e, {
        locale: g.value,
        scroll: !1,
      });
    },
  };
};
export { r as useLanguage };
