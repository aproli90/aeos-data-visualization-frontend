import React from 'react';
import { COLOR_PALETTES, type ColorPalette } from '../constants/colorPalettes';

interface ColorPaletteOptionProps {
  palette: ColorPalette;
}

export const ColorPaletteOption: React.FC<ColorPaletteOptionProps> = ({ palette }) => {
  const colors = COLOR_PALETTES[palette];
  const displayName = palette.charAt(0).toUpperCase() + palette.slice(1);

  return (
    <option value={palette} className="flex items-center gap-2">
      {displayName}
    </option>
  );
};