export const hexToRGBA = (hex: string, alpha: number): string => {
  const rgb = hexToRgb(hex);
  return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${alpha})`;
};

export const hexToRgb = (hex: string) => {
  // Remove the '#' if present
  const color = hex.replace('#', '');

  // Parse the hex values
  const r = parseInt(color.substring(0, 2), 16);
  const g = parseInt(color.substring(2, 4), 16);
  const b = parseInt(color.substring(4, 6), 16);

  // Handle invalid values
  return {
    r: isNaN(r) ? 0 : r,
    g: isNaN(g) ? 0 : g,
    b: isNaN(b) ? 0 : b
  };
};

export const createGradient = (color: string): [string, string] => {
  // Create gradient from more transparent to more opaque
  return [hexToRGBA(color, 0.8), hexToRGBA(color, 1)];
};

export const rotateColors = (colors: string[]): string[] => {
  if (!colors || colors.length === 0) return [];
  return [...colors.slice(1), colors[0]];
};