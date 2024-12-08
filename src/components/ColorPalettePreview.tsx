import React from 'react';
import { COLOR_PALETTES, type ColorPalette } from '../constants/colorPalettes';

interface ColorPalettePreviewProps {
  palette: ColorPalette;
}

export const ColorPalettePreview: React.FC<ColorPalettePreviewProps> = ({ palette }) => {
  const colors = COLOR_PALETTES[palette];

  return (
    <div className="flex gap-1">
      {colors.slice(0, 5).map((color, index) => (
        <div
          key={index}
          className="w-3 h-3 rounded-full"
          style={{ backgroundColor: color }}
        />
      ))}
    </div>
  );
};