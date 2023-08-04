/**
 * Distributes color from the palette based from a dynamic zero index.
 * @param index Index of dataset
 * @param zero_index Index where value is closest to 0 (zero)
 * @returns {string} Hex color
 */
export const getColor = (index: number, zero_index: number): string => {
  const gradient_palette = [
    "#049f09", // dark green
    "#091f12",
    "#0d2f1b",
    "#123f24",
    "#164f2d",
    "#1b5e36",
    "#206e3f",
    "#247e48",
    "#298e52",
    "#2d9e5b",
    "#32ad64",
    "#37bd6d",
    "#41c777",
    "#51cc82",
    "#60d18e",
    "#70d599",
    "#80daa4",
    "#90deaf",
    "#a0e3bb",
    "#afe8c6",
    "#bfecd1",
    "#cff1dd",
    "#dff5e8",
    "#effaf3", // light green
    "#fcecec", // light red
    "#fadada",
    "#f8c7c8",
    "#f6b5b5",
    "#f4a3a3",
    "#f29091",
    "#f07e7f",
    "#ee6c6c",
    "#ec595a",
    "#ea4748",
    "#e83536",
    "#e62223",
    "#dc1819",
    "#c91617",
    "#b71415",
    "#a51213",
    "#921011",
    "#800e0e",
    "#6e0c0c",
    "#5b0a0a",
    "#490808",
    "#370606",
    "#240404",
    "#120202", // dark red
  ].reverse();

  return gradient_palette[index + zero_index + 1];
};

/**
 * Returns the index in array where value is closest to target.
 * @param arr Array of numbers
 * @param target Target value
 * @returns {number} Index where value is closest to the target
 */
export const closestIndex = (arr: number[], target: number): number => {
  return arr.reduce((prev, curr, index) => {
    const diff = Math.abs(curr - target);
    return diff < Math.abs(arr[prev] - target) ? index : prev;
  }, 0);
};
