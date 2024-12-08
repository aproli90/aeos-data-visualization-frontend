const BASE_PALETTES = {
  modern: [
    '#5470c6', // Blue
    '#91cc75', // Green
    '#fac858', // Yellow
    '#ee6666', // Red
    '#73c0de', // Light Blue
    '#3ba272', // Teal
    '#fc8452', // Orange
    '#9a60b4'  // Purple
  ],
  vibrant: [
    '#ff7f0e', // Orange
    '#2ca02c', // Green
    '#d62728', // Red
    '#9467bd', // Purple
    '#8c564b', // Brown
    '#e377c2', // Pink
    '#17becf', // Cyan
    '#bcbd22'  // Olive
  ],
  pastel: [
    '#6b9ac4', // Soft Blue
    '#97d8c4', // Mint
    '#f4b942', // Soft Yellow
    '#f4847c', // Salmon
    '#b4d4ee', // Light Blue
    '#a8e6cf', // Soft Green
    '#dcedc1', // Light Green
    '#ffd3b6'  // Peach
  ],
  contrast: [
    '#e41a1c', // Red
    '#377eb8', // Blue
    '#4daf4a', // Green
    '#984ea3', // Purple
    '#ff7f00', // Orange
    '#ffff33', // Yellow
    '#a65628', // Brown
    '#f781bf'  // Pink
  ],
  neon: [
    '#39FF14', // Neon Green
    '#FF10F0', // Neon Pink
    '#00FFFF', // Neon Cyan
    '#FF3131', // Neon Red
    '#4D4DFF', // Neon Blue
    '#FFFF00', // Neon Yellow
    '#FF8C00', // Neon Orange
    '#FF1493'  // Deep Pink
  ]
} as const;

export const COLOR_PALETTES: Record<keyof typeof BASE_PALETTES, string[]> = Object.fromEntries(
  Object.entries(BASE_PALETTES).map(([key, colors]) => [key, [...colors]])
) as Record<keyof typeof BASE_PALETTES, string[]>;

export type ColorPalette = keyof typeof BASE_PALETTES;

// Re-export the base palettes for reference
export const getBasePalette = (palette: ColorPalette): string[] => BASE_PALETTES[palette];