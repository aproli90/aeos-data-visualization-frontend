export const CHART_FONTS = {
  'Default': '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  'Broadway': '"Broadway", "Playfair Display", serif',
  'Bauhaus': '"Bauhaus 93", "Righteous", sans-serif',
  'Berlin Sans': '"Berlin Sans FB", "Audiowide", sans-serif',
  'Copperplate': '"Copperplate Gothic", "Orbitron", sans-serif',
  'Art Deco': '"ITC Avant Garde Gothic", "Poiret One", sans-serif',
  'Futura Bold': '"Futura Md BT", "Exo 2", sans-serif',
  'Avant Garde': '"Avant Garde", "Quicksand", sans-serif',
  'Rockwell': '"Rockwell", "Coda", serif',
  'Eurostile': '"Eurostile", "Anton", sans-serif',
  'Impact': '"Impact", "Josefin Sans", sans-serif',
  'Gill Sans Nova': '"Gill Sans Nova", "Quicksand", sans-serif'
} as const;

export type ChartFont = keyof typeof CHART_FONTS | string;

export const validateFontFamily = (font: string): boolean => {
  // Basic CSS font-family validation
  const validFontNameRegex = /^[a-zA-Z0-9\s-]+$/;
  return validFontNameRegex.test(font);
};