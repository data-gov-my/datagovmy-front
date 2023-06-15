function h(a) {
  return (
    (a = Math.max(0, Math.min(1, a))),
    "rgb(" +
      Math.max(
        0,
        Math.min(
          255,
          Math.round(
            34.61 + a * (1172.33 - a * (10793.56 - a * (33300.12 - a * (38394.49 - a * 14825.05))))
          )
        )
      ) +
      ", " +
      Math.max(
        0,
        Math.min(
          255,
          Math.round(
            23.31 + a * (557.33 + a * (1225.33 - a * (3574.96 - a * (1073.77 + a * 707.56))))
          )
        )
      ) +
      ", " +
      Math.max(
        0,
        Math.min(
          255,
          Math.round(
            27.2 + a * (3211.1 - a * (15327.97 - a * (27814 - a * (22569.18 - a * 6838.66))))
          )
        )
      ) +
      ")"
  );
}
export { h as default };
