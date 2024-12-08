export const hexToRGBA = (hex: string, alpha: number): string => {
  // Remove the '#' if present
  const color = hex.replace('#', '');

  // Convert hex to RGB
  const r = parseInt(color.substring(0, 2), 16);
  const g = parseInt(color.substring(2, 4), 16);
  const b = parseInt(color.substring(4, 6), 16);

  // Return RGBA string
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

export const createGradient = (color: string): [string, string] => {
  // Create gradient from more transparent to more opaque
  return [hexToRGBA(color, 0.8), hexToRGBA(color, 1)];
};

export const rotateColors = (colors: string[]): string[] => {
  // Move colors one position forward
  return [...colors.slice(1), colors[0]];
};