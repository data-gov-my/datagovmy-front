function t(n) {
  function e() {
    document.readyState !== "loading" && (n(), document.removeEventListener("DOMContentLoaded", e));
  }
  typeof window < "u" &&
    typeof document < "u" &&
    (document.addEventListener("DOMContentLoaded", e), e());
}
export { t as onDocumentReady };
