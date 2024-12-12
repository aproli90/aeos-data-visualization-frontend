import React, { useState, useCallback } from 'react';
import { X, Check, Palette } from 'lucide-react';
import { ColorPicker } from './ColorPicker';

interface ColorInputProps {
  color: string;
  onChange: (color: string) => void;
  onRemove: () => void;
  showRemove?: boolean;
}

export const ColorInput: React.FC<ColorInputProps> = ({ 
  color, 
  onChange, 
  onRemove, 
  showRemove = true 
}) => {
  const [hexInput, setHexInput] = useState(color);
  const [showHexInput, setShowHexInput] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);

  const handleHexSubmit = useCallback(() => {
    const isValidHex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(hexInput);
    if (isValidHex) {
      onChange(hexInput);
      setShowHexInput(false);
    }
  }, [hexInput, onChange]);

  const handleHexInputKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleHexSubmit();
    } else if (e.key === 'Escape') {
      setShowHexInput(false);
      setHexInput(color);
    }
  }, [color, handleHexSubmit]);

  const handleColorChange = useCallback((newColor: string) => {
    onChange(newColor);
    setHexInput(newColor);
  }, [onChange]);

  const handleColorPickerClick = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setShowColorPicker(true);
  }, []);

  const handleColorPickerClose = useCallback(() => {
    setShowColorPicker(false);
  }, []);

  return (
    <div 
      className="flex flex-col items-center gap-2" 
      onClick={(e) => e.stopPropagation()}
    >
      <div className="relative">
        <button
          type="button"
          onClick={handleColorPickerClick}
          className="relative group w-12 h-12 rounded-lg cursor-pointer border-2 border-gray-200 dark:border-gray-700 overflow-hidden"
          style={{ backgroundColor: color }}
        >
          <div className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/10 dark:group-hover:bg-white/10 transition-colors">
            <Palette className="w-5 h-5 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        </button>
        
        {showColorPicker && (
          <ColorPicker
            color={color}
            onChange={handleColorChange}
            onClose={handleColorPickerClose}
          />
        )}
      </div>

      {showHexInput ? (
        <div className="flex items-center gap-1">
          <input
            type="text"
            value={hexInput}
            onChange={(e) => setHexInput(e.target.value)}
            onKeyDown={handleHexInputKeyDown}
            className="w-24 px-2 py-1 text-sm bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent text-gray-900 dark:text-gray-100"
            placeholder="#000000"
            autoFocus
          />
          <button
            type="button"
            onClick={handleHexSubmit}
            className="p-1 text-green-600 hover:text-green-700 dark:text-green-500 dark:hover:text-green-400"
            title="Apply color"
          >
            <Check className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setShowHexInput(true)}
          className="px-2 py-1 text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
        >
          {color.toUpperCase()}
        </button>
      )}
      
      {showRemove && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          className="p-1 text-gray-500 hover:text-red-500 dark:text-gray-400 dark:hover:text-red-400 rounded-lg transition-colors"
          title="Remove color"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};