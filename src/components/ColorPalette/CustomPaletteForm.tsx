import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { ColorInput } from './ColorInput';

interface CustomPaletteFormProps {
  initialName?: string;
  initialColors?: string[];
  onSubmit: (name: string, colors: string[]) => void;
  submitLabel?: string;
}

export const CustomPaletteForm: React.FC<CustomPaletteFormProps> = ({ 
  initialName = '',
  initialColors = ['#6366f1'],
  onSubmit,
  submitLabel = 'Save Palette'
}) => {
  const [name, setName] = useState(initialName);
  const [colors, setColors] = useState(initialColors);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || colors.length === 0) return;
    onSubmit(name.trim(), colors);
  };

  const addColor = () => setColors(prev => [...prev, '#6366f1']);
  
  const updateColor = (index: number, color: string) => {
    setColors(prev => prev.map((c, i) => i === index ? color : c));
  };

  const removeColor = (index: number) => {
    if (colors.length > 1) {
      setColors(prev => prev.filter((_, i) => i !== index));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">
          Palette Name
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent text-gray-900 dark:text-gray-100"
          placeholder="My Custom Palette"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">
          Colors
        </label>
        <div className="flex flex-wrap gap-4 mb-4">
          {colors.map((color, index) => (
            <ColorInput
              key={index}
              color={color}
              onChange={(c) => updateColor(index, c)}
              onRemove={() => removeColor(index)}
              showRemove={colors.length > 1}
            />
          ))}
          
          <button
            type="button"
            onClick={addColor}
            className="flex items-center justify-center w-12 h-12 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600 hover:border-indigo-500 dark:hover:border-indigo-400 transition-colors"
            title="Add color"
          >
            <Plus className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          </button>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={!name.trim() || colors.length === 0}
          className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white rounded-lg disabled:opacity-50 transition-colors"
        >
          {submitLabel}
        </button>
      </div>
    </form>
  );
};