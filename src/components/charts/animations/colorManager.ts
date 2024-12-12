import { createGradient } from '../../../utils/colorUtils';

const DEFAULT_COLORS = ['#5470c6', '#91cc75', '#fac858', '#ee6666'];

export class ColorManager {
  private colorMap: Map<string, string> = new Map();
  private usedColors: Set<string> = new Set();
  private availableColors: string[];

  constructor(colors: string[] | undefined) {
    // Validate and set available colors with fallback
    this.availableColors = Array.isArray(colors) && colors.length > 0
      ? [...colors]
      : [...DEFAULT_COLORS];
  }

  getColor(categoryName: string): string {
    // Return existing color if already assigned
    if (this.colorMap.has(categoryName)) {
      return this.colorMap.get(categoryName)!;
    }

    // Find an unused color
    let color = this.availableColors.find(c => !this.usedColors.has(c));
    
    // If all colors are used, cycle through them
    if (!color) {
      const index = this.colorMap.size % this.availableColors.length;
      color = this.availableColors[index];
    }

    // Store the mapping
    this.colorMap.set(categoryName, color);
    this.usedColors.add(color);

    return color;
  }

  getGradient(categoryName: string): [string, string] {
    const color = this.getColor(categoryName);
    return createGradient(color);
  }

  reset() {
    this.colorMap.clear();
    this.usedColors.clear();
  }

  // Helper method to get all available colors
  getAllColors(): string[] {
    return [...this.availableColors];
  }

  // Helper method to get current color mappings
  getColorMappings(): Map<string, string> {
    return new Map(this.colorMap);
  }
}