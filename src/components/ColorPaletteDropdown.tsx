import React, { useState, useRef } from 'react';
import { ChevronDown, Plus, Edit2 } from 'lucide-react';
import { COLOR_PALETTES, type ColorPalette } from '../constants/colorPalettes';
import { ColorPalettePreview } from './ColorPalettePreview';
import { useOnClickOutside } from '../hooks/useOnClickOutside';
import { useCustomPalettes } from '../hooks/useCustomPalettes';
import { CustomPaletteModal } from './ColorPalette/CustomPaletteModal';
import { PaletteOption } from './ColorPalette/PaletteOption';
import type { CustomPalette } from '../hooks/useCustomPalettes';

interface ColorPaletteDropdownProps {
  value: string;
  colors: string[];
  onChange: (value: string, colors: string[]) => void;
}

export const ColorPaletteDropdown: React.FC<ColorPaletteDropdownProps> = ({
  value,
  colors,
  onChange
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPalette, setEditingPalette] = useState<CustomPalette | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { customPalettes, addPalette, updatePalette, removePalette } = useCustomPalettes();

  useOnClickOutside(dropdownRef, () => setIsOpen(false));

  const getCurrentColors = (paletteId: string): string[] => {
    // For built-in palettes
    if (paletteId in COLOR_PALETTES) {
      return COLOR_PALETTES[paletteId as ColorPalette];
    }
    
    // For custom palettes
    const customPalette = customPalettes.find(p => p.id === paletteId);
    if (customPalette) {
      return customPalette.colors;
    }
    
    // Return current colors as fallback
    return colors;
  };

  const handleSelect = (paletteId: string) => {
    const newColors = getCurrentColors(paletteId);
    onChange(paletteId, [...newColors]); // Ensure we pass a new array
    setIsOpen(false);
  };

  const handleSavePalette = (palette: CustomPalette) => {
    if (editingPalette) {
      updatePalette(palette);
      if (value === palette.id) {
        onChange(palette.id, palette.colors);
      }
    } else {
      addPalette(palette);
      onChange(palette.id, palette.colors);
    }
    setEditingPalette(null);
    setIsModalOpen(false);
  };

  const handleRemovePalette = (id: string) => {
    removePalette(id);
    if (id === value) {
      const firstPaletteId = Object.keys(COLOR_PALETTES)[0];
      handleSelect(firstPaletteId);
    }
  };

  const getPaletteName = (paletteId: string): string => {
    if (paletteId in COLOR_PALETTES) {
      return paletteId;
    }
    return customPalettes.find(p => p.id === paletteId)?.name || paletteId;
  };

  return (
    <>
      <div ref={dropdownRef} className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full flex items-center justify-between px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent bg-white dark:bg-gray-800 shadow-sm transition-all hover:border-indigo-300 dark:hover:border-indigo-600 text-gray-700 dark:text-gray-200"
        >
          <div className="flex items-center gap-3">
            <span className="capitalize">{getPaletteName(value)}</span>
            <ColorPalettePreview colors={colors} />
          </div>
          <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </button>

        {isOpen && (
          <div className="absolute z-50 w-full mt-2 py-2 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
            {/* Built-in palettes */}
            {Object.entries(COLOR_PALETTES).map(([paletteId, paletteColors]) => (
              <PaletteOption
                key={paletteId}
                name={paletteId}
                colors={paletteColors}
                isSelected={value === paletteId}
                onSelect={() => handleSelect(paletteId)}
              />
            ))}

            {/* Divider */}
            {customPalettes.length > 0 && (
              <div className="my-2 border-t border-gray-200 dark:border-gray-700" />
            )}

            {/* Custom palettes */}
            {customPalettes.map(palette => (
              <PaletteOption
                key={palette.id}
                name={palette.name}
                colors={palette.colors}
                isSelected={value === palette.id}
                onSelect={() => handleSelect(palette.id)}
                onEdit={() => {
                  setEditingPalette(palette);
                  setIsModalOpen(true);
                  setIsOpen(false);
                }}
                onRemove={() => handleRemovePalette(palette.id)}
                isCustom
              />
            ))}

            {/* Add custom palette button */}
            <button
              onClick={() => {
                setIsModalOpen(true);
                setIsOpen(false);
              }}
              className="w-full mt-2 px-4 py-2 flex items-center gap-2 text-indigo-600 hover:bg-indigo-50 dark:text-indigo-400 dark:hover:bg-indigo-900/20"
            >
              <Plus className="w-4 h-4" />
              Create Palette
            </button>
          </div>
        )}
      </div>

      <CustomPaletteModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingPalette(null);
        }}
        onSave={handleSavePalette}
        initialPalette={editingPalette || undefined}
        mode={editingPalette ? 'edit' : 'create'}
      />
    </>
  );
};