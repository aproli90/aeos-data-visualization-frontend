import React from 'react';

interface ColorPalettePreviewProps {
  colors: string[];
  maxColors?: number;
}

export const ColorPalettePreview: React.FC<ColorPalettePreviewProps> = ({ 
  colors = [], 
  maxColors = 5 
}) => {
  if (!colors || !Array.isArray(colors)) {
    console.warn('ColorPalettePreview: Invalid colors prop', { colors });
    return null;
  }

  return (
    <div className="flex gap-1">
      {colors.slice(0, maxColors).map((color, index) => (
        <div
          key={`${color}-${index}`}
          className="w-3 h-3 rounded-full"
          style={{ backgroundColor: color }}
        />
      ))}
    </div>
  );
};