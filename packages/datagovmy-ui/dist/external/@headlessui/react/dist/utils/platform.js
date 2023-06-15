function i() {
  return (
    /iPhone/gi.test(window.navigator.platform) ||
    (/Mac/gi.test(window.navigator.platform) && window.navigator.maxTouchPoints > 0)
  );
}
function n() {
  return /Android/gi.test(window.navigator.userAgent);
}
function t() {
  return i() || n();
}
export { n as isAndroid, i as isIOS, t as isMobile };
