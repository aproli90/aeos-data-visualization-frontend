import React, { useState, useRef } from 'react';
import { ChevronDown } from 'lucide-react';
import { COLOR_PALETTES, type ColorPalette } from '../constants/colorPalettes';
import { ColorPalettePreview } from './ColorPalettePreview';
import { useOnClickOutside } from '../hooks/useOnClickOutside';

interface ColorPaletteDropdownProps {
  value: ColorPalette;
  onChange: (value: ColorPalette) => void;
}

export const ColorPaletteDropdown: React.FC<ColorPaletteDropdownProps> = ({
  value,
  onChange
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useOnClickOutside(dropdownRef, () => setIsOpen(false));

  const handleSelect = (palette: ColorPalette) => {
    onChange(palette);
    setIsOpen(false);
  };

  return (
    <div ref={dropdownRef} className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent bg-white dark:bg-gray-800 shadow-sm transition-all hover:border-indigo-300 dark:hover:border-indigo-600 text-gray-700 dark:text-gray-200"
      >
        <div className="flex items-center gap-3">
          <span className="capitalize">{value}</span>
          <ColorPalettePreview palette={value} />
        </div>
        <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute z-50 w-full mt-2 py-2 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
          {Object.keys(COLOR_PALETTES).map((palette) => (
            <button
              key={palette}
              onClick={() => handleSelect(palette as ColorPalette)}
              className={`w-full px-4 py-2 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors ${
                palette === value ? 'bg-indigo-50 dark:bg-indigo-900/20' : ''
              }`}
            >
              <span className="capitalize text-gray-700 dark:text-gray-200">
                {palette}
              </span>
              <ColorPalettePreview palette={palette as ColorPalette} />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};