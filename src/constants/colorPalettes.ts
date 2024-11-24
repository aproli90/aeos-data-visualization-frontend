export const COLOR_PALETTES = {
  modern: ['#5470c6', '#91cc75', '#fac858', '#ee6666', '#73c0de', '#3ba272', '#fc8452', '#9a60b4'],
  vibrant: ['#ff7f0e', '#2ca02c', '#d62728', '#9467bd', '#8c564b', '#e377c2', '#7f7f7f', '#bcbd22'],
  pastel: ['#6b9ac4', '#97d8c4', '#f4b942', '#f4847c', '#b4d4ee', '#a8e6cf', '#dcedc1', '#ffd3b6'],
  contrast: ['#e41a1c', '#377eb8', '#4daf4a', '#984ea3', '#ff7f00', '#ffff33', '#a65628', '#f781bf'],
  neon: ['#00ff00', '#ff00ff', '#00ffff', '#ff0000', '#0000ff', '#ffff00', '#ff8800', '#ff0088']
} as const;

export type ColorPalette = keyof typeof COLOR_PALETTES;