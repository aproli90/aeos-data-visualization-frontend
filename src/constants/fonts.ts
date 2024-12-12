export const CHART_FONTS = {
  'Default': '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  'Inter': '"Inter", sans-serif',
  'Poppins': '"Poppins", sans-serif',
  'Montserrat': '"Montserrat", sans-serif',
  'Roboto': '"Roboto", sans-serif',
  'Open Sans': '"Open Sans", sans-serif',
  'Lato': '"Lato", sans-serif',
  'Source Sans Pro': '"Source Sans Pro", sans-serif',
  'Playfair Display': '"Playfair Display", serif',
  'Merriweather': '"Merriweather", serif',
  'IBM Plex Sans': '"IBM Plex Sans", sans-serif',
  'DM Sans': '"DM Sans", sans-serif'
} as const;

export type ChartFont = keyof typeof CHART_FONTS | string;

export const validateFontFamily = (font: string): boolean => {
  // Basic CSS font-family validation
  const validFontNameRegex = /^[a-zA-Z0-9\s-]+$/;
  return validFontNameRegex.test(font);
};