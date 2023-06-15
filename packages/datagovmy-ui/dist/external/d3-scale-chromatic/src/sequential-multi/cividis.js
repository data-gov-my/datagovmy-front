function h(a) {
  return (
    (a = Math.max(0, Math.min(1, a))),
    "rgb(" +
      Math.max(
        0,
        Math.min(
          255,
          Math.round(
            -4.54 - a * (35.34 - a * (2381.73 - a * (6402.7 - a * (7024.72 - a * 2710.57))))
          )
        )
      ) +
      ", " +
      Math.max(
        0,
        Math.min(
          255,
          Math.round(32.49 + a * (170.73 + a * (52.82 - a * (131.46 - a * (176.58 - a * 67.37)))))
        )
      ) +
      ", " +
      Math.max(
        0,
        Math.min(
          255,
          Math.round(
            81.24 + a * (442.36 - a * (2482.43 - a * (6167.24 - a * (6614.94 - a * 2475.67))))
          )
        )
      ) +
      ")"
  );
}
export { h as default };
