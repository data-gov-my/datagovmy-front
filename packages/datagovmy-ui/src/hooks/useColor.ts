import {
  interpolateBlues,
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

export const useColor = (key: Color, domain: [min: number, max: number]) => {
  const lookup: { [key: string]: (normalizedValue: number) => string } = {
    blues: interpolateBlues,
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

  const normalize = (value: number): number => (value - domain[0]) / (domain[1] - domain[0]);

  const interpolate = (value: number | null, normalized: boolean = false): string => {
    if (value === null || !value) return "#ffffff00"; // transparent
    return !normalized ? lookup[key](normalize(value)) : lookup[key](value);
  };

  return {
    interpolate,
  };
};
