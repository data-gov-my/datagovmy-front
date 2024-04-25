import { interpolateRgbBasis } from "d3-interpolate";
import {
  // interpolateBlues,
  interpolateBrBG,
  interpolateBuGn,
  interpolateBuPu,
  interpolateCividis,
  interpolateCool,
  interpolateCubehelixDefault,
  interpolateGnBu,
  interpolateGreens,
  interpolateGreys,
  interpolateInferno,
  interpolateMagma,
  interpolateOrRd,
  interpolateOranges,
  interpolatePRGn,
  interpolatePiYG,
  interpolatePlasma,
  interpolatePuBu,
  interpolatePuBuGn,
  interpolatePuOr,
  interpolatePuRd,
  interpolatePurples,
  interpolateRainbow,
  interpolateRdBu,
  interpolateRdGy,
  interpolateRdPu,
  interpolateRdYlBu,
  interpolateRdYlGn,
  interpolateReds,
  interpolateSinebow,
  interpolateSpectral,
  interpolateTurbo,
  interpolateViridis,
  interpolateWarm,
  interpolateYlGn,
  interpolateYlGnBu,
  interpolateYlOrBr,
  interpolateYlOrRd,
} from "d3-scale-chromatic";

export type Color =
  | "blues"
  | "brBG"
  | "buGn"
  | "buPu"
  | "cividis"
  | "cool"
  | "cubehelixDefault"
  | "gnBu"
  | "greens"
  | "greys"
  | "inferno"
  | "magma"
  | "orRd"
  | "oranges"
  | "pRGn"
  | "piYG"
  | "plasma"
  | "puBu"
  | "puBuGn"
  | "puOr"
  | "puRd"
  | "purples"
  | "rainbow"
  | "rdBu"
  | "rdGy"
  | "rdPu"
  | "rdYlBu"
  | "rdYlGn"
  | "reds"
  | "sinebow"
  | "spectral"
  | "turbo"
  | "viridis"
  | "warm"
  | "ylGn"
  | "ylGnBu"
  | "ylOrBr"
  | "ylOrRd";

export const useColor = (key: Color) => {
  const blueScheme = [
    "#eff6ff", // Blue 50
    "#dbeafe", // Blue 100
    "#bfdbfe", // Blue 200
    "#93c5fd", // Blue 300
    "#60a5fa", // Blue 400
    "#3b82f6", // Blue 500
    "#2563eb", // Blue 600
    "#1d4ed8", // Blue 700
    "#1e40af", // Blue 800
  ];

  const lookup: { [key: string]: (normalizedValue: number) => string } = {
    blues: value => interpolateRgbBasis(blueScheme)(value), // interpolateBlues,
    brBG: interpolateBrBG,
    buGn: interpolateBuGn,
    buPu: interpolateBuPu,
    cividis: interpolateCividis,
    cool: interpolateCool,
    cubehelixDefault: interpolateCubehelixDefault,
    gnBu: interpolateGnBu,
    greens: interpolateGreens,
    greys: interpolateGreys,
    inferno: interpolateInferno,
    magma: interpolateMagma,
    orRd: interpolateOrRd,
    oranges: interpolateOranges,
    pRGn: interpolatePRGn,
    piYG: interpolatePiYG,
    plasma: interpolatePlasma,
    puBu: interpolatePuBu,
    puBuGn: interpolatePuBuGn,
    puOr: interpolatePuOr,
    puRd: interpolatePuRd,
    purples: interpolatePurples,
    rainbow: interpolateRainbow,
    rdBu: interpolateRdBu,
    rgGy: interpolateRdGy,
    rdPu: interpolateRdPu,
    rdYlBu: interpolateRdYlBu,
    rdYlGn: interpolateRdYlGn,
    reds: interpolateReds,
    sinebow: interpolateSinebow,
    spectral: interpolateSpectral,
    turbo: interpolateTurbo,
    viridis: interpolateViridis,
    warm: interpolateWarm,
    ylGn: interpolateYlGn,
    ylGnBu: interpolateYlGnBu,
    ylGnBr: interpolateYlOrBr,
    ylOrRd: interpolateYlOrRd,
  };

  const interpolate = (
    value: number | null,
    domain: [min: number, max: number] | null = null
  ): string => {
    if (value === null) return "#ffffff00"; // transparent
    if (domain !== null) {
      const normalize = (value: number): number => (value - domain[0]) / (domain[1] - domain[0]);
      return lookup[key](normalize(value));
    }
    return lookup[key](value);
  };

  return {
    interpolate,
  };
};
